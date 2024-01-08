import { Widget, _decorator } from "cc";
import { EDITOR } from "cc/env";
import { Adapter } from "./Adapter";

const { ccclass, property, executeInEditMode, menu } = _decorator;

enum Flags {
    None = 0,
    TOP = 1 << 0,
    BOTTOM = 1 << 1,
    LEFT = 1 << 2,
    RIGHT = 1 << 3,
}

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
@ccclass("AdapterSafeArea")
@executeInEditMode
@menu("Quick适配组件/AdapterSafeArea")
export default class AdapterSafeArea extends Adapter {

    @property
    protected _flags: number = Flags.None;

    protected setFlag(flag: Flags, value: boolean) {
        const current = (this._flags & flag) > 0;
        if (value == current) {
            return;
        }
        if (value) {
            this._flags |= flag;
        } else {
            this._flags &= ~flag;
        }
        this._isDirty = true;
    }

    @property({ tooltip: EDITOR ? "是否对齐上边" : "" })
    get isAlignTop() {
        return (this._flags & Flags.TOP) > 0;
    }
    set isAlignTop(v) {
        this.setFlag(Flags.TOP, v);
    }

    @property({ tooltip: EDITOR ? "是否对齐下边" : "" })
    get isAlignBottom() {
        return (this._flags & Flags.BOTTOM) > 0;
    }
    set isAlignBottom(v) {
        this.setFlag(Flags.BOTTOM, v);
    }

    @property({ tooltip: EDITOR ? "是否对齐左边" : "" })
    get isAlignLeft() {
        return (this._flags & Flags.LEFT) > 0;
    }
    set isAlignLeft(v) {
        this.setFlag(Flags.LEFT, v);
    }

    @property({ tooltip: EDITOR ? "是否对齐右边" : "" })
    get isAlignRight() {
        return (this._flags & Flags.RIGHT) > 0;
    }
    set isAlignRight(v) {
        this.setFlag(Flags.RIGHT, v);
    }

    @property
    _top = 0;
    @property({
        visible: function (this: AdapterSafeArea) {
            return this.isAlignTop;
        }, tooltip: EDITOR ? "本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用" : ""
    })
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
    @property({
        visible: function (this: AdapterSafeArea) {
            return this.isAlignBottom;
        }, tooltip: EDITOR ? "本节点顶边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用" : ""
    })
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
    @property({
        visible: function (this: AdapterSafeArea) {
            return this.isAlignLeft;
        }, tooltip: EDITOR ? "本节点顶边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用" : ""
    })
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
    @property({
        visible: function (this: AdapterSafeArea) {
            return this.isAlignRight;
        }, tooltip: EDITOR ? "本节点顶边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用" : ""
    })
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
        let comp = this.getComponent(Widget);
        if (comp) {
            return comp;
        }
        return this.addComponent(Widget);
    }

    resetInEditor() {
        this.doLayout(true);
    }

    protected doLayout(isForce = false) {
        if (this._isDirty || isForce) {
            let widget = this.widget!;
            if (EDITOR) {
                widget.left = this.left;
                widget.right = this.right;
                widget.top = this.top;
                widget.bottom = this.bottom;
                return;
            }
            if (!App.isFullScreenAdaption) {
                return;
            }
            if (!widget || !widget.enabled) {
                return;
            }
            // 屏幕向上时，加上安全区域高度
            if (widget.isAlignTop && this.isAlignTop) {
                widget.isAbsoluteTop = true;
                if (this.direction == Adapter.direction.Portrait) {
                    widget.top = this.top + Adapter.safeArea.outside.height;
                } else {
                    widget.top = this.top;
                }
            }
            // 屏幕向下时，加上安全区域高度
            if (widget.isAlignBottom && this.isAlignBottom) {
                widget.isAbsoluteBottom = true;
                if (this.direction == Adapter.direction.UpsideDown) {
                    widget.bottom = this.bottom + Adapter.safeArea.outside.height;
                } else {
                    widget.bottom = this.bottom;
                }
            }
            // 屏幕向左时，加上安全区域宽度
            if (widget.isAlignLeft && this.isAlignLeft) {
                widget.isAbsoluteLeft = true;
                if (this.direction == Adapter.direction.LandscapeLeft) {
                    widget.left = this.left + Adapter.safeArea.outside.width;
                } else {
                    widget.left = this.left;
                }

            }
            // 屏幕向右时，加上安全区域宽度
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
            this.doOnAdapterComplete();
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
