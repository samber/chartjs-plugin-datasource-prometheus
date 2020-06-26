import PrometheusQuery from 'prometheus-query';
import datasource from './datasource';
import opt from './options';
import {
    setTimeAxesOptions
} from './axes';

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
        const step = _options['timeRange']['step'] || datasource.getPrometheusStepAuto(start, end, chart.width);

        const pq = new PrometheusQuery(prometheus);

        pq.rangeQuery(query, start, end, step)
            .then((res) => {
                if (res.result.length > 0) {
                    chart.data.datasets = res.result.map((serie, i) => {
                        return {
                            label: serie.metric.toString(),
                            data: serie.values.map((v, j) => {
                                return {
                                    t: v.time,
                                    y: v.value,
                                };
                            }),
                            backgroundColor: _options.backgroundColor[i % _options.backgroundColor.length],
                            borderColor: _options.borderColor[i % _options.borderColor.length],
                            borderWidth: _options.borderWidth,
                        };
                    });

                }

                if (_options.fillGaps) {
                    fillGaps(chart, start, end, step);
                }

                setTimeAxesOptions(chart, start, end);

                chart['datasource-prometheus']['loading'] = true;
                chart.update();
                chart['datasource-prometheus']['loading'] = false;
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
