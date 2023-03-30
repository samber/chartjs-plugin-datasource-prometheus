import { PrometheusDriver, QueryResult } from 'prometheus-query';

// Min step is 1s
const PROMETHEUS_QUERY_RANGE_MIN_STEP = 1;
var datasource = {
    /**
     * Compute a step for range_query (interval between 2 points in second)
     * Min step: 1s
     * Default: 1 step every 25px
     * @param {Date} start
     * @param {Date} end
     * @param {number} chartWidth: width in pixel
     */
    getPrometheusStepAuto: (start, end, chartWidth) => {
        const secondDuration = (end.getTime() - start.getTime()) / 1000;
        const step = Math.floor(secondDuration / chartWidth) * 25;
        return step < PROMETHEUS_QUERY_RANGE_MIN_STEP ? PROMETHEUS_QUERY_RANGE_MIN_STEP : step;
    },
    /**
     * Return Date objects containing the start and end date of interval.
     * Relative dates are computed to absolute
     * @param {object} timeRange
     */
    getStartAndEndDates(timeRange) {
        // default to "absolute"
        timeRange.type = !!timeRange.type ? timeRange.type : 'absolute';
        if (timeRange.type === 'absolute') {
            return {
                type: 'absolute',
                start: timeRange['start'],
                end: timeRange['end'],
            };
        }
        else if (timeRange.type === 'relative') {
            return {
                type: 'absolute',
                start: new Date(new Date().getTime() + timeRange.start),
                end: new Date(new Date().getTime() + timeRange.end),
            };
        }
        throw new Error('Unexpected options.timeRange value.');
    },
    executeQueries: (prometheus, queries, start, end, step) => {
        const haveDirectPrometheusRequests = queries.find((q) => typeof q === 'string') != null;
        const p = !!prometheus && haveDirectPrometheusRequests ? new PrometheusDriver(prometheus) : null;
        return queries.map((query) => {
            if (typeof query === 'string')
                return p.rangeQuery(query, start, end, step);
            // if query is not a string, i assume this is an async function returning prometheus results
            return query(start, end, step)
                .then((data) => QueryResult.fromJSON(data));
        });
    }
};

// Mixin for TimeRange field
class ChartDatasourcePrometheusPluginNoDataMsg {
    constructor() {
        this.message = 'No data to display';
        this.font = '16px normal \'Helvetica Nueue\'';
        this.textAlign = 'center';
        this.textBaseline = 'middle';
        this.direction = 'ltr';
    }
}
class ChartDatasourcePrometheusPluginErrorMsg {
    constructor() {
        this.message = null;
        this.font = '16px normal \'Helvetica Nueue\'';
        this.textAlign = 'center';
        this.textBaseline = 'middle';
        this.direction = 'ltr';
    }
}
class ChartDatasourcePrometheusPluginLoadingMsg {
    constructor() {
        this.message = 'Loading data...';
        this.font = '16px normal \'Helvetica Nueue\'';
        this.textAlign = 'center';
        this.textBaseline = 'middle';
        this.direction = 'ltr';
    }
}
const colorList = [
    'rgba(255, 99, 132, 1)',
    'rgba(54, 162, 235, 1)',
    'rgba(255, 206, 86, 1)',
    'rgba(75, 192, 192, 1)',
    'rgba(153, 102, 255, 1)',
    'rgba(255, 159, 64, 1)'
];
class ChartDatasourcePrometheusPluginOptions {
    constructor() {
        /**
         * Options for Prometheus requests
         */
        this.prometheus = null; // can be null when the provided query is just an async function
        /**
         * Options for designing Charts
         * See https://learnui.design/tools/data-color-picker.html#palette
         */
        this.fillGaps = false;
        this.tension = 0.4;
        this.cubicInterpolationMode = 'default';
        this.stepped = false;
        this.fill = false;
        this.stacked = false;
        this.borderWidth = 3;
        this.borderColor = colorList;
        this.backgroundColor = colorList;
        this.noDataMsg = new ChartDatasourcePrometheusPluginNoDataMsg();
        this.errorMsg = new ChartDatasourcePrometheusPluginErrorMsg();
        this.loadingMsg = new ChartDatasourcePrometheusPluginLoadingMsg();
        this.findInLabelMap = null;
        this.findInBorderColorMap = null;
        this.findInBackgroundColorMap = null;
        this.dataSetHook = null;
    }
    /**
     * Compute a step for range_query (interval between 2 points in second)
     */
    assertPluginOptions() {
        if (!this.query)
            throw new Error('options.query is undefined');
        if (!this.timeRange)
            throw new Error('options.timeRange is undefined');
        if (this.timeRange.start == null)
            throw new Error('options.timeRange.start is undefined');
        if (this.timeRange.end == null)
            throw new Error('options.timeRange.end is undefined');
        if (typeof (this.timeRange) != 'object')
            throw new Error('options.timeRange must be a object');
        if (typeof (this.timeRange.type) != 'string')
            throw new Error('options.timeRange.type must be a string');
        if (this.timeRange.type != 'relative' && this.timeRange.type != 'absolute')
            throw new Error('options.timeRange.type must be either "relative" or "absolute"');
        if (!(typeof (this.timeRange.start) == 'number' || (typeof (this.timeRange.start) == 'object' && this.timeRange.start.constructor.name == 'Date')))
            throw new Error('options.timeRange.start must be a Date object (absolute) or integer (relative)');
        if (!(typeof (this.timeRange.end) == 'number' || (typeof (this.timeRange.end) == 'object' && this.timeRange.end.constructor.name == 'Date')))
            throw new Error('options.timeRange.end must be a Date object (absolute) or integer (relative)');
        if (this.timeRange['msUpdateInterval'] != null && typeof (this.timeRange['msUpdateInterval']) != 'number')
            throw new Error('options.timeRange.msUpdateInterval must be a integer');
        if (this.timeRange['msUpdateInterval'] != null && this.timeRange['msUpdateInterval'] < 1000)
            throw new Error('options.timeRange.msUpdateInterval must be greater than 1s.');
    }
    getQueries() {
        var _a, _b;
        if (((_b = (_a = this.query) === null || _a === void 0 ? void 0 : _a.constructor) === null || _b === void 0 ? void 0 : _b.name) != 'Array')
            return [this.query];
        return this.query;
    }
}

