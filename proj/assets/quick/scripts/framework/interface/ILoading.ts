/**
 * @description 加载动画
 */
export class ILoading implements ISingleton {
    static module: string = "【ILoading】";
    module: string = null!;
    isResident = true;

    /**@description 渲染层级 */
    protected get zOrder() {
        return 99;
    }

    /**@description Loading提示中切换显示内容的时间间隔 */
    protected get interval() {
        return 3;
    }

    /**@description 默认的超时时间（秒） */
    protected get timeout(){
        return 30;
    }

    /**@description 返回显示节点 Label */
    protected findText(): cc.Label {
        return null!
    }

    /**@description 当前loading节点 */
    protected node: cc.Node = null!;
    protected get prefab() {
        return App.uiManager.getScenePrefab("Loading")!;
    }
    protected _timeOutCb?: () => void;
    /**@description 显示超时回调 */
    public set timeOutCb(value) {
        this._timeOutCb = value;
    }
    public get timeOutCb() {
        return this._timeOutCb;
    }

    /**@description 显示的Loading提示内容 */
    protected _content: string[] = [];
    protected _showContentIndex = 0;

    /**@description 超时回调定时器id */
    protected _timerId: any = -1;

    /**@description 显示的提示 */
    protected text: cc.Label = null!;

    /**
     * @description 显示Loading
     * @param content 提示内容
     * @param timeOutCb 超时回调
     * @param timeout 显示超时时间
     */
    public show(content: string | string[], timeOutCb?: () => void, timeout ?:number) {
        this._timeOutCb = timeOutCb;
        if ( !timeout ){
            timeout = this.timeout;
        }
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
        if (!this.prefab) {
            return;
        }
        if (!this.node) {
            this.node = cc.instantiate(this.prefab);
        }
        this.node.removeFromParent();
        App.uiManager.addView(this.node, this.zOrder);
        this.node.position = cc.Vec3.ZERO;
        this.text = this.findText();
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
                .delay(this.interval)
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

    protected stopShowContent() {
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
        if (this.node) this.node.active = false;
    }

    /**@description 仅 UpdateLoading 有效 */
    public updateProgress(progress: number){

    }
}

