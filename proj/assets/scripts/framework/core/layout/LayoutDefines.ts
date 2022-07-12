import { size, Size, v2, Vec2, Node, UITransform } from "cc";

/**
 * @description 布局类型
 */
export enum LayoutType {
    /**@description 顶对齐 */
    TOP = 1 << 0,
    /**@description 垂直居中 */
    MID = 1 << 1,
    /**@description 底对齐 */
    BOT = 1 << 2,
    /**@description 左对齐 */
    LEFT = 1 << 3,
    /**@description 水平居中 */
    CENTER = 1 << 4,
    /**@description 右对齐 */
    RIGHT = 1 << 5,
    /**@description 包含水平方向对齐方式( 左对齐 | 水平居中 | 右对齐 ) */
    HORIZONTAL = LEFT | CENTER | RIGHT,
    /**@description 包含垂直方向对齐方式( 顶对齐 | 垂直居中 | 底对齐 ) */
    VERTICAL = TOP | MID | BOT,
    /**@description 包含垂直方向对齐方式( 顶对齐 | 底对齐 ) */
    TOP_BOT = TOP | BOT,
    /**@description 包含水平方向对齐方式( 左对齐 | 右对齐 ) */
    LEFT_RIGHT,
    /**@description 水平居中，顶对齐 */
    CENTER_TOP = CENTER | TOP,
    /**@description 水平居中，底对齐 */
    CENTER_BOT = CENTER | BOT,
    /**@description 垂直居中，左对齐 */
    MID_LETF = MID | LEFT,
    /**@description 垂直居中，右对齐 */
    MID_RIGHT = MID | RIGHT,
}

/**@description 对齐节点 */
export interface LayoutNode {
    x: number;
    y: number;
    parent: LayoutNode;

}

interface LayoutResult {
    position: Vec2;
    originSize: Size;
}

export class LayoutParam {
    private _alignFlags = 0;
    get alignFlags() {
        return this._alignFlags;
    }
    set alignFlags(v) {
        this._alignFlags = v;
    }

    /**@description 结果 */
    result: LayoutResult = {
        /**@description 布局后坐标 */
        position: v2(0, 0),
        /**@description 原来节点的大小 */
        originSize: size(0, 0)
    }

