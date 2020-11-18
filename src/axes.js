
// enforce xAxes data type to 'time'
const setTimeAxesOptions = (chart, start, end) => {
    chart.config.options = !!chart.config.options ? chart.config.options : {};
    chart.config.options.scales = !!chart.config.options.scales ? chart.config.options.scales : {};
    chart.config.options.scales.xAxes = !!chart.config.options.scales.xAxes && chart.config.options.scales.xAxes.length > 0 ? chart.config.options.scales.xAxes : [{}];
    chart.config.options.scales.xAxes[0].time = !!chart.config.options.scales.xAxes[0].time ? chart.config.options.scales.xAxes[0].time : {};
    chart.config.options.scales.xAxes[0].time.displayFormats = !!chart.config.options.scales.xAxes[0].time.displayFormats ? chart.config.options.scales.xAxes[0].time.displayFormats : 'MMM D, hA'; // override default momentjs format for 'hour' time unit

    chart.config.options.scales.xAxes[0].type = 'time';
    chart.config.options.scales.xAxes[0].distribution = chart.config.options.scales.xAxes[0].distribution || 'linear';
    chart.config.options.scales.xAxes[0].time.minUnit = chart.config.options.scales.xAxes[0].time.minUnit || 'second';
}

// fill NaN values into data from Prometheus to fill Gaps (hole in chart is to show missing metrics from Prometheus)
const fillGaps = (chart, start, end, step, options = {}) => {
    const minStep = (options['timeRange']['minStep'] || step);
    minStep = minStep >= step ? minStep : step; 
    chart.data.datasets.forEach((dataSet, index) => {
        // detect missing data in response
        for (let i = dataSet.data.length - 2; i > 0 ; i--) {
            if ((dataSet.data[i + 1].t - dataSet.data[i].t) > (1100 * minStep)) {
                for (let steps = (dataSet.data[i + 1].t - dataSet.data[i].t) / (minStep * 1000); steps > 1; steps--) {
                    dataSet.data.splice(i + 1, 0,
                        { t: new Date(dataSet.data[i + 1].t.getTime() - minStep * 1000), v: Number.NaN });	
                }
            }
        }

        // at the start of time range
        if (Math.abs(start - dataSet.data[0].t) > (1100 * minStep)) {
            for (let i = Math.abs(start - dataSet.data[0].t) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.unshift({ t: new Date(dataSet.data[0].t.getTime() - minStep * 1000), v: Number.NaN });
            }
        }

        // at the end of time range
        if (Math.abs(end - dataSet.data[dataSet.data.length - 1].t) > (1100 * minStep)) {
            for (let i = Math.abs(end - dataSet.data[dataSet.data.length - 1].t) / (minStep * 1000); i > 1; i--) {
                chart.data.datasets[index].data.push({ t: new Date(dataSet.data[chart.data.datasets[index].data.length - 1].t.getTime() + minStep * 1000), v: Number.NaN });
            }
        }
    });
}

export {
    setTimeAxesOptions,
    fillGaps,
};
