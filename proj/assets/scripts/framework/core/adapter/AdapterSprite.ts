import { Adapter } from "./Adapter";

const { ccclass, property , executeInEditMode,menu} = cc._decorator;

/**
 * 缩放方式
 */
export enum SpriteScaleType {
    /**
     * 缩放到填满父节点（如果父节点有裁剪，图像可能会被裁剪，节点可能会超出父节点）
     */
    FILL,

    /**
     * 缩放到刚好在父节点内部最大化显示（图像会完整显示，但父节点上下或者左右可能会留空）
     */
    SUIT,
}

/**
 * 对齐方式
 */
export enum SpriteAlignType {
    /**
     * 缩放后靠左对齐
     */
    LEFT,

    /**
     * 缩放后靠上对齐
     */
    TOP,

    /**
     * 缩放后靠右对齐
     */
    RIGHT,

    /**
     * 缩放后靠下对齐
     */
    BOTTOM,

    /**
     * 缩放后居中对齐
     */
    CENTER,
}

/**
 * Sprite 适配组件
 *
 * @author caizhitao
 * @created 2020-12-27 21:22:43
 */
@ccclass
@executeInEditMode
@menu("adapter/AdapterSprite")
export default class AdapterSprite extends Adapter {
    @property({
        type: cc.Enum(SpriteScaleType),
        tooltip: `缩放类型:
        -FILL: 缩放到填满父节点（如果父节点有裁剪，图像可能会被裁剪，节点可能会超出父节点）
        -SUIT: 缩放到刚好在父节点内部最大化显示（图像会完整显示，但父节点上下或者左右可能会留空）`,
    })
    get scaleType(){
        return this._scaleType;
    }
    set scaleType(value){
        this._scaleType = value;
        if ( CC_EDITOR ){
            this.updateSprite(this._scaleType,this.alignType);
        }
    }
    private _scaleType: SpriteScaleType = SpriteScaleType.SUIT;

    @property({
        type: cc.Enum(SpriteAlignType),
        tooltip: `齐方式类型:
        -LEFT: 缩放后靠左对齐
        -TOP: 缩放后靠上对齐
        -RIGHT: 缩放后靠右对齐
        -BOTTOM: 缩放后靠下对齐
        -CENTER: 缩放后居中对齐`,
    })
    get alignType(){
        return this._alignType;
    }
    set alignType(value){
        this._alignType = value;
        if ( CC_EDITOR ){
            this.updateSprite(this._scaleType,this._alignType);
        }
    }
    private _alignType: SpriteAlignType = SpriteAlignType.CENTER;

    private _sprite: cc.Sprite = null!;

    onLoad() {
        this._sprite = this.node.getComponent(cc.Sprite) as cc.Sprite;
    }

    start() {
        this.updateSprite(this.scaleType, this.alignType);
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
        this.updateSprite(this.scaleType, this.alignType);
    }

    updateSprite(scaleType: SpriteScaleType, alignType: SpriteAlignType) {
        if (!this._sprite || !this._sprite.enabled || !this._sprite.spriteFrame) {
            return;
        }
        let widget = this.node.parent?.getComponent(cc.Widget);
        if (widget) {
            widget.updateAlignment();
        }
        this.width = this._sprite.spriteFrame.getRect().width;
        this.height = this._sprite.spriteFrame.getRect().height;
        let trans = this.parentTrans;
        if (this.width / this.height > trans.width / trans.height) {
            // 设计分辨率宽高比大于显示分辨率
            if (scaleType == SpriteScaleType.SUIT) {
                let scale = trans.width / this.width;
                this.node.scale = scale;
            } else if (scaleType == SpriteScaleType.FILL) {
                let scale = trans.height / this.height;
                this.node.scale = scale;
            }
        } else {
            // 设计分辨率宽高比小于显示分辨率
            if (scaleType == SpriteScaleType.SUIT) {
                let scale = trans.height / this.height;
                this.node.scale = scale;
            } else if (scaleType == SpriteScaleType.FILL) {
                let scale = trans.width / this.width;
                this.node.scale = scale;
            }
        }

        switch (alignType) {
            case SpriteAlignType.CENTER:
                this.node.setPosition(cc.v2());
                break;
            case SpriteAlignType.LEFT:
                this.node.setPosition(cc.v2(-0.5 * (trans.width - this.width * this.node.scale), 0));
                break;
            case SpriteAlignType.RIGHT:
                this.node.setPosition(cc.v2(0.5 * (trans.width - this.width * this.node.scale), 0));
                break;
            case SpriteAlignType.TOP:
                this.node.setPosition(cc.v2(0, 0.5 * (trans.height - this.height * this.node.scale)));
                break;
            case SpriteAlignType.BOTTOM:
                this.node.setPosition(cc.v2(0, -0.5 * (trans.height - this.height * this.node.scale)));
                break;
        }
    }

    private get parentTrans(){
        return this.node.parent;
    }
}