// enforce xAxes data type to 'time'
function setTimeAxesOptions(chart) {
    chart.config.options.scales = !!chart.config.options.scales ? chart.config.options.scales : {};
    chart.config.options.scales.x = !!chart.config.options.scales.x ? chart.config.options.scales.x : {};
    chart.config.options.scales.y = !!chart.config.options.scales.y ? chart.config.options.scales.y : {};
    const options = chart.config.options.plugins['datasource-prometheus'];
    Object.assign(chart.config.options.scales.x, {
        type: 'timeseries',
        ticks: {
            maxRotation: 0,
            minRotation: 0,
            major: {
                enabled: true
            },
        },
        stacked: options.stacked,
        time: {
            minUnit: 'second'
        }
    });
    Object.assign(chart.config.options.scales.y, {
        stacked: options.stacked
    });
}
// fill NaN values into data from Prometheus to fill Gaps (hole in chart is to show missing metrics from Prometheus)
// only accept Date objects here
function fillGaps(chart, start, end, step, options) {
    let minStep = options.timeRange.minStep || step;
    minStep = minStep >= step ? minStep : step;
    chart.data.datasets.forEach((dataSet, index) => {
        // detect missing data in response
        for (let i = dataSet.data.length - 2; i > 0; i--) {
            if ((dataSet.data[i + 1]['x'] - dataSet.data[i]['x']) > (1100 * minStep)) {
                for (let steps = (dataSet.data[i + 1]['x'] - dataSet.data[i]['x']) / (minStep * 1000); steps > 1; steps--) {
                    const value = { x: new Date(dataSet.data[i + 1]['x'].getTime() - minStep * 1000), v: Number.NaN };
                    dataSet.data.splice(i + 1, 0, value);
                }
            }
        }
        // at the start of time range
        if (Math.abs(start.getTime() - dataSet.data[0]['x']) > (1100 * minStep)) {
            for (let i = Math.abs(start.getTime() - dataSet.data[0]['x']) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.unshift({ x: new Date(dataSet.data[0]['x'].getTime() - minStep * 1000), v: Number.NaN });
            }
        }
        // at the end of time range
        if (Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['x']) > (1100 * minStep)) {
            for (let i = Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['x']) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.push({ x: new Date(dataSet.data[chart.data.datasets[index].data.length - 1]['x'].getTime() + minStep * 1000), v: Number.NaN });
            }
        }
    });
}

