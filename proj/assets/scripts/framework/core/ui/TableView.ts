/**
 * @description 扩展TableView
 */

import { CellType, TableViewCell } from "./TableViewCell";

const { ccclass, property } = cc._decorator;

interface Options {
    anchor: cc.Vec2;
    applyToHorizontal: boolean;
    applyToVertical: boolean;
}
const EPSILON = 1e-4;
const MOVEMENT_FACTOR = 0.7;
const NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED = 5;
const OUT_OF_BOUNDARY_BREAKING_FACTOR = 0.05;

let _tempPoint = cc.v2();
let _tempPrevPoint = cc.v2();

let quintEaseOut = (time: number) => {
    time -= 1;
    return (time * time * time * time * time + 1);
};

let getTimeInMilliseconds = () => {
    let currentTime = new Date();
    return currentTime.getMilliseconds();
};


const eventMap = {
    'scroll-to-top': 0,
    'scroll-to-bottom': 1,
    'scroll-to-left': 2,
    'scroll-to-right': 3,
    'scrolling': 4,
    'bounce-bottom': 6,
    'bounce-left': 7,
    'bounce-right': 8,
    'bounce-top': 5,
    'scroll-ended': 9,
    'touch-up': 10,
    'scroll-ended-with-threshold': 11,
    'scroll-began': 12,
}

/**
 * !#en Enum for ScrollView event type.
 * !#zh 滚动视图事件类型
 * @enum ScrollView.EventType
 */
enum EventType {
    /**@description 内部使用 */
    UNKNOWN = "UNKNOWN",
    /**
     * !#en The event emmitted when ScrollView scroll to the top boundary of inner container
     * !#zh 滚动视图滚动到顶部边界事件
     * @property {Number} SCROLL_TO_TOP
     */
    SCROLL_TO_TOP = "scroll-to-top",
    /**
     * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container
     * !#zh 滚动视图滚动到底部边界事件
     * @property {Number} SCROLL_TO_BOTTOM
     */
    SCROLL_TO_BOTTOM = "scroll-to-bottom",
    /**
     * !#en The event emmitted when ScrollView scroll to the left boundary of inner container
     * !#zh 滚动视图滚动到左边界事件
     * @property {Number} SCROLL_TO_LEFT
     */
    SCROLL_TO_LEFT = "scroll-to-left",
    /**
     * !#en The event emmitted when ScrollView scroll to the right boundary of inner container
     * !#zh 滚动视图滚动到右边界事件
     * @property {Number} SCROLL_TO_RIGHT
     */
    SCROLL_TO_RIGHT = "scroll-to-right",
    /**
     * !#en The event emmitted when ScrollView is scrolling
     * !#zh 滚动视图正在滚动时发出的事件
     * @property {Number} SCROLLING
     */
    SCROLLING = "scrolling",
    /**
     * !#en The event emmitted when ScrollView scroll to the top boundary of inner container and start bounce
     * !#zh 滚动视图滚动到顶部边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_TOP
     */
    BOUNCE_TOP = "bounce-top",
    /**
     * !#en The event emmitted when ScrollView scroll to the bottom boundary of inner container and start bounce
     * !#zh 滚动视图滚动到底部边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_BOTTOM
     */
    BOUNCE_BOTTOM = "bounce-bottom",
    /**
     * !#en The event emmitted when ScrollView scroll to the left boundary of inner container and start bounce
     * !#zh 滚动视图滚动到左边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_LEFT
     */
    BOUNCE_LEFT = "bounce-left",
    /**
     * !#en The event emmitted when ScrollView scroll to the right boundary of inner container and start bounce
     * !#zh 滚动视图滚动到右边界并且开始回弹时发出的事件
     * @property {Number} BOUNCE_RIGHT
     */
    BOUNCE_RIGHT = "bounce-right",
    /**
     * !#en The event emmitted when ScrollView auto scroll ended
     * !#zh 滚动视图滚动结束的时候发出的事件
     * @property {Number} SCROLL_ENDED
     */
    SCROLL_ENDED = "scroll-ended",
    /**
     * !#en The event emmitted when user release the touch
     * !#zh 当用户松手的时候会发出一个事件
     * @property {Number} TOUCH_UP
     */
    TOUCH_UP = "touch-up",
    /**
     * !#en The event emmitted when ScrollView auto scroll ended with a threshold
     * !#zh 滚动视图自动滚动快要结束的时候发出的事件
     * @property {Number} AUTOSCROLL_ENDED_WITH_THRESHOLD
     */
    AUTOSCROLL_ENDED_WITH_THRESHOLD = "scroll-ended-with-threshold",
    /**
     * !#en The event emmitted when ScrollView scroll began
     * !#zh 滚动视图滚动开始时发出的事件
     * @property {Number} SCROLL_BEGAN
     */
    SCROLL_BEGAN = "scroll-began",
};

enum Direction {
    /**
     * @description 水平方向
     */
    HORIZONTAL,
    /**
     * @description 垂直方向
     * */
    VERTICAL
};

enum FillOrder {
    /**
     * @description 水平方向时，从左到右填充，垂直方向时，从上到下填充
     */
    TOP_DOWN,
    /**
     * @description 水平方向时，从右到左填充，垂直方向时，从下到上填充
     */
    BOTTOM_UP,
}

export interface TableViewDelegate {

    /**
     * @description 获取cell类型
     * @param view 
     * @param index 
     */
    tableCellTypeAtIndex(view: TableView, index: number): CellType;
    /**@description 返回当前TalbeView的总项数 */
    numberOfCellsInTableView(view: TableView): number;
    /**@description 更新cell数据 */
    updateCellData(view: TableView, cell: TableViewCell): void;

    /**@description 列表项被选中 */
    tableCellSelected?(view: TableView, cell: TableViewCell): void;
    /**@description 列表项取消选中 */
    tableCellUnselected?(view: TableView, cell: TableViewCell): void;
    /**@description 列表项点击完成 */
    tableCellTouched?(view: TableView, cell: TableViewCell): void;
    /**@description 列表项进入复用 */
    tableCellWillRecycle?(view: TableView, cell: TableViewCell): void;
}

@ccclass
export default class TableView extends cc.Component {
    name: string = "TableView";
    public static EventType = EventType;
    public static Direction = Direction;
    public static FillOrder = FillOrder;

    @property({ type: cc.Node, tooltip: "包含可滚动性展示内容的节点引用", displayName: "Content", visible: true })
    private _content: cc.Node = null;
    /**
     * @description 可流动展示内容节点
     */
    get content() {
        return this._content;
    }
    set content(v) {
        if (this._content == v) {
            return;
        }
        this._content = v;
        this._calculateBoundary();
    }

    @property({
        tooltip: "滚动方向 \nHORIZONTAL 水平方向 \nVERTICAL 垂直方向", displayName: "Direction", type: cc.Enum(Direction), visible: true
    })
    private _direction: Direction = Direction.HORIZONTAL;
    /**@description 视图滚动方向 */
    get direction() {
        return this._direction;
    }
    set direction(v) {
        if (this._direction == v) {
            return;
        }
        this._direction = v;
    }

