import { EventApi } from "../../framework/event/EventApi";
import { Config } from "../config/Config";
import { BUNDLE_RESOURCES } from "../../framework/base/Defines";
import { find, instantiate, Label ,Node, Prefab, Tween, tween, UIOpacity, Vec3} from "cc";
import { ViewZOrder } from "../config/ViewZOrder";
/**
 * @description 加载动画
 */

export default class UILoading {
    private static _instance: UILoading = null!;
    public static Instance() { return this._instance || (this._instance = new UILoading()); }
    /**@description 当前loading节点 */
    private _node: Node = null!;
    constructor() {
        Manager.eventDispatcher.addEventListener(EventApi.AdaptScreenEvent, this.onAdaptScreen, this);
    }
    private onAdaptScreen() {
        Manager.resolutionHelper.fullScreenAdapt(this._node);
    }
    private _isWaitingHide = false;
    private delay : number = 0;
    private content: Node = null!;
    private text: Label = null!;
    private _isLoadingPrefab = false;
    private finishLoadCb : any = null;
    private _uiName:string = null!;

    /**@description 显示节点的透明度 */
    private _contentOpacity : UIOpacity = null!;

    private get contentOpacity(){
        if( this._contentOpacity ){
            return this._contentOpacity;
        }
        return this.content.getComponent(UIOpacity) as UIOpacity;
    }

    public preloadPrefab() {
        this.loadPrefab();
    }

    /**
    * @description 显示全屏幕加载动画
    * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
    */
    public show( delay : number ,name : string) {
        if( delay == undefined || delay == null || delay < 0 ){
            this.delay = Config.LOAD_VIEW_DELAY;
        }else{
            this.delay = delay;
        }
        this._uiName = name;
        this._show();
    }
    private _timerId = -1;

    /**
     * @description 显示动画
     * @param timeOut 超时加载时间。默认10为加载界面失败
     * @param timeOutCb 超时回调
     */
    private async _show() {
        this._isWaitingHide = false;
        let finish = await this.loadPrefab();
        if (finish) {
            this._node.removeFromParent();
            Manager.uiManager.addChild(this._node,ViewZOrder.UILoading);
            this._node.position = Vec3.ZERO;
            this.content = find("content", this._node) as Node;
            Tween.stopAllByTarget(this.contentOpacity);
            this.text = find("text", this.content)?.getComponent(Label) as Label;
            this.text.string = "0%";
            this.contentOpacity.opacity = 0;
            if ( this.delay > 0 ){
                tween(this.contentOpacity).delay(this.delay).set({ opacity: 255 }).start();
            }
            //第一次在预置体没加载好就被隐藏
            if (this._isWaitingHide) {
                // cc.error(`sssssssss`);
                this._isWaitingHide = false;
                this._node.active = false;
                return;
            }
            this.startTimeOutTimer(Config.LOAD_VIEW_TIME_OUT);
            this._node.active = true;
        }
    }


    /**@description 开始计时回调 */
    private startTimeOutTimer(timeout: number) {
        this.stopTimeOutTimer();
        if (timeout) {
            this._timerId = setTimeout(() => {
                Manager.tips.show(`加载界面${this._uiName ? this._uiName : ""}超时，请重试`);
                this.hide();
                this._isWaitingHide = false;
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    private stopTimeOutTimer() {
        clearTimeout(this._timerId);
        this._timerId = -1;
    }

    /**
     * @description 加载
     * @param completeCb 
     */
    private async loadPrefab() {
        return new Promise<boolean>((resolove, reject) => {
            //正在加载中
            if (this._isLoadingPrefab) {
                warn(`正在加载Loading预置体`);
                this.finishLoadCb = resolove;
                return;
            }
            if (this._node) {
                if (this.finishLoadCb) {
                    this.finishLoadCb(true);
                    this.finishLoadCb = null;
                }
                resolove(true);
                return;
            }
            this._isLoadingPrefab = true;
            Manager.assetManager.load(
                BUNDLE_RESOURCES, 
                Config.CommonPrefabs.uiLoading,
                Prefab,
                (finish, total, item)=>{},
                (data) => {
                this._isLoadingPrefab = false;
                if (data && data.data && data.data instanceof Prefab) {
                    Manager.assetManager.addPersistAsset(Config.CommonPrefabs.uiLoading,data.data,BUNDLE_RESOURCES);
                    this._node = instantiate(data.data);
                    if (this.finishLoadCb) {
                        this.finishLoadCb(true);
                        this.finishLoadCb = null;
                    }
                    resolove(true);
                }
                else {
                    if (this.finishLoadCb) {
                        this.finishLoadCb(false);
                        this.finishLoadCb = null;
                    }
                    resolove(false);
                }
            });
        });
    }

    public hide() {
        this.stopTimeOutTimer();
        if (this._node) {
            Tween.stopAllByTarget(this.content);
            this._isWaitingHide = true;
            this._node.active = false;
        } else {
            //没有加载好预置体，置一个标记
            this._isWaitingHide = true;
        }
    }

    public updateProgress(progress: number) {
        if (this.text) {
            if (progress == undefined || progress == null || Number.isNaN(progress)) {
                this.hide();
                return;
            }
            if (progress >= 0 && progress <= 100) {
                this.text.string = `${progress}%`;
            }
        }
    }
}
