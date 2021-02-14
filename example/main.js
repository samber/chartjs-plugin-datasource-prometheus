const form = document.querySelector('form#refresh-form');
const endpointInput = document.querySelector('form#refresh-form input#endpoint');
const queryInput = document.querySelector('form#refresh-form input#query');
const btn = document.querySelector('form#refresh-form button');
const ctx = document.querySelector('#myChart canvas').getContext('2d');

endpointInput.value = 'http://demo.robustperception.io:9090/';

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
        scales: {},
        plugins: {
            'datasource-prometheus': {
                prometheus: {
                    endpoint: getEndpoint(),
                },
                // query: ['node_load1', 'node_load5', 'node_load15'],
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

function getEndpoint() {
    // demo.robustperception.io does not support HTTPS
    // but Github Pages use HTTPS
    // then we need this bullshit to prevent requests to insecure endpoint
    // https://github.com/RobustPerception/demo_prometheus_ansible/issues/5
    if (endpointInput.value == 'http://demo.robustperception.io:9090/')
        return 'https://cors-anywhere-chartjs-demo.herokuapp.com/' + endpointInput.value;
        // return 'https://cors-anywhere.herokuapp.com/' + endpointInput.value;
    return endpointInput.value;
}

form.addEventListener('submit', (event) => {
    event.preventDefault();
    myChart.options.plugins['datasource-prometheus'].prometheus.endpoint = getEndpoint();
    myChart.options.plugins['datasource-prometheus'].query = queryInput.value;
    myChart.update();
});
