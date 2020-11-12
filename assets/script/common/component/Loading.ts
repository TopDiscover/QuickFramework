import { Manager } from "../manager/Manager";
import { EventApi } from "../../framework/event/EventApi";
import { ViewZOrder, Config } from "../config/Config";
import { BUNDLE_RESOURCES, ResourceCacheData } from "../../framework/base/Defines";
/**
 * @description 加载动画
 */

export default class Loading {
    private static _instance: Loading = null;
    public static Instance() { return this._instance || (this._instance = new Loading()); }
    /**@description 当前loading节点 */
    private _node: cc.Node = null;
    constructor() {
        Manager.eventDispatcher.addEventListener(EventApi.AdaptScreenEvent, this.onAdaptScreen, this);
    }
    private onAdaptScreen() {
        Manager.resolutionHelper.fullScreenAdapt(this._node);
    }
    /**@description 是否等待关闭 */
    private _isWaitingHide = false;
    /**@description 是否正在加载预置 */
    private _isLoadingPrefab = false;
    private _timeOutCb : ()=>void = null;
    /**@description 显示超时回调 */
    public set timeOutCb(value){
        this._timeOutCb = value;
    }
    public get timeOutCb(){
        return this._timeOutCb;
    }

    /**@description 超时回调定时器id */
    private _timerId:number = -1;

    public preLoadPrefab() {
        this.loadPrefab();
    }

    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    public show( content : string , timeOutCb?:()=>void,timeout = Config.LOADING_TIME_OUT ) {
        this._timeOutCb = timeOutCb;
        this._show(content,timeout);
        return this;
    }

    private async _show( content : string , timeout : number ) {
        this._isWaitingHide = false;
        let finish = await this.loadPrefab();
        if (finish) {
            Manager.resolutionHelper.fullScreenAdapt(this._node);
            this._node.removeFromParent();
            this._node.parent = Manager.uiManager.getCanvas();
            this._node.zIndex = ViewZOrder.Loading;
            this._node.position = cc.Vec3.ZERO;
            cc.find("content/text",this._node).getComponent(cc.Label).string = content;
            //第一次在预置体没加载好就被隐藏
            if (this._isWaitingHide) {
                // cc.error(`sssssssss`);
                this._isWaitingHide = false;
                this._node.active = false;
                return;
            }
            this.startTimeOutTimer(timeout);
            this._node.active = true;
        }
    }


    /**@description 开始计时回调 */
    private startTimeOutTimer(timeout: number) {
        if (timeout > 0) {
            this._timerId = setTimeout(() => {
                this._timeOutCb && this._timeOutCb();
                this.hide();
                this._isWaitingHide = false;
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    private stopTimeOutTimer( ) {
        this._timeOutCb = null;
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
                cc.warn(`正在加载Loading预置体`);
                return;
            }
            if (this._node) {
                resolove(true);
                return;
            }
            this._isLoadingPrefab = true;
            Manager.assetManager.load(
                BUNDLE_RESOURCES, 
                Config.CommonPrefabs.loading,
                cc.Prefab,
                (finish: number, total: number, item: cc.AssetManager.RequestItem)=>{},
                (data: ResourceCacheData) => {
                this._isLoadingPrefab = false;
                if (data && data.data && data.data instanceof cc.Prefab) {
                    this._node = cc.instantiate(data.data);
                    resolove(true);
                }
                else {
                    resolove(false);
                }
            });
        });
    }

    public hide() {
        this.stopTimeOutTimer();
        if (this._node) {
            this._isWaitingHide = true;
            this._node.active = false;
        } else {
            //没有加载好预置体，置一个标记
            this._isWaitingHide = true;
        }
    }
}
