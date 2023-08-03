import EventComponent from "./EventComponent";

const { ccclass, property , menu } = cc._decorator;
/**
 * @description 点击屏蔽组件
 */
@ccclass
@menu("QuickUI组件/TouchBlocker")
export default class TouchBlocker extends EventComponent {

    @property
    protected _target : cc.Node = null!;

    /**@description 可点击的目标节点 */
    @property({ type: cc.Node, tooltip: CC_DEV && "可被点击的节点" })
    get target(){
        return this._target;
    }
    set target(v){
        this._target = v;
    }

    /**@description 拦截状态 */
    protected _isBlock: boolean = false;
    /**@description 拦截状态 */
    get isBlock(){
        return this._isBlock;
    }
    set isBlock( v ){
        this._isBlock = v;
    }

    onLoad(): void {
        super.onLoad();
        this.registerEvent();
    }

    start(): void {
        super.start && super.start();
        this.reset();
    }

    /**@description 注册事件 */
    protected registerEvent() {
        this.onN(this.node, cc.Node.EventType.TOUCH_START, this.onTouchEvent);
        this.onN(this.node, cc.Node.EventType.TOUCH_MOVE, this.onTouchEvent);
        this.onN(this.node, cc.Node.EventType.TOUCH_END, this.onTouchEvent);
    }

    /**@description 重置 */
    protected reset(): void {
        this.setSwallowTouches(false);
    }

    protected onTouchEvent(event: cc.Event.EventTouch) {
        if ( !this.isBlock) {
            //全部放行
            return;
        }

        if (!cc.isValid(this.target)) {
            //拦截状态并且无目标
            event.stopPropagationImmediate();
            return;
        }

        //点击是否命中目标节点
        const targetRect = this.target.getBoundingBoxToWorld();
        const isContains = targetRect.contains(event.getLocation());
        if (!isContains) {
            event.stopPropagationImmediate();
        }
    }

    /**
     * @description 设置节点是否吞噬点击事件
     * @param isSwallow 
     */
    protected setSwallowTouches(isSwallow: boolean) {
        this.node._touchListener && this.node._touchListener.setSwallowTouches(isSwallow);
    }
}
