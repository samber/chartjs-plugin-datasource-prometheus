# Welcome to chartjs-plugin-datasource-prometheus 👋

[![NPM version](https://img.shields.io/npm/v/chartjs-plugin-datasource-prometheus.svg?style=flat-square)](https://npmjs.com/package/chartjs-plugin-datasource-prometheus)
<a href="https://www.jsdelivr.com/package/npm/chartjs-plugin-datasource-prometheus"><img src="https://data.jsdelivr.com/v1/package/npm/chartjs-plugin-datasource-prometheus/badge" alt="jsDelivr Downloads"></a>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> A Prometheus datasource for ChartJS.

![screenshot](./doc/img/screenshot.png)

#### Dependencies:

- requires [chart.js](https://www.chartjs.org) 4.0 or later.
- requires a chart.js date provider to be registered, one of:
  - [chartjs-adapter-date-fns](https://github.com/chartjs/chartjs-adapter-date-fns)
  - [chartjs-adapter-moment](https://github.com/chartjs/chartjs-adapter-moment)
  - [chartjs-adapter-luxon](https://github.com/chartjs/chartjs-adapter-luxon)
  - if unsure, chartjs-adapter-date-fns is a good pick
- requires [prometheus-query](https://github.com/samber/prometheus-query-js) 3.0 or later.

#### Demonstration:

[https://samber.github.io/chartjs-plugin-datasource-prometheus/example/](https://samber.github.io/chartjs-plugin-datasource-prometheus/example/)

I would be happy to add links to charts using this library. Feel free to reach me by creating an issue ;)

## ✨ Features

- Loads time-series from Prometheus into Chart.js.
- **Similar to Grafana**, but ported to Chart.js for public-facing web applications.
- **UMD compatible**, you can use it with any module loader
- Have been tested with *line chart* and (stacked) *bar chart*. The library should be compatible with more chart types.
- Graph **auto-refresh**
- Date interval can be **absolute** or **relative** to `now`
- Multiple Prometheus queries into the same chart
- Stacked series
- Custom backend requests (useful for multitenant apps)
- Hooks available (styling, labeling, data presentation...)
- Custom chart messages for errors or empty Prometheus responses
- Break or continuous lines when gap in data
- Line styling
- Send queries with your own Prometheus driver

⚠️ This project is not intented to replace [Grafana](https://grafana.com/). For monitoring purpose or internal company graph showing, Grafana will definitely be better and more secure.

## 🚀 Installation

Via npm:

```bash
npm install momentjs chart.js --save

npm install chartjs-plugin-datasource-prometheus --save
```

Via CDN:

Add inside of `<head>` the following:
```html
<script src="https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-adapter-date-fns@3/dist/chartjs-adapter-date-fns.bundle.min.js" crossorigin="anonymous"></script>
<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datasource-prometheus@2/dist/chartjs-plugin-datasource-prometheus.umd.min.js" crossorigin="anonymous"></script>
```

💡 Note that chartjs-plugin-datasource-prometheus must be loaded after Chart.js and the date-fns adapter.

Here is used the jsDelivr CDN with specifying only a major version so any minor and patch updates will be applied automatically.
If you need to use a specific version or ESM the copy link from https://www.jsdelivr.com/package/npm/chartjs-plugin-datasource-prometheus


## 💡 Quick start

chartjs-plugin-datasource-prometheus can be used with ES6 modules, plain JavaScript and module loaders.

```html
<canvas id="myChart"></canvas>
```

Then, you need to register the plugin to enable it for all charts in the page.

```js
Chart.registry.plugins.register(ChartDatasourcePrometheusPlugin);
```

Or, you can enable the plugin only for specific charts.

```js
var chart = new Chart(ctx, {
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
        // ...
    }
});
```

In the example below, we display Go duration of garbage collection, for the last 12 hours:

```js
var myChart = new Chart(ctx, {
  type: 'line',
  plugins: [ChartDatasourcePrometheusPlugin],
  options: {
    plugins: {
      'datasource-prometheus': {
        prometheus: {
          endpoint: "https://prometheus.demo.do.prometheus.io",
          baseURL: "/api/v1",   // default value
        },
        query: 'sum by (job) (go_gc_duration_seconds)',
        timeRange: {
          type: 'relative',

          // from 12 hours ago to now
          start: -12 * 60 * 60 * 1000,
          end: 0,
        },
      },
    },
  },
});
```

## 💬 Spec

### Options

| Property | Required | Description | Default |
| --- | :---: | --- | --- |
| **prometheus.endpoint** | yes | Prometheus hostname | |
| **prometheus.baseURL** | no | Prometheus metric path | `"/api/v1"` |
| **prometheus.headers** | no | Headers to add to Prometheus request | |
| **prometheus.auth.username** | no | Basic auth username | |
| **prometheus.auth.password** | no | Basic auth password | |
| **prometheus.proxy.host** | no | Proxy hostname | |
| **prometheus.proxy.port** | no | Proxy port | |
| **prometheus.withCredentials** | no | Send cookies in cross-site requests | `false` |
| **prometheus.timeout** | no | Prometheus request timeout in milliseconds | `10000` |
| **query** | yes | Prometheus query: string or function (see below). Supports multiple queries, using an array. |  |
| **timeRange.type** | no | Time range type: absolute or relative | `"absolute"` |
| **timeRange.start** | yes | Time range start: Date object (absolute) or integer (relative) |  |
| **timeRange.end** | yes | Time range end: Date object (absolute) or integer (relative) |  |
| **timeRange.step** | no | Time between 2 data points | [computed] |
| **timeRange.minStep** | no | Min time between 2 data points | `null` |
| **timeRange.msUpdateInterval** | no | Update interval in millisecond | null |
| **fillGaps** | no | Insert NaN values when values are missing in time range | `false` |
| **tension** | no | Bezier curve tension of the line. Set to 0 to draw straightlines. This option is ignored if monotone cubic interpolation is used | `0.4` |
| **cubicInterpolationMode** | no | "default" or "monotone" | `"default"` |
| **stepped** | no | false, true, "before", "middle" or "after" | `false` |
| **stacked** | no | Whether values are stacked or not | false |
| **fill** | no | Fills the area under the line | `false` |
| **borderWidth** | no | Should I explain this field? | `3` |
| **backgroundColor** | no | Should I explain this field? | See library source code |
| **borderColor** | no | Should I explain this field? | See library source code |
| **errorMsg.message** | no | Overrides error messages | `null` |
| **errorMsg.font** | no | Font of error messages | `"16px normal 'Helvetica Nueue'"` |
| **noDataMsg.message** | no | Empty chart message | `"No data to display"` |
| **noDataMsg.font** | no | Font of empty chart message | `"16px normal 'Helvetica Nueue'"` |

### Hooks

Some hooks have been inserted into the library. It may help you to rewrite label names dynamically, set colors...

// 💡  For better serie labels, we are looking for a templating solution => please contribute ;)

| Property | Required | Description | Prototype |
| --- | :---: | --- | --- |
| **findInLabelMap** | no | Custom serie label | `(serie: Metric) => string` |
| **findInBorderColorMap** | no | Custom serie line color | `(serie: Metric) => string` |
| **findInBackgroundColorMap** | no | Custom serie background color | `(serie: Metric) => string` |
| **dataSetHook** | no | Modify data on the fly, right before display | `(datasets: ChartDataSet[]) => ChartDataSet[]` |

## Examples

### Multiple queries in one chart

The `query` field can be an array of queries. Returned series are aggregated in a single chart.

In case you want to show those queries on different axes, you can define a custom `options.scales.yAxes` field.

```js
var myChart = new Chart(ctx, {
    type: 'line',
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
        scales: {
            yAxes: [
                {position: 'left'},
                {position: 'left'},
                {position: 'right'},
            ]
        },
        plugins: {
            'datasource-prometheus': {
                prometheus: {
                    endpoint: "https://prometheus.demo.do.prometheus.io",
                },
                query: ['node_load1', 'node_load5', 'node_load15'],
                timeRange: {
                    type: 'relative',

                    // from 12 hours ago to now
                    start: -12 * 60 * 60 * 1000,
                    end: 0,
                },
            },
        },
    },
});
```

![screenshot](./doc/img/screenshot-multiple-queries.png)

### Auto refresh

Animations should be disabled when chart refresh itself.

```js
var myChart = new Chart(ctx, {
    type: 'line',
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
        animation: {
            duration: 0,
        },
        plugins: {
            'datasource-prometheus': {
                prometheus: {
                    endpoint: "https://prometheus.demo.do.prometheus.io",
                },
                query: 'node_load1',
                timeRange: {
                    type: 'relative',

                    // from 10 minutes ago to now
                    start: -1 * 10 * 60 * 1000,
                    end: 0,
                    msUpdateInterval: 5000,
                },
            },
        },
    },
});
```

### Update

Query update:

```js
chart.options.plugins['datasource-prometheus'].query = "new query";
chart.update({});
```

Start/end range update:

```js
chart.options.plugins['datasource-prometheus'].timeRange.start = startTime;
chart.update({});
```

### Custom queries

In the context of a multitenant application, it is not a good idea to write a query on the browser side. In that scenario, you may need to send a custom request to your backend, which is responsible for doing the final Prometheus query.

In that case, the `prometheus` field can be ommited. Just pass a function with the following prototype: `(start: Date, end: Date, step: number) => Promise<any>`.

It can be combined with traditional string queries: `query: ['node_load1', customReq]`.

```js
// Here, we call a fictive API that gonna query Prometheus to get the list
// of comments, wrote by the current user during the past hour.
// This endpoint will return a Prometheus-like response.
function customReq(start, end, step) {
    const startTimestamp = start.getTime() / 1000;
    const endTimestamp = end.getTime() / 1000;

    const url = `https://api.example.com/user/activity?event_type=comment.write&range_start=${startTimestamp}&end=${endTimestamp}&range_step=${step}`;
    const headers = {'Authorization': 'Bearer Ainae1Ahchiew6UhseeCh7el'};

    return fetch(url, { headers })
        .then(response => response.json())
        .then(response => response['data']);
}

const myChart = new Chart(ctx, {
    type: 'line',
    plugins: [ChartDatasourcePrometheusPlugin],
    options: {
        plugins: {
            'datasource-prometheus': {
                query: customReq,
                timeRange: {
                    type: 'relative',
                    start: -1 * 60 * 60 * 1000, // 1h ago
                    end: 0,   // now
                },
            },
        },
    },
});
```

## 🤯 Troubleshooting

#### CORS

Start your Prometheus instance with `--web.cors.origin="www.example.com"` flag or even `--web.cors.origin=".*"` if you like living dangerously. 😅

## 🔐 Security advisory

Please read the [security advisory](https://github.com/samber/prometheus-query-js#-security-advisory) of prometheus-query library.

In the context of a multitenant application, it is not a good idea to write a query on the browser side. In that scenario, you may need to use the "custom request" feature.

## 🤝 Contributing

The Prometheus Datasource is open source and contributions from community (you!) are welcome.

There are many ways to contribute: writing code, documentation, reporting issues...

[How-to](./CONTRIBUTING.md)

## Author

👤 **Samuel Berthe**

* Twitter: [@samuelberthe](https://twitter.com/samuelberthe)
* Github: [@samber](https://github.com/samber)

👤 **Frantisek Svoboda**

* Twitter: [@sFrenkie](https://twitter.com/sFrenkie)
* Github: [@sFrenkie](https://github.com/sFrenkie)


## 💫 Show your support

Give a ⭐️ if this project helped you!

[![support us](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/samber)

## 📝 License

Copyright © 2020 [Samuel Berthe](https://github.com/samber).

This project is [MIT](./LICENSE) licensed.
