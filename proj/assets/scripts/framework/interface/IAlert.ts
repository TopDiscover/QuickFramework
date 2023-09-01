import { Node } from "cc";
/**
 * @description 公共提示弹出框基础接口，在Application中返回具体的实现类型
 */
export class IAlert implements ISingleton {
    static module: string = "【IAlert】";
    module: string = null!;
    isResident = true;

    protected curPanel: Node = null!;
    protected queue: AlertConfig[] = [];

    protected getConfig(config: AlertConfig) {
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
        return false;
    }

    /**@description 获取当前显示弹出的配置 */
    public currentShow(tag?: string | number): AlertConfig | null | undefined {
        return null
    }

    /**@description 是否有该类型的弹出框 */
    public isRepeat(tag: string | number) {
        return false;
    }

    /**@description 关闭当前显示的 
     * @param tag 可不传，关闭当前的弹出框，否则关闭指定tag的弹出框
     */
    public close(tag?: string | number) {
    }

    public closeAll() {
        this.queue = [];
        this.finishAlert();
    }

    public finishAlert() {
        if (this.curPanel) {
            this.curPanel.destroy();
            this.curPanel = null!;
        }

        let config = this.queue.shift();
        if (this.queue.length != 0) {
            this._show(this.queue[0]);
            return this.queue[0];
        }
        return config;
    }

    protected _show(config: AlertConfig) {

    }
}

