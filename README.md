# Welcome to chartjs-plugin-datasource-prometheus 👋

[![NPM version](https://img.shields.io/npm/v/chartjs-plugin-datasource-prometheus.svg?style=flat-square)](https://npmjs.com/package/chartjs-plugin-datasource-prometheus)
<a href="https://www.jsdelivr.com/package/npm/chartjs-plugin-datasource-prometheus"><img src="https://data.jsdelivr.com/v1/package/npm/chartjs-plugin-datasource-prometheus/badge" alt="jsDelivr Downloads"></img></a>
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](#)

> A Prometheus datasource for ChartJS.

![screenshot](./screenshot.png)

#### Dependencies:

- requires [chart.js](https://www.chartjs.org) 2.7 or later.
- requires [moment.js](https://momentjs.com/) 2.0 or later.
- requires [prometheus-query](https://github.com/samber/prometheus-query-js) 2.0 or later.

## ✨ Features (WIP)

- Loads time-series from Prometheus into Chart.js.
- **Similar to Grafana**, but ported to Chart.js for public-facing web applications.
- **UMD compatible**, you can use it with any module loader
- Supports **line chart only** (for now!)
- Graph **auto-refresh**
- Date interval can be **absolute** or **relative** to `now`

⚠️ This project is not intented to replace [Grafana](https://grafana.com/). For monitoring purpose or internal company graph showing, Grafana will definitely be better and more secure.

## 🚀 Installation

Via npm:

```bash
npm install momentjs chart.js --save

npm install chartjs-plugin-datasource-prometheus --save
```

Via CDN:

```html
<script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.24.0/moment.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/chart.js@2.9.3/dist/Chart.min.js"></script>

<script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datasource-prometheus/dist/chartjs-plugin-datasource-prometheus.umd.min.js"></script>
```

💡 Note that chartjs-plugin-datasource-prometheus must be loaded after Chart.js and Moment.js.

## 💡 Quick start

chartjs-plugin-datasource-prometheus can be used with ES6 modules, plain JavaScript and module loaders.

```html
<canvas id="myChart"></canvas>
```

Then, you need to register the plugin to enable it for all charts in the page.

```js
Chart.plugins.register(ChartDatasourcePrometheusPlugin);
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
          endpoint: "http://demo.robustperception.io:9090",
          baseURL: "/api/v1",   // default value
        },
        query: 'sum by (job) (go_gc_duration_seconds)',
        timeRange: {
          type: 'relative',

          // from 12 hours ago to now
          start: -12 * 60 * 60 * 1000,
          end: end,

          // refresh every 5s
          msUpdateInterval: 5 * 1000,
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

## 🤝 Contributing

The Prometheus Datasource is open source and contributions from community (you!) are welcome.

There are many ways to contribute: writing code, documentation, reporting issues...

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
[![support us](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://www.patreon.com/sfrenkie)

## 📝 License

Copyright © 2020 [Samuel Berthe](https://github.com/samber).
Copyright © 2020 [Frantisek Svoboda](https://github.com/sfrenkie).

This project is [MIT](./LICENSE) licensed.
