
import { EventApi } from "../event/EventApi";
import { getSingleton } from "../base/Singleton";
import { uiManager } from "../base/UIManager";

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

export function resolutionHelper(){
    return getSingleton(ResolutionHelper);
}

class ResolutionHelper {
    private _logTag = "[ResolutionHelper]";
    private static _instance: ResolutionHelper = null;
    public static Instance() { return this._instance || (this._instance = new ResolutionHelper()); }
    private canvas: cc.Canvas = null;
    /**@description 是否需要进行全屏幕适配 */
    private screenAdaptType: ScreenAdaptType = ScreenAdaptType.None;
    private node: cc.Node = null;

    /**最大允许屏幕比率 */
    private readonly MAX_RATE = 2.4;

    private designResolution: cc.Size = null;
    private landscapeHeight = 0;
    private protraitHeight = 0;
    private waitScorllY = null;
    private isFirstResize = true;
    public _isShowKeyboard = false;
    public _keybordChangeTimerId = -1;
    public _maxLandscapeHeight = 0;
    public get isShowKeyboard() {
        let me = resolutionHelper();
        return me._isShowKeyboard;
    }
    public set isShowKeyboard(value) {
        let me = resolutionHelper();
        //let content = value ? "键盘显示!!!" : "键盘隐藏!!!";
        //cc.log(me._logTag,`${content}`);
        me._isShowKeyboard = value;

        if (!value) {
            me._onResize(true);
        }
    }

    /**@description 全屏适配 */
    public fullScreenAdapt(node: cc.Node) {
        let me = resolutionHelper();
        if (node && me.isNeedAdapt) {
            node.setContentSize(cc.winSize);
            //这里可能父节点还没有，就不管了，按当前节点大小，把子节点做布局
            me.updateAlignment(node);
        }
    }

    /**@description 是否需要做适配操作，当分辨率发生变化，只要ScreenAdaptType 不是None的情况 */
    public get isNeedAdapt() {
        let me = resolutionHelper();
        if (me.screenAdaptType != ScreenAdaptType.None) {
            return true;
        }
        return false;
    }

    private updateAlignment(node: cc.Node) {
        let me = resolutionHelper();
        let ch = node.children;
        for (let i = 0; i < ch.length; i++) {
            let child = ch[i];
            cc.updateAlignment(child);
            me.updateAlignment(child);
        }
    }



    public onLoad(node: cc.Node) {
        let me = resolutionHelper();
        me.node = node;
        me.canvas = node.getComponent(cc.Canvas);
        me.designResolution = me.canvas.designResolution.clone();
        me.onResize();
    }

    public onDestroy() {
        let me = resolutionHelper();
        me.node = null;
        me.isFirstResize = false;
    }

    /**@description 做屏幕适配 */
    private doChangeResolution() {
        let me = resolutionHelper();
        if (me.screenAdaptType == ScreenAdaptType.Increase) {
            let winsize = me.getWinsize();
            me.canvas.designResolution = winsize;
        } else if (me.screenAdaptType == ScreenAdaptType.Max) {
            let winsize = me.getMaxWinsize();
            if (CC_DEBUG) cc.log(`max winsize : ${winsize.width} * ${winsize.height}`);
            me.canvas.designResolution = winsize;
        } else {
            me.canvas.designResolution = me.designResolution;
        }
        if (me.isNeedAdapt) {
            dispatch(EventApi.AdaptScreenEvent);
            uiManager().fullScreenAdapt();
        }
    }


    /**@description 浏览器适配初始化 */
    public initBrowserAdaptor() {
        let me = resolutionHelper();
        if (me.isBrowser && !CC_EDITOR) {
            cc.view.resizeWithBrowserSize(true);

            //调试浏览器
            if (CC_PREVIEW) {
                me.recordHeight();
            } else {
                window.addEventListener("load", () => {
                    me.recordHeight();
                    window.addEventListener("resize", me.onResize, false);
                    window.addEventListener("orientationchange", me.onOrientationChange, false);
                }, false);
            }
        }
    }

    private get isBrowser() {
        if (cc.sys.isBrowser) {
            return true;
        }
        return false;
    }

    private get isSafari() {
        let me = resolutionHelper();
        if (me.isBrowser && cc.sys.OS_IOS == cc.sys.os && cc.sys.browserType == cc.sys.BROWSER_TYPE_SAFARI) {
            return true;
        }
        return false;
    }

