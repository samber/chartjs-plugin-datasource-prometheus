// Min step is 1s
const PROMETHEUS_QUERY_RANGE_MIN_STEP = 1;

export default {

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
            'dataSetHook': null,
        };

        return Object.assign(dEfault, options);
    }

};
