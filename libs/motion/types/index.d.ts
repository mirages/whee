declare enum Mode {
    realtime = "realtime",
    frame = "frame"
}
declare enum Direction {
    x = "x",
    y = "y",
    xy = "xy"
}
interface Options {
    target?: HTMLElement | string;
    mode?: Mode;
    direction?: Direction;
}
interface StepCallback {
    (arg: {
        x: number;
        y: number;
    }): void;
}
interface TouchstartCallback {
    (e: TouchEvent): void;
}
interface TouchmoveCallback {
    (s: {
        x: number;
        y: number;
    }, e: TouchEvent): void;
}
interface TouchendCallback {
    (s: {
        x: number;
        y: number;
    }, e: TouchEvent): void;
}
declare class Motion {
    static isSupportPassive: boolean;
    static Direction: typeof Direction;
    static Mode: typeof Mode;
    readonly el: HTMLElement | null;
    readonly mode: Mode;
    readonly direction: Direction;
    private mainFinger;
    private trendData;
    private trendLength;
    private prevData;
    private renderData;
    private frameId;
    private rendering;
    private accumulation;
    private tmThreshold;
    private touchstartHandler;
    private touchmoveHandler;
    private touchendHandler;
    private scaleHandler;
    /**
     * Motion 构造函数
     * @param {Object} [options] - 配置项
     * @param {string} [options.target=HTMLElement|string] - 绑定元素
     * @param {string} [options.direction=xy] - 移动记录方向：x 只记录水平方向，y 只记录垂直方向，xy 水平垂直方向都记录
     * @param {string} [options.mode=realtime] - 模式：
     *  'absolute' 绝对模式，输出绝对位置变量
     *  'relative' 相对模式，输出相对（上一次）位置变量
     */
    constructor(options?: Options);
    private getEl;
    private initEvent;
    private createData;
    private getMoveData;
    private setTrendData;
    private isNeedInertiaScroll;
    private inertiaScroll;
    private getMoveStep;
    /**
     * 速度为 0，或者速度方向改变，或者速度无限大，则停止运动
     * @param v - 当前速度
     * @param nextV - 下一刻速度
     */
    private isMoveStop;
    private moveFrame;
    private moveRealtime;
    onTouchstart(cb?: TouchstartCallback): void;
    onTouchmove(cb?: TouchmoveCallback): void;
    onTouchend(cb?: TouchendCallback): void;
    touchstart(event: TouchEvent): void;
    touchmove(event: TouchEvent, cb?: StepCallback): void;
    touchend(event: TouchEvent, cb?: StepCallback): void;
    clearInertiaScroll(): void;
}
export default Motion;
