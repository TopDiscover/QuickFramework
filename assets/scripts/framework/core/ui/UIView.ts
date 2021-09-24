import EventComponent from "../../componects/EventComponent";
import AudioComponent from "../../componects/AudioComponent";
import { _decorator, Node, game, Game, EventKeyboard, tween, Tween, Vec3, systemEvent, SystemEvent, js, macro } from "cc";
import { Macro } from "../../defines/Macros";

/**
 * @description 视图基类
 */
const { ccclass, property } = _decorator;

@ccclass
export default class UIView extends EventComponent implements IFullScreenAdapt {
    onFullScreenAdapt(): void {

    }

    public static getPrefabUrl(): string {
        Log.e(`请求实现public static getPrefabUrl`);
        return Macro.UNKNOWN;
    }

    /**@description ViewOption.args参数 */
    private _args?: any[] | any;
    /**@description 通过UI管理器打开时的传入ViewOption.args参数 */
    public get args() {
        return this._args;
    }
    public set args(args) {
        this._args = args;
    }

    /**
     * @description 统一定义一个显示内容节点
     * */
    private _content: Node | null = null;
    protected set content(value) {
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

    public close( options ?: ViewOption ) {
        if ( options && options.isAction ){
            //有动画
            if ( options.start ){
                options.start();
            }
            if ( !options.do ){
                Log.e(`必须指定动画参数,界面将会直接关闭`);
                Manager.uiManager.close(this.className);
                return;
            }
            options.do.then(()=>{
                if ( options.complete ) options.complete();
                Manager.uiManager.close(this.className);
            });
        }else{
            //没有设置项
            Manager.uiManager.close(this.className);
        }
    }

    /**@description args为open代入的参数 */
    public show(options ?: ViewOption) {
        //再如果界面已经存在于界面管理器中，此时传入新的参数，只从show里面过来,这里重新对_args重新赋值
        if ( options ){
            this._args = options.args;
        }else{
            this._args = null;
        }

        if ( options && options.isAction ){
            //有动画
            if (this.node) this.node.active = true;
            if ( options.start ){
                options.start();
            }
            if ( options.do ){
                options.do.then(()=>{
                    if ( options.complete ) options.complete();
                });
            }else{
                if ( options.complete ) options.complete();
            }
        }else{
            //没有设置项
            if (this.node) this.node.active = true;
        }
    }

    public hide( options ?: ViewOption ) {
        if ( options && options.isAction ){
            //有动画
            if ( options.start ){
                options.start();
            }
            if ( !options.do ){
                Log.e(`必须指定动画参数,界面将会直接隐藏`);
                if (this.node) this.node.removeFromParent();
                return;
            }
            options.do.then(()=>{
                if ( options.complete ) options.complete();
                if (this.node) this.node.removeFromParent();
            });
        }else{
            //没有设置项
            if (this.node) this.node.removeFromParent();
        }
    }

    protected _enabledKeyUp: boolean = false;
    /**@description 是否启用键盘抬起事件 */
    protected get enabledKeyUp() {
        return this._enabledKeyUp;
    }
    protected set enabledKeyUp(value) {
        this._enabledKeyUp = value;
        if (value) {
            systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
            systemEvent.on(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        } else {
            systemEvent.off(SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
        }
    }

    protected _enabledKeyDown: boolean = false;
    /**@description 是否启用键盘按下事件 */
    protected get enabledKeyDown() {
        return this._enabledKeyUp;
    }
    protected set enabledKeyDown(value) {
        this._enabledKeyUp = value;
        if (value) {
            systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
            systemEvent.on(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        } else {
            systemEvent.off(SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        }
    }

    protected onKeyUp(ev: EventKeyboard) {
        if (ev.keyCode == macro.KEY.escape) {
            this.onKeyBackUp(ev);
        } else {
            ev.propagationStopped = true;
        }
    }

    protected onKeyDown(ev: EventKeyboard) {
        if (ev.keyCode == macro.KEY.escape) {
            this.onKeyBackDown(ev);
        } else {
            ev.propagationStopped = true;
        }
    }

    protected onKeyBackUp(ev: EventKeyboard) {
        //只有一个接受，不再向上传播
        ev.propagationStopped = true;
    }

    protected onKeyBackDown(ev: EventKeyboard) {
        ev.propagationStopped = true;
    }

    audioHelper: AudioComponent = null!;

    onLoad() {
        this.audioHelper = <AudioComponent>(this.addComponent(AudioComponent));
        this.audioHelper.owner = this;
        super.onLoad();
    }

    onDestroy() {
        this.enabledKeyDown = false;
        this.enabledKeyUp = false;
        this.enableFrontAndBackgroundSwitch = false;
        super.onDestroy();
    }

    private _enterBackgroundTime = 0;
    private _enableFrontAndBackgroundSwitch = false;
    protected set enableFrontAndBackgroundSwitch(value) {
        this._enableFrontAndBackgroundSwitch = value;
        if (value) {
            game.on(Game.EVENT_SHOW, this._onEnterForgeGround, this);
            game.on(Game.EVENT_HIDE, this._onEnterBackground, this);
        } else {
            game.off(Game.EVENT_SHOW, this._onEnterForgeGround, this);
            game.off(Game.EVENT_HIDE, this._onEnterBackground, this);
        }
    }
    protected get enableFrontAndBackgroundSwitch() {
        return this._enableFrontAndBackgroundSwitch;
    }

    private _onEnterBackground() {
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