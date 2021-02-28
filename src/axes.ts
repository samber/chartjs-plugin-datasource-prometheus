
import { ChartDataSets } from "chart.js";
import { ChartDatasourcePrometheusPluginOptions } from "./options";

// enforce xAxes data type to 'time'
export function setTimeAxesOptions(chart: Chart) {
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
export function fillGaps(chart: Chart, start: Date, end: Date, step: number, options: ChartDatasourcePrometheusPluginOptions) {
    let minStep = options.timeRange.minStep || step;
    minStep = minStep >= step ? minStep : step;

    chart.data.datasets.forEach((dataSet: ChartDataSets, index: number) => {
        // detect missing data in response
        for (let i = dataSet.data.length - 2; i > 0; i--) {
            if ((dataSet.data[i + 1]['t'] - dataSet.data[i]['t']) > (1100 * minStep)) {
                for (let steps = (dataSet.data[i + 1]['t'] - dataSet.data[i]['t']) / (minStep * 1000); steps > 1; steps--) {
                    const value = { t: new Date(dataSet.data[i + 1]['t'].getTime() - minStep * 1000), v: Number.NaN };
                    (dataSet.data as any).splice(i + 1, 0, value);
                }
            }
        }

        // at the start of time range
        if (Math.abs(start.getTime() - dataSet.data[0]['t']) > (1100 * minStep)) {
            for (let i = Math.abs(start.getTime() - dataSet.data[0]['t']) / (minStep * 1000); i > 1; i--) {
                (chart.data.datasets[index].data as any).unshift({ t: new Date(dataSet.data[0]['t'].getTime() - minStep * 1000), v: Number.NaN });
            }
        }

        // at the end of time range
        if (Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['t']) > (1100 * minStep)) {
            for (let i = Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['t']) / (minStep * 1000); i > 1; i--) {
                (chart.data.datasets[index].data as any).push({ t: new Date(dataSet.data[chart.data.datasets[index].data.length - 1]['t'].getTime() + minStep * 1000), v: Number.NaN });
            }
        }
    });
}
