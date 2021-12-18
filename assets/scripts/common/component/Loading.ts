/**
 * @description 加载动画
 */

import { Config, ViewZOrder } from "../config/Config";

export default class Loading {
    protected static _instance: Loading = null!;
    public static Instance() { return this._instance || (this._instance = new Loading()); }
    /**@description 当前loading节点 */
    protected node: cc.Node = null!;
    /**@description 是否等待关闭 */
    protected _isWaitingHide = false;
    /**@description 是否正在加载预置 */
    protected _isLoadingPrefab = false;
    private _timeOutCb?: () => void;
    /**@description 显示超时回调 */
    public set timeOutCb(value) {
        this._timeOutCb = value;
    }
    public get timeOutCb() {
        return this._timeOutCb;
    }

    /**@description 显示的Loading提示内容 */
    protected _content: string[] = [];
    private _showContentIndex = 0;

    /**@description 超时回调定时器id */
    private _timerId: any = -1;

    /**@description 显示的提示 */
    protected text: cc.Label = null!;

    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    public show(content: string | string[], timeOutCb?: () => void, timeout = Config.LOADING_TIME_OUT) {
        this._timeOutCb = timeOutCb;
        if (Array.isArray(content)) {
            this._content = content;
        } else {
            this._content = [];
            this._content.push(content);
        }
        this._show(timeout);
        return this;
    }

    protected _show(timeout: number) {
        if ( !this.node ){
            this.node = cc.instantiate(Manager.uiManager.getScenePrefab("Loading"));
        }
        this.node.removeFromParent();
        Manager.uiManager.addView(this.node, ViewZOrder.Loading);
        this.node.position = cc.Vec3.ZERO;
        this.text = cc.find("content/text", this.node).getComponent(cc.Label);
        this._showContentIndex = 0;
        this.startShowContent();
        this.startTimeOutTimer(timeout);
        this.node.active = true;
    }

    protected startShowContent() {
        if (this._content.length == 1) {
            this.text.string = this._content[0];
        } else {
            this.stopShowContent();
            cc.tween(this.text.node)
                .call(() => {
                    this.text.string = this._content[this._showContentIndex];
                })
                .delay(Config.LOADING_CONTENT_CHANGE_INTERVAL)
                .call(() => {
                    this._showContentIndex++;
                    if (this._showContentIndex >= this._content.length) {
                        this._showContentIndex = 0;
                    }
                    this.startShowContent();
                })
                .start();
        }
    }

    private stopShowContent() {
        if (this.text) {
            cc.Tween.stopAllByTarget(this.text.node);
        }
    }

    /**@description 开始计时回调 */
    protected startTimeOutTimer(timeout: number) {
        if (timeout > 0) {
            this._timerId = setTimeout(() => {
                this._timeOutCb && this._timeOutCb();
                this.hide();
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    protected stopTimeOutTimer() {
        this._timeOutCb = undefined;
        clearTimeout(this._timerId);
        this._timerId = -1;
    }

    public hide() {
        this.stopShowContent();
        this.stopTimeOutTimer();
        if (this.node) {
            this.node.active = false;
        }
    }
}