function selectLabel(options, serie, i) {
    const defaultValue = serie.metric.toString();
    if (options.findInLabelMap) {
        return options.findInLabelMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}
function selectBackGroundColor(options, serie, i) {
    const defaultValue = !options.fill ? 'transparent' : options.backgroundColor[i % options.backgroundColor.length];
    if (options.findInBackgroundColorMap) {
        return options.findInBackgroundColorMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}
function selectBorderColor(options, serie, i) {
    const defaultValue = options.borderColor[i % options.borderColor.length];
    if (options.findInBorderColorMap) {
        return options.findInBorderColorMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}

class ChartDatasourcePrometheusPluginInternals {
    constructor() {
        this.loading = false;
        this.rendering = false;
        this.updateInterval = null;
        this.error = null;
    }
}
class ChartDatasourcePrometheusPlugin {
    constructor() {
        this.id = 'datasource-prometheus';
    }
    beforeInit(chart, options) {
        chart['datasource-prometheus'] = new ChartDatasourcePrometheusPluginInternals();
    }
    afterInit(chart, args, _options) {
        if (chart.config['type'] !== "line" && chart.config['type'] !== "bar")
            throw 'ChartDatasourcePrometheusPlugin is only compatible with Line chart\nFeel free to contribute for more!';
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
    beforeUpdate(chart, args, _options) {
        if (!!chart['datasource-prometheus']
            && (chart['datasource-prometheus'].loading === true
                || chart['datasource-prometheus'].rendering === true))
            return;
        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);
        const prometheus = options.prometheus;
        const queries = options.getQueries();
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
        const reqs = datasource.executeQueries(prometheus, queries, start, end, step);
        // look for previously hidden series
        let isHiddenMap = {};
        for (let i = 0; i < chart.data.datasets.length; i++) {
            const oldDataSet = chart.data.datasets[i];
            isHiddenMap[oldDataSet.label] = !chart.isDatasetVisible(i);
        }
        // loop over queries
        // when we get all query results, we mix series into a single `datasets` array
        chart['datasource-prometheus'].loading = true;
        this.updateMessage(chart, _options);
        Promise.all(reqs)
            .then((results) => {
            // extract data from responses and prepare series for Chart.js
            const datasets = results.reduce((datasets, result, queryIndex) => {
                const seriesCount = datasets.length;
                const data = result.result.map((serie, i) => {
                    return {
                        tension: options.tension,
                        cubicInterpolationMode: options.cubicInterpolationMode || 'default',
                        stepped: options.stepped,
                        fill: options.fill || false,
                        label: selectLabel(options, serie),
                        data: serie.values.map((v, j) => {
                            return {
                                x: v.time,
                                y: v.value,
                            };
                        }),
                        backgroundColor: selectBackGroundColor(options, serie, seriesCount + i),
                        borderColor: selectBorderColor(options, serie, seriesCount + i),
                        borderWidth: options.borderWidth,
                        hidden: isHiddenMap[selectLabel(options, serie)] || false,
                    };
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
    afterDraw(chart, args, _options) {
        this.updateMessage(chart, _options);
    }
    updateMessage(chart, _options) {
        var _a;
        const options = Object.assign(new ChartDatasourcePrometheusPluginOptions(), _options);
        if (chart['datasource-prometheus'].error != null) {
            this.writeText(chart, ((_a = options.errorMsg) === null || _a === void 0 ? void 0 : _a.message) || chart['datasource-prometheus'].error, (ctx) => {
                ctx.direction = options.errorMsg.direction;
                ctx.textAlign = options.errorMsg.textAlign;
                ctx.textBaseline = options.errorMsg.textBaseline;
                ctx.font = "16px normal 'Helvetica Nueue'";
            });
        }
        else if (chart['datasource-prometheus'].loading == true) {
            if (options.loadingMsg) {
                this.writeText(chart, options.loadingMsg.message, (ctx) => {
                    ctx.direction = options.loadingMsg.direction;
                    ctx.textAlign = options.loadingMsg.textAlign;
                    ctx.textBaseline = options.loadingMsg.textBaseline;
                    ctx.font = options.loadingMsg.font;
                });
            }
        }
        else if (chart.data.datasets.length == 0) {
            this.writeText(chart, options.noDataMsg.message, (ctx) => {
                ctx.direction = options.noDataMsg.direction;
                ctx.textAlign = options.noDataMsg.textAlign;
                ctx.textBaseline = options.noDataMsg.textBaseline;
                ctx.font = options.noDataMsg.font;
            });
        }
    }
    writeText(chart, message, fn) {
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
    destroy(chart, args, _options) {
        // auto update
        if (!!chart['datasource-prometheus'].updateInterval)
            clearInterval(chart['datasource-prometheus'].updateInterval);
    }
    resumeRendering(chart) {
        chart['datasource-prometheus'].loading = false;
        chart['datasource-prometheus'].rendering = true;
        chart.update();
        chart['datasource-prometheus'].rendering = false;
    }
}

var index = new ChartDatasourcePrometheusPlugin();
// export * from './options';

export { index as default };
//# sourceMappingURL=chartjs-plugin-datasource-prometheus.esm.js.map
