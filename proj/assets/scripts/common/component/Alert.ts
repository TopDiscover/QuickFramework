import { find, input, Input, instantiate, isValid, Label, Node, RichText, tween, Vec3 } from "cc";
import EventComponent from "../../framework/componects/EventComponent";
import { inject } from "../../framework/defines/Decorators";
import { ViewZOrder } from "../config/Config";

class AlertDialog extends EventComponent {

    /**@description 关闭按钮 */
    @inject("close",Node,"content")
    private _closeBtn: Node = null!;
    /**@description 显示内容 */
    @inject("content",Node)
    private _content: Node = null!;
    /**@description 常规显示文字 */
    @inject("content",Label,"content")
    private _textContent: Label = null!;
    /**@description 富文本显示文字 */
    @inject("richContent",RichText,"content")
    private _richTextContent: RichText = null!;
    /**@description 标题 */
    @inject("title",Label,"content")
    private _title: Label = null!;
    /**@description 确定按钮 */
    @inject("confirm",Node,"content")
    private _confirm: Node = null!;
    /**@description 取消按钮 */
    @inject("cancel",Node,"content")
    private _cancel: Node = null!;
    /**@description 配置信息 */
    private _config: AlertConfig = null!;

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
            tween(this._content)
                .set({ scale: new Vec3(0.2, 0.2, 0.2) })
                .to(0.2, { scale: new Vec3(1.1, 1.1, 1.1) })
                .delay(0.05)
                .to(0.1, { scale: new Vec3(1.0, 1, 1) })
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
            let title = find("Label", this._confirm);
            if (title) {
                let lb = title.getComponent(Label);
                if (lb) lb.string = config.confirmString;
            }
        }

        if (config.cancelString) {
            let title = find("Label", this._cancel);
            if (title) {
                let lb = title.getComponent(Label);
                if (lb) lb.string = config.cancelString;
            }
        }
    }

    /**@description 显示按钮 */
    private showButton(config: AlertConfig) {
        if (this._confirm && this._cancel && this._closeBtn) {

            //关闭按钮
            this.onN(this._closeBtn,Input.EventType.TOUCH_END, this.close.bind(this));

            //确定按钮
            if (config.confirmCb) {
                this._confirm.active = true;
                this.onN(this._confirm,Input.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, true));
                this.onN(this._closeBtn,Input.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, false));
            }
            else {
                this._confirm.active = false;
            }

            //取消按钮
            if (config.cancelCb) {
                this._cancel.active = true;
                this.onN(this._cancel,Input.EventType.TOUCH_END, this.onClick.bind(this, config.cancelCb, false));
            } else {
                this._cancel.active = false;
            }

            if (this._confirm.active) {
                //确定按钮有显示
                if (this._cancel.active) {
                    //两个按钮都显示，
                } else {
                    //只有显示确定
                    this._confirm.setPosition(new Vec3(0, this._confirm.position.y, this._confirm.position.z));
                }
            } else {
                //确定按钮没有显示
                if (this._cancel.active) {
                    //只有一个取消按钮
                    this._confirm.setPosition(new Vec3(0, this._confirm.position.y, this._confirm.position.z));
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
    private _close(complete: (() => void) | null) {
        if (isValid(this._content)) {
            // this._content.stopAllActions();
            tween(this._content)
                .to(0.2, { scale: new Vec3(1.15, 1.15, 1.15) })
                .to(0.1, { scale: new Vec3(0.3, 0.3, 0.3) })
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
    private curPanel: Node = null!;
    private queue: AlertConfig[] = [];

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
            let current = this.curPanel.getComponent(AlertDialog)?.config;
            if (current && current.tag == tag) {
                return true;
            }
        }
        return false;
    }

    /**@description 获取当前显示弹出的配置 */
    public currentShow(tag?: string | number) {
        if (this.curPanel) {
            let current = this.curPanel.getComponent(AlertDialog)?.config;
            if (tag && current && current.tag == tag) {
                return current;
            } else {
                return current;
            }
        }
        return null;
    }

    /**@description 是否有该类型的弹出框 */
    public isRepeat(tag: string | number) {
        if (this.curPanel) {
            let current = this.curPanel.getComponent(AlertDialog)?.config;
            if (current && current.tag == tag) {
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
                let current = this.curPanel.getComponent(AlertDialog)?.config;
                if (current && current.tag == tag) {
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
            this.curPanel.destroy();
            this.curPanel = <any>null;
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
            this.curPanel = instantiate(App.uiManager.getScenePrefab("Alert") as Node);
            let dialog = this.curPanel.addComponent(AlertDialog);
            App.uiManager.addView(this.curPanel, ViewZOrder.Alert);
            dialog.show(config);
        }
    }
}

