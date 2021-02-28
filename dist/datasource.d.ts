import { PrometheusConnectionOptions, QueryResult } from "prometheus-query";
import { ChartDatasourcePrometheusPluginOptionsTimeRange, PrometheusQuery, PrometheusTimeRangeAbsolute } from "./options";
declare const _default: {
    /**
     * Compute a step for range_query (interval between 2 points in second)
     * Min step: 1s
     * Default: 1 step every 25px
     * @param {Date} start
     * @param {Date} end
     * @param {number} chartWidth: width in pixel
     */
    getPrometheusStepAuto: (start: Date, end: Date, chartWidth: number) => number;
    /**
     * Return Date objects containing the start and end date of interval.
     * Relative dates are computed to absolute
     * @param {object} timeRange
     */
    getStartAndEndDates(timeRange: ChartDatasourcePrometheusPluginOptionsTimeRange): PrometheusTimeRangeAbsolute;
    executeQueries: (prometheus: PrometheusConnectionOptions, queries: PrometheusQuery[], start: Date, end: Date, step: number) => Promise<QueryResult>[];
};
export default _default;
