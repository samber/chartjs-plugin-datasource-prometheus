
import { PrometheusDriver, QueryResult } from 'prometheus-query';
import { Chart, ChartDataset } from 'chart.js';

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
    updateInterval: any | null = null;
    error: string | null = null;
}

export class ChartDatasourcePrometheusPlugin {
    id = 'datasource-prometheus';

    public beforeInit(chart: Chart, options: any) {
        chart['datasource-prometheus'] = new ChartDatasourcePrometheusPluginInternals();
    }

    public afterInit(chart: Chart, args: any, _options: any) {
        if (chart.config.type != 'line')
            throw 'ChartDatasourcePrometheusPlugin is already compatible with Line chart\nFeel free to contribute for more!';
        if (!_options)
            throw 'ChartDatasourcePrometheusPlugin.options is undefined';

        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);

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
        if (!!chart['datasource-prometheus'] && chart['datasource-prometheus'].loading == true)
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
        if (chart.data.datasets.length > 0) {
            for (let oldDataSetIndex in chart.data.datasets) {
                const oldDataSet: ChartDataset = chart.data.datasets[oldDataSetIndex];
                let metaIndex = 0;
                for (let id in oldDataSet['_meta']) { metaIndex = id as any as number; } // 🤮
                isHiddenMap[oldDataSet.label] = !chart.isDatasetVisible(oldDataSet['_meta'][metaIndex].index);
            }
        }

        // loop over queries
        // when we get all query results, we mix series into a single `datasets` array
        Promise.all(reqs)
            .then((results) => {
                // extract data from responses and prepare series for Chart.js
                const datasets = results.reduce((datasets, result, queryIndex) => {
                    if (result.result.length == 0)
                        return datasets;

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

                    chart['datasource-prometheus'].loading = true;
                    chart.update();
                    chart['datasource-prometheus'].loading = false;
                }
            })
            .catch((err) => {
                // reset data and axes
                chart.data.datasets = [];
                setTimeAxesOptions(chart);

                chart['datasource-prometheus'].error = 'Failed to fetch data';

                throw err;
            });
    }

    public beforeRender(chart: Chart, args: any, _options: any) {
        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);

        if (chart['datasource-prometheus'].error != null) {
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            chart.clear();

            ctx.save();
            ctx.direction = options.errorMsg.direction;
            ctx.textAlign = options.errorMsg.textAlign;
            ctx.textBaseline = options.errorMsg.textBaseline;
            ctx.font = "16px normal 'Helvetica Nueue'";
            ctx.fillText(options.errorMsg?.message || chart['datasource-prometheus'].error, width / 2, height / 2);
            ctx.restore();
            return;
        } else if (chart.data.datasets.length == 0) {
            const ctx = chart.ctx;
            const width = chart.width;
            const height = chart.height;
            chart.clear();

            ctx.save();
            ctx.direction = options.noDataMsg.direction;
            ctx.textAlign = options.noDataMsg.textAlign;
            ctx.textBaseline = options.noDataMsg.textBaseline;
            ctx.font = options.noDataMsg.font;
            ctx.fillText(options.noDataMsg.message, width / 2, height / 2);
            ctx.restore();
            return;
        }
    }

    public destroy(chart: Chart, args: any, _options: any) {
        // auto update
        if (!!chart['datasource-prometheus'].updateInterval)
            clearInterval(chart['datasource-prometheus'].updateInterval);
    }

};
