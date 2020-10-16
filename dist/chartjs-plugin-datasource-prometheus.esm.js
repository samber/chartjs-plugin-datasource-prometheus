import 'chart.js';
import PrometheusQuery from 'prometheus-query';

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
        timeRange['type'] = !!timeRange['type'] ? timeRange['type'] : 'absolute';

        if (timeRange['type'] === 'absolute') {
            return {
                start: timeRange['start'],
                end: timeRange['end']
            };
        } else if (timeRange['type'] === 'relative') {
            return {
                start: new Date(new Date().getTime() + timeRange['start']),
                end: new Date(new Date().getTime() + timeRange['end']),
            };
        }
        throw new Error('Unexpected options.timeRange value.');
    }

};

// Min step is 1s

var opt = {

    /**
     * Compute a step for range_query (interval between 2 points in second)
     */
    assertPluginOptions: (options) => {
        if (!options)
            throw 'ChartDatasourcePrometheusPlugin.options is undefined';

        if (!options['query'])
            throw new Error('options.query is undefined');
        if (!options['timeRange'])
            throw new Error('options.timeRange is undefined');
        if (options['timeRange']['start'] == null)
            throw new Error('options.timeRange.start is undefined');
        if (options['timeRange']['end'] == null)
            throw new Error('options.timeRange.end is undefined');

        if (typeof (options['query']) != 'string')
            throw new Error('options.query must be a string');

        if (typeof (options['timeRange']) != 'object')
            throw new Error('options.timeRange must be a object');
        if (typeof (options['timeRange']['type']) != 'string')
            throw new Error('options.timeRange.type must be a string');
        if (!(typeof (options['timeRange']['start']) == 'number' || (typeof (options['timeRange']['start']) == 'object' && options['timeRange']['start'].constructor.name == 'Date')))
            throw new Error('options.timeRange.start must be a Date object (absolute) or integer (relative)');
        if (!(typeof (options['timeRange']['end']) == 'number' || (typeof (options['timeRange']['end']) == 'object' && options['timeRange']['end'].constructor.name == 'Date')))
            throw new Error('options.timeRange.end must be a Date object (absolute) or integer (relative)');
        if (typeof (options['timeRange']['msUpdateInterval']) != 'number')
            throw new Error('options.timeRange.msUpdateInterval must be a integer');
        if (options['timeRange']['msUpdateInterval'] < 1000)
            throw new Error('options.timeRange.msUpdateInterval must be greater than 1s.');
    },

    defaultOptionsValues: (options) => {
        const dEfault = {
            // https://learnui.design/tools/data-color-picker.html#palette
            'backgroundColor': [
                'transparent',
                'transparent',
                'transparent',
                'transparent',
                'transparent',
                'transparent',
                'transparent',
                'transparent',

                // 'rgba(0, 63, 92, 0.2)',
                // 'rgba(47, 75, 124, 0.2)',
                // 'rgba(102, 81, 145, 0.2)',
                // 'rgba(160, 81, 149, 0.2)',
                // 'rgba(212, 80, 135, 0.2)',
                // 'rgba(249, 93, 106, 0.2)',
                // 'rgba(255, 124, 67, 0.2)',
                // 'rgba(255, 166, 0, 0.2)',

                // 'rgba(255, 99, 132, 0.2)',
                // 'rgba(54, 162, 235, 0.2)',
                // 'rgba(255, 206, 86, 0.2)',
                // 'rgba(75, 192, 192, 0.2)',
                // 'rgba(153, 102, 255, 0.2)',
                // 'rgba(255, 159, 64, 0.2)'
            ],
            'borderColor': [
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
            ],
            'borderWidth': 3,
            'fillGaps': false,
        };

        return Object.assign(dEfault, options);
    }

};

// const AXES_UNIT_AND_STEP = [{

// enforce xAxes data type to 'time'
const setTimeAxesOptions = (chart, start, end) => {
    chart.config.options = !!chart.config.options ? chart.config.options : {};
    chart.config.options.scales = !!chart.config.options.scales ? chart.config.options.scales : {};
    chart.config.options.scales.xAxes = !!chart.config.options.scales.xAxes && chart.config.options.scales.xAxes.length > 0 ? chart.config.options.scales.xAxes : [{}];
    chart.config.options.scales.xAxes[0].time = !!chart.config.options.scales.xAxes[0].time ? chart.config.options.scales.xAxes[0].time : {};
    chart.config.options.scales.xAxes[0].time.displayFormats = !!chart.config.options.scales.xAxes[0].time.displayFormats ? chart.config.options.scales.xAxes[0].time.displayFormats : {};

    chart.config.options.scales.xAxes[0].type = chart.config.options.scales.xAxes[0].type || 'time';
    chart.config.options.scales.xAxes[0].distribution = chart.config.options.scales.xAxes[0].distribution || 'linear';
    chart.config.options.scales.xAxes[0].time.minUnit = chart.config.options.scales.xAxes[0].time.minUnit || 'second';
};

