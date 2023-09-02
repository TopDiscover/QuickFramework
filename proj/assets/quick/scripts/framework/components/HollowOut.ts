/**
 * @description 挖孔组件 原项目地址 https://gitee.com/ichenpipi/cocos-eazax-kit
 * 使用之前，请先重置组件，以完成正确的赋值
 */

import { Macro } from "../defines/Macros";

const { ccclass, property, menu , executionOrder , executeInEditMode , disallowMultiple } = cc._decorator;

enum TYPE {
    /**@description 矩形 */
    Rect = 1,
    /**@description 圆形 */
    Circle,
}

@ccclass
@menu("QuickUI组件/HollowOut")
@executeInEditMode
@disallowMultiple
@executionOrder(-10)
export default class HollowOut extends cc.Component {
    static TYPE = TYPE;

    @property
    protected _type = TYPE.Rect;
    @property({ type: cc.Enum(TYPE), tooltip: CC_DEV && "镂空类型" })
    get type() {
        return this._type;
    }
    set type(v) {
        this._type = v;
        this.updateProperties();
    }

    @property
    protected _center: cc.Vec2 = cc.v2();
    @property({ tooltip: CC_DEV && "中心坐标" })
    get center() {
        return this._center;
    }
    set center(v) {
        this._center = v;
        this.updateProperties();
    }

    @property
    protected _width: number = 300;
    @property({
        tooltip: CC_DEV && "宽", visible() {
            return this._type == TYPE.Rect;
        },
    })
    get width() {
        return this._width;
    }
    set width(v) {
        this._width = v;
        this.updateProperties();
    }

    @property
    protected _height: number = 300;
    @property({
        tooltip: CC_DEV && "高", visible() {
            return this._type == TYPE.Rect;
        },
    })
    get height() {
        return this._height;
    }
    set height(v) {
        this._height = v;
        this.updateProperties();
    }

    @property
    protected _round: number = 1;
    @property({
        tooltip: CC_DEV && "圆角半径", visible() {
            return this._type == TYPE.Rect;
        },
    })
    get round() {
        return this._round;
    }
    set round(v) {
        this._round = v;
        this.updateProperties();
    }

    @property
    protected _radius: number = 200;
    @property({
        tooltip: CC_DEV && "半径", visible() {
            return this._type == TYPE.Circle;
        },
    })
    get radius() {
        return this._radius;
    }
    set radius(v) {
        this._radius = v;
        this.updateProperties();
    }

    @property
    protected _feather: number = 0.5;
    @property({
        tooltip: CC_DEV && "边缘虚化宽度", visible() {
            return this._type === TYPE.Circle || this.radius > 0;
        },
    })
    get feather() {
        return this._feather;
    }
    set feather(v) {
        this._feather = v;
        this.updateProperties();
    }

    protected sprite: cc.Sprite = null!;

    protected material: cc.Material = null!;

    protected tweenRes: () => void = null;

    protected onLoad(): void {
        super.onLoad && super.onLoad();
        this.init();
    }

    protected resetInEditor(): void {
        this.init();
    }

    protected init() {
        //检查当前组件是否有 cc.Sprite , 如果没有，重新添加一个
        this.sprite = this.node.getComponent(cc.Sprite);
        if (!cc.isValid(this.sprite)) {
            this.sprite = this.node.addComponent(cc.Sprite);
        }

        if ( CC_EDITOR && !(this.sprite.spriteFrame && this.sprite.spriteFrame.name.startsWith("singleColor_unpackable"))) {
            let view = App.retainMemory;
            this.sprite.loadImage({
                url: "quick/images/singleColor_unpackable",
                view: view,
                complete: data => {
                    this.onLoadSpriteComplete(data);
                },
                bundle: Macro.BUNDLE_RESOURCES
            });
        } else {
            this.onLoadSpriteComplete(this.sprite.spriteFrame);
        }

    }

    /**@description 加载 Sprite 完成 */
    protected onLoadSpriteComplete(data: cc.SpriteFrame) {
        if ( !cc.isValid(data) ){
            return;
        }
        data.getTexture().packable = false;

        let material = this.sprite.getMaterial(0);
        if ( CC_EDITOR && !(material && material.name.startsWith("quick-2d-hollowout-sprite"))) {
            let view = App.retainMemory;
            //加载材质
            loadRes<cc.Material>({
                bundle: Macro.BUNDLE_RESOURCES,
                url: "quick/material/quick-2d-hollowout-sprite",
                view: view,
                type: cc.Material,
                onComplete: (data) => {
                    if (data) {
                        let material = data;
                        this.sprite.setMaterial(0, material);
                        this.onLoadMaterialComplete(material)
                    }
                },
            })
        } else {
            this.onLoadMaterialComplete(material);
        }

    }

    protected onLoadMaterialComplete(data: cc.Material) {
        this.material = data;
        //更新材质属性
        this.updateProperties();
    }

    /**@description 更新材质属性 */
    protected updateProperties() {
        switch (this.type) {
            case TYPE.Rect:
                this.rect(this.center, this.width, this.height, this.round, this.feather)
                break;
            case TYPE.Circle:
                this.circle(this.center, this.radius, this.feather);
                break;
        }
    }

