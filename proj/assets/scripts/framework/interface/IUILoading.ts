import { _decorator, Component, find, instantiate, Label, Node, tween, Tween, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

export class IUILoading implements ISingleton {
    static module: string = "【IUILoading】";
    module: string = null!;
    isResident = true;

    /**@description 当前loading节点 */
    protected node: Node = null!;
    protected get prefab() {
        return App.uiManager.getScenePrefab("UILoading")!;
    }
    protected delay: number = 0;
    protected content: Node = null!;
    protected text: Label = null!;
    protected _uiName: string = null!;

    /**@description 显示节点的透明度 */
    protected _contentOpacity: UIOpacity = null!;

    protected get contentOpacity() {
        if (this._contentOpacity) {
            return this._contentOpacity;
        }
        return this.content.getComponent(UIOpacity) as UIOpacity;
    }

    /**@description 默认延迟显示时间 */
    protected get delayTime() {
        return 0.1;
    }

    /**@description 加载界面超时时间,如果在LOAD_VIEW_TIME_OUT秒未加载出，提示玩家加载界面超时,默认20秒 */
    protected get timeout() {
        return 20;
    }

    /**@description 渲染层级 */
    protected get zOrder() {
        return 99;
    }

    /**@description 查找内容节点 */
    protected findContent() {
        return find("content", this.node)!;
    }

    /**@description 查找显示组件 */
    protected findText() {
        return find("text", this.content)?.getComponent(Label)!;
    }

    /**
    * @description 显示全屏幕加载动画
    * @param delay 延迟显示时间 当为null时，不会显示loading进度，但会显示阻隔层 >0时为延迟显示的时间
    */
    public show(delay?: number, name?: string) {
        if (delay == undefined || delay == null || delay < 0) {
            this.delay = this.delayTime;
        } else {
            this.delay = delay;
        }
        this._uiName = name ? name : "";
        this._show();
    }
    protected _timerId: any = -1;

    /**
     * @description 显示动画
     * @param timeOut 超时加载时间。默认10为加载界面失败
     * @param timeOutCb 超时回调
     */
    protected _show() {
        if (!this.node) {
            this.node = instantiate(this.prefab)!;
        }
        this.node.removeFromParent();
        App.uiManager.addView(this.node, this.zOrder);
        this.node.position = Vec3.ZERO;
        this.content = this.findContent();
        Tween.stopAllByTarget(this.contentOpacity);
        this.text = this.findText();
        this.text.string = "0%";
        this.contentOpacity.opacity = 0;
        if (this.delay > 0) {
            tween(this.contentOpacity).delay(this.delay).set({ opacity: 255 }).start();
        }
        this.startTimeOutTimer(this.timeout);
        this.node.active = true;
    }


    /**@description 开始计时回调 */
    protected startTimeOutTimer(timeout: number) {
        this.stopTimeOutTimer();
        if (timeout) {
            this._timerId = setTimeout(() => {
                App.tips.show(`加载界面${this._uiName ? this._uiName : ""}超时，请重试`);
                this.hide();
            }, timeout * 1000);
        }
    }
    /**@description 停止计时 */
    protected stopTimeOutTimer() {
        clearTimeout(this._timerId);
        this._timerId = -1;
    }

    public hide() {
        this.stopTimeOutTimer();
        if (this.node) {
            Tween.stopAllByTarget(this.content);
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

