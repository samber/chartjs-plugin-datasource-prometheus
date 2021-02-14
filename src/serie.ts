
import { ChartDatasourcePrometheusPluginOptions } from "./options";

export function selectLabel(options: ChartDatasourcePrometheusPluginOptions, serie, i) {
    const defaultValue = serie.metric.toString();
    if (options.findInLabelMap) {
        return options.findInLabelMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}

export function selectBackGroundColor(options: ChartDatasourcePrometheusPluginOptions, serie, i) {
    const defaultValue = options.backgroundColor[i % options.backgroundColor.length];
    if (options.findInBackgroundColorMap) {
        return options.findInBackgroundColorMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}

export function selectBorderColor(options: ChartDatasourcePrometheusPluginOptions, serie, i) {
    const defaultValue = options.borderColor[i % options.borderColor.length];
    if (options.findInBorderColorMap) {
        return options.findInBorderColorMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}
