// Min step is 1s
const PROMETHEUS_QUERY_RANGE_MIN_STEP = 1;

export default {

    /**
     * Compute a step for range_query (interval between 2 points in second)
     * Min step: 1s
     * Default: 1 step every 25px
     * @param {Date} start 
     * @param {Date} end
     * @param {number} chartWidth: width in pixel 
     */
    getPrometheusStepAuto: (start, end, chartWidth) => {
        const secondDuration = (end.getTime() - start.getTime()) / 1000;
        const step = Math.floor(secondDuration / chartWidth) * 25;
        return step < PROMETHEUS_QUERY_RANGE_MIN_STEP ? PROMETHEUS_QUERY_RANGE_MIN_STEP : step;
    },

    /**
     * Return Date objects containing the start and end date of interval.
     * Relative dates are computed to absolute
     * @param {object} timeRange 
     */
    getStartAndEndDates(timeRange) {
        // default to "absolute"
        timeRange['type'] = !!timeRange['type'] ? timeRange['type'] : 'absolute';

        if (timeRange['type'] === 'absolute') {
            return {
                start: timeRange['start'],
                end: timeRange['end']
            };
        } else if (timeRange['type'] === 'relative') {
            return {
                start: new Date(new Date().getTime() + timeRange['start']),
                end: new Date(new Date().getTime() + timeRange['end']),
            };
        }
        throw new Error('Unexpected options.timeRange value.');
    }

};