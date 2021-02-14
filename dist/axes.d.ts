/// <reference types="chart.js" />
import { ChartDatasourcePrometheusPluginOptions } from "./options";
export declare function setTimeAxesOptions(chart: Chart): void;
export declare function fillGaps(chart: Chart, start: Date, end: Date, step: number, options: ChartDatasourcePrometheusPluginOptions): void;
