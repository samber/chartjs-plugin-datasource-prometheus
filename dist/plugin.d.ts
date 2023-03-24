import { Chart } from 'chart.js';
export declare class ChartDatasourcePrometheusPlugin {
    id: string;
    beforeInit(chart: Chart, options: any): void;
    afterInit(chart: Chart, args: any, _options: any): void;
    beforeUpdate(chart: Chart, args: any, _options: any): boolean;
    afterDraw(chart: Chart, args: any, _options: any): void;
    writeText(chart: Chart, message: string, fn?: (ctx: CanvasRenderingContext2D) => void): void;
    destroy(chart: Chart, args: any, _options: any): void;
    private resumeRendering;
}
