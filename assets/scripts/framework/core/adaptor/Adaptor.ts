
import { Canvas, Node, size, Size, sys, UITransform, view, Widget, widgetManager } from "cc";
import { DEBUG, EDITOR, JSB, PREVIEW } from "cc/env";
import { Macro } from "../../defines/Macros";

type DeviceDirection = "" | "Landscape" | "Portrait";

export enum ScreenAdaptType {
    /**@description 无处理 */
    None,
    /**@description 放大 */
    Increase,
    /**@description 缩小 */
    Decrease,
    /**@description 最大化，不能在进行拉伸扩大了 */
    Max,
}

function instance() {
    return getSingleton(Adaptor);
}

export class Adaptor {
    private _logTag = "[Adaptor]";
    private static _instance: Adaptor = null!;
    public static Instance() { return this._instance || (this._instance = new Adaptor()); }
    private canvas: Canvas = null!;
    /**@description 是否需要进行全屏幕适配 */
    private screenAdaptType: ScreenAdaptType = ScreenAdaptType.None;
    private node: Node | null = null;

    /**最大允许屏幕比率 */
    private readonly MAX_RATE = 2.4;

    private designResolution: Size = null!;
    private landscapeHeight = 0;
    private protraitHeight = 0;
    private waitScorllY: number | null = null;
    private isFirstResize = true;
    public _isShowKeyboard = false;
    public _keybordChangeTimerId = -1;
    public _maxLandscapeHeight = 0;
    public get isShowKeyboard() {
        return instance()._isShowKeyboard;
    }
    public set isShowKeyboard(value) {
        let me = instance();
        me._isShowKeyboard = value;
        if (!value) {
            me._onResize(true);
        }
    }

    /**@description 全屏适配 */
    public fullScreenAdapt(node: Node,adpater ?: IFullScreenAdapt) {
        let me = instance();
        if (node && me.isNeedAdapt) {
            //只有该节点有适配组件，才适配到全屏
            let widget = node.getComponent(Widget);
            if( !widget ) return;
            let trans = node.getComponent(UITransform)
            trans?.setContentSize(view.getVisibleSize());
            widgetManager.updateAlignment(node);
            if( adpater ){
                adpater.onFullScreenAdapt();
            }
        }
    }

    /**@description 是否需要做适配操作，当分辨率发生变化，只要ScreenAdaptType 不是None的情况 */
    public get isNeedAdapt() {
        let me = instance();
        if (me.screenAdaptType != ScreenAdaptType.None) {
            return true;
        }
        return false;
    }

    public onLoad(node: Node) {
        let me = instance();
        me.node = node;
        me.canvas = node.getComponent(Canvas) as Canvas;
        me.designResolution = view.getDesignResolutionSize();
        me.onResize();
    }

    public onDestroy() {
        let me = instance();
        me.node = null;
        me.isFirstResize = false;
    }

    /**@description 做屏幕适配 */
    private doChangeResolution() {
        let me = instance();
        if (me.screenAdaptType == ScreenAdaptType.Increase) {
            let winsize = me.getWinsize();
            let policy = view.getResolutionPolicy();
            view.setDesignResolutionSize(winsize.width, winsize.height, policy);
        } else if (me.screenAdaptType == ScreenAdaptType.Max) {
            let winsize = me.getMaxWinsize();
            if (DEBUG) Log.d(`max winsize : ${winsize.width} * ${winsize.height}`);
            let policy = view.getResolutionPolicy();
            view.setDesignResolutionSize(winsize.width, winsize.height, policy);
        } else {
            let policy = view.getResolutionPolicy();
            view.setDesignResolutionSize(me.designResolution.width, me.designResolution.height, policy);
        }
        if (me.isNeedAdapt) {
            dispatch(Macro.ADAPT_SCREEN);
            Manager.uiManager.fullScreenAdapt();
        }
    }


