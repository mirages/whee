declare enum Mode {
    realtime = "realtime",
    frame = "frame"
}
declare enum Direction {
    x = "x",
    y = "y",
    xy = "xy"
}
interface Opts {
    target?: HTMLElement | string;
    mode?: Mode;
    direction?: Direction;
}
export interface stepCallback {
    (arg: {
        x: number;
        y: number;
    }): void;
}
export interface touchstartCallback {
    (e: TouchEvent): void;
}
export interface touchmoveCallback {
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
    private trendData;
    private maxLength;
    private tmThreshold;
    private prevData;
    private renderData;
    private animateId;
    private rendering;
    private accumulation;
    private touchstartHandler;
    private touchmoveHandler;
    private touchendHandler;
    /**
     * Motion 构造函数
     * @param {Object} [options] - 配置项
     * @param {string} [options.target=HTMLElement|string] - 绑定元素
     * @param {string} [options.direction=xy] - 移动记录方向：x 只记录水平方向，y 只记录垂直方向，xy 水平垂直方向都记录
     * @param {string} [options.mode=realtime] - 模式：
     *  'absolute' 绝对模式，输出绝对位置变量
     *  'relative' 相对模式，输出相对（上一次）位置变量
     */
    constructor(options?: Opts);
    private getEl;
    private initEvent;
    private createData;
    private getMoveData;
    private isNeedInertiaScroll;
    touchstart(cb?: touchstartCallback): void;
    touchmove(cb?: touchmoveCallback): void;
    touchend(cb?: touchmoveCallback): void;
    start(event: TouchEvent): void;
    move(event: TouchEvent, cb?: stepCallback): void;
    moveAnimate(event: TouchEvent, cb?: stepCallback): void;
    moveRealtime(event: TouchEvent, cb?: stepCallback): void;
    private setTrendData;
    end(event: TouchEvent, cb?: stepCallback): void;
    private inertiaScroll;
    private getMoveStep;
    /**
     * 速度为 0，或者速度方向改变，或者速度无限大，则停止运动
     * @param v - 当前速度
     * @param nextV - 下一刻速度
     */
    private isMoveStop;
    clearInertiaScroll(): void;
}
export default Motion;
