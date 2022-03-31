/**
 * @description 加载动画
 */

import { Config, ViewZOrder } from "../config/Config";

export default class UILoading {
    private static _instance: UILoading = null;
    public static Instance() { return this._instance || (this._instance = new UILoading()); }
    /**@description 当前loading节点 */
    private node: cc.Node = null;
    private delay: number = null;
    private content: cc.Node = null;
    private text: cc.Label = null;
    private _uiName = null;

    /**
    * @description 显示全屏幕加载动画
    * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
    */
    public show(delay?: number, name?: string) {
        if (delay == undefined || delay == null || delay < 0) {
            this.delay = Config.LOAD_VIEW_DELAY;
        } else {
            this.delay = delay;
        }
        this._uiName = name ? name : "";
        this._show();
    }
    private _timerId: any = -1;

    /**
     * @description 显示动画
     * @param timeOut 超时加载时间。默认10为加载界面失败
     * @param timeOutCb 超时回调
     */
    private _show() {
        if (!this.node){
            this.node = cc.instantiate(Manager.uiManager.getScenePrefab("UILoading"));
        }
        this.node.removeFromParent();
        Manager.uiManager.addView(this.node, ViewZOrder.UILoading);
        this.node.position = cc.Vec3.ZERO;
        this.content = cc.find("content", this.node);
        cc.Tween.stopAllByTarget(this.content);
        this.text = cc.find("text", this.content).getComponent(cc.Label);
        this.text.string = "0%";
        this.content.opacity = 0;
        if (this.delay > 0) {
            cc.tween(this.content).delay(this.delay).set({ opacity: 255 }).start();
        }
        this.startTimeOutTimer(Config.LOAD_VIEW_TIME_OUT);
        this.node.active = true;
    }


    /**@description 开始计时回调 */
    private startTimeOutTimer(timeout: number) {
        this.stopTimeOutTimer();
        if (timeout) {
            this._timerId = setTimeout(() => {
                Manager.tips.show(`加载界面${this._uiName ? this._uiName : ""}超时，请重试`);
                this.hide();
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    private stopTimeOutTimer() {
        clearTimeout(this._timerId);
        this._timerId = -1;
    }

    public hide() {
        this.stopTimeOutTimer();
        if (this.node) {
            cc.Tween.stopAllByTarget(this.content);
            this.node.active = false;
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
