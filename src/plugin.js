import PrometheusQuery from 'prometheus-query';
import datasource from './datasource';
import opt from './options';
import {
    setTimeAxesOptions,
    fillGaps,
} from './axes';
import {
    selectLabel,
    selectBackGroundColor,
    selectBorderColor,
} from './serie';

export default {
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
        } = datasource.getStartAndEndDates(_options['timeRange'])
        const expectedStep = _options['timeRange']['step'] || datasource.getPrometheusStepAuto(start, end, chart.width);
        const minStep = (_options['timeRange']['minStep'] || expectedStep);
        const step = minStep >= expectedStep ? minStep : expectedStep;
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
                    let isHiddenMap = {};
                    if (chart.data.datasets.length > 0) {
                        for (let oldDataSetKey in chart.data.datasets) {
                            const oldDataSet = chart.data.datasets[oldDataSetKey];
                            let metaIndex = 0;
                            for (let id in oldDataSet._meta) { metaIndex = id; }
                            isHiddenMap[oldDataSet.label] = !chart.isDatasetVisible(oldDataSet._meta[metaIndex].index);
                        }
                    }

                    chart.data.datasets = res.result.map((serie, i) => {
                        return {
                            tension: _options.tension || 0.4,
                            stepped: _options.stepped || false,
                            cubicInterpolationMode: _options.cubicInterpolationMode || 'default',
                            fill: _options.fill || false,
                            label: selectLabel(_options, serie, i),
                            data: serie.values.map((v, j) => {
                                return {
                                    t: v.time,
                                    y: v.value,
                                };
                            }),
                            backgroundColor: selectBackGroundColor(_options, serie, i),
                            borderColor: selectBorderColor(_options, serie, i),
                            borderWidth: _options.borderWidth,
                            hidden: isHiddenMap[selectLabel(_options, serie, i)] || false,
                        };
                    });

                    if (_options.fillGaps) {
                        fillGaps(chart, start, end, step, _options);
                    }

                    if (_options.dataSetHook) {
                        chart.data.datasets = _options.dataSetHook(chart.data.datasets);
                    }

                    setTimeAxesOptions(chart);

                    chart['datasource-prometheus']['loading'] = true;
                    chart.update();
                    chart['datasource-prometheus']['loading'] = false;

                } else {
                    chart.data.datasets = []; // no data
                }
            });

        return true;
    },
    beforeRender: (chart, options) => {
        const _options = opt.defaultOptionsValues(options);
        if (chart.data.datasets.length == 0) {
            const ctx = chart.chart.ctx;
            const width = chart.chart.width;
            const height = chart.chart.height;
            chart.clear();
    
            ctx.save();
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.font = _options.noData && _options.noData.font ? _options.noData.font : "16px normal 'Helvetica Nueue'";
            ctx.fillText(_options.noData && _options.noData.message ? _options.noData.message : 'No data to display', width / 2, height / 2);
            ctx.restore();
            return false;
        }
        return true
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
