import { PrometheusDriver } from 'prometheus-query';

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
    }
};

// Mixin for TimeRange field
class PrometheusTimeRange {
    constructor() {
        this.step = null;
        this.minStep = null;
        this.msUpdateInterval = null;
    }
}
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
class ChartDatasourcePrometheusPluginOptions {
    constructor() {
        /**
         * Options for designing Charts
         * See https://learnui.design/tools/data-color-picker.html#palette
         */
        this.fillGaps = false;
        this.tension = 0.4;
        this.cubicInterpolationMode = 'default';
        this.stepped = false;
        this.fill = false;
        this.borderWidth = 3;
        this.borderColor = [
            // 'rgba(0, 63, 92, 1)',
            // 'rgba(47, 75, 124, 1)',
            // 'rgba(102, 81, 145, 1)',
            // 'rgba(160, 81, 149, 1)',
            // 'rgba(212, 80, 135, 1)',
            // 'rgba(249, 93, 106, 1)',
            // 'rgba(255, 124, 67, 1)',
            // 'rgba(255, 166, 0, 1)',
            'rgba(255, 99, 132, 1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)',
            'rgba(75, 192, 192, 1)',
            'rgba(153, 102, 255, 1)',
            'rgba(255, 159, 64, 1)'
        ];
        this.backgroundColor = [
            'transparent',
            'transparent',
            'transparent',
            'transparent',
            'transparent',
            'transparent',
            'transparent',
            'transparent',
        ];
        this.noDataMsg = new ChartDatasourcePrometheusPluginNoDataMsg();
        this.errorMsg = new ChartDatasourcePrometheusPluginErrorMsg();
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
        if (typeof (this.query) != 'string' && !(typeof (this.query) == 'object' && this.query.constructor.name == 'Array'))
            throw new Error('options.query must be a string or an array of strings');
        if (typeof (this.query) == 'object' && this.query.constructor.name == 'Array' && (this.query.length == 0 || this.query.length > 10))
            throw new Error('options.query must contains between 1 and 10 queries');
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
        if (typeof (this.query) == 'string')
            return [this.query];
        return this.query;
    }
}

// enforce xAxes data type to 'time'
function setTimeAxesOptions(chart) {
    chart.config.options.scales = !!chart.config.options.scales ? chart.config.options.scales : {};
    chart.config.options.scales.xAxes = !!chart.config.options.scales.xAxes && chart.config.options.scales.xAxes.length > 0 ? chart.config.options.scales.xAxes : [{}];
    chart.config.options.scales.xAxes[0].time = !!chart.config.options.scales.xAxes[0].time ? chart.config.options.scales.xAxes[0].time : {};
    // https://www.chartjs.org/docs/latest/axes/cartesian/time.html#display-formats
    // chart.config.options.scales.xAxes[0].time.displayFormats = !!chart.config.options.scales.xAxes[0].time['displayFormats'] ? chart.config.options.scales.xAxes[0].time.displayFormats : 'MMM D, hA'; // override default momentjs format for 'hour' time unit
    chart.config.options.scales.xAxes[0].type = 'time';
    chart.config.options.scales.xAxes[0].distribution = chart.config.options.scales.xAxes[0].distribution || 'linear';
    chart.config.options.scales.xAxes[0].time.minUnit = chart.config.options.scales.xAxes[0].time.minUnit || 'second';
}
// fill NaN values into data from Prometheus to fill Gaps (hole in chart is to show missing metrics from Prometheus)
// only accept Date objects here
function fillGaps(chart, start, end, step, options) {
    let minStep = options.timeRange.minStep || step;
    minStep = minStep >= step ? minStep : step;
    chart.data.datasets.forEach((dataSet, index) => {
        // detect missing data in response
        for (let i = dataSet.data.length - 2; i > 0; i--) {
            if ((dataSet.data[i + 1]['t'] - dataSet.data[i]['t']) > (1100 * minStep)) {
                for (let steps = (dataSet.data[i + 1]['t'] - dataSet.data[i]['t']) / (minStep * 1000); steps > 1; steps--) {
                    const value = { t: new Date(dataSet.data[i + 1]['t'].getTime() - minStep * 1000), v: Number.NaN };
                    dataSet.data.splice(i + 1, 0, value);
                }
            }
        }
        // at the start of time range
        if (Math.abs(start.getTime() - dataSet.data[0]['t']) > (1100 * minStep)) {
            for (let i = Math.abs(start.getTime() - dataSet.data[0]['t']) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.unshift({ t: new Date(dataSet.data[0]['t'].getTime() - minStep * 1000), v: Number.NaN });
            }
        }
        // at the end of time range
        if (Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['t']) > (1100 * minStep)) {
            for (let i = Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['t']) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.push({ t: new Date(dataSet.data[chart.data.datasets[index].data.length - 1]['t'].getTime() + minStep * 1000), v: Number.NaN });
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
    const defaultValue = options.backgroundColor[i % options.backgroundColor.length];
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
    afterInit(chart, _options) {
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
    beforeUpdate(chart, _options) {
        if (!!chart['datasource-prometheus'] && chart['datasource-prometheus'].loading == true)
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
        const p = new PrometheusDriver(prometheus);
        const reqs = queries.map((query) => {
            return p.rangeQuery(query, start, end, step);
        });
        // look for previously hidden series
        let isHiddenMap = {};
        if (chart.data.datasets.length > 0) {
            for (let oldDataSetIndex in chart.data.datasets) {
                const oldDataSet = chart.data.datasets[oldDataSetIndex];
                let metaIndex = 0;
                for (let id in oldDataSet['_meta']) {
                    metaIndex = id;
                } // 🤮
                isHiddenMap[oldDataSet.label] = !chart.isDatasetVisible(oldDataSet['_meta'][metaIndex].index);
            }
        }
        const yAxes = chart.config.options.scales.yAxes;
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
                        yAxisID: !!yAxes && yAxes.length > 0 ? yAxes[queryIndex % yAxes.length].id : null,
                        tension: options.tension,
                        cubicInterpolationMode: options.cubicInterpolationMode || 'default',
                        stepped: options.stepped,
                        fill: options.fill || false,
                        label: selectLabel(options, serie),
                        data: serie.values.map((v, j) => {
                            return {
                                t: v.time,
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
    beforeRender(chart, _options) {
        var _a;
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
            ctx.fillText(((_a = options.errorMsg) === null || _a === void 0 ? void 0 : _a.message) || chart['datasource-prometheus'].error, width / 2, height / 2);
            ctx.restore();
            return;
        }
        else if (chart.data.datasets.length == 0) {
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
    destroy(chart) {
        // auto update
        if (!!chart['datasource-prometheus'].updateInterval)
            clearInterval(chart['datasource-prometheus'].updateInterval);
    }
}

var index = new ChartDatasourcePrometheusPlugin();

export default index;
export { ChartDatasourcePrometheusPluginErrorMsg, ChartDatasourcePrometheusPluginNoDataMsg, ChartDatasourcePrometheusPluginOptions, PrometheusTimeRange };
//# sourceMappingURL=chartjs-plugin-datasource-prometheus.esm.js.map
