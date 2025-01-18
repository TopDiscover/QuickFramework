/**
 * @description websocket代理
 */
export interface IWSProxyOptions {
    tag?: string;
    /**@description 连接成功 */
    onOpen?: (ev: Event) => void;
    /**@description 连接关闭 */
    onClose?: (ev: CloseEvent) => void;
    /**@description 连接错误 */
    onError?: (ev: Event) => void;
    /**@description 接收消息 */
    onMessage?: (data: MessageEvent) => void;
}

export const NORMAL_CLOSE_CODE = 1000;

export class WSProxy {

    /**@description 设置项 */
    options: IWSProxyOptions = null!;

    /**@description 等待发送的数据 */
    private waitSend: SocketBuffer[] = []

    /**@description 关闭回调 */
    private rsClose: () => void = null!
    private rsCloseTimeOut: number = -1

    /**@description 连接回调 */
    private rsOpen: (success: boolean) => void = null!
    private rsOpenTimeOut: number = -1
    onOpenCb: ((success: boolean) => void)[] = []

    /**@description websocket */
    protected _ws: WebSocket = null!;
    get ws() { return this._ws; }

    /**
     * @description 连接
     * @param url 连接地址
     * @param timeOut 连接超时时间 默认为10s
     * @param protocols 
     * @returns 
     */
    connect(url: string, timeOut: number = 10000, protocols?: string | string[]) {
        return new Promise<boolean>((resolve, reject) => {
            const protocol = url.indexOf("wss") == 0 ? "wss" : "ws";
            if (CC_JSB && protocol == "wss") {
                if (!App.wssCacertUrl) {
                    Log.e(`${this.options.tag}请先设置wss的证书url,Launch脚本中直接挂载证书`);
                }
                this._ws = new (<any>(WebSocket))(url, [], App.wssCacertUrl);
            } else {
                this._ws = new WebSocket(url, protocols);
            }
            this._ws.binaryType = "arraybuffer";
            this._ws.onopen = this.onOpen.bind(this);
            this._ws.onclose = this.onClose.bind(this);
            this._ws.onerror = this.onError.bind(this);
            this._ws.onmessage = this.onMessage.bind(this);

            this.rsOpen = resolve;
            this.rsOpenTimeOut = setTimeout(() => {
                try {
                    if (this.status != WebSocket.OPEN) {
                        CC_DEBUG && Log.w(`${this.options.tag}连接超时`);
                    }
                } catch (error) {
                    CC_DEBUG && Log.e(`${this.options.tag}WebSocket连接时发生错误:`, error);
                } finally {
                    this.doOpen(false);
                }
            }, timeOut);
        });
    }

    private doOpen(success: boolean) {
        if (this.rsOpen) {
            this.rsOpen(success);
        }
        this.rsOpen = null!;
        for (let i = 0; i < this.onOpenCb.length; i++) {
            this.onOpenCb[i](success);
        }
        this.onOpenCb = [];
        clearTimeout(this.rsOpenTimeOut);
    }

    private doClose() {
        if (this.rsClose) {
            this.rsClose();
        }
        this.rsClose = null!;
        this._ws = null!;
        this.waitSend = [];
        clearTimeout(this.rsCloseTimeOut);
    }

    protected onClose(ev: CloseEvent) {
        CC_DEBUG && Log.d(`${this.options.tag} WebSocket 连接关闭`);
        this.options.onClose?.(ev);
        this.doClose();
    }

    protected onOpen(ev: Event) {
        CC_DEBUG && Log.d(`${this.options.tag} WebSocket 连接成功`);
        this.options.onOpen?.(ev);
        this.doOpen(true);
        //发送等待的数据
        this.waitSend.forEach((data) => {
            this.ws.send(data);
        });
        this.waitSend = [];
    }

    protected onError(ev: Event) {
        CC_DEBUG && Log.e(`${this.options.tag} WebSocket 连接错误`);
        this.doOpen(false);
        this.doClose();
        this.options.onError?.(ev);
    }

    protected onMessage(ev: MessageEvent) {
        this.options.onMessage?.(ev);
    }

    get status() {
        return this.ws?.readyState;
    }

    close(reason?: string, code: number = NORMAL_CLOSE_CODE, closeTimeOut: number = 3000) {
        return new Promise<void>((resolve, reject) => {
            if (!this.ws) {
                resolve();
                this.doClose();
                CC_DEBUG && Log.w(this.options.tag, `关闭时，网络未连接`);
                return
            }
            if ( this.status == WebSocket.CLOSED ){
                resolve();
                this.doClose();
                CC_DEBUG && Log.w(this.options.tag, `关闭时，网络已经关闭`);
                return
            }
            if ( this.status != WebSocket.CLOSING ){
                this.ws.close(code, reason);
            }
            this.rsClose = resolve;
            this.rsCloseTimeOut = setTimeout(() => {
                try {
                    if (this.status != WebSocket.CLOSED) {
                        CC_DEBUG && Log.w(`${this.options.tag}关闭超时`);
                    }
                } catch (error) {
                    CC_DEBUG && Log.e(`${this.options.tag}WebSocket关闭时发生错误:`, error);
                } finally {
                    this.doClose();
                }
            }, closeTimeOut);
        })
    }

    send(data: SocketBuffer) {
        if (!this.ws || !data) {
            return;
        }
        if (this.status === WebSocket.OPEN) {
            this.ws.send(data);
        } else {
            if (this.status === WebSocket.CONNECTING) {
                this.waitSend.push(data);
                return;
            } else {
                //关闭或者正在关闭状态
                let content = this.status == WebSocket.CLOSING ? `网络正在关闭` : `网络已经关闭`;
                CC_DEBUG && Log.w(this.options.tag, `发送消息失败: ${content}`);
            }
        }
    }
}