    protected get horizontal() {
        return this.direction == Direction.HORIZONTAL;
    }

    protected get vertical() {
        return this.direction == Direction.VERTICAL;
    }

    /**
     * @description 是否开启滚动惯性。
     */
    @property({ tooltip: "是否开启滚动惯性", displayName: "Inertia" })
    inertia: boolean = true;

    /**@description 开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。 */
    @property({ tooltip: "开启惯性后，在用户停止触摸后滚动多快停止，0表示永不停止，1表示立刻停止。", displayName: "Brake", range: [0, 1, 0.1] })
    brake: number = 0.5;

    /**@description 是否允许滚动内容超过边界，并在停止触摸后回弹 */
    @property({ tooltip: "是否允许滚动内容超过边界，并在停止触摸后回弹", displayName: "Elastic" })
    elastic: boolean = true;

    /**@description 回弹持续的时间，0 表示将立即反弹。 */
    @property({ tooltip: "回弹持续的时间，0 表示将立即反弹", displayName: "Bounce Duration", range: [0, 10] })
    bounceDuration: number = 1;


    @property({
        tooltip: "水平滚动的 ScrollBar", displayName: "Horizontal Scroll Bar", type: cc.Scrollbar, animatable: false, visible: function () {
            return this.direction == Direction.HORIZONTAL;
        }
    })
    private _hBar: cc.Scrollbar = null;
    /**@description 水平滚动的 ScrollBar。 */
    get horizontalScrollBar() {
        return this._hBar;
    }
    set horizontalScrollBar(v) {
        if (this._hBar === v) {
            return;
        }
        this._hBar = v;
        if (this._hBar) {
            this._hBar.setTargetScrollView(this);
            this._updateScrollBar()
        }
    }


    @property({
        tooltip: "垂直滚动的 ScrollBar", displayName: "Vertical Scroll Bar", type: cc.Scrollbar, animatable: false, visible: function () {
            return this.direction == Direction.VERTICAL;
        }
    })
    private _vBar: cc.Scrollbar = null;
    /**@description 垂直滚动的 ScrollBar。 */
    get verticalScrollBar() {
        return this._vBar;
    }
    set verticalScrollBar(v) {
        if (this._vBar === v) {
            return;
        }
        this._vBar = v;
        if (this._vBar) {
            this._vBar.setTargetScrollView(this);
            this._updateScrollBar();
        }
    }

    /**@description 滚动视图的事件回调函数 */
    @property({ tooltip: "滚动视图的事件回调函数", type: cc.Component.EventHandler, displayName: "ScrollEvents" })
    scrollEvents: cc.Component.EventHandler[] = [];

    /**
     * @description 如果这个属性被设置为 true，那么滚动行为会取消子节点上注册的触摸事件，默认被设置为 true。
     * 注意，子节点上的 touchstart 事件仍然会触发，触点移动距离非常短的情况下 touchmove 和 touchend 也不会受影响。
     */
    @property({ tooltip: "滚动行为是否取消子节点上注册的触摸事件", displayName: "Cancel Inner Events" })
    cancelInnerEvents: boolean = true;

    @property({ tooltip: "Cell项模板", displayName: "Template", type: TableViewCell, visible: true })
    protected _template: TableViewCell[] = [];
    /**
     * @description 使用需要注意，设置模板时，要一次性设置，不要拿着当前模板操作 
     * @example 
     * let template = this.template;
     * template.push(template1)
     * template.push(template2)
     * template.push(template3)
     * this.template = template;
     * */
    get template() {
        return this._template;
    }
    set template(v) {
        this._template = v;
        this._fillCellSize();
    }

    /**@description 模板大小 */
    protected _templateSize: Map<CellType, cc.Size> = new Map();

    @property({ tooltip: "填充方式 \nTOP_DOWN 水平方向时，从左到右填充，垂直方向时，从上到下填充 \nBOTTOM_UP 水平方向时，从右到左填充，垂直方向时，从下到上填充", type: cc.Enum(FillOrder) })
    fillOrder: FillOrder = FillOrder.TOP_DOWN;

    protected _delegate: TableViewDelegate = null!;
    /**@description 代理 */
    get delegate() {
        if (!this._delegate) {
            Log.e(`【${this.name}】致命错误 : 未设置TableView代理`)
        }
        return this._delegate;
    }
    set delegate(v) {
        if (this._delegate === v) {
            return;
        }
        this._delegate = v;
    }

    protected get _view() {
        if (this.content) {
            return this.content.parent;
        }
        return null;
    }

    protected _topBoundary = 0;
    protected _bottomBoundary = 0;
    protected _leftBoundary = 0;
    protected _rightBoundary = 0;

    protected _touchMoveDisplacements: cc.Vec2[] = [];
    protected _touchMoveTimeDeltas: number[] = [];
    protected _touchMovePreviousTimestamp = 0;
    protected _touchMoved = false;

    protected _autoScrolling = false;
    protected _autoScrollAttenuate = false;
    protected _autoScrollStartPosition = cc.v2(0, 0);
    protected _autoScrollTargetDelta = cc.v2(0, 0);
    protected _autoScrollTotalTime = 0;
    protected _autoScrollAccumulatedTime = 0;
    protected _autoScrollCurrentlyOutOfBoundary = false;
    protected _autoScrollBraking = false;
    protected _autoScrollBrakingStartPosition = cc.v2(0, 0);

    protected _outOfBoundaryAmount = cc.v2(0, 0);
    protected _outOfBoundaryAmountDirty = true;
    protected _stopMouseWheel = false;
    protected _mouseWheelEventElapsedTime = 0.0;
    protected _isScrollEndedWithThresholdEventFired = false;
    //use bit wise operations to indicate the direction
    protected _scrollEventEmitMask = 0;
    protected _isBouncing = false;
    protected _scrolling = false;

    /**@description 当前正在使用的cell */
    protected _cellsUsed: TableViewCell[] = [];
    /**@description 当前回收复制的cell */
    protected _cellsFreed: TableViewCell[] = [];
    /**@description 当前cell的所有位置偏移量 */
    protected _cellsOffsets: number[] = [];
    /**@description 当前渲染节点索引 */
    protected _indices: number[] = [];