    /**
     * 矩形镂空
     * @param center 中心坐标
     * @param width 宽
     * @param height 高
     * @param round 圆角半径
     * @param feather 边缘虚化宽度
     */
    rect(center?: cc.Vec2, width?: number, height?: number, round?: number, feather?: number) {
        // 保存类型
        this._type = TYPE.Rect;
        // 确认参数
        if (center != null) {
            this._center = center;
        }
        if (width != null) {
            this._width = width;
        }
        if (height != null) {
            this._height = height;
        }
        if (round != null) {
            this._round = (round >= 0) ? round : 0;
            const min = Math.min(this._width / 2, this._height / 2);
            this._round = (this._round <= min) ? this._round : min;
        }
        if (feather != null) {
            this._feather = (feather >= 0) ? feather : 0;
            this._feather = (this._feather <= this._round) ? this._feather : this._round;
        }
        // 更新材质
        const material = this.material;
        if (cc.isValid(material)) {
            material.setProperty('size', this.getNodeSize());
            material.setProperty('center', this.getCenter(this._center));
            material.setProperty('width', this.getWidth(this._width));
            material.setProperty('height', this.getHeight(this._height));
            material.setProperty('round', this.getRound(this._round));
            material.setProperty('feather', this.getFeather(this._feather));
        }
    }

    /**
     * 圆形镂空
     * @param center 中心坐标
     * @param radius 半径
     * @param feather 边缘虚化宽度
     */
    circle(center?: cc.Vec2, radius?: number, feather?: number) {
        // 保存类型
        this._type = TYPE.Circle;
        // 确认参数
        if (center != null) {
            this._center = center;
        }
        if (radius != null) {
            this._radius = radius;
        }
        if (feather != null) {
            this._feather = (feather >= 0) ? feather : 0;
        }
        // 更新材质
        const material = this.material;
        if (cc.isValid(material)) {
            material.setProperty('size', this.getNodeSize());
            material.setProperty('center', this.getCenter(this._center));
            material.setProperty('width', this.getWidth(this._radius * 2));
            material.setProperty('height', this.getHeight(this._radius * 2));
            material.setProperty('round', this.getRound(this._radius));
            material.setProperty('feather', this.getFeather(this._feather));
        }
    }

    /**
     * 缓动镂空（矩形）
     * @param time 时间
     * @param center 中心坐标
     * @param width 宽
     * @param height 高
     * @param round 圆角半径
     * @param feather 边缘虚化宽度
     */
    public rectTo(time: number, center: cc.Vec2, width: number, height: number, round: number = 0, feather: number = 0): Promise<void> {
        return new Promise(res => {
            // 保存类型
            this._type = TYPE.Rect;
            // 停止进行中的缓动
            cc.Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            // 完成上一个期约
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            // 确认参数
            round = Math.min(round, width / 2, height / 2);
            feather = Math.min(feather, round);
            // 缓动
            cc.tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    width: width,
                    height: height,
                    round: round,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        if (this.tweenRes) {
                            this.tweenRes();
                            this.tweenRes = null;
                        }
                    });
                })
                .start();
        });
    }

    /**
     * 缓动镂空（圆形）
     * @param time 时间
     * @param center 中心坐标
     * @param radius 半径
     * @param feather 边缘虚化宽度
     */
    public circleTo(time: number, center: cc.Vec2, radius: number, feather: number = 0): Promise<void> {
        return new Promise(res => {
            // 保存类型
            this._type = TYPE.Circle;
            // 停止进行中的缓动
            cc.Tween.stopAllByTarget(this);
            this.unscheduleAllCallbacks();
            // 完成上一个期约
            this.tweenRes && this.tweenRes();
            this.tweenRes = res;
            // 缓动
            cc.tween<HollowOut>(this)
                .to(time, {
                    center: center,
                    radius: radius,
                    feather: feather
                })
                .call(() => {
                    this.scheduleOnce(() => {
                        if (this.tweenRes) {
                            this.tweenRes();
                            this.tweenRes = null;
                        }
                    });
                })
                .start();
        });
    }

    /**
     * 取消所有挖孔
     */
    public reset() {
        this.rect(cc.v2(), 0, 0, 0, 0);
    }

    /**
     * 挖孔设为节点大小（就整个都挖没了）
     */
    public setNodeSize() {
        const node = this.node,
            width = node.width,
            height = node.height;
        this._radius = Math.sqrt(width ** 2 + height ** 2) / 2;
        this.rect(node.getPosition(), width, height, 0, 0);
    }

    /**
     * 获取中心点
     * @param center 
     */
    protected getCenter(center: cc.Vec2) {
        const node = this.node,
            width = node.width,
            height = node.height;
        const x = (center.x + (width / 2)) / width,
            y = (-center.y + (height / 2)) / height;
        return cc.v2(x, y);
    }

    /**
     * 获取节点尺寸
     */
    protected getNodeSize() {
        return cc.v2(this.node.width, this.node.height);
    }

    /**
     * 获取挖孔宽度
     * @param width 
     */
    protected getWidth(width: number) {
        return width / this.node.width;
    }

    /**
     * 获取挖孔高度
     * @param height 
     */
    protected getHeight(height: number) {
        return height / this.node.width;
    }

    /**
     * 获取圆角半径
     * @param round 
     */
    protected getRound(round: number) {
        return round / this.node.width;
    }

    /**
     * 获取边缘虚化宽度
     * @param feather 
     */
    protected getFeather(feather: number) {
        return feather / this.node.width;
    }
}
