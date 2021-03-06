import { Manager } from "../manager/Manager";
import { EventApi } from "../../framework/event/EventApi";
import { ViewZOrder, Config } from "../config/Config";
import { BUNDLE_RESOURCES, ResourceCacheData } from "../../framework/base/Defines";
import { i18n } from "../language/LanguageImpl";


/**@description 提示弹出框配置 */
interface AlertConfig {
    /**@description 用来标识弹出框，后面可指定tag进行关闭所有相同tag的弹出框 */
    tag?: string | number,
    /**@description 提示内容 richText只能二先1 */
    text?: string,
    /**@description 标题,默认为 : 温馨提示 */
    title?: string,
    /**@description 确定按钮文字 默认为 : 确定*/
    confirmString?: string,
    /**@description 取消按钮文字 默认为 : 取消*/
    cancelString?: string,
    /**@description 确定按钮回调 有回调则显示按钮，无回调则不显示*/
    confirmCb?: (isOK: boolean) => void,
    /**@description 取消按钮回调 有回调则显示按钮，无回调则不显示*/
    cancelCb?: (isOK: boolean) => void,
    /**@description 富文件显示内容 跟text只能二选1 */
    richText?: string,
    /**@description true 回调后在关闭弹出 false 关闭弹出框在回调 默认为 : false */
    immediatelyCallback?: boolean,
}

class AlertDialog extends cc.Component {

    /**@description 关闭按钮 */
    private _closeBtn: cc.Node = null;
    /**@description 显示内容 */
    private _content: cc.Node = null;
    /**@description 常规显示文字 */
    private _textContent: cc.Label = null;
    /**@description 富文本显示文字 */
    private _richTextContent: cc.RichText = null;
    /**@description 标题 */
    private _title: cc.Label = null;
    /**@description 确定按钮 */
    private _confirm: cc.Node = null;
    /**@description 取消按钮 */
    private _cancel: cc.Node = null;
    /**@description 配置信息 */
    private _config: AlertConfig = null;

    public get config() {
        return this._config;
    }
    onLoad() {
        this._content = cc.find("content", this.node);
        this._closeBtn = cc.find("close", this._content);
        this._title = cc.find("title", this._content).getComponent(cc.Label);
        this._textContent = cc.find("content", this._content).getComponent(cc.Label);
        this._richTextContent = cc.find("richContent", this._content).getComponent(cc.RichText);
        this._confirm = cc.find("confirm", this._content);
        this._cancel = cc.find("cancel", this._content);
    }

    public show(config: AlertConfig) {
        if (!config.title) {
            config.title = i18n.alert_title;
        }
        if (!config.confirmString) {
            config.confirmString = i18n.alert_confirm;
        }
        if (!config.cancelString) {
            config.cancelString = i18n.alert_cancel;
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
                cc.error("请指定提示内容");
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
            this._closeBtn.on(cc.Node.EventType.TOUCH_END, this.close.bind(this));

            //确定按钮
            if (config.confirmCb) {
                this._confirm.active = true;
                this._confirm.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, true));
                this._closeBtn.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.confirmCb, false));
            }
            else {
                this._confirm.active = false;
            }

            //取消按钮
            if (config.cancelCb) {
                this._cancel.active = true;
                this._cancel.on(cc.Node.EventType.TOUCH_END, this.onClick.bind(this, config.cancelCb, false));
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
                    cc.warn("提示框无按钮显示");
                }
            }

        }
    }

    /**@description 关闭 */
    private close() {
        this._close(null);
    }
    private _close(complete: () => void) {
        let selt = this;
        if (cc.isValid(this._content)) {
            cc.tween(this._content)
                .to(0.2, { scale: 1.15 })
                .to(0.1, { scale: 0.3 })
                .call(() => {
                    Manager.alert.finishAlert();
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

export default class Alert {

    private static _instance: Alert = null;
    public static Instance() { return this._instance || (this._instance = new Alert()); }

    private curPanel: cc.Node = null;
    private queue: AlertConfig[] = [];

    private prefab: cc.Prefab = null;

    constructor() {
        Manager.eventDispatcher.addEventListener(EventApi.AdaptScreenEvent, this.onAdaptScreen, this);
    }

    private _isLoadingPrefab = false;
    private finishLoadCb = null;
    public preLoadPrefab() {
        this.loadPrefab();
    }

    private onAdaptScreen() {
        Manager.resolutionHelper.fullScreenAdapt(this.curPanel);
    }

    /**
     * @description 显示弹出框
     * @param config 配置信息
     */
    public show(config: AlertConfig) {
        this.queue.push(config);
        this._show(config);
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
            this.curPanel.removeFromParent();
            this.curPanel = null;
        }

        let config = this.queue.shift();
        if (this.queue.length != 0) {
            this._show(this.queue[0]);
            return this.queue[0];
        }
        return config;
    }

    private async _show(config: AlertConfig) {
        let finish = await this.loadPrefab();
        if (finish) {
            if (!this.curPanel) {
                this.curPanel = cc.instantiate(this.prefab);
                Manager.resolutionHelper.fullScreenAdapt(this.curPanel);
                let dialog = this.curPanel.addComponent(AlertDialog);
                let canvas = Manager.uiManager.getCanvas();
                if (canvas) {
                    this.curPanel.parent = canvas;
                    this.curPanel.zIndex = ViewZOrder.Alert;
                    dialog.show(config);
                }
            }
        }
    }

    private async loadPrefab() {
        return new Promise<boolean>((resolve, reject) => {
            //正在加载中
            if (this._isLoadingPrefab) {
                this.finishLoadCb = resolve;
                return;
            }
            if (this.prefab) {
                if (this.finishLoadCb) {
                    this.finishLoadCb(true);
                    this.finishLoadCb = null;
                }
                resolve(true);
            }
            else {
                this._isLoadingPrefab = true;
                Manager.assetManager.load(
                    BUNDLE_RESOURCES,
                    Config.CommonPrefabs.alert,
                    cc.Prefab,
                    (finish: number, total: number, item: cc.AssetManager.RequestItem) => { },
                    (data: ResourceCacheData) => {
                        this._isLoadingPrefab = false;
                        if (data && data.data && data.data instanceof cc.Prefab) {
                            this.prefab = data.data;
                            if (this.finishLoadCb) {
                                this.finishLoadCb(true);
                                this.finishLoadCb = null;
                            }
                            resolve(true);
                        }
                        else {
                            if (this.finishLoadCb) {
                                this.finishLoadCb(false);
                                this.finishLoadCb = null;
                            }
                            resolve(false);
                        }
                    });
            }
        });
    }
}