    /**@description 浏览器适配初始化 */
    public initBrowserAdaptor() {
        let me = instance();
        if (me.isBrowser && !EDITOR) {
            view.resizeWithBrowserSize(true);
            view.setResizeCallback(me.onResize)

            //调试浏览器
            if (PREVIEW || sys.platform == sys.Platform.WECHAT_GAME) {
                me.recordHeight();
            } else {
                window.addEventListener("load", () => {
                    me.recordHeight();
                    window.addEventListener("orientationchange", me.onOrientationChange, false);
                }, false);
            }
        }
    }

    get isBrowser() {
        if (sys.isBrowser) {
            return true;
        }
        return false;
    }

    private get isSafari() {
        let me = instance();
        if (me.isBrowser && sys.OS_IOS == sys.os && sys.browserType == sys.BROWSER_TYPE_SAFARI) {
            return true;
        }
        return false;
    }

    private onOrientationChange() {
        let me = instance();
        me.recordHeight();
        me.isFirstResize = false;
        //cc.log(me._logTag,`onOrientationChange`);
    }

    private onResize() {
        let me = instance();
        me._onResize(false);
    }

    private _onResize(isHideKeyboard: boolean) {
        let me = instance();
        //cc.log(me._logTag,`onResize`);
        if (me.node) {
            if (PREVIEW || sys.platform == sys.Platform.WECHAT_GAME) {
                me.recordHeight();
                me.doAdapt();
            }
            else {

                if (me.isShowKeyboard) {
                    //cc.log(`键盘显示，不做重新适配处理`);
                    me.recordHeight();
                    return;
                }

                if (me.dviceDirection == "Landscape") {
                    let height = me.landscapeHeight;
                    let offsetY = 0;
                    me.recordHeight();
                    if (me.landscapeHeight != 0) {
                        offsetY = me.landscapeHeight - height;//Math.abs(me.landscapeHeight - height);
                        if (me.isFirstResize) {
                            if (DEBUG) Log.d(me._logTag, `在有导行条情况下进行刷新操作`);
                            me.waitScorllY = offsetY;
                            me.doAdapt();
                            me.isFirstResize = false;
                            return;
                        }
                    }
                }

                if (isHideKeyboard && me.dviceDirection == "Landscape") {
                    //cc.log(`maxHeigth : ${me._maxLandscapeHeight} curHeigth : ${me.landscapeHeight}`);
                    me.waitScorllY = Math.abs(me._maxLandscapeHeight - me.landscapeHeight);
                }

                me.isFirstResize = false;
                me.doAdapt();

                setTimeout(() => {
                    if (me.isShowKeyboard) {
                        //cc.log(`键盘显示11，不做重新适配处理`);
                        return;
                    }
                    if (me.dviceDirection == "Landscape") {
                        me.recordHeight();
                        Log.d(`cur scrolly : ${window.scrollY}`);
                        if (window.scrollY > 0 || me.isSafari) {
                            if (DEBUG) Log.d(me._logTag, me.dviceDirection);
                            if (me.isSafari) {
                                //在safari浏览器下，做一个强制移动，让浏览器的导行条显示出来,不然在ios13之前，最顶部分按钮无法点击
                                me.waitScorllY = window.scrollY > 0 ? -window.scrollY : -50;
                            } else {
                                me.waitScorllY = -window.scrollY;
                            }
                            if (DEBUG) Log.d(me._logTag, `scrollY : ${me.waitScorllY}`);
                            me.doAdapt();
                        } else {
                            me.doAdapt();
                        }
                    } else if (me.dviceDirection == "Portrait") {
                        if (me.protraitHeight > window.innerHeight) {
                            me.waitScorllY = (me.protraitHeight - window.innerHeight);
                        }
                        me.recordHeight();
                        me.doAdapt();
                    }
                }, 505);
            }
        }
    }

