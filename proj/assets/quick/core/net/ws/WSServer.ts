
/**
 * @description WebSocket 服务端
 */

import { IWSProxyOptions, WSProxy } from "./WSProxy";

export interface IWSServerOptionsBase {
    /**@description tag */
    tag?: string;
    /**@description 连接超时时间 默认为 10000ms */
    timeOut?: number;
    /**@description url */
    url: string;
    /**@description 协议 */
    protocols?: string | string[]
}

export interface IWSServerOptions extends IWSProxyOptions, IWSServerOptionsBase {

}

/**
 * @description WebSocket 服务端
 */
export class WSServer {

    private _options: IWSServerOptions = null!
    get options() {
        return this._options;
    }
    set options(v: IWSServerOptions) {
        this._options = v;
        this.options.timeOut = this.options.timeOut || 10000;
        if (this.proxy) {
            this.proxy.options = this.options;
        }
    }

    private proxy: WSProxy = null!

    /**@description 网络是否连接成功 */
    get isConnected() { return this.proxy ? this.proxy.status == WebSocket.OPEN : false; }

    /**@description 启动服务器 */
    async start() {
        if (this.proxy) {
            if (this.proxy.ws) {
                throw new Error(`${this.options.tag}连接已经存在`);
            }
        } else {
            this.proxy = new WSProxy();
        }
        this.proxy.options = this.options;
        const success = await this.proxy.connect(this.options.url, this.options.timeOut);
        if (!success) {
            await this.stop();
        }
        return success;
    }

    /**@description 停止服务器 */
    async stop() {
        if (this.proxy) {
            await this.proxy.close();
        }
        this.proxy = null;
    }

    send(data: SocketBuffer) {
        if (this.proxy) {
            this.proxy.send(data);
        } else {
            CC_DEBUG && Log.w(this.options.tag, `连接不存在`);
        }
    }
}