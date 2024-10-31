import { ChartDataset } from "chart.js";
import { Metric, PrometheusConnectionOptions } from "prometheus-query";
export declare class PrometheusTimeRange {
    step?: number | null;
    minStep?: number | null;
    msUpdateInterval?: number | null;
}
export interface PrometheusTimeRangeRelative {
    type: 'relative';
    start: number;
    end: number;
}
export interface PrometheusTimeRangeAbsolute {
    type: 'absolute';
    start: Date;
    end: Date;
}
export type ChartDatasourcePrometheusPluginOptionsTimeRange = PrometheusTimeRange & (PrometheusTimeRangeRelative | PrometheusTimeRangeAbsolute);
export type PrometheusQuery = string | ((start: Date, end: Date, step: number) => Promise<any>);
export type PrometheusQueries = PrometheusQuery | PrometheusQuery[];
export type PrometheusSerieHook = (serie: Metric) => string | null;
export type DataSetHook = (datasets: ChartDataset[]) => ChartDataset[];
export declare class ChartDatasourcePrometheusPluginNoDataMsg {
    message?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    direction?: CanvasDirection;
}
export declare class ChartDatasourcePrometheusPluginErrorMsg {
    message?: string | null;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    direction?: CanvasDirection;
}
export declare class ChartDatasourcePrometheusPluginLoadingMsg {
    message?: string;
    font?: string;
    textAlign?: CanvasTextAlign;
    textBaseline?: CanvasTextBaseline;
    direction?: CanvasDirection;
}
export declare class ChartDatasourcePrometheusPluginOptions {
    /**
     * Options for Prometheus requests
     */
    prometheus: PrometheusConnectionOptions | null;
    query: PrometheusQueries;
    timeRange: ChartDatasourcePrometheusPluginOptionsTimeRange;
    /**
     * Options for designing Charts
     * See https://learnui.design/tools/data-color-picker.html#palette
     */
    fillGaps?: boolean;
    tension?: number;
    cubicInterpolationMode?: 'default' | 'monotone';
    stepped?: boolean;
    fill?: boolean;
    stacked?: boolean;
    borderWidth?: number;
    borderColor?: string[];
    backgroundColor?: string[];
    noDataMsg?: ChartDatasourcePrometheusPluginNoDataMsg;
    errorMsg?: ChartDatasourcePrometheusPluginErrorMsg;
    loadingMsg?: ChartDatasourcePrometheusPluginLoadingMsg;
    findInLabelMap?: PrometheusSerieHook | null;
    findInBorderColorMap?: PrometheusSerieHook | null;
    findInBackgroundColorMap?: PrometheusSerieHook | null;
    dataSetHook?: DataSetHook | null;
    /**
     * Compute a step for range_query (interval between 2 points in second)
     */
    assertPluginOptions(): void;
    getQueries(): PrometheusQuery[];
}