    private doAdapt() {
        let me = instance();
        if (me.canvas) {
            if (me.waitScorllY != null) {
                let top = me.waitScorllY;
                if (DEBUG) Log.d(me._logTag, `scroll top : ${top}`);
                if (window.scrollTo) {
                    let fun: any = window.scrollTo;
                    fun(0, top);
                }
                me.waitScorllY = null;
            }
            me.calculateNeedFullScreenAdapt();
            me.doChangeResolution();
        }
        else {
            if (DEBUG) Log.d(me._logTag, `等待场景加载完成做适配`);
        }
    }

    //记录屏幕高度
    private recordHeight() {
        if (window.innerWidth && window.innerHeight) {
            let me = instance();
            if (me.dviceDirection == "Landscape") {
                me.landscapeHeight = window.innerHeight;
                me._maxLandscapeHeight = Math.max(me._maxLandscapeHeight, me.landscapeHeight);
            } else if (me.dviceDirection == "Portrait") {
                me.protraitHeight = Math.max(window.innerWidth, window.innerHeight);
            }
        }
    }

    private getWinsize() {
        let me = instance();
        let frameSize = me.getFrameSize();
        let width = frameSize.width * me.designResolution.height / frameSize.height;
        let height = me.designResolution.height;
        return size(width, height);
    }

    /**@description 最大化窗口大小 */
    private getMaxWinsize() {
        let me = instance();
        //实际当前窗口的宽度
        let height = me.designResolution.height;
        let width = height * me.MAX_RATE;
        return size(width, height);
    }

    private getFrameSize() {
        let me = instance();
        let frameSize = view.getFrameSize();
        let innerSize = me.windowInnerSize;
        let size = frameSize.clone();
        if (!JSB && !PREVIEW) {
            size = innerSize;  
        }
        return size;
    }

    /**计算是否需要进行全屏幕适配 */
    private calculateNeedFullScreenAdapt() {
        let me = instance();
        //当前设计分辨率的宽高比
        let design = me.designResolution.width / me.designResolution.height;
        let frameSize = me.getFrameSize();
        let rate = frameSize.width / frameSize.height;
        if (me.dviceDirection == "Portrait" || (me.dviceDirection == '' && design < 1)) {
            design = 1 / design;
            rate = 1 / rate;
        }
        if (DEBUG) Log.d(me._logTag, `design : ${design} real : ${rate}`);

        me.screenAdaptType = ScreenAdaptType.None;
        if (design == rate) {
            //相等比率，
            if (DEBUG) Log.d(me._logTag, `相等比率`);
        } else if (rate < design) {
            me.screenAdaptType = ScreenAdaptType.Decrease;
            if (DEBUG) Log.d(me._logTag, `当前设计比率大于实际比率，按宽进行适配，上下有黑边`);
        } else {
            if (DEBUG) Log.d(me._logTag, `当前设计比率小于实际比率，将会对支持全屏的界面进行重重布局`);
            if (rate >= me.MAX_RATE) {
                if (DEBUG) Log.d(me._logTag, `超过上限比率，按最大值来`)
                me.screenAdaptType = ScreenAdaptType.Max;
            } else {
                me.screenAdaptType = ScreenAdaptType.Increase;
            }
        }
    }

    /**@description 当前是否处于横屏状态 */
    private get dviceDirection(): DeviceDirection {
        if ((window.orientation != undefined || window.orientation != null) && (window.orientation == 90 || window.orientation == -90)) {
            return "Landscape";
        }
        if ((window.orientation != undefined || window.orientation != null) && (window.orientation == 0 || window.orientation == 180)) {
            return "Portrait";
        }
        return "";
    }

    private get windowInnerSize() {
        let size = Size.ZERO.clone();
        if (window.innerHeight && window.innerWidth) {
            let w = window.innerWidth;
            let h = window.innerHeight;
            let isLandscape = w >= h;
            if (!sys.isMobile || isLandscape) {
                size.width = w;
                size.height = h;
            } else {
                size.width = h;
                size.height = w;
            }
        }
        return size;
    }
}