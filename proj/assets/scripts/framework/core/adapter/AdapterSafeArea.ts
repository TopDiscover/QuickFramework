import { Adapter } from "./Adapter";

const { ccclass, property, executeInEditMode, menu } = cc._decorator;

/**
 * @classdesc  安全区域适配Widget , App.isFullScreenAdaption = true 时有效
 * @description
 *
 * 用法：
 *
 * 1. 将本组件挂载在节点上即可（注意：该节点上必须挂在 Widget 组件）
 *
 * 适配原理：
 *
 * 1. 根据安全区域范围，修改widget组件属性
 * 自动添加刘海宽度，以避免显示到安全区域之外
 */
@ccclass
@executeInEditMode
@menu("Quick适配组件/AdapterSafeArea")
export default class AdapterSafeArea extends Adapter {
    @property
    protected _isTop = false;
    @property({ tooltip: CC_EDITOR && "是否对齐上边" })
    get isAlignTop() {
        return this._isTop;
    }
    set isAlignTop(v) {
        if (this._isTop == v) {
            return;
        }
        this._isTop = v;
        this._isDirty = true;
    }

    @property
    protected _isBottom = false;
    @property({ tooltip: CC_EDITOR && "是否对齐下边", })
    get isAlignBottom() {
        return this._isBottom;
    }
    set isAlignBottom(v) {
        if (this._isBottom == v) {
            return;
        }
        this._isBottom = v;
        this._isDirty = true;
    }

    @property
    protected _isLeft = false;
    @property({ tooltip: CC_EDITOR && "是否对齐左边", })
    get isAlignLeft() {
        return this._isLeft;
    }
    set isAlignLeft(v) {
        if (this._isLeft == v) {
            return;
        }
        this._isLeft = v;
        this._isDirty = true;
    }

    @property
    protected _isRight = false;
    @property({ tooltip: CC_EDITOR && "是否对齐右边", })
    get isAlignRight() {
        return this._isRight;
    }
    set isAlignRight(v) {
        if (this._isRight == v) {
            return;
        }
        this._isRight = v;
        this._isDirty = true;
    }

    @property
    _top = 0;
    @property({ tooltip: CC_EDITOR && "本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用", })
    get top() {
        return this._top;
    }
    set top(v) {
        if (this._top == v) {
            return;
        }
        this._top = v;
        this._isDirty = true;
    }

    @property
    _bottom = 0;
    @property({ tooltip: CC_EDITOR && "本节点顶边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用", })
    get bottom() {
        return this._bottom;
    }
    set bottom(v) {
        if (this._bottom == v) {
            return;
        }
        this._bottom = v;
        this._isDirty = true;
    }

    @property
    _left = 0;
    @property({ tooltip: CC_EDITOR && "本节点顶边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用", })
    get left() {
        return this._left;
    }
    set left(v) {
        if (this._left == v) {
            return;
        }
        this._left = v;
        this._isDirty = true;
    }

    @property
    _right = 0;
    @property({ tooltip: CC_EDITOR && "本节点顶边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用", })
    get right() {
        return this._right;
    }
    set right(v) {
        if (this._right == v) {
            return;
        }
        this._right = v;
        this._isDirty = true;
    }

    protected _isDirty = false;

    protected get widget() {
        let comp = this.getComponent(cc.Widget);
        if (comp) {
            return comp;
        }
        return this.addComponent(cc.Widget);
    }

    protected resetInEditor() {
        this.doLayout(true);
    }

    protected doLayout(isForce = false) {
        if (this._isDirty || isForce) {
            let widget = this.widget;
            if (CC_EDITOR) {
                widget.left = this.left;
                widget.right = this.right;
                widget.top = this.top;
                widget.bottom = this.bottom;

                widget.isAlignLeft = this.isAlignLeft;
                widget.isAlignRight = this.isAlignRight;
                widget.isAlignTop = this.isAlignTop;
                widget.isAlignBottom = this.isAlignBottom;
                return;
            }
            if ( !App.isFullScreenAdaption ){
                return;
            }
            if (!widget || !widget.enabled) {
                return;
            }
            // 如果对齐上边界，并且包含安全区域到屏幕上边界的缝隙
            if (widget.isAlignTop && this.isAlignTop) {
                widget.isAbsoluteTop = true;
                if (this.direction == Adapter.direction.Portrait) {
                    widget.top = this.top + Adapter.safeArea.outside.height;
                } else {
                    widget.top = this.top;
                }
            }
            // 如果对齐下边界，并且包含安全区域到屏幕下边界的缝隙
            if (widget.isAlignBottom && this.isAlignBottom) {
                widget.isAbsoluteBottom = true;
                if (this.direction == Adapter.direction.UpsideDown) {
                    widget.bottom = this.bottom + Adapter.safeArea.outside.height;
                } else {
                    widget.bottom = this.bottom;
                }
            }
            // 如果对齐左边界，并且包含安全区域到屏幕左边界的缝隙
            if (widget.isAlignLeft && this.isAlignLeft) {
                widget.isAbsoluteLeft = true;
                if (this.direction == Adapter.direction.LandscapeLeft) {
                    widget.left = this.left + Adapter.safeArea.outside.width;
                } else {
                    widget.left = this.left;
                }

            }
            // 如果对齐右边界，并且包含安全区域到屏幕右边界的缝隙
            if (widget.isAlignRight && this.isAlignRight) {
                widget.isAbsoluteRight = true;
                if (this.direction == Adapter.direction.LandscapeRight) {
                    widget.right = this.right + Adapter.safeArea.outside.width;
                } else {
                    widget.right = this.right;
                }
            }
            widget.updateAlignment();
            this._isDirty = false;
        }
    }

    protected onChangeSize() {
        this.doLayout(true);
    }

    protected update(dt: number) {
        super.update && super.update(dt);
        this.doLayout();
    }
}