const fillGaps = (chart, start, end, step, options = {}) => {
    var minStep = (options.minStep || step);
    minStep = minStep >= step ? minStep : step; 
    chart.data.datasets.forEach((dataSet, index) => {
        // detect missing data in response
        for (var i = dataSet.data.length - 2; i > 0 ; i--) {
            if ((dataSet.data[i + 1].t - dataSet.data[i].t) > (1100 * minStep)) {
                for (var steps = (dataSet.data[i + 1].t - dataSet.data[i].t) / (minStep * 1000); steps > 1; steps--) {
                    dataSet.data.splice(i + 1, 0,
                        { t: new Date(dataSet.data[i + 1].t.getTime() - minStep * 1000), v: Number.NaN });	
                }
            }
        }

        // at the start of time range
        if (Math.abs(start - dataSet.data[0].t) > (1100 * minStep)) {
            for (var i = Math.abs(start - dataSet.data[0].t) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.unshift({ t: new Date(dataSet.data[0].t.getTime() - minStep * 1000), v: Number.NaN });
            }
        }

        // at the end of time range
        if (Math.abs(end - dataSet.data[dataSet.data.length - 1].t) > (1100 * minStep)) {
            for (var i = Math.abs(end - dataSet.data[dataSet.data.length - 1].t) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.push({ t: new Date(dataSet.data[chart.data.datasets[index].data.length - 1].t.getTime() + minStep * 1000), v: Number.NaN });
            }
        }
    });
}


const selectLabel = (_options, serie, i) => {
    if (_options.findInLabelMap ) {
        return _options.findInLabelMap(serie.metric) || serie.metric.toString();
    }
    return serie.metric.toString();
}

const selectBorderColor = (_options, serie, i) => {
    if (_options.findInBorderColorMap) {
        return _options.findInBorderColorMap(serie.metric) || _options.borderColor[i % _options.borderColor.length];
    }
    return _options.borderColor[i % _options.borderColor.length];
}

var ChartDatasourcePrometheusPlugin = {
    id: 'datasource-prometheus',

    beforeInit: (chart) => {
        chart['datasource-prometheus'] = {
            'loading': false,
        };
    },

    afterInit: (chart, options) => {
        opt.assertPluginOptions(options); // triggers exceptions

        // auto update
        if (!!options && !!options['timeRange'] && !!options['timeRange']['msUpdateInterval'])
            chart['datasource-prometheus']['updateInterval'] = setInterval(() => {
                chart.update();
            }, options['timeRange']['msUpdateInterval']);
    },

    beforeUpdate: (chart, options) => {
        const _options = opt.defaultOptionsValues(options);

        if (!!chart['datasource-prometheus'] && chart['datasource-prometheus']['loading'] == true)
            return true;

        const prometheus = _options['prometheus'];
        const query = _options['query'];
        const {
            start,
            end
        } = datasource.getStartAndEndDates(_options['timeRange']);
        const step = _options['timeRange']['step'] || datasource.getPrometheusStepAuto(start, end, chart.width);
        if (!!chart['datasource-prometheus'] && 
              chart['datasource-prometheus']['step'] == step &&
              chart['datasource-prometheus']['start'] == start &&
              chart['datasource-prometheus']['end'] == end)
            return true;

        chart['datasource-prometheus']['step'] = step;
        chart['datasource-prometheus']['start'] = start;
        chart['datasource-prometheus']['end'] = end;
        const pq = new PrometheusQuery(prometheus);

        pq.rangeQuery(query, start, end, step)
            .then((res) => {
                if (res.result.length > 0) {
                    var isHiddenMap = {};
                    if (chart.data.datasets.length > 0) {
                        for(var oldDataSetKey in chart.data.datasets){
                            var oldDataSet = chart.data.datasets[oldDataSetKey];
                            var metaIndex = 0;
                            for (var id in oldDataSet._meta ){ metaIndex = id; }
                            isHiddenMap[oldDataSet.label] = !chart.isDatasetVisible(oldDataSet._meta[metaIndex].index);
                        }
                    }

                    chart.data.datasets = res.result.map((serie, i) => {
                        return {
                            label: selectLabel(_options, serie, i),
                            data: serie.values.map((v, j) => {
                                return {
                                    t: v.time,
                                    y: v.value,
                                };
                            }),
                            backgroundColor: _options.backgroundColor[i % _options.backgroundColor.length],
                            borderColor: selectBorderColor(_options, serie, i),
                            borderWidth: _options.borderWidth,
                            hidden: isHiddenMap[selectLabel(_options, serie, i)] || false,
                        };
                    });

                    if (_options.fillGaps) {
                        fillGaps(chart, start, end, step, _options);
                    }
                    setTimeAxesOptions(chart);

                    chart['datasource-prometheus']['loading'] = true;
                    chart.update();
                    chart['datasource-prometheus']['loading'] = false;
                } else {
                    chart.data.datasets = []; // no data
                    var ctx = chart.chart.ctx;
                    var width = chart.chart.width;
                    var height = chart.chart.height;
                    chart.clear();

                    ctx.save();
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.font = "21px 'Muli-Bold'";
                    ctx.fillText('No data to display for selected time period', width / 2, height / 2);
                    ctx.restore();
                }
            });

        return false;
    },

    destroy: (chart, options) => {
        // auto update
        if (!!chart['datasource-prometheus']['updateInterval'])
            clearInterval(chart['datasource-prometheus']['updateInterval']);
    },

    constructors: {},
    extensions: {},

    register: (type, constructor, extensions) => {},

    getType: (url) => {},

    getConstructor: (type) => {}
};

export default ChartDatasourcePrometheusPlugin;
