
import { PrometheusDriver, QueryResult } from 'prometheus-query';
import { Chart, ChartType, ChartDataset } from 'chart.js';

import datasource from './datasource';
import { ChartDatasourcePrometheusPluginOptions, PrometheusQuery } from './options';
import {
    setTimeAxesOptions,
    fillGaps,
} from './axes';
import {
    selectLabel,
    selectBackGroundColor,
    selectBorderColor,
} from './serie';

class ChartDatasourcePrometheusPluginInternals {
    loading: boolean = false;
    rendering: boolean = false;
    updateInterval: any | null = null;
    error: string | null = null;
}

export class ChartDatasourcePrometheusPlugin {
    id = 'datasource-prometheus';

    public beforeInit(chart: Chart, options: any) {
        chart['datasource-prometheus'] = new ChartDatasourcePrometheusPluginInternals();
    }

    public afterInit(chart: Chart, args: any, _options: any) {
        if (!_options)
            throw 'ChartDatasourcePrometheusPlugin.options is undefined';

        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);
        
        if (options.chartType === 'stat') {
        } else if (chart.config['type'] !== "line" as ChartType && chart.config['type'] !== "bar" as ChartType) {
            throw 'ChartDatasourcePrometheusPlugin is only compatible with Line chart\nFeel free to contribute for more!';
        }

        options.assertPluginOptions(); // triggers exceptions