    private onOrientationChange() {
        let me = resolutionHelper();
        me.recordHeight();
        me.isFirstResize = false;
        //cc.log(me._logTag,`onOrientationChange`);
    }

    private onResize() {
        let me = resolutionHelper();
        me._onResize(false);
    }

    private _onResize(isHideKeyboard: boolean) {
        let me = resolutionHelper();
        //cc.log(me._logTag,`onResize`);
        if (me.node) {
            if (CC_PREVIEW) {
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
                            if (CC_DEBUG) cc.log(me._logTag, `在有导行条情况下进行刷新操作`);
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
                        cc.log(`cur scrolly : ${window.scrollY}`);
                        if (window.scrollY > 0 || me.isSafari) {
                            if (CC_DEBUG) cc.log(me._logTag, me.dviceDirection);
                            if (me.isSafari) {
                                //在safari浏览器下，做一个强制移动，让浏览器的导行条显示出来,不然在ios13之前，最顶部分按钮无法点击
                                me.waitScorllY = window.scrollY > 0 ? -window.scrollY : -50;
                            } else {
                                me.waitScorllY = -window.scrollY;
                            }
                            if (CC_DEBUG) cc.log(me._logTag, `scrollY : ${me.waitScorllY}`);
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
        let me = resolutionHelper();
        if (me.canvas) {
            if (me.waitScorllY != null) {
                let top = me.waitScorllY;
                if (CC_DEBUG) cc.log(me._logTag, `scroll top : ${top}`);
                if (window.scrollTo) {
                    window.scrollTo(0, top);
                }
                me.waitScorllY = null;
            }
            me.calculateNeedFullScreenAdapt();
            me.doChangeResolution();
        }
        else {
            if (CC_DEBUG) cc.log(me._logTag, `等待场景加载完成做适配`);
        }
    }

    //记录屏幕高度
    private recordHeight() {
        if (window.innerWidth && window.innerHeight) {
            let me = resolutionHelper();
            if (me.dviceDirection == "Landscape") {
                me.landscapeHeight = window.innerHeight;
                me._maxLandscapeHeight = Math.max(me._maxLandscapeHeight, me.landscapeHeight);
            } else if (me.dviceDirection == "Portrait") {
                me.protraitHeight = Math.max(window.innerWidth, window.innerHeight);

            }
        }
    }

    private getWinsize() {
        let me = resolutionHelper();
        let frameSize = me.getFrameSize();
        let width = frameSize.width * me.designResolution.height / frameSize.height;
        let height = me.designResolution.height;
        return cc.size(width, height);
    }

    /**@description 最大化窗口大小 */
    private getMaxWinsize() {
        let me = resolutionHelper();
        //实际当前窗口的宽度
        let height = me.designResolution.height;
        let width = height * me.MAX_RATE;
        return cc.size(width, height);
    }

    private getFrameSize() {
        let me = resolutionHelper();
        let frameSize = cc.view.getFrameSize();
        let innerSize = me.windowInnerSize;
        let size = frameSize.clone();
        if (!CC_JSB && !CC_PREVIEW) {
            size = innerSize;
        }
        return size;
    }

    /**计算是否需要进行全屏幕适配 */
    private calculateNeedFullScreenAdapt() {
        let me = resolutionHelper();
        //当前设计分辨率的宽高比
        let design = me.designResolution.width / me.designResolution.height;
        let frameSize = me.getFrameSize();
        let rate = frameSize.width / frameSize.height;
        if (CC_DEBUG) cc.log(me._logTag, `design : ${design} real : ${rate}`);

        me.screenAdaptType = ScreenAdaptType.None;
        if (design == rate) {
            //相等比率，
            if (CC_DEBUG) cc.log(me._logTag, `相等比率`);
        } else if (rate < design) {
            me.screenAdaptType = ScreenAdaptType.Decrease;
            if (CC_DEBUG) cc.log(me._logTag, `当前设计比率大于实际比率，按宽进行适配，上下有黑边`);
        } else {
            if (CC_DEBUG) cc.log(me._logTag, `当前设计比率小于实际比率，将会对支持全屏的界面进行重重布局`);
            if (rate >= me.MAX_RATE) {
                if (CC_DEBUG) cc.log(me._logTag, `超过上限比率，按最大值来`)
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
        let me = resolutionHelper();
        let size = cc.Size.ZERO.clone();
        if (window.innerHeight && window.innerWidth) {
            let w = window.innerWidth;
            let h = window.innerHeight;
            let isLandscape = w >= h;
            if (!cc.sys.isMobile || isLandscape) {
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