    /**
      * !#en Scroll the content to the bottom boundary of ScrollView.
      * !#zh 视图内容将在规定时间内滚动到视图底部。
      * @method scrollToBottom
      * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
      * the content will jump to the bottom boundary immediately.
      * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
      * @example
      * // Scroll to the bottom of the view.
      * scrollView.scrollToBottom(0.1);
      */
    scrollToBottom(timeInSecond = 0, attenuated = true) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 0),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta, true);
        }
    }

    /**
     * !#en Scroll the content to the top boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图顶部。
     * @method scrollToTop
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the top boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the top of the view.
     * scrollView.scrollToTop(0.1);
     */
    scrollToTop(timeInSecond = 0, attenuated = true) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 1),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * !#en Scroll the content to the left boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图左边。
     * @method scrollToLeft
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the left boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the left of the view.
     * scrollView.scrollToLeft(0.1);
     */
    scrollToLeft(timeInSecond = 0, attenuated = true) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * !#en Scroll the content to the right boundary of ScrollView.
     * !#zh 视图内容将在规定时间内滚动到视图右边。
     * @method scrollToRight
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the right boundary immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to the right of the view.
     * scrollView.scrollToRight(0.1);
     */
    scrollToRight(timeInSecond = 0, attenuated = true) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(1, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }




    /**
     * !#en  Get the positive offset value corresponds to the content's top left boundary.
     * !#zh  获取滚动视图相对于左上角原点的当前滚动偏移
     * @method getScrollOffset
     * @return {Vec2}  - A Vec2 value indicate the current scroll offset.
     */
    getScrollOffset() {
        let topDelta = this._getContentTopBoundary() - this._topBoundary;
        let leftDeta = this._getContentLeftBoundary() - this._leftBoundary;

        return cc.v2(leftDeta, topDelta);
    }

    /**
     * !#en Get the maximize available  scroll offset
     * !#zh 获取滚动视图最大可以滚动的偏移量
     * @method getMaxScrollOffset
     * @return {Vec2} - A Vec2 value indicate the maximize scroll offset in x and y axis.
     */
    getMaxScrollOffset() {
        let viewSize = this._view.getContentSize();
        let contentSize = this.content.getContentSize();
        let horizontalMaximizeOffset = contentSize.width - viewSize.width;
        let verticalMaximizeOffset = contentSize.height - viewSize.height;
        horizontalMaximizeOffset = horizontalMaximizeOffset >= 0 ? horizontalMaximizeOffset : 0;
        verticalMaximizeOffset = verticalMaximizeOffset >= 0 ? verticalMaximizeOffset : 0;

        return cc.v2(horizontalMaximizeOffset, verticalMaximizeOffset);
    }

    /**
     * !#en Scroll the content to the horizontal percent position of ScrollView.
     * !#zh 视图内容在规定时间内将滚动到 ScrollView 水平方向的百分比位置上。
     * @method scrollToPercentHorizontal
     * @param {Number} percent - A value between 0 and 1.
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the horizontal percent position of ScrollView immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * @example
     * // Scroll to middle position.
     * scrollView.scrollToBottomRight(0.5, 0.1);
     */
    scrollToPercentHorizontal(percent: number, timeInSecond = 0, attenuated = true) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(percent, 0),
            applyToHorizontal: true,
            applyToVertical: false,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }


    /**
     * !#en Scroll the content to the vertical percent position of ScrollView.
     * !#zh 视图内容在规定时间内滚动到 ScrollView 垂直方向的百分比位置上。
     * @method scrollToPercentVertical
     * @param {Number} percent - A value between 0 and 1.
     * @param {Number} [timeInSecond=0] - Scroll time in second, if you don't pass timeInSecond,
     * the content will jump to the vertical percent position of ScrollView immediately.
     * @param {Boolean} [attenuated=true] - Whether the scroll acceleration attenuated, default is true.
     * // Scroll to middle position.
     * scrollView.scrollToPercentVertical(0.5, 0.1);
     */
    scrollToPercentVertical(percent: number, timeInSecond = 0, attenuated = true) {
        let moveDelta = this._calculateMovePercentDelta({
            anchor: cc.v2(0, percent),
            applyToHorizontal: false,
            applyToVertical: true,
        });

        if (timeInSecond) {
            this._startAutoScroll(moveDelta, timeInSecond, attenuated !== false);
        } else {
            this._moveContent(moveDelta);
        }
    }

    /**
     * !#en  Stop auto scroll immediately
     * !#zh  停止自动滚动, 调用此 API 可以让 Scrollview 立即停止滚动
     * @method stopAutoScroll
     */
    stopAutoScroll() {
        this._autoScrolling = false;
        this._autoScrollAccumulatedTime = this._autoScrollTotalTime;
    }

    /**
     * !#en Modify the content position.
     * !#zh 设置当前视图内容的坐标点。
     * @method setContentPosition
     * @param {Vec2} position - The position in content's parent space.
     */
    setContentPosition(position: cc.Vec2) {
        if (position.fuzzyEquals(this.getContentPosition(), EPSILON)) {
            return;
        }

        this._setContentPosition(position);
        this._outOfBoundaryAmountDirty = true;
    }

    private _setContentPosition(position: cc.Vec2) {
        if (this.content) {
            this.content.setPosition(position);
            // Log.d(position);
        }
    }

    /**
     * !#en Query the content's position in its parent space.
     * !#zh 获取当前视图内容的坐标点。
     * @method getContentPosition
     * @returns {Vec2} - The content's position in its parent space.
     */
    getContentPosition() {
        return this.content.getPosition();
    }

    /**
     * !#en Query whether the user is currently dragging the ScrollView to scroll it
     * !#zh 用户是否在拖拽当前滚动视图
     * @method isScrolling
     * @returns {Boolean} - Whether the user is currently dragging the ScrollView to scroll it
     */
    isScrolling() {
        return this._scrolling;
    }

    /**
     * !#en Query whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
     * !#zh 当前滚动视图是否在惯性滚动
     * @method isAutoScrolling
     * @returns {Boolean} - Whether the ScrollView is currently scrolling because of a bounceback or inertia slowdown.
     */
    isAutoScrolling() {
        return this._autoScrolling;
    }

    /**
     * @description 更新指定项
     * @param index 
     */
    updateCellAtIndex(index: number) {

    }

    /**
     * @description 插入项，默认为插入到最后
     * @param index 
     */
    insertCellAtIndex(index?: number) {

    }

    /**
     * @description 删除指定项
     * @param index 
     */
    removeCellAtIndex(index: number) {

    }

    /**
     * @description 重置数据
     */
    reloadData() {
        //删除当前渲染的cell
        for (let i = 0; i < this._cellsUsed.length; i++) {
            let cell = this._cellsUsed[i];
            if (this.delegate.tableCellWillRecycle) {
                this.delegate.tableCellWillRecycle(this, cell);
            }
            this._cellsFreed.push(cell);
            cell.reset();
            if (cell.node.parent == this.content) {
                this.content.removeChild(cell.node);
            }
        }

        //清空渲染节点索引
        this._indices = [];
        //清空当前使用的节点
        this._cellsFreed = [];
        //刷新节点的位置
        this._updateCellPositions();
        this._updateContentSize();

        this._updateCells();
    }

    /**
     * @description 返回当前可重用节点
     * @param type 指定类型获取
     * @returns 
     */
    dequeueCell(type: CellType): TableViewCell | null {
        let cell: TableViewCell = null;
        if (this._cellsFreed.length <= 0) {
            return cell;
        }
        for (let i = 0; i < this._cellsFreed.length; i++) {
            let v = this._cellsFreed[i];
            if (v.type == type) {
                this._cellsFreed.splice(i, 1);
                return v;
            }
        }
        return cell;
    }


    /**
     * @description 返回指定位置的cell,注意：只会从当前显示节点中返回，如果没有在显示，会返回null
     * @param index 
     * @returns 
     */
    cellAtIndex(index: number): TableViewCell | null {
        return null;
    }

    updateCellData(cell: TableViewCell) {
        this.delegate.updateCellData(this, cell);
    }

    /**
     * @description 刷新Cell位置
     */
    protected _updateCellPositions() {
        let count = this.delegate.numberOfCellsInTableView(this);
        this._cellsOffsets = [];
        if (count > 0) {
            let cur = 0;
            let size: cc.Size;
            let type: CellType;
            for (let i = 0; i < count; i++) {
                this._cellsOffsets.push(cur);
                type = this.delegate.tableCellTypeAtIndex(this, i);
                size = this._getCellSize(type);
                if (this.horizontal) {
                    //水平
                    cur += size.width;
                } else {
                    cur += size.height;
                }
            }
            //最后一项
            this._cellsOffsets.push(cur);
        }
    }

    /**
     * @description 更新content的大小
     */
    protected _updateContentSize() {
        let size = cc.size(0, 0);
        let count = this.delegate.numberOfCellsInTableView(this);
        if (count > 0) {
            let maxPos = this._cellsOffsets[count];
            if (this.horizontal) {
                size = cc.size(maxPos, this._view.getContentSize().height);
            } else {
                size = cc.size(this._view.getContentSize().width, maxPos);
            }
        }

        this.content.setContentSize(size);

        if (this.delegate.numberOfCellsInTableView(this) > 0) {
            if (this.horizontal) {
                this.scrollToLeft();
            } else {
                this.scrollToTop();
            }
        }
    }

    protected _getCellSize(type: CellType) {
        if (this._templateSize.size <= 0) {
            this._fillCellSize();
        }
        let size = this._templateSize.get(type);
        if (size) {
            return size;
        }
        Log.e(`【${this.name}】未找到 ${type} 的 cell 模板`);
        return cc.size(0, 0);
    }

    protected _fillCellSize() {
        this._templateSize.clear();
        for (let i = 0; i < this.template.length; i++) {
            let template = this.template[i];
            this._templateSize.set(template.type, template.node.getContentSize());
        }
    }

    protected _getTemplete(type: CellType) {
        for (let i = 0; i < this.template.length; i++) {
            let v = this.template[i];
            if (v.type == type) {
                return this.template[i];
            }
        }
        return null;
    }

    protected _getCellOffset(index: number) {
        let pos = this._cellsOffsets[index];
        if (this.horizontal) {
            return cc.v2(pos, 0);
        } else {
            return cc.v2(0, pos);
        }
    }

    protected _updateCells() {
        let count = this.delegate.numberOfCellsInTableView(this);
        if (count > 0) {
            for (let i = 0; i < count; i++) {
                let type = this.delegate.tableCellTypeAtIndex(this, i)
                let cell = this._getTemplete(type);
                let node = cc.instantiate(cell.node);
                cell = node.getComponent(TableViewCell);
                cell.view = this;
                cell.index = i;
                cell.isDoUpdate = true;
                cell.node.active = true;
                let offset = this._getCellOffset(i);
                this.content.addChild(node);
                node.setPosition(this.align(node, offset))
            }
        }
    }

    /**
     * @description 根据当前填充方式及视图方向设置Cell的对齐方式
     * @param node 
     * @param target 
     * @param offset 
     * @returns 
     */
    protected align(node: cc.Node, offset: cc.Vec2) {
        let target = this.content;
        let targetSize = target.getContentSize();
        let targetAnchor = target.getAnchorPoint();
        let x = node.x, y = node.y;
        let anchor = node.getAnchorPoint();

        let left = 0;
        let right = 0;
        let top = 0;
        let bottom = 0;
        let isAlignHorizontalCenter = false;
        let isAlignLeft = false;
        let isAlignVerticalCenter = false;
        let isAlignBottom = false;

        if (this.horizontal) {
            //水平方向
            //居中对齐 y
            isAlignVerticalCenter = true;
            if (this.fillOrder == FillOrder.TOP_DOWN) {
                isAlignLeft = true;
                left = offset.x;
            } else {
                right = offset.x;
            }
        } else {
            //垂直方向
            //居中对齐 x
            isAlignHorizontalCenter = true;
            if (this.fillOrder == FillOrder.TOP_DOWN) {
                //顶对齐 y
                top = offset.y;
            } else {
                //底对齐 y
                isAlignBottom = true;
                bottom = offset.y;
            }
        }

        // x 轴处理

        let localLeft, localRight, targetWidth = targetSize.width;
        localLeft = -targetAnchor.x * targetWidth;
        localRight = localLeft + targetWidth;

        localLeft += left;
        localRight -= right;

        let width, anchorX = anchor.x, scaleX = node.scaleX;
        if (scaleX < 0) {
            anchorX = 1.0 - anchorX;
            scaleX = -scaleX;
        }

        width = node.width * scaleX;
        if (isAlignHorizontalCenter) {
            //居中处理
            let targetCenter = (0.5 - targetAnchor.x) * targetSize.width;
            x = targetCenter + (anchorX - 0.5) * width;
        }
        else if (isAlignLeft) {
            //左对齐
            x = localLeft + anchorX * width;
        }
        else {
            //右对齐
            x = localRight + (anchorX - 1) * width;
        }


        // y 轴处理

        let localTop, localBottom, targetHeight = targetSize.height;
        localBottom = -targetAnchor.y * targetHeight;
        localTop = localBottom + targetHeight;

        // adjust borders according to offsets
        localBottom += bottom;
        localTop -= top;

        let height, anchorY = anchor.y, scaleY = node.scaleY;
        if (scaleY < 0) {
            anchorY = 1.0 - anchorY;
            scaleY = -scaleY;
        }

        height = node.height * scaleY;
        if (isAlignVerticalCenter) {
            //居中
            let targetMiddle = (0.5 - targetAnchor.y) * targetSize.height;
            y = targetMiddle + (anchorY - 0.5) * height;
        }
        else if (isAlignBottom) {
            //底对齐
            y = localBottom + anchorY * height;
        }
        else {
            //顶对齐
            y = localTop + (anchorY - 1) * height;
        }

        return cc.v2(x, y);
    }

    protected _registerEvent() {
        this.node.on(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.on(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.on(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.on(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    }

    protected _unregisterEvent() {
        this.node.off(cc.Node.EventType.TOUCH_START, this._onTouchBegan, this, true);
        this.node.off(cc.Node.EventType.TOUCH_MOVE, this._onTouchMoved, this, true);
        this.node.off(cc.Node.EventType.TOUCH_END, this._onTouchEnded, this, true);
        this.node.off(cc.Node.EventType.TOUCH_CANCEL, this._onTouchCancelled, this, true);
        this.node.off(cc.Node.EventType.MOUSE_WHEEL, this._onMouseWheel, this, true);
    }

    protected _onMouseWheel(event: cc.Event.EventMouse, captureListeners?: cc.Node[]) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;

        let deltaMove = cc.v2(0, 0);
        let wheelPrecision = -0.1;
        //On the windows platform, the scrolling speed of the mouse wheel of ScrollView on chrome and firebox is different
        if (cc.sys.os === cc.sys.OS_WINDOWS && cc.sys.browserType === cc.sys.BROWSER_TYPE_FIREFOX) {
            wheelPrecision = -0.1 / 3;
        }
        if (CC_JSB || CC_RUNTIME) {
            wheelPrecision = -7;
        }
        if (this.vertical) {
            deltaMove = cc.v2(0, event.getScrollY() * wheelPrecision);
        }
        else if (this.horizontal) {
            deltaMove = cc.v2(event.getScrollY() * wheelPrecision, 0);
        }

        this._mouseWheelEventElapsedTime = 0;
        this._processDeltaMove(deltaMove);

        if (!this._stopMouseWheel) {
            this._handlePressLogic();
            this.schedule(this._checkMouseWheel, 1.0 / 60);
            this._stopMouseWheel = true;
        }

        this._stopPropagationIfTargetIsMe(event);
    }

    protected _checkMouseWheel(dt: number) {
        let currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        let maxElapsedTime = 0.1;

        if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._processInertiaScroll();
            this.unschedule(this._checkMouseWheel);
            this._dispatchEvent(EventType.SCROLL_ENDED);
            this._stopMouseWheel = false;
            return;
        }

        this._mouseWheelEventElapsedTime += dt;

        // mouse wheel event is ended
        if (this._mouseWheelEventElapsedTime > maxElapsedTime) {
            this._onScrollBarTouchEnded();
            this.unschedule(this._checkMouseWheel);
            this._dispatchEvent(EventType.SCROLL_ENDED);
            this._stopMouseWheel = false;
        }
    }

    protected _calculateMovePercentDelta(options: Options) {
        let anchor = options.anchor;
        let applyToHorizontal = options.applyToHorizontal;
        let applyToVertical = options.applyToVertical;
        this._calculateBoundary();

        anchor = anchor.clampf(cc.v2(0, 0), cc.v2(1, 1));

        let scrollSize = this._view.getContentSize();
        let contentSize = this.content.getContentSize();
        let bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDeta = -bottomDeta;

        let leftDeta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDeta = -leftDeta;

        let moveDelta = cc.v2(0, 0);
        let totalScrollDelta = 0;
        if (applyToHorizontal) {
            totalScrollDelta = contentSize.width - scrollSize.width;
            moveDelta.x = leftDeta - totalScrollDelta * anchor.x;
        }

        if (applyToVertical) {
            totalScrollDelta = contentSize.height - scrollSize.height;
            moveDelta.y = bottomDeta - totalScrollDelta * anchor.y;
        }

        return moveDelta;
    }

    protected _moveContentToTopLeft(scrollViewSize: cc.Size) {
        let contentSize = this.content.getContentSize();

        let bottomDeta = this._getContentBottomBoundary() - this._bottomBoundary;
        bottomDeta = -bottomDeta;
        let moveDelta = cc.v2(0, 0);
        let totalScrollDelta = 0;

        let leftDeta = this._getContentLeftBoundary() - this._leftBoundary;
        leftDeta = -leftDeta;

        if (contentSize.height < scrollViewSize.height) {
            totalScrollDelta = contentSize.height - scrollViewSize.height;
            moveDelta.y = bottomDeta - totalScrollDelta;
        }

        if (contentSize.width < scrollViewSize.width) {
            totalScrollDelta = contentSize.width - scrollViewSize.width;
            moveDelta.x = leftDeta;
        }

        this._updateScrollBarState();
        this._moveContent(moveDelta);
        this._adjustContentOutOfBoundary();
    }

    protected _calculateBoundary() {
        if (this.content) {
            //refresh content size
            let layout = this.content.getComponent(cc.Layout);
            if (layout && layout.enabledInHierarchy) {
                layout.updateLayout();
            }
            let viewSize = this._view.getContentSize();

            let anchorX = viewSize.width * this._view.anchorX;
            let anchorY = viewSize.height * this._view.anchorY;

            this._leftBoundary = -anchorX;
            this._bottomBoundary = -anchorY;

            this._rightBoundary = this._leftBoundary + viewSize.width;
            this._topBoundary = this._bottomBoundary + viewSize.height;

            this._moveContentToTopLeft(viewSize);
        }
    }

    /**
     * !#en Whether this scroll view has the nested view group.
     * !#zh 此 Scoll View 是否含有嵌套的 View Group
     * @method hasNestedViewGroup
     * @returns {Boolean} - Whether this ScrollView has the nested view group.
     */
    protected hasNestedViewGroup(event: cc.Event, captureListeners?: cc.Node[]) {
        if (event.eventPhase !== cc.Event.CAPTURING_PHASE) return;

        if (captureListeners) {
            //captureListeners are arranged from child to parent
            for (let i = 0; i < captureListeners.length; ++i) {
                let item = captureListeners[i];

                if (this.node === item) {
                    if (event.target.getComponent(cc.ViewGroup)) {
                        return true;
                    }
                    return false;
                }

                if (item.getComponent(cc.ViewGroup)) {
                    return true;
                }
            }
        }
        return false;
    }

    //This is for Scrollview as children of a Button
    protected _stopPropagationIfTargetIsMe(event: cc.Event) {
        if (event.eventPhase === cc.Event.AT_TARGET && event.target === this.node) {
            event.stopPropagation();
        }
    }

    // touch event handler
    protected _onTouchBegan(event: cc.Event.EventTouch, captureListeners?: cc.Node[]) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;

        let touch = event.touch;
        if (this.content) {
            this._handlePressLogic();
        }
        this._touchMoved = false;
        this._stopPropagationIfTargetIsMe(event);
    }

    protected _onTouchMoved(event: cc.Event.EventTouch, captureListeners?: cc.Node[]) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;

        let touch = event.touch;
        if (this.content) {
            this._handleMoveLogic(touch);
        }
        // Do not prevent touch events in inner nodes
        if (!this.cancelInnerEvents) {
            return;
        }

        let deltaMove = touch.getLocation().sub(touch.getStartLocation());
        //FIXME: touch move delta should be calculated by DPI.
        if (deltaMove.mag() > 7) {
            if (!this._touchMoved && event.target !== this.node) {
                // Simulate touch cancel for target node
                let cancelEvent = new cc.Event.EventTouch(event.getTouches(), event.bubbles);
                cancelEvent.type = cc.Node.EventType.TOUCH_CANCEL;
                cancelEvent.touch = event.touch;
                (<any>cancelEvent).simulate = true;
                event.target.dispatchEvent(cancelEvent);
                this._touchMoved = true;
            }
        }
        this._stopPropagationIfTargetIsMe(event);
    }

    protected _onTouchEnded(event: cc.Event.EventTouch, captureListeners?: cc.Node[]) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;

        this._dispatchEvent(EventType.TOUCH_UP);

        let touch = event.touch;
        if (this.content) {
            this._handleReleaseLogic(touch);
        }
        if (this._touchMoved) {
            event.stopPropagation();
        } else {
            this._stopPropagationIfTargetIsMe(event);
        }
    }

    protected _onTouchCancelled(event: cc.Event.EventTouch, captureListeners?: cc.Node[]) {
        if (!this.enabledInHierarchy) return;
        if (this.hasNestedViewGroup(event, captureListeners)) return;

        // Filte touch cancel event send from self
        if (!(<any>event).simulate) {
            let touch = event.touch;
            if (this.content) {
                this._handleReleaseLogic(touch);
            }
        }
        this._stopPropagationIfTargetIsMe(event);
    }

    protected _processDeltaMove(deltaMove: cc.Vec2) {
        this._scrollChildren(deltaMove);
        this._gatherTouchMove(deltaMove);
    }

    // Contains node angle calculations
    protected _getLocalAxisAlignDelta(touch: cc.Touch) {
        this.node.convertToNodeSpaceAR(touch.getLocation(), _tempPoint);
        this.node.convertToNodeSpaceAR(touch.getPreviousLocation(), _tempPrevPoint);
        return _tempPoint.sub(_tempPrevPoint);
    }

    protected _handleMoveLogic(touch: cc.Touch) {
        let deltaMove = this._getLocalAxisAlignDelta(touch);
        this._processDeltaMove(deltaMove);
    }

    protected _scrollChildren(deltaMove: cc.Vec2) {
        deltaMove = this._clampDelta(deltaMove);

        let realMove = deltaMove;
        let outOfBoundary;
        if (this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary();
            realMove.x *= (outOfBoundary.x === 0 ? 1 : 0.5);
            realMove.y *= (outOfBoundary.y === 0 ? 1 : 0.5);
        }

        if (!this.elastic) {
            outOfBoundary = this._getHowMuchOutOfBoundary(realMove);
            realMove = realMove.add(outOfBoundary);
        }

        let vertical_scrollEventType = EventType.UNKNOWN;
        let horizontal_scrollEventType = EventType.UNKNOWN;

        if (this.vertical) {
            if (realMove.y > 0) { //up
                let icBottomPos = this.content.y - this.content.anchorY * this.content.height;

                if (icBottomPos + realMove.y >= this._bottomBoundary) {
                    vertical_scrollEventType = EventType.SCROLL_TO_BOTTOM;
                }
            }
            else if (realMove.y < 0) { //down
                let icTopPos = this.content.y - this.content.anchorY * this.content.height + this.content.height;

                if (icTopPos + realMove.y <= this._topBoundary) {
                    vertical_scrollEventType = EventType.SCROLL_TO_TOP;
                }
            }
        }
        if (this.horizontal) {
            if (realMove.x < 0) { //left
                let icRightPos = this.content.x - this.content.anchorX * this.content.width + this.content.width;
                if (icRightPos + realMove.x <= this._rightBoundary) {
                    horizontal_scrollEventType = EventType.SCROLL_TO_RIGHT;
                }
            }
            else if (realMove.x > 0) { //right
                let icLeftPos = this.content.x - this.content.anchorX * this.content.width;
                if (icLeftPos + realMove.x >= this._leftBoundary) {
                    horizontal_scrollEventType = EventType.SCROLL_TO_LEFT;
                }
            }
        }

        this._moveContent(realMove, false);

        if ((this.horizontal && realMove.x !== 0) || (this.vertical && realMove.y !== 0)) {
            if (!this._scrolling) {
                this._scrolling = true;
                this._dispatchEvent(EventType.SCROLL_BEGAN);
            }
            this._dispatchEvent(EventType.SCROLLING);
        }

        if (vertical_scrollEventType !== EventType.UNKNOWN) {
            this._dispatchEvent(vertical_scrollEventType);
        }

        if (horizontal_scrollEventType !== EventType.UNKNOWN) {
            this._dispatchEvent(horizontal_scrollEventType);
        }

    }

    protected _handlePressLogic() {
        if (this._autoScrolling) {
            this._dispatchEvent(EventType.SCROLL_ENDED);
        }
        this._autoScrolling = false;
        this._isBouncing = false;

        this._touchMovePreviousTimestamp = getTimeInMilliseconds();
        this._touchMoveDisplacements.length = 0;
        this._touchMoveTimeDeltas.length = 0;

        this._onScrollBarTouchBegan();
    }

    protected _clampDelta(delta: cc.Vec2) {
        let contentSize = this.content.getContentSize();
        let scrollViewSize = this._view.getContentSize();
        if (contentSize.width < scrollViewSize.width) {
            delta.x = 0;
        }
        if (contentSize.height < scrollViewSize.height) {
            delta.y = 0;
        }

        return delta;
    }

    protected _gatherTouchMove(delta: cc.Vec2) {
        delta = this._clampDelta(delta);

        while (this._touchMoveDisplacements.length >= NUMBER_OF_GATHERED_TOUCHES_FOR_MOVE_SPEED) {
            this._touchMoveDisplacements.shift();
            this._touchMoveTimeDeltas.shift();
        }

        this._touchMoveDisplacements.push(delta);

        let timeStamp = getTimeInMilliseconds();
        this._touchMoveTimeDeltas.push((timeStamp - this._touchMovePreviousTimestamp) / 1000);
        this._touchMovePreviousTimestamp = timeStamp;
    }

    protected _startBounceBackIfNeeded() {
        if (!this.elastic) {
            return false;
        }

        let bounceBackAmount = this._getHowMuchOutOfBoundary();
        bounceBackAmount = this._clampDelta(bounceBackAmount);

        if (bounceBackAmount.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            return false;
        }

        let bounceBackTime = Math.max(this.bounceDuration, 0);
        this._startAutoScroll(bounceBackAmount, bounceBackTime, true);

        if (!this._isBouncing) {
            if (bounceBackAmount.y > 0) this._dispatchEvent(EventType.BOUNCE_TOP);
            if (bounceBackAmount.y < 0) this._dispatchEvent(EventType.BOUNCE_BOTTOM);
            if (bounceBackAmount.x > 0) this._dispatchEvent(EventType.BOUNCE_RIGHT);
            if (bounceBackAmount.x < 0) this._dispatchEvent(EventType.BOUNCE_LEFT);
            this._isBouncing = true;
        }

        return true;
    }

    protected _processInertiaScroll() {
        let bounceBackStarted = this._startBounceBackIfNeeded();
        if (!bounceBackStarted && this.inertia) {
            let touchMoveVelocity = this._calculateTouchMoveVelocity();
            if (!touchMoveVelocity.fuzzyEquals(cc.v2(0, 0), EPSILON) && this.brake < 1) {
                this._startInertiaScroll(touchMoveVelocity);
            }
        }

        this._onScrollBarTouchEnded();
    }

    protected _handleReleaseLogic(touch: cc.Touch) {
        let delta = this._getLocalAxisAlignDelta(touch);
        this._gatherTouchMove(delta);
        this._processInertiaScroll();
        if (this._scrolling) {
            this._scrolling = false;
            if (!this._autoScrolling) {
                this._dispatchEvent(EventType.SCROLL_ENDED);
            }
        }
    }

    protected _isOutOfBoundary() {
        let outOfBoundary = this._getHowMuchOutOfBoundary();
        return !outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON);
    }

    protected _isNecessaryAutoScrollBrake() {
        if (this._autoScrollBraking) {
            return true;
        }

        if (this._isOutOfBoundary()) {
            if (!this._autoScrollCurrentlyOutOfBoundary) {
                this._autoScrollCurrentlyOutOfBoundary = true;
                this._autoScrollBraking = true;
                this._autoScrollBrakingStartPosition = this.getContentPosition();
                return true;
            }

        } else {
            this._autoScrollCurrentlyOutOfBoundary = false;
        }

        return false;
    }

    protected getScrollEndedEventTiming() {
        return EPSILON;
    }

    protected _processAutoScrolling(dt: number) {
        let isAutoScrollBrake = this._isNecessaryAutoScrollBrake();
        let brakingFactor = isAutoScrollBrake ? OUT_OF_BOUNDARY_BREAKING_FACTOR : 1;
        this._autoScrollAccumulatedTime += dt * (1 / brakingFactor);

        let percentage = Math.min(1, this._autoScrollAccumulatedTime / this._autoScrollTotalTime);
        if (this._autoScrollAttenuate) {
            percentage = quintEaseOut(percentage);
        }

        let newPosition = this._autoScrollStartPosition.add(this._autoScrollTargetDelta.mul(percentage));
        let reachedEnd = Math.abs(percentage - 1) <= EPSILON;

        let fireEvent = Math.abs(percentage - 1) <= this.getScrollEndedEventTiming();
        if (fireEvent && !this._isScrollEndedWithThresholdEventFired) {
            this._dispatchEvent(EventType.AUTOSCROLL_ENDED_WITH_THRESHOLD);
            this._isScrollEndedWithThresholdEventFired = true;
        }

        if (this.elastic) {
            let brakeOffsetPosition = newPosition.sub(this._autoScrollBrakingStartPosition);
            if (isAutoScrollBrake) {
                brakeOffsetPosition = brakeOffsetPosition.mul(brakingFactor);
            }
            newPosition = this._autoScrollBrakingStartPosition.add(brakeOffsetPosition);
        } else {
            let moveDelta = newPosition.sub(this.getContentPosition());
            let outOfBoundary = this._getHowMuchOutOfBoundary(moveDelta);
            if (!outOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
                newPosition = newPosition.add(outOfBoundary);
                reachedEnd = true;
            }
        }

        if (reachedEnd) {
            this._autoScrolling = false;
        }

        let deltaMove = newPosition.sub(this.getContentPosition());
        this._moveContent(this._clampDelta(deltaMove), reachedEnd);
        this._dispatchEvent(EventType.SCROLLING);

        // scollTo API controll move
        if (!this._autoScrolling) {
            this._isBouncing = false;
            this._scrolling = false;
            this._dispatchEvent(EventType.SCROLL_ENDED);
        }
    }

    protected _startInertiaScroll(touchMoveVelocity: cc.Vec2) {
        let inertiaTotalMovement = touchMoveVelocity.mul(MOVEMENT_FACTOR);
        this._startAttenuatingAutoScroll(inertiaTotalMovement, touchMoveVelocity);
    }

    protected _calculateAttenuatedFactor(distance: number) {
        if (this.brake <= 0) {
            return (1 - this.brake);
        }

        //attenuate formula from: http://learnopengl.com/#!Lighting/Light-casters
        return (1 - this.brake) * (1 / (1 + distance * 0.000014 + distance * distance * 0.000000008));
    }

    protected _startAttenuatingAutoScroll(deltaMove: cc.Vec2, initialVelocity: cc.Vec2) {
        let time = this._calculateAutoScrollTimeByInitalSpeed(initialVelocity.mag());


        let targetDelta = deltaMove.normalize();
        let contentSize = this.content.getContentSize();
        let scrollviewSize = this._view.getContentSize();

        let totalMoveWidth = (contentSize.width - scrollviewSize.width);
        let totalMoveHeight = (contentSize.height - scrollviewSize.height);

        let attenuatedFactorX = this._calculateAttenuatedFactor(totalMoveWidth);
        let attenuatedFactorY = this._calculateAttenuatedFactor(totalMoveHeight);

        targetDelta = cc.v2(targetDelta.x * totalMoveWidth * (1 - this.brake) * attenuatedFactorX, targetDelta.y * totalMoveHeight * attenuatedFactorY * (1 - this.brake));

        let originalMoveLength = deltaMove.mag();
        let factor = targetDelta.mag() / originalMoveLength;
        targetDelta = targetDelta.add(deltaMove);

        if (this.brake > 0 && factor > 7) {
            factor = Math.sqrt(factor);
            targetDelta = deltaMove.mul(factor).add(deltaMove);
        }

        if (this.brake > 0 && factor > 3) {
            factor = 3;
            time = time * factor;
        }

        if (this.brake === 0 && factor > 1) {
            time = time * factor;
        }

        this._startAutoScroll(targetDelta, time, true);
    }

    protected _calculateAutoScrollTimeByInitalSpeed(initalSpeed: number) {
        return Math.sqrt(Math.sqrt(initalSpeed / 5));
    }

    protected _startAutoScroll(deltaMove: cc.Vec2, timeInSecond: number, attenuated: boolean) {
        let adjustedDeltaMove = this._flattenVectorByDirection(deltaMove);

        this._autoScrolling = true;
        this._autoScrollTargetDelta = adjustedDeltaMove;
        this._autoScrollAttenuate = attenuated;
        this._autoScrollStartPosition = this.getContentPosition();
        this._autoScrollTotalTime = timeInSecond;
        this._autoScrollAccumulatedTime = 0;
        this._autoScrollBraking = false;
        this._isScrollEndedWithThresholdEventFired = false;
        this._autoScrollBrakingStartPosition = cc.v2(0, 0);

        let currentOutOfBoundary = this._getHowMuchOutOfBoundary();
        if (!currentOutOfBoundary.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._autoScrollCurrentlyOutOfBoundary = true;
        }
    }

    protected _calculateTouchMoveVelocity() {
        let totalTime = 0;
        totalTime = this._touchMoveTimeDeltas.reduce(function (a, b) {
            return a + b;
        }, totalTime);

        if (totalTime <= 0 || totalTime >= 0.5) {
            return cc.v2(0, 0);
        }

        let totalMovement = cc.v2(0, 0);
        totalMovement = this._touchMoveDisplacements.reduce(function (a, b) {
            return a.add(b);
        }, totalMovement);

        return cc.v2(totalMovement.x * (1 - this.brake) / totalTime,
            totalMovement.y * (1 - this.brake) / totalTime);
    }

    protected _flattenVectorByDirection(vector: cc.Vec2) {
        let result = vector;
        result.x = this.horizontal ? result.x : 0;
        result.y = this.vertical ? result.y : 0;
        return result;
    }

    protected _moveContent(deltaMove: cc.Vec2, canStartBounceBack = false) {
        let adjustedMove = this._flattenVectorByDirection(deltaMove);
        let newPosition = this.getContentPosition().add(adjustedMove);

        this.setContentPosition(newPosition);

        let outOfBoundary = this._getHowMuchOutOfBoundary();
        this._updateScrollBar(outOfBoundary);

        if (this.elastic && canStartBounceBack) {
            this._startBounceBackIfNeeded();
        }
    }

    protected _getContentLeftBoundary() {
        let contentPos = this.getContentPosition();
        return contentPos.x - this.content.getAnchorPoint().x * this.content.getContentSize().width;
    }

    protected _getContentRightBoundary() {
        let contentSize = this.content.getContentSize();
        return this._getContentLeftBoundary() + contentSize.width;
    }

    protected _getContentTopBoundary() {
        let contentSize = this.content.getContentSize();
        return this._getContentBottomBoundary() + contentSize.height;
    }

    protected _getContentBottomBoundary() {
        let contentPos = this.getContentPosition();
        return contentPos.y - this.content.getAnchorPoint().y * this.content.getContentSize().height;
    }

    protected _getHowMuchOutOfBoundary(addition?: cc.Vec2) {
        addition = addition || cc.v2(0, 0);
        if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON) && !this._outOfBoundaryAmountDirty) {
            return this._outOfBoundaryAmount;
        }

        let outOfBoundaryAmount = cc.v2(0, 0);
        if (this._getContentLeftBoundary() + addition.x > this._leftBoundary) {
            outOfBoundaryAmount.x = this._leftBoundary - (this._getContentLeftBoundary() + addition.x);
        } else if (this._getContentRightBoundary() + addition.x < this._rightBoundary) {
            outOfBoundaryAmount.x = this._rightBoundary - (this._getContentRightBoundary() + addition.x);
        }

        if (this._getContentTopBoundary() + addition.y < this._topBoundary) {
            outOfBoundaryAmount.y = this._topBoundary - (this._getContentTopBoundary() + addition.y);
        } else if (this._getContentBottomBoundary() + addition.y > this._bottomBoundary) {
            outOfBoundaryAmount.y = this._bottomBoundary - (this._getContentBottomBoundary() + addition.y);
        }

        if (addition.fuzzyEquals(cc.v2(0, 0), EPSILON)) {
            this._outOfBoundaryAmount = outOfBoundaryAmount;
            this._outOfBoundaryAmountDirty = false;
        }

        outOfBoundaryAmount = this._clampDelta(outOfBoundaryAmount);

        return outOfBoundaryAmount;
    }

    protected _updateScrollBarState() {
        if (!this.content) {
            return;
        }
        let contentSize = this.content.getContentSize();
        let scrollViewSize = this._view.getContentSize();
        if (this.verticalScrollBar) {
            if (contentSize.height < scrollViewSize.height) {
                this.verticalScrollBar.hide();
            } else {
                this.verticalScrollBar.show();
            }
        }

        if (this.horizontalScrollBar) {
            if (contentSize.width < scrollViewSize.width) {
                this.horizontalScrollBar.hide();
            } else {
                this.horizontalScrollBar.show();
            }
        }
    }

    protected _updateScrollBar(outOfBoundary: cc.Vec2 = cc.v2(0, 0)) {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onScroll(outOfBoundary);
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onScroll(outOfBoundary);
        }
    }

    protected _onScrollBarTouchBegan() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchBegan();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchBegan();
        }
    }

    protected _onScrollBarTouchEnded() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar._onTouchEnded();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar._onTouchEnded();
        }
    }

    protected _dispatchEvent(event: EventType) {
        if (event === EventType.SCROLL_ENDED) {
            this._scrollEventEmitMask = 0;

        } else if (event === EventType.SCROLL_TO_TOP ||
            event === EventType.SCROLL_TO_BOTTOM ||
            event === EventType.SCROLL_TO_LEFT ||
            event === EventType.SCROLL_TO_RIGHT) {
            let flag = (1 << eventMap[event]);
            if (this._scrollEventEmitMask & flag) {
                return;
            } else {
                this._scrollEventEmitMask |= flag;
            }
        }

        cc.Component.EventHandler.emitEvents(this.scrollEvents, this, event);
        this.node.emit(event, this);
    }

    protected _adjustContentOutOfBoundary() {
        this._outOfBoundaryAmountDirty = true;
        if (this._isOutOfBoundary()) {
            let outOfBoundary = this._getHowMuchOutOfBoundary(cc.v2(0, 0));
            let newPosition = this.getContentPosition().add(outOfBoundary);
            if (this.content) {
                this._setContentPosition(newPosition);
                this._updateScrollBar(cc.v2(0, 0));
            }
        }
    }

    protected start() {
        this._calculateBoundary();
        //Because widget component will adjust content position and scrollview position is correct after visit
        //So this event could make sure the content is on the correct position after loading.
        if (this.content) {
            cc.director.once(cc.Director.EVENT_BEFORE_DRAW, this._adjustContentOutOfBoundary, this);
        }
    }

    protected _hideScrollbar() {
        if (this.horizontalScrollBar) {
            this.horizontalScrollBar.hide();
        }

        if (this.verticalScrollBar) {
            this.verticalScrollBar.hide();
        }
    }

    protected onDisable() {
        if (!CC_EDITOR) {
            this._unregisterEvent();
            if (this.content) {
                this.content.off(cc.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                this.content.off(cc.Node.EventType.SCALE_CHANGED, this._calculateBoundary, this);
                if (this._view) {
                    this._view.off(cc.Node.EventType.POSITION_CHANGED, this._calculateBoundary, this);
                    this._view.off(cc.Node.EventType.SCALE_CHANGED, this._calculateBoundary, this);
                    this._view.off(cc.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                }
            }
        }
        this._hideScrollbar();
        this.stopAutoScroll();
    }

    protected onEnable() {
        if (!CC_EDITOR) {
            this._registerEvent();
            if (this.content) {
                this.content.on(cc.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                this.content.on(cc.Node.EventType.SCALE_CHANGED, this._calculateBoundary, this);
                if (this._view) {
                    this._view.on(cc.Node.EventType.POSITION_CHANGED, this._calculateBoundary, this);
                    this._view.on(cc.Node.EventType.SCALE_CHANGED, this._calculateBoundary, this);
                    this._view.on(cc.Node.EventType.SIZE_CHANGED, this._calculateBoundary, this);
                }
            }
        }
        this._updateScrollBarState();
    }

    protected update(dt) {
        if (this._autoScrolling) {
            this._processAutoScrolling(dt);
        }
    }
}
