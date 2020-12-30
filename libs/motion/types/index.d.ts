declare enum Mode {
    realtime = "realtime",
    frame = "frame"
}
declare enum Direction {
    x = "x",
    y = "y",
    xy = "xy"
}
declare const enum Coordinate {
    screen = "screen",
    client = "client",
    page = "page"
}
interface Options {
    target?: HTMLElement | string;
    mode?: Mode;
    direction?: Direction;
    coordinate?: Coordinate;
}
interface MoveData {
    x: number;
    y: number;
    t: number;
}
interface TransData extends MoveData {
    scale: number;
    angle: number;
}
declare type CbData = Pick<TransData, 'x' | 'y' | 'angle' | 'scale'>;
interface StepCallback {
    (trans: CbData): void;
}
interface TouchstartCallback {
    (e: TouchEvent): void;
}
interface TouchmoveCallback {
    (s: CbData, e: TouchEvent): void;
}
interface TouchendCallback {
    (s: CbData, e: TouchEvent): void;
}
declare class Motion {
    static isSupportPassive: boolean;
    static Direction: typeof Direction;
    static Mode: typeof Mode;
    readonly el: HTMLElement | null;
    readonly mode: Mode;
    readonly direction: Direction;
    readonly coordinate: Coordinate;
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
    /**
     * Motion 构造函数
     * @param {Object} [options] - 配置项
     * @param {string} [options.target=HTMLElement|string] - 绑定元素
     * @param {string} [options.direction=xy] - 移动记录方向：x 只记录水平方向，y 只记录垂直方向，xy 水平垂直方向都记录
     * @param {string} [options.mode=realtime] - 模式：
     *  'realtime' 实时模式，实时计算触摸情况
     *  'frame' 帧模式
     */
    constructor(options?: Options);
    private getEl;
    private initEvent;
    private createData;
    private setTrendData;
    private getMoveData;
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
