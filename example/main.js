var ctx = document.getElementById('myChart').getContext('2d');

const query = 'sum by (job) (go_gc_duration_seconds)';
// const query = 'node_load1';

// // absolute
// const start = new Date(new Date().getTime() - (60 * 60 * 1000));
// const end = new Date();

// relative
const start = -12 * 60 * 60 * 1000;
const end = 0; // now

var myChart = new Chart(ctx, {
    type: 'line',
    data: {},
    options: {
        scales: {},
        plugins: {
            'datasource-prometheus': {
                prometheus: {
                    endpoint: "http://demo.robustperception.io:9090/",
                },
                query: query,
                timeRange: {
                    type: 'relative',
                    start: start,
                    end: end,
                    msUpdateInterval: 5 * 1000,
                },
            },
        },
    },
    plugins: [
        ChartDatasourcePrometheusPlugin,
    ],
});

document.getElementById('updateBtn').addEventListener('click', () => {
    myChart.update();
});