import EventComponent from "../base/EventComponent";
import AudioComponent from "../base/AudioComponent";
import { Manager } from "../Framework";
import { _decorator, Node, game, Game, EventKeyboard, tween, Tween, Vec3, systemEvent, SystemEvent, js, macro } from "cc";
import { DEBUG } from "cc/env";
import { BUNDLE_TYPE } from "../base/Defines"

/**
 * @description 视图基类
 */
const { ccclass, property } = _decorator;

export interface UIClass<T extends UIView> {
    new(): T;
    /**
     *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer 
     */
    getPrefabUrl(): string;
}

@ccclass
export default abstract class UIView extends EventComponent {

    /**@description 是否允许接受键盘事件 */
    private _isEnableKey = false;
    private action: Tween<any> | null = null;
    public static getPrefabUrl(): string {
        if (DEBUG) {
            error(`请求实现public static getPrefabUrl`);
        }
        return "unknown";
    }

    /**@description init代码参数 */
    private _args?: any[];
    /**@description 当前传入参数，即通过UI管理器打开时的传入参数 */
    public get args() {
        return this._args;
    }
    public set args(args) {
        this._args = args;
    }

    /**
     * @description 当前界面的节点，如果界面需要使用动画打开或关闭，
     * 可直接对content进行赋值，
     * 使用showWithAction 有动画显示
     * 使用hideWithAction 有动画隐藏
     * 使用closeWithAction 有动画关闭
     * */
    private _content: Node = null!;
    protected set content(value: Node) {
        this._content = value;
    }
    protected get content() {
        return this._content;
    }

    /**本组件的类名 */
    private _className: string = "unknow";
    public set className(value: string) {
        this._className = value;
    }
    public get className(): string {
        return this._className;
    }

    private _bundle: BUNDLE_TYPE = null!;
    /**指向当前View打开时的bundle */
    public set bundle(value) {
        this._bundle = value;
    }
    public get bundle() {
        return this._bundle;
    }

    public close() {
        Manager.uiManager.close(this.className);
    }

    /**@description args为open代入的参数 */
    public show(args?: any[]) {
        //再如果界面已经存在于界面管理器中，不会再进入init函数，此时传入新的参数，只从show里面过来,这里重新对_args重新赋值
        this._args = args;
        if (this.node) this.node.active = true;
    }

    public hide() {
        if (this.node) this.node.removeFromParent();
    }

    /**@description 动画显示界面 
     *@param isOverrideShow 是否是重写show调用的,如果是重写show调用了,必将此参数设置为true,否则会产生死循环递归调用 
     *@param completeCallback 完成回调
     *@example 
     *  示例： 通常在init/onLoad函数中调用 showWithAction,
     *  但如果需要界面通过hide隐藏，而不是关闭界面时，下一次显示时
     *  管理器直接调用了show,没有执行界面的打开动画，如果还需要界面打开动画
     *  需要按如下方式重写show方法
     *  show( args : any[] ){
     *      super.show(args);
     *      this.showWithAction(true);
     *      //to do => 
     *  }
     */
    public showWithAction(isOverrideShow = false, completeCallback?: () => void) {
        if (this.content) {
            if (!isOverrideShow) this.show(this.args);
            this.action?.stop();
            this.action = tween(this.content);
            this.action.set({ scale: new Vec3(0.2, 0.2, 0.2) })
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .delay(0.05)
                .to(0.1, { scale: new Vec3(1, 1, 1) })
                .call(() => {
                    if (completeCallback) completeCallback();
                })
                .start();
        }
    }

    /**@description 动画隐藏界面 
     *@param isOverrideHide 是否是重写hide调用的,如果是重写hide调用了,必将此参数设置为true,否则会产生死循环递归调用 
     *@param completeCallback 完成回调
     */
    public hideWithAction(completeCallback?: () => void) {
        if (this.content) {
            this.action?.stop();
            this.action = tween(this.content);
            this.action.to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) })
                .call(() => {
                    this.hide();
                    this.content.setScale(new Vec3(1, 1, 1));
                    if (completeCallback) completeCallback();
                })
                .start();
        }
    }

    /**@description 动画关闭界面 
     *@param completeCallback 完成回调
     */
    public closeWithAction(completeCallback?: () => void) {
        if (this.content) {
            this.action?.stop();
            this.action = tween(this.content)
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) })
                .call(() => {
                    if (completeCallback) completeCallback();
                    this.close();
                })
                .start();
        }
    }


    /**
     * @description 启用物理返回键按钮
     * @param isEnabled true 启用，
     * @example 重写onKeyBack方法
     */
    protected setEnabledKeyBack(isEnabled: boolean) {
        if (isEnabled) {
            systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        } else {
            systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }

        this._isEnableKey = isEnabled;
    }

    protected isEnabledKeyBack() {
        return this._isEnableKey;
    }

    protected onKeyUp(ev: EventKeyboard) {
        if (DEBUG) {
            log(`[${js.getClassName(this)}] onKeyUp keyCode : ${ev.keyCode}`);
        }
        if (ev.keyCode == macro.KEY.escape) {
            this.onKeyBack(ev);
        } else {
            ev.propagationStopped = true;
        }
    }

    protected onKeyBack(ev: EventKeyboard) {
        //只有一个接受，不再向上传播
        //ev.stopPropagation();
    }

    public audioHelper: AudioComponent = null!;

    onLoad() {
        this.audioHelper = <AudioComponent>(this.addComponent(AudioComponent));
        this.audioHelper.owner = this;
        super.onLoad();
    }

    onDestroy() {
        this.setEnabledKeyBack(false);
        this.enableFrontAndBackgroundSwitch = false;
        super.onDestroy();
    }

    private _enterBackgroundTime = 0;
    private _enableFrontAndBackgroundSwitch = false;
    public set enableFrontAndBackgroundSwitch(value) {
        this._enableFrontAndBackgroundSwitch = value;
        if (value) {
            game.on(Game.EVENT_SHOW, this._onEnterForgeGround, this);
            game.on(Game.EVENT_HIDE, this._onEnterBackground, this);
        } else {
            game.off(Game.EVENT_SHOW, this._onEnterForgeGround, this);
            game.off(Game.EVENT_HIDE, this._onEnterBackground, this);
        }
    }
    public get enableFrontAndBackgroundSwitch() {
        return this._enableFrontAndBackgroundSwitch;
    }

    protected _onEnterBackground() {
        this._enterBackgroundTime = Date.timeNow();
        this.onEnterBackground();
    }

    private _onEnterForgeGround() {
        let now = Date.timeNow();
        let inBackgroundTime = now - this._enterBackgroundTime;
        this.onEnterForgeground(inBackgroundTime);
    }

    protected onEnterForgeground(inBackgroundTime: number) {

    }
    protected onEnterBackground() {

    }
}