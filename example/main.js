const form = document.querySelector('form#refresh-form');
const endpointInput = document.querySelector('form#refresh-form input#endpoint');
const queryInput = document.querySelector('form#refresh-form input#query');
const btn = document.querySelector('form#refresh-form button');
const ctx = document.querySelector('#myChart canvas').getContext('2d');

endpointInput.value = 'https://prometheus.demo.do.prometheus.io/';

queryInput.value = 'sum by (job) (go_gc_duration_seconds)';
// queryInput.value = 'go_memstats_heap_objects';
// queryInput.value = 'node_load1';

// // absolute
// const start = new Date(new Date().getTime() - (60 * 60 * 1000));
// const end = new Date();

// relative
const start = -1 * 60 * 60 * 1000;
const end = 0; // now

const myChart = new Chart(ctx, {
    type: 'line',
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
        animation: {
            duration: 0,
        },
        scales: {},
        plugins: {
            'datasource-prometheus': {
                prometheus: {
                    endpoint: endpointInput.value,
                },
                // query: ['node_load1', 'node_load5', 'node_load15'],
                query: queryInput.value,
                // query: customReq,
                timeRange: {
                    type: 'relative',
                    start: start,
                    end: end,
                    // msUpdateInterval: 2000,
                },
            },
        },
    },
});


function customReq(start, end, step) {
    const url = `https://prometheus.demo.do.prometheus.io/api/v1/query_range?query=${encodeURIComponent(queryInput.value)}&start=${start.getTime() / 1000}&end=${end.getTime() / 1000}&step=${step}`;
    const proxiedUrl = `https://cors-anywhere-chartjs-demo.herokuapp.com/${url}`;
    return fetch(proxiedUrl)
        .then(response => response.json())
        .then(response => response['data']);
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    myChart.options.plugins['datasource-prometheus'].prometheus.endpoint = endpointInput.value;
    myChart.options.plugins['datasource-prometheus'].query = queryInput.value;
    myChart.update();
});
