import { find ,instantiate,Label,Node, Prefab, tween, Vec3} from "cc";
/**
 * @description 加载动画
 */

export default class Loading {
    private static _instance: Loading = null!;
    public static Instance() { return this._instance || (this._instance = new Loading()); }
    /**@description 当前loading节点 */
    private _node: Node = null!;
    constructor() {
        Manager.eventDispatcher.addEventListener(td.Adaptor.ADAPT_SCREEN, this.onAdaptScreen, this);
    }
    private onAdaptScreen() {
        Manager.resolutionHelper.fullScreenAdapt(this._node);
    }
    /**@description 是否等待关闭 */
    private _isWaitingHide = false;
    /**@description 是否正在加载预置 */
    private _isLoadingPrefab = false;
    private _timeOutCb ?: ()=>void;
    /**@description 显示超时回调 */
    public set timeOutCb(value){
        this._timeOutCb = value;
    }
    public get timeOutCb(){
        return this._timeOutCb;
    }

    /**@description 显示的Loading提示内容 */
    private _content : string[] = [];
    private _showContentIndex = 0;

    /**@description 超时回调定时器id */
    private _timerId:number = -1;

    /**@description 显示的提示 */
    private _text : Label = null!;

    public preloadPrefab() {
        this.loadPrefab();
    }

    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    public show( content : string | string[] , timeOutCb?:()=>void,timeout = td.Config.LOADING_TIME_OUT ) {
        this._timeOutCb = timeOutCb;
        if( Array.isArray(content) ){
            this._content = content;
        }else{
            this._content = [];
            this._content.push(content);
        }
        this._show(timeout);
        return this;
    }

    private async _show( timeout : number ) {
        this._isWaitingHide = false;
        let finish = await this.loadPrefab();
        if (finish) {
            this._node.removeFromParent();
            Manager.uiManager.addChild(this._node,td.ViewZOrder.Loading);
            this._node.position = Vec3.ZERO;
            this._text = find("content/text",this._node)?.getComponent(Label) as Label;
            this._showContentIndex = 0;
            this.startShowContent();
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

    private startShowContent( ){
        if( this._content.length == 1 ){
            this._text.string = this._content[0];
        }else{
            // this._text.node.stopAllActions();
            tween(this._text.node)
            .call(()=>{
                this._text.string = this._content[this._showContentIndex];
            })
            .delay(td.Config.LOADING_CONTENT_CHANGE_INTERVAL)
            .call(()=>{
                this._showContentIndex ++;
                if( this._showContentIndex >= this._content.length ){
                    this._showContentIndex = 0;
                }
                this.startShowContent();
            })
            .start();
        }
    }

    private stopShowContent(){
        if( this._text ){
            // this._text.node.stopAllActions();
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
        this._timeOutCb = undefined;
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
                return;
            }
            if (this._node) {
                resolove(true);
                return;
            }
            this._isLoadingPrefab = true;
            Manager.assetManager.load(
                td.Macro.BUNDLE_RESOURCES, 
                td.Config.CommonPrefabs.loading,
                Prefab,
                (finish, total, item)=>{},
                (data) => {
                this._isLoadingPrefab = false;
                if (data && data.data && data.data instanceof Prefab) {
                    Manager.assetManager.addPersistAsset(td.Config.CommonPrefabs.loading,data.data,td.Macro.BUNDLE_RESOURCES)
                    this._node = instantiate(data.data);
                    resolove(true);
                }
                else {
                    resolove(false);
                }
            });
        });
    }

    public hide() {
        this.stopShowContent();
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
