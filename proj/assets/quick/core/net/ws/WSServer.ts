
/**
 * @description WebSocket
 */

import { IWSProxyOptions, WSProxy } from "./WSProxy";

export interface IWSServerOptions extends IWSProxyOptions {
    /**@description 连接超时时间 默认为 10000ms */
    timeOut?: number;
    /**@description url */
    url: string;
    /**@description 协议 */
    protocols?: string | string[]
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
        if ( this.proxy ){
            this.proxy.options = this.options;
        }
    }

    private proxy: WSProxy = null!

    /**@description 网络是否连接成功 */
    get isConnected() { return this.proxy ? this.proxy.status == WebSocket.OPEN : false; }

    /**@description 启动服务器 */
    start() {
        if (this.proxy) {
            throw new Error(`连接已经存在`);
        }
        this.proxy = new WSProxy();
        return this.proxy.connect(this.options.url, this.options.timeOut);
    }

    /**@description 停止服务器 */
    async stop() {
        if ( this.proxy ){
            await this.proxy.close();
        }
        this.proxy = null;
    }

    send(data: SocketBuffer) {
        if ( this.proxy ) {
            this.proxy.send(data);
        }else{
            CC_DEBUG && Log.w(this.options.tag, `连接不存在`);
        }
    }
}