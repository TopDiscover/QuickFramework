
const { ccclass, property } = cc._decorator;
/**
 * @description 该适配方案出处 https://forum.cocos.org/t/cocos-creator/74001
 */

/**
 * 屏幕分辨率下 的像素值
 */
 export interface SafeArea {
    /**
     * 屏幕分辨率下：画布（屏幕)宽度
     */
    screenWidth: number;

    /**
     * 屏幕分辨率下：画布（屏幕）高度
     */
    screenHeight: number;

    /**
     * 屏幕分辨率下：安全区域宽度像素
     */
    safeAreaWidth: number;

    /**
     * 屏幕分辨率下：安全区域高度像素
     */
    safeAreaHeight: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）上边缘的距离像素
     */
    safeAreaMarginTop: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）下边缘的距离像素
     */
    safeAreaMarginBottom: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）左边缘的距离像素
     */
    safeAreaMarginLeft: number;

    /**
     * 屏幕分辨率下：安全区域距离画布（屏幕）右边缘的距离像素
     */
    safeAreaMarginRight: number;

    /**
     * 屏幕分辨率下：安全区域 X 偏移像素（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
     */
    safeAreaXOffset: number;

    /**
     * 屏幕分辨率下：安全区域 Y 偏移像素（相对于 Cocos 坐标系，X轴正方向往右，Y轴正方向往上）
     */
    safeAreaYOffset: number;

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

const EDITOR_SIZI = cc.size(1280,720);
export class Adapter extends cc.Component {

    protected set width(value: number) {
        this.node.width = value;
    }
    protected get width(){
        return this.node.width;
    }

    protected set height(value:number){
        this.node.height = value;
    }

    protected get height(){
        return this.node.height;
    }

    protected static get canvasSize(){
        if ( CC_EDITOR ){
            return EDITOR_SIZI;
        }else{
            return cc.view.getCanvasSize();
        }
    }

    protected static get visibleSize(){
        if ( CC_EDITOR ){
            return EDITOR_SIZI;
        }else{
            return cc.view.getVisibleSize();
        }
    }
}
