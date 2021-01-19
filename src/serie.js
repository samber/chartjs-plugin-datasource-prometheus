
const selectLabel = (_options, serie, i) => {
    const defaultValue = serie.metric.toString();
    if (_options.findInLabelMap) {
        return _options.findInLabelMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}

const selectBackGroundColor = (_options, serie, i) => {
    const defaultValue = _options.backgroundColor[i % _options.backgroundColor.length];
    if (_options.findInBackgroundColorMap) {
        return _options.findInBackgroundColorMap(serie.metric) || defaultValue;
    }
    return defaultValue;
}

const selectBorderColor = (_options, serie, i) => {
    const defaultValue = _options.borderColor[i % _options.borderColor.length];
    if (_options.findInBorderColorMap) {
        return _options.findInBorderColorMap(serie.metric);
    }
    return defaultValue;
}

export {
    selectLabel,
    selectBackGroundColor,
    selectBorderColor,
};
