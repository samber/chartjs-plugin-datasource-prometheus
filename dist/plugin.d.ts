import { PluginServiceGlobalRegistration, PluginServiceRegistrationOptions } from 'chart.js';
export declare class ChartDatasourcePrometheusPlugin implements PluginServiceGlobalRegistration, PluginServiceRegistrationOptions {
    id: string;
    beforeInit(chart: Chart, options: any): void;
    afterInit(chart: Chart, _options: any): void;
    beforeUpdate(chart: Chart, _options: any): boolean;
    afterDraw(chart: Chart, _options: any): void;
    destroy(chart: Chart): void;
    private resumeRendering;
}
