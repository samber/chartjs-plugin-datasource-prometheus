const form = document.querySelector('form#refresh-form');
const endpointInput = document.querySelector('form#refresh-form input#endpoint');
const queryInput = document.querySelector('form#refresh-form input#query');
const chartTypeSelect = document.querySelector('form#refresh-form select#chartType');
const btn = document.querySelector('form#refresh-form button');
const timeseriesCtx = document.querySelector('#myChart canvas').getContext('2d');
const statCtx = document.querySelector('#myStatChart canvas').getContext('2d');

endpointInput.value = 'https://prometheus.demo.prometheus.io/';

queryInput.value = 'sum by (job) (go_gc_duration_seconds)';
// queryInput.value = 'go_memstats_heap_objects';
// queryInput.value = 'node_load1';

// // absolute
// const start = new Date(new Date().getTime() - (60 * 60 * 1000));
// const end = new Date();

// relative
const start = -1 * 60 * 60 * 1000;
const end = 0; // now

const timeseriesChart = new Chart(timeseriesCtx, {
    type: 'line',
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
        animation: {
            duration: 0,
        },
        scales: {},
        plugins: {
            'datasource-prometheus': {
                chartType: 'timeseries',
                prometheus: {
                    endpoint: endpointInput.value,
                },
                query: queryInput.value,
                timeRange: {
                    type: 'relative',
                    start: start,
                    end: end,
                },
            },
        },
    },
});

const statChart = new Chart(statCtx, {
    type: 'line',
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
        animation: {
            duration: 0,
        },
        scales: {},
        plugins: {
            'datasource-prometheus': {
                chartType: 'stat',
                prometheus: {
                    endpoint: endpointInput.value,
                },
                query: queryInput.value,
                timeRange: {
                    type: 'relative',
                    start: start,
                    end: end,
                },
            },
        },
    },
});

function updateChartVisibility() {
    const selectedType = chartTypeSelect.value;
    document.getElementById('myChart').style.display = selectedType === 'timeseries' ? 'block' : 'none';
    document.getElementById('myStatChart').style.display = selectedType === 'stat' ? 'block' : 'none';
}

// Initial visibility
updateChartVisibility();

function customReq(start, end, step) {
    const url = `https://prometheus.demo.do.prometheus.io/api/v1/query_range?query=${encodeURIComponent(queryInput.value)}&start=${start.getTime() / 1000}&end=${end.getTime() / 1000}&step=${step}`;
    const proxiedUrl = `https://cors-anywhere-chartjs-demo.herokuapp.com/${url}`;
    return fetch(proxiedUrl)
        .then(response => response.json())
        .then(response => response['data']);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    timeseriesChart.options.plugins['datasource-prometheus'].prometheus.endpoint = endpointInput.value;
    timeseriesChart.options.plugins['datasource-prometheus'].query = queryInput.value;
    statChart.options.plugins['datasource-prometheus'].prometheus.endpoint = endpointInput.value;
    statChart.options.plugins['datasource-prometheus'].query = queryInput.value;
    timeseriesChart.update();
    statChart.update();
});

chartTypeSelect.addEventListener('change', updateChartVisibility);
