
const selectLabel = (_options, serie, i) => {
    if (_options.findInLabelMap) {
        return _options.findInLabelMap(serie.metric) || serie.metric.toString();
    }
    return serie.metric.toString();
}

const selectBackGroundColor = (_options, serie, i) => {
    if (_options.findInBackgroundColorMap) {
        return _options.findInBackgroundColorMap(serie.metric) || _options.backgroundColor[i % _options.backgroundColor.length];
    }
    return _options.backgroundColor[i % _options.backgroundColor.length];
}

const selectBorderColor = (_options, serie, i) => {
    if (_options.findInBorderColorMap) {
        return _options.findInBorderColorMap(serie.metric) || _options.borderColor[i % _options.borderColor.length];
    }
    return _options.borderColor[i % _options.borderColor.length];
}

export {
    selectLabel,
    selectBackGroundColor,
    selectBorderColor,
};
