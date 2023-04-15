import EventComponent from "../../framework/componects/EventComponent";
import { inject } from "../../framework/defines/Decorators";
import { ViewZOrder } from "../config/Config";

class AlertDialog extends EventComponent {

    /**@description 关闭按钮 */
    @inject("close",cc.Node,"content")
    private _closeBtn: cc.Node = null;
    /**@description 显示内容 */
    @inject("content",cc.Node)
    private _content: cc.Node = null;
    /**@description 常规显示文字 */
    @inject("content",cc.Label,"content")
    private _textContent: cc.Label = null;
    /**@description 富文本显示文字 */
    @inject("richContent",cc.RichText,"content")
    private _richTextContent: cc.RichText = null;
    /**@description 标题 */
    @inject("title",cc.Label,"content")
    private _title: cc.Label = null;
    /**@description 确定按钮 */
    @inject("confirm",cc.Node,"content")
    private _confirm: cc.Node = null;
    /**@description 取消按钮 */
    @inject("cancel",cc.Node,"content")
    private _cancel: cc.Node = null;
    /**@description 配置信息 */
    private _config: AlertConfig = null;

    public get config() {
        return this._config;
    }

    public show(config: AlertConfig) {
        if (!config.title) {
            config.title = App.getLanguage("alert_title");
        }
        if (!config.confirmString) {
            config.confirmString = App.getLanguage("alert_confirm");
        }
        if (!config.cancelString) {
            config.cancelString = App.getLanguage("alert_cancel");
        }
        this._config = config;
        this.writeContent(config)
        this.showButton(config);
        this._show();
    }

    private _show() {
        if (this._content) {
            cc.tween(this._content)
                .set({ scale: 0.2 })
                .to(0.2, { scale: 1.1 })
                .delay(0.05)
                .to(0.1, { scale: 1.0 })
                .start();
        }
    }

    /**@description 写入提示文字 */
    private writeContent(config: AlertConfig) {
        //写内容,
        if (config.richText) {
            this._textContent.node.active = false;
            this._richTextContent.node.active = true;
            this._richTextContent.string = config.richText;
        }
        else {
            this._textContent.node.active = true;
            this._richTextContent.node.active = false;
            if (config.text) {
                this._textContent.string = config.text;
            } else {
                Log.e("请指定提示内容");
                this._textContent.string = "";
            }

        }
        //写标题
        if (config.title) {
            this._title.string = config.title;
        }

        //写按钮
        if (config.confirmString) {
            let title = cc.find("Background/Label", this._confirm);
            if (title) {
                title.getComponent(cc.Label).string = config.confirmString;
            }
        }

        if (config.cancelString) {
            let title = cc.find("Background/Label", this._cancel);
            if (title) {
                title.getComponent(cc.Label).string = config.cancelString;
            }
        }
    }

    /**@description 显示按钮 */
    private showButton(config: AlertConfig) {
        if (this._confirm && this._cancel && this._closeBtn) {

            //关闭按钮
            this.onN(this._closeBtn,cc.Node.EventType.TOUCH_END, this.close.bind(this));

            //确定按钮
            if (config.confirmCb) {
                this._confirm.active = true;
                this.onN(this._confirm,cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, true));
                this.onN(this._closeBtn,cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, false));
            }
            else {
                this._confirm.active = false;
            }

            //取消按钮
            if (config.cancelCb) {
                this._cancel.active = true;
                this.onN(this._cancel,cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.cancelCb, false));
            } else {
                this._cancel.active = false;
            }

            if (this._confirm.active) {
                //确定按钮有显示
                if (this._cancel.active) {
                    //两个按钮都显示，
                } else {
                    //只有显示确定
                    this._confirm.x = 0;
                }
            } else {
                //确定按钮没有显示
                if (this._cancel.active) {
                    //只有一个取消按钮
                    this._cancel.x = 0;
                } else {
                    //无按钮显示，输入警告
                    Log.w("提示框无按钮显示");
                }
            }

        }
    }

    /**@description 关闭 */
    private close() {
        this._close(null);
    }
    private _close(complete: () => void) {
        if (cc.isValid(this._content)) {
            cc.Tween.stopAllByTarget(this._content);
            cc.tween(this._content)
                .to(0.2, { scale: 1.15 })
                .to(0.1, { scale: 0.3 })
                .call(() => {
                    App.alert.finishAlert();
                    if (complete) complete();
                })
                .start();
        }
    }

    private onClick(cb: (isOk: boolean) => void, isOk: boolean) {
        if (this._config.immediatelyCallback) {
            if (cb) cb(isOk);
            this._close(null);
        } else {
            this._close(() => {
                if (cb) cb(isOk);
            });
        }
    }
}

