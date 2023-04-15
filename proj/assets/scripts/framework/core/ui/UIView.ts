import EventComponent from "../../componects/EventComponent";
import AudioComponent from "../../componects/AudioComponent";
import { Macro } from "../../defines/Macros";

/**
 * @description 视图基类
 */
const { ccclass, property, menu } = cc._decorator;

@ccclass
@menu("Quick公共组件/UIView")
export default class UIView extends EventComponent {

    /**
	 *@description 视图prefab 地址 resources目录下如z_panels/WeiZoneLayer,如果是在主场景上的节点，使用Canvas:xx/xx
	 */
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

    /**@description 关闭界面动画 */
    protected get closeAction() : ViewAction | null{
        return null;
    } 

    public close( ) {
        if ( this.closeAction ){
            this.closeAction(()=>{
                App.uiManager.close(this.className);
            });
        }else{
            App.uiManager.close(this.className);
        }
    }

    protected get showAction() : ViewAction | null{
        return null;
    }

    /**@description args为open代入的参数 */
    public show( args ?: any[] | any) {
        //再如果界面已经存在于界面管理器中，此时传入新的参数，只从show里面过来,这里重新对_args重新赋值
        this._args = args;
        if (this.node) this.node.active = true;
        if ( this.showAction ){
            this.showAction(()=>{});
        }
    }

    protected get hideAction() : ViewAction | null{
        return null;
    }

    public hide( ) {
        if ( this.hideAction ){
            this.hideAction(()=>{
                if (this.node) this.node.removeFromParent();
            });
        }else{
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
            this.onI(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp);
        } else {
            this.offI(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp);
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
            this.onI(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown);
        } else {
            this.offI(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown);
        }
    }

    protected onKeyUp(ev: cc.Event.EventKeyboard) {
        if (ev.keyCode == cc.macro.KEY.escape) {
            this.onKeyBackUp(ev);
        } else {
            ev.stopPropagation();
        }
    }

    protected onKeyDown(ev: cc.Event.EventKeyboard) {
        if (ev.keyCode == cc.macro.KEY.escape) {
            this.onKeyBackDown(ev);
        } else {
            ev.stopPropagation();
        }
    }

    protected onKeyBackUp(ev: cc.Event.EventKeyboard) {
        //只有一个接受，不再向上传播
        ev.stopPropagation();
    }

    protected onKeyBackDown(ev: cc.Event.EventKeyboard) {
        ev.stopPropagation();
    }

    audioHelper: AudioComponent = null!;

    onLoad() {
        this.audioHelper = <AudioComponent>(this.addComponent(AudioComponent));
        this.audioHelper.owner = this;
        super.onLoad();
    }

    private _enterBackgroundTime = 0;
    private _enableFrontAndBackgroundSwitch = false;
    protected set enableFrontAndBackgroundSwitch(value) {
        this._enableFrontAndBackgroundSwitch = value;
        if (value) {
            this.onG(cc.game.EVENT_SHOW, this._onEnterForgeGround);
            this.onG(cc.game.EVENT_HIDE, this._onEnterBackground);
        } else {
            this.offG(cc.game.EVENT_SHOW, this._onEnterForgeGround);
            this.offG(cc.game.EVENT_HIDE, this._onEnterBackground);
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