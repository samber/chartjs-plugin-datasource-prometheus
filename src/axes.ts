
import { Chart, ChartDataset } from "chart.js/auto";
import { ChartDatasourcePrometheusPluginOptions } from "./options";

// enforce xAxes data type to 'time'
export function setTimeAxesOptions(chart: Chart) {
    chart.config.options.scales = !!chart.config.options.scales ? chart.config.options.scales : {};
    chart.config.options.scales.x = !!chart.config.options.scales.x ? chart.config.options.scales.x : {};
    chart.config.options.scales.y = !!chart.config.options.scales.y ? chart.config.options.scales.y : {};

    const options = chart.config.options.plugins['datasource-prometheus'];

    Object.assign(chart.config.options.scales.x, {
        type: 'timeseries',
        ticks: {
            maxRotation: 0,
            minRotation: 0
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
export function fillGaps(chart: Chart, start: Date, end: Date, step: number, options: ChartDatasourcePrometheusPluginOptions) {
    let minStep = options.timeRange.minStep || step;
    minStep = minStep >= step ? minStep : step;

    chart.data.datasets.forEach((dataSet: ChartDataset, index: number) => {
        // detect missing data in response
        for (let i = dataSet.data.length - 2; i > 0; i--) {
            if ((dataSet.data[i + 1]['x'] - dataSet.data[i]['x']) > (1100 * minStep)) {
                for (let steps = (dataSet.data[i + 1]['x'] - dataSet.data[i]['x']) / (minStep * 1000); steps > 1; steps--) {
                    const value = { t: new Date(dataSet.data[i + 1]['x'].getTime() - minStep * 1000), v: Number.NaN };
                    (dataSet.data as any).splice(i + 1, 0, value);
                }
            }
        }

        // at the start of time range
        if (Math.abs(start.getTime() - dataSet.data[0]['x']) > (1100 * minStep)) {
            for (let i = Math.abs(start.getTime() - dataSet.data[0]['x']) / (minStep * 1000); i > 1; i--) {
                (chart.data.datasets[index].data as any).unshift({ x: new Date(dataSet.data[0]['x'].getTime() - minStep * 1000), v: Number.NaN });
            }
        }

        // at the end of time range
        if (Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['x']) > (1100 * minStep)) {
            for (let i = Math.abs(end.getTime() - dataSet.data[dataSet.data.length - 1]['x']) / (minStep * 1000); i > 1; i--) {
                (chart.data.datasets[index].data as any).push({ x: new Date(dataSet.data[chart.data.datasets[index].data.length - 1]['x'].getTime() + minStep * 1000), v: Number.NaN });
            }
        }
    });
}