export default class Alert implements ISingleton{
    static module: string = "【Alert】";
    module: string = null!;
    isResident = true;
    private curPanel: cc.Node = null;
    private queue: AlertConfig[] = [];

    private get prefab(){
        return App.uiManager.getScenePrefab("Alert");
    }

    private getConfig(config: AlertConfig) {
        let result: AlertConfig = {};
        if (config.tag) {
            result.tag = config.tag;
        }
        if (config.text) {
            result.text = config.text;
        }
        if (config.title) {
            result.title = config.title;
        }
        if (config.confirmString) {
            result.confirmString = config.confirmString;
        }
        if (config.cancelString) {
            result.cancelString = config.cancelString;
        }
        if (config.richText) {
            result.richText = config.richText;
        }
        if (config.immediatelyCallback) {
            result.immediatelyCallback = config.immediatelyCallback;
        }
        if (config.isRepeat) {
            result.isRepeat = config.isRepeat;
        }
        return result;
    }
    /**
     * @description 显示弹出框
     * @param config 配置信息
     */
    public show(config: AlertConfig) {
        if (config.tag && config.isRepeat === false) {
            if (this.isRepeat(config.tag)) {
                Log.w(`弹出框已经存在 config : ${JSON.stringify(this.getConfig(config))}`);
                return false;
            }
        }
        this.queue.push(config);
        this._show(config);
        return true;
    }

    /**@description 当前显示的弹出框是否是tag */
    public isCurrentShow(tag: string | number) {
        if (this.curPanel) {
            let current = this.curPanel.getComponent(AlertDialog).config;
            if (current.tag == tag) {
                return true;
            }
        }
        return false;
    }

    /**@description 获取当前显示弹出的配置 */
    public currentShow(tag?: string | number) {
        if (this.curPanel) {
            let current = this.curPanel.getComponent(AlertDialog).config;
            if (tag) {
                if (current.tag == tag) {
                    return current;
                }
            } else {
                return current;
            }
        }
        return null;
    }

    /**@description 是否有该类型的弹出框 */
    public isRepeat(tag: string | number) {
        if (this.curPanel) {
            let current = this.curPanel.getComponent(AlertDialog).config;
            if (current.tag == tag) {
                Log.w(`重复的弹出框 config ; ${JSON.stringify(this.getConfig(current))}`)
                return true;
            }
        } else {
            for (let i = 0; i < this.queue.length; i++) {
                let data = this.queue[i];
                if (data.tag == tag) {
                    Log.w(`重复的弹出框 config ; ${JSON.stringify(this.getConfig(data))}`)
                    return true;
                }
            }
        }
        return false;
    }

    /**@description 关闭当前显示的 
     * @param tag 可不传，关闭当前的弹出框，否则关闭指定tag的弹出框
     */
    public close(tag?: string | number) {
        if (tag) {
            let j = this.queue.length;
            while (j--) {
                if (this.queue[j].tag == tag) {
                    this.queue.splice(j, 1);
                }
            }
            if (this.curPanel) {
                let current = this.curPanel.getComponent(AlertDialog).config;
                if (current.tag == tag) {
                    this.finishAlert();
                }
            }
        } else {
            this.finishAlert();
        }
    }

    public closeAll() {
        this.queue = [];
        this.finishAlert();
    }

    public finishAlert() {
        if (this.curPanel) {
            this.curPanel.destroy()
            this.curPanel = null;
        }

        let config = this.queue.shift();
        if (this.queue.length != 0) {
            this._show(this.queue[0]);
            return this.queue[0];
        }
        return config;
    }

    private _show(config: AlertConfig) {
        if (!this.curPanel) {
            this.curPanel = cc.instantiate(this.prefab);
            let dialog = this.curPanel.addComponent(AlertDialog);
            App.uiManager.addView(this.curPanel, ViewZOrder.Alert)
            dialog.show(config);
        }
    }
}

