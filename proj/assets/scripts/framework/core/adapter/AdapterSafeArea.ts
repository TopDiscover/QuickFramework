import { Adapter } from "./Adapter";
import AdapterView from "./AdapterView";

const { ccclass, property,executeInEditMode,menu } = cc._decorator;

/**
 * @author zhitaocai
 * @classdesc  安全区域适配Widget
 * @description
 *
 * 用法：
 *
 * 1. 将本组件挂载在节点上即可（注意：该节点上必须挂在 Widget 组件）
 *
 * 适配原理：
 *
 * 1. 根据安全区域范围，修改widget组件属性
 */
@ccclass
@executeInEditMode
@menu("adapter/AdapterSafeArea")
export default class AdapterSafeArea extends Adapter {
    @property({
        tooltip: "是否包含安全区域和屏幕上边界之间的缝隙",
    })
    withInsertTop: boolean = false;

    @property({
        tooltip: "是否包含安全区域和屏幕下边界之间的缝隙",
    })
    withInsertBottom: boolean = false;

    @property({
        tooltip: "是否包含安全区域和屏幕左边界之间的缝隙",
    })
    withInsertLeft: boolean = false;

    @property({
        tooltip: "是否包含安全区域和屏幕右边界之间的缝隙",
    })
    withInsertRight: boolean = false;

    onLoad() {
        this._onResize();
    }

    onEnable() {
        let onResize = this._onResize.bind(this);
        window.addEventListener("resize", onResize);
        window.addEventListener("orientationchange", onResize);
    }

    onDisable() {
        let onResize = this._onResize.bind(this);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("orientationchange", onResize);
    }

    private _onResize() {
        let widget = this.getComponent(cc.Widget);
        if (!widget || !widget.enabled) {
            return;
        }
        // 如果对齐上边界，并且包含安全区域到屏幕上边界的缝隙
        if (widget.isAlignTop && this.withInsertTop) {
            widget.isAbsoluteTop = true;
            widget.top = -AdapterView.screenPxToDesignPx(AdapterView.safeArea.safeAreaMarginTop);
            this.height += Math.abs(widget.top);
        }
        // 如果对齐下边界，并且包含安全区域到屏幕下边界的缝隙
        if (widget.isAlignBottom && this.withInsertBottom) {
            widget.isAbsoluteBottom = true;
            widget.bottom = -AdapterView.screenPxToDesignPx(AdapterView.safeArea.safeAreaMarginBottom);
            this.height += Math.abs(widget.bottom);
        }
        // 如果对齐左边界，并且包含安全区域到屏幕左边界的缝隙
        if (widget.isAlignLeft && this.withInsertLeft) {
            widget.isAbsoluteLeft = true;
            widget.left = -AdapterView.screenPxToDesignPx(AdapterView.safeArea.safeAreaMarginLeft);
            this.width += Math.abs(widget.left);
        }
        // 如果对齐右边界，并且包含安全区域到屏幕右边界的缝隙
        if (widget.isAlignRight && this.withInsertRight) {
            widget.isAbsoluteRight = true;
            widget.right = -AdapterView.screenPxToDesignPx(AdapterView.safeArea.safeAreaMarginRight);
            this.width += Math.abs(widget.right);
        }
        widget.updateAlignment();
    }
}
