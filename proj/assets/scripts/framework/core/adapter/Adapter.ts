
/**
 * @description 该适配方案参考 https://forum.cocos.org/t/cocos-creator/74001
 */

/**
 * 屏幕分辨率下 的像素值
 */
interface SafeArea {
    /**
     * 屏幕分辨率下：画布（屏幕)宽度
     */
    width: number;

    /**
     * 屏幕分辨率下：画布（屏幕）高度
     */
    height: number;

    /**@description 屏幕分辨率下：安全区域大小(像素) */
    safe: cc.Size;

    /**@description 「设计分辨率」 非安全区域的大小(像素)即刘海单边的大小 */
    outside: cc.Size;

    /**
     * 「设计分辨率」像素值转换到 「屏幕分辨率」 下的像素比
     *
     * e.g.
     *
     * * screenPx = designPx * pixelRatio
     * * designPx = screenPx / pixelRatio
     */
    designPxToScreenPxRatio: number;
}

/**@description 设备方向 */
enum DeviceDirection {
    /**@description 未知*/
    Unknown,
    /**@description 横屏(即摄像头向左) */
    LandscapeLeft,
    /**@description 横屏(即摄像头向右) */
    LandscapeRight,
    /**@description 竖屏(即摄像头向上) */
    Portrait,
    /**@description 竖屏(即摄像头向下) */
    UpsideDown,
}

let SAFE_SIZE = cc.size(0, 0);
let OUTSIDE_SIZE = cc.size(0, 0);

const EDITOR_SIZI = cc.size(1280, 720);
export class Adapter extends cc.Component {

    static direction = DeviceDirection;

    protected set width(value: number) {
        this.node.width = value;
    }
    protected get width() {
        return this.node.width;
    }

    protected set height(value: number) {
        this.node.height = value;
    }

    protected get height() {
        return this.node.height;
    }

    protected static get canvasSize() {
        if (CC_EDITOR) {
            return EDITOR_SIZI;
        } else {
            return cc.view.getCanvasSize();
        }
    }

    protected static get visibleSize() {
        if (CC_EDITOR) {
            return EDITOR_SIZI;
        } else {
            return cc.view.getVisibleSize();
        }
    }

    protected _func: any = null;

    onLoad() {
        super.onLoad && super.onLoad();
        this.onChangeSize();
    }

    onEnable() {
        super.onEnable && super.onEnable();
        this.addEvents();
    }

    onDisable() {
        this.removeEvents();
        super.onDisable && super.onDisable();
    }

    onDestroy() {
        this.removeEvents();
        super.onDestroy && super.onDestroy();
    }

    protected addEvents() {
        if (this._func) {
            return;
        }
        this._func = this.onChangeSize.bind(this);
        window.addEventListener("resize", this._func);
        window.addEventListener("orientationchange", this._func);
    }

    protected removeEvents() {
        if (this._func) {
            window.removeEventListener("resize", this._func);
            window.removeEventListener("orientationchange", this._func);
        }
        this._func = null;
    }

    /**
     * @description 视图发生大小变化
     */
    protected onChangeSize() {

    }

    /**@description 获取当前设备方向 */
    get direction() {
        let str = "未知"
        let result = DeviceDirection.Unknown;
        if (window.orientation != undefined || window.orientation != null) {
            if (window.orientation == 90) {
                str = `横屏向左`
                result = DeviceDirection.LandscapeLeft;
            } else if (window.orientation == -90) {
                str = `横屏向右`
                result = DeviceDirection.LandscapeRight;
            } else if (window.orientation == 0) {
                str = "竖屏向上"
                result = DeviceDirection.Portrait;
            } else if (window.orientation == 180) {
                str = "竖屏向下"
                result = DeviceDirection.UpsideDown;
            }
        }
        Log.d(`设备方向 : ${str}`)
        return result;
    }

    private static _safeArea: SafeArea = null!;

    static set safeArea(value: SafeArea) {
        this._safeArea = value as any;
    }

    static screenPxToDesignPx(screenPx: number) {
        return screenPx / this.safeArea.designPxToScreenPxRatio;
    }

    static designPxToScreenPx(designPx: number) {
        return designPx * this.safeArea.designPxToScreenPxRatio;
    }

    /**
     * 基于屏幕尺寸的安全区域
     *
     * 可以通过 screenPxToDesignPx 转换为基于设计画布尺寸的像素大小
     */
    static get safeArea() {
        if (this._safeArea == null || this._safeArea == undefined) {
            // 初始屏幕宽高像素
            let screenWidth = Adapter.canvasSize.width;
            let screenHeight = Adapter.canvasSize.height;
            // 「设计分辨率」像素值转换到 「屏幕分辨率」 下的像素比
            let designWidth = Adapter.visibleSize.width;
            let designHeight = Adapter.visibleSize.height;
            let designPxToScreenPxRatio = Math.min(screenWidth / designWidth, screenHeight / designHeight);

            // 计算安全区域的宽高像素
            let rect = cc.sys.getSafeAreaRect();
            let safeAreaWith = Math.abs(designWidth - rect.width);
            let safeAreaHeight = Math.abs(designHeight - rect.height);
            OUTSIDE_SIZE.width = (safeAreaWith / 2) / designPxToScreenPxRatio
            OUTSIDE_SIZE.height = (safeAreaHeight / 2) / designPxToScreenPxRatio

            SAFE_SIZE.width = rect.width * designPxToScreenPxRatio;
            SAFE_SIZE.height = rect.height * designPxToScreenPxRatio;

            this._safeArea = {
                width: screenWidth,
                height: screenHeight,
                outside: OUTSIDE_SIZE,
                safe: SAFE_SIZE,
                designPxToScreenPxRatio: designPxToScreenPxRatio,
            };
        }
        return this._safeArea;
    }
}
