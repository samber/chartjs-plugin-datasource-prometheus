// const AXES_UNIT_AND_STEP = [{
//         'minMsPerPixel': 0,
//         'pxPerStep': 50,
//         'unit': 'millisecond'
//     },
//     {
//         'minMsPerPixel': 1000,
//         'pxPerStep': 50,
//         'unit': 'second'
//     },
//     {
//         'minMsPerPixel': 60 * 1000,
//         'pxPerStep': 50,
//         'unit': 'minute'
//     },
//     {
//         'minMsPerPixel': 60 * 60 * 1000,
//         'pxPerStep': 50,
//         'unit': 'hour'
//     },
//     {
//         'minMsPerPixel': 24 * 60 * 60 * 1000,
//         'pxPerStep': 50,
//         'unit': 'day'
//     },
//     {
//         'minMsPerPixel': 30 * 24 * 60 * 60 * 1000,
//         'pxPerStep': 50,
//         'unit': 'month'
//     },
//     {
//         'minMsPerPixel': 365 * 24 * 60 * 60 * 1000,
//         'pxPerStep': 50,
//         'unit': 'year'
//     },
// ];

// pixels between 2 vertical grid lines
const PIXEL_STEP_SIZE = 30;

// enforce xAxes data type to 'time'
const setTimeAxesOptions = (chart, start, end) => {
    chart.config.options = !!chart.config.options ? chart.config.options : {};
    chart.config.options.scales = !!chart.config.options.scales ? chart.config.options.scales : {};
    chart.config.options.scales.xAxes = !!chart.config.options.scales.xAxes && chart.config.options.scales.xAxes.length > 0 ? chart.config.options.scales.xAxes : [{}];
    chart.config.options.scales.xAxes[0].time = !!chart.config.options.scales.xAxes[0].time ? chart.config.options.scales.xAxes[0].time : {};
    chart.config.options.scales.xAxes[0].time.displayFormats = !!chart.config.options.scales.xAxes[0].time.displayFormats ? chart.config.options.scales.xAxes[0].time.displayFormats : {};

    // const w = chart.width;
    // const msInterval = (end.getTime() - start.getTime());
    // const msPerPixel = msInterval / w;

    // for (let i = 0; i < AXES_UNIT_AND_STEP.length && AXES_UNIT_AND_STEP[i]['minMsPerPixel'] * AXES_UNIT_AND_STEP[i]['stepSize'] < msPerPixel; i++) {
    //     chart.config.options.scales.xAxes[0].time.unit = AXES_UNIT_AND_STEP[i]['unit'];
    //     chart.config.options.scales.xAxes[0].time.stepSize = AXES_UNIT_AND_STEP[i]['stepSize'];
    // }

    chart.config.options.scales.xAxes[0].type = 'time';
    chart.config.options.scales.xAxes[0].distribution = 'linear';
    // chart.config.options.scales.xAxes[0].time.stepSize = PIXEL_STEP_SIZE; // pixels between 2 vertical grid lines
    chart.config.options.scales.xAxes[0].time.minUnit = 'millisecond';
    chart.config.options.scales.xAxes[0].time.displayFormats.hour = 'MMM D, hA'; // override default momentjs format for 'hour' time unit
}

export {
    setTimeAxesOptions,
};