    private _setAlign(type: LayoutType, isAlign: boolean) {
        let current = (this._alignFlags & type) > 0;
        if (isAlign === current) {
            return;
        }
        let isHorizontal = (type & LayoutType.LEFT_RIGHT) > 0;
        const trans = this.node.getComponent(UITransform)!;
        if (isAlign) {
            this._alignFlags |= type;
            if (isHorizontal) {
                this.isAlignHorizontalCenter = false;
                if (this.isStretchWidth) {
                    // become stretch
                    this.result.originSize.width = trans.width;
                }
            }
            else {
                this.isAlignVerticalCenter = false;
                if (this.isStretchHeight) {
                    // become stretch
                    this.result.originSize.height = trans.height;
                }
            }
        }
        else {
            if (isHorizontal) {
                if (this.isStretchWidth) {
                    // will cancel stretch
                    trans.width = this.result.originSize.width;
                }
            }
            else {
                if (this.isStretchHeight) {
                    // will cancel stretch
                    trans.height = this.result.originSize.height;
                }
            }

            this._alignFlags &= ~type;
        }
    }
    /**@description 指定一个对齐目标，只能是当前节点的其中一个父节点，默认为空，为空时表示当前父节点。 */
    target: Node = null!;
    private _node: Node = null!;
    /**@description 需要布局的对象节点,不参为空且必须有一个父节点*/
    get node() {
        return this._node;
    }
    set node(node) {
        const trans = node.getComponent(UITransform)!;
        this.result.originSize.width = trans.width;
        this.result.originSize.height = trans.height;
        this._node = node;
    }
    /**@description 是否对齐上边。 */
    get isAlignTop() {
        return (this._alignFlags & LayoutType.TOP) > 0;
    }
    set isAlignTop(value) {
        this._setAlign(LayoutType.TOP, value);
    }
    /**@description 是否垂直方向对齐中点，开启此项会将垂直方向其他对齐选项取消。 */
    get isAlignVerticalCenter() {
        return (this._alignFlags & LayoutType.MID) > 0;
    }
    set isAlignVerticalCenter(value) {
        if (value) {
            this.isAlignTop = false;
            this.isAlignBottom = false;
            this._alignFlags |= LayoutType.MID;
        }
        else {
            this._alignFlags &= ~LayoutType.MID;
        }
    }
    /**@description 是否对齐下边。 */
    get isAlignBottom() {
        return (this._alignFlags & LayoutType.BOT) > 0;
    }
    set isAlignBottom(value) {
        this._setAlign(LayoutType.BOT, value);
    }
    /**@description 是否对齐左边 */
    get isAlignLeft() {
        return (this._alignFlags & LayoutType.LEFT) > 0;
    }
    set isAlignLeft(value) {
        this._setAlign(LayoutType.LEFT, value);
    }
    /**@description 是否水平方向对齐中点，开启此选项会将水平方向其他对齐选项取消。 */
    public get isAlignHorizontalCenter() {
        return (this._alignFlags & LayoutType.CENTER) > 0;
    }
    public set isAlignHorizontalCenter(value) {
        if (value) {
            this.isAlignLeft = false;
            this.isAlignRight = false;
            this._alignFlags |= LayoutType.CENTER;
        }
        else {
            this._alignFlags &= ~LayoutType.CENTER;
        }
    }
    /**@description 是否对齐右边。 */
    public get isAlignRight(): boolean {
        return (this._alignFlags & LayoutType.RIGHT) > 0;
    }
    public set isAlignRight(value: boolean) {
        this._setAlign(LayoutType.RIGHT, value);
    }
    /**@description 当前是否水平拉伸。当同时启用左右对齐时，节点将会被水平拉伸，此时节点的宽度只读。 */
    get isStretchWidth() {
        return (this._alignFlags & LayoutType.LEFT_RIGHT) === LayoutType.LEFT_RIGHT;
    }
    /**@description 当前是否垂直拉伸。当同时启用上下对齐时，节点将会被垂直拉伸，此时节点的高度只读。 */
    get isStretchHeight() {
        return (this._alignFlags & LayoutType.TOP_BOT) === LayoutType.TOP_BOT;
    }
    /**@description 本节点顶边和父节点顶边的距离，可填写负值，只有在 isAlignTop 开启时才有作用。 */
    top: number = 0;
    /**@description 本节点底边和父节点底边的距离，可填写负值，只有在 isAlignBottom 开启时才有作用。 */
    bottom: number = 0;
    /**@description 本节点左边和父节点左边的距离，可填写负值，只有在 isAlignLeft 开启时才有作用。 */
    left: number = 0;
    /**@description 本节点右边和父节点右边的距离，可填写负值，只有在 isAlignRight 开启时才有作用。 */
    right: number = 0;
    /**@description 水平居中的偏移值，可填写负值，只有在 isAlignHorizontalCenter 开启时才有作用。 */
    horizontalCenter: number = 0;
    /**@description 垂直居中的偏移值，可填写负值，只有在 isAlignVerticalCenter 开启时才有作用。 */
    verticalCenter: number = 0;
    /**@description 如果为 true，"horizontalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。 */
    isAbsoluteHorizontalCenter: boolean = true;
    /**@description 如果为 true，"verticalCenter" 将会以像素作为偏移值，反之为百分比（0 到 1）。 */
    isAbsoluteVerticalCenter: boolean = true;
    /**@description 如果为 true，"top" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。 */
    isAbsoluteTop: boolean = true;
    /**@description 如果为 true，"bottom" 将会以像素作为边距，否则将会以相对父物体高度的百分比（0 到 1）作为边距。 */
    isAbsoluteBottom: boolean = true;
    /**@description 如果为 true，"left" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。 */
    isAbsoluteLeft: boolean = true;
    /**@description 如果为 true，"right" 将会以像素作为边距，否则将会以相对父物体宽度的百分比（0 到 1）作为边距。 */
    isAbsoluteRight: boolean = true;
}	