        // auto update
        if (!!options && !!options.timeRange) {
            if (!!options.timeRange.msUpdateInterval)
                chart['datasource-prometheus'].updateInterval = setInterval(() => {
                    chart.update();
                }, options.timeRange.msUpdateInterval);
            else
                chart.update();
        }
    }

    public beforeUpdate(chart: Chart, args: any, _options: any) {
        if (!!chart['datasource-prometheus']
            && (chart['datasource-prometheus'].loading === true
                || chart['datasource-prometheus'].rendering === true))
            return;

        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);

        const prometheus = options.prometheus;
        const queries: PrometheusQuery[] = options.getQueries();
        const { start, end } = datasource.getStartAndEndDates(options.timeRange);
        const expectedStep = options.timeRange.step || datasource.getPrometheusStepAuto(start, end, chart.width);
        const minStep = (options.timeRange.minStep || expectedStep);
        const step = minStep >= expectedStep ? minStep : expectedStep;
        if (!!chart['datasource-prometheus'] &&
            chart['datasource-prometheus'].step == step &&
            chart['datasource-prometheus'].start == start &&
            chart['datasource-prometheus'].end == end)
            return;

        chart['datasource-prometheus'].step = step;
        chart['datasource-prometheus'].start = start;
        chart['datasource-prometheus'].end = end;

        chart['datasource-prometheus'].error = null;

        const reqs: Promise<QueryResult>[] = datasource.executeQueries(prometheus, queries, start, end, step);

        // look for previously hidden series
        let isHiddenMap = {};
        for (let i = 0; i < chart.data.datasets.length; i++) {
            const oldDataSet: ChartDataset = chart.data.datasets[i];
            isHiddenMap[oldDataSet.label] = !chart.isDatasetVisible(i);
        }

        // loop over queries
        // when we get all query results, we mix series into a single `datasets` array
        chart['datasource-prometheus'].loading = true;
        this.updateMessage(chart, _options);

        Promise.all(reqs)
            .then((results) => {
                if (options.chartType === 'stat') {
                    const statData = results.reduce((stats, result, queryIndex) => {
                        return stats.concat(result.result.map((serie, i) => {
                            const values = serie.values;
                            if (values.length === 0) return null;
                            
                            const latestValue = values[values.length - 1];
                            const previousValue = values.length > 1 ? values[values.length - 2] : null;
                            const percentChange = previousValue ? 
                                ((latestValue.value - previousValue.value) / previousValue.value) * 100 : null;
                            
                            return {
                                label: selectLabel(options, serie, i),
                                value: latestValue.value,
                                percentChange: percentChange,
                                sparklineData: values.slice(-20),
                                backgroundColor: selectBackGroundColor(options, serie, i),
                                borderColor: selectBorderColor(options, serie, i),
                            };
                        }).filter(Boolean));
                    }, []);
                    
                    chart['datasource-prometheus'].statData = statData;
                    chart.data.datasets = [];
                } else {
                    // extract data from responses and prepare series for Chart.js
                    const datasets = results.reduce((datasets, result, queryIndex) => {
                        const seriesCount = datasets.length;
                        const data = result.result.map((serie, i) => {
                            return {
                                tension: options.tension,
                                cubicInterpolationMode: options.cubicInterpolationMode || 'default',
                                stepped: options.stepped,
                                fill: options.fill || false,
                                label: selectLabel(options, serie, seriesCount + i),
                                data: serie.values.map((v, j) => {
                                    return {
                                        x: v.time,
                                        y: v.value,
                                    };
                                }),
                                backgroundColor: selectBackGroundColor(options, serie, seriesCount + i),
                                borderColor: selectBorderColor(options, serie, seriesCount + i),
                                borderWidth: options.borderWidth,
                                hidden: isHiddenMap[selectLabel(options, serie, seriesCount + i)] || false,
                            } as ChartDataset;
                        });

                        return datasets.concat(...data);
                    }, []);

                    chart.data.datasets = datasets;
                    // in case there is some data, we make things beautiful
                    if (chart.data.datasets.length > 0) {
                        if (options.fillGaps) {
                            fillGaps(chart, start, end, step, options);
                        }

                        if (options.dataSetHook) {
                            chart.data.datasets = options.dataSetHook(chart.data.datasets);
                        }

                        setTimeAxesOptions(chart);
                    }
                }
                this.resumeRendering(chart);
            })
            .catch((err) => {
                // reset data and axes
                chart.data.datasets = [];
                chart['datasource-prometheus'].error = 'Failed to fetch data';
                setTimeAxesOptions(chart);
                this.resumeRendering(chart);
                throw err;
            });
        return false;
    }

    public afterDraw(chart: Chart, args: any, _options: any) {
        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);
        
        if (options.chartType === 'stat' && chart['datasource-prometheus'].statData) {
            this.renderStatVisualization(chart, chart['datasource-prometheus'].statData, options);
        }
        
        this.updateMessage(chart, _options);
    }

    public updateMessage(chart: Chart, _options: any) {
        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);

        if (chart['datasource-prometheus'].error != null) {
            this.writeText(chart, options.errorMsg?.message || chart['datasource-prometheus'].error, (ctx) => {
                ctx.direction = options.errorMsg.direction;
                ctx.textAlign = options.errorMsg.textAlign;
                ctx.textBaseline = options.errorMsg.textBaseline;
                ctx.font = "16px normal 'Helvetica Nueue'";
            });
        } else if (chart['datasource-prometheus'].loading == true) {
            if (options.loadingMsg) {
                this.writeText(chart, options.loadingMsg.message, (ctx) => {
                    ctx.direction = options.loadingMsg.direction;
                    ctx.textAlign = options.loadingMsg.textAlign;
                    ctx.textBaseline = options.loadingMsg.textBaseline;
                    ctx.font = options.loadingMsg.font;
                });
            }
        } else if (chart.data.datasets.length == 0) {
            this.writeText(chart, options.noDataMsg.message, (ctx) => {
                ctx.direction = options.noDataMsg.direction;
                ctx.textAlign = options.noDataMsg.textAlign;
                ctx.textBaseline = options.noDataMsg.textBaseline;
                ctx.font = options.noDataMsg.font;
            });
        }
    }

    public writeText(chart: Chart, message: string, fn?: (ctx: CanvasRenderingContext2D) => void) {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;
        chart.clear();

        ctx.save();
        if (fn) {
            fn(ctx);
        }

        ctx.fillText(message, width / 2, height / 2);
        ctx.restore();
    }

    public afterDestroy(chart: Chart, args: any, _options: any) {
        // auto update
        if (!!chart['datasource-prometheus'].updateInterval)
            clearInterval(chart['datasource-prometheus'].updateInterval);
    }

    private resumeRendering(chart: Chart) {
        chart['datasource-prometheus'].loading = false;
        chart['datasource-prometheus'].rendering = true;
        chart.update();
        chart['datasource-prometheus'].rendering = false;
    }

    private renderStatVisualization(chart: Chart, statData: any[], options: ChartDatasourcePrometheusPluginOptions) {
        const ctx = chart.ctx;
        const width = chart.width;
        const height = chart.height;
        
        chart.clear();
        
        const statsPerRow = Math.ceil(Math.sqrt(statData.length));
        const statWidth = width / statsPerRow;
        const statHeight = height / Math.ceil(statData.length / statsPerRow);
        
        statData.forEach((stat, index) => {
            const row = Math.floor(index / statsPerRow);
            const col = index % statsPerRow;
            const x = col * statWidth;
            const y = row * statHeight;
            
            ctx.save();
            
            if (stat.sparklineData && stat.sparklineData.length > 1) {
                this.drawSparkline(ctx, stat.sparklineData, x, y, statWidth, statHeight, stat.borderColor);
            }
            
            ctx.fillStyle = stat.borderColor || '#333';
            ctx.font = 'bold 48px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            
            const valueText = this.formatStatValue(stat.value);
            ctx.fillText(valueText, x + statWidth / 2, y + statHeight / 2 - 20);
            
            if (stat.percentChange !== null) {
                ctx.font = '24px Arial';
                ctx.fillStyle = stat.percentChange >= 0 ? '#28a745' : '#dc3545';
                const changeText = `${stat.percentChange >= 0 ? '+' : ''}${stat.percentChange.toFixed(1)}%`;
                ctx.fillText(changeText, x + statWidth / 2, y + statHeight / 2 + 30);
            }
            
            ctx.font = '16px Arial';
            ctx.fillStyle = '#666';
            ctx.fillText(stat.label, x + statWidth / 2, y + statHeight - 20);
            
            ctx.restore();
        });
    }

    private drawSparkline(ctx: CanvasRenderingContext2D, data: any[], x: number, y: number, width: number, height: number, color: string) {
        if (data.length < 2) return;
        
        const values = data.map(d => d.value);
        const minValue = Math.min(...values);
        const maxValue = Math.max(...values);
        const valueRange = maxValue - minValue || 1;
        
        ctx.save();
        ctx.globalAlpha = 0.3;
        ctx.strokeStyle = color || '#007bff';
        ctx.lineWidth = 2;
        ctx.beginPath();
        
        data.forEach((point, index) => {
            const px = x + (index / (data.length - 1)) * width;
            const py = y + height - ((point.value - minValue) / valueRange) * (height * 0.6);
            
            if (index === 0) {
                ctx.moveTo(px, py);
            } else {
                ctx.lineTo(px, py);
            }
        });
        
        ctx.stroke();
        ctx.restore();
    }

    private formatStatValue(value: number): string {
        if (value >= 1000000) {
            return (value / 1000000).toFixed(1) + 'M';
        } else if (value >= 1000) {
            return (value / 1000).toFixed(1) + 'K';
        } else {
            return value.toFixed(1);
        }
    }
};
