import WebSocketClinet from "./WebSocketClient";
import { IMessage } from "./Message";

/**
 * @description 服务器连接器
 */

export class ServerConnector {

    /**
     * @description websocket实例由外部设置方可使用
     */
    private _wsClient: WebSocketClinet = null;

    constructor() {
        this._wsClient = new WebSocketClinet();
        this._wsClient.onClose = this.onClose.bind(this);
        this._wsClient.onError = this.onError.bind(this);
        this._wsClient.onMessage = this.onMessage.bind(this);
        this._wsClient.onOpen = this.onOpen.bind(this);
    }

    /**
     * @description 发送心跳
     */
    protected sendHeartbeat() {
        if (CC_DEBUG) cc.error(`请重写sendHeartbeat`);
    }

    /**
     * @description 获取最大心跳超时的次数
     */
    protected getMaxHeartbeatTimeOut(): number {
        //默认给5次
        return 5;
    }

    /**@description 心跳发送间隔，默认为5秒 */
    protected getHeartbeatInterval(): number {
        return 5000;
    }

    /**
     * @description 心跳超时
     */
    protected onHeartbeatTimeOut() {
        //do noting
    }

    /**
     * @description 是否为心跳消息
     */
    protected isHeartBeat(data: IMessage): boolean {
        return false;
    }

    /**
     * @description 网络打开
     */
    protected onOpen() {
        this._curRecvHartTimeOutCount = 0;
        this.stopSendHartSchedule();
        this.sendHeartbeat();
        this.startSendHartSchedule();
    }

    /**
     * @description 网络关闭
     */
    protected onClose(ev: Event) {
        //停止心跳发送，已经没有意义
        this.stopSendHartSchedule();
    }

    /**
     * @description 网络错误
     */
    protected onError(ev: Event) {
        //网络连接出错误，停止心跳发送
        this.stopSendHartSchedule();
    }

    /**
     * @description 收到网络消息
     */
    protected onMessage(data: Uint8Array) {
        this.recvHeartbeat();
    }

    /**
     * @description 收到心跳
     */
    protected recvHeartbeat() {
        this._curRecvHartTimeOutCount = 0;
    }

    private _sendHartId: any = -1; //发送心跳包的间隔id
    private _curRecvHartTimeOutCount: number = 0;//当前接收心跳超时的次数

    private _enabled = true;
    /**@description 是否启用 */
    public get enabled() {
        return this._enabled;
    }
    public set enabled(value: boolean) {
        this._enabled = value;
        if (value == false) {
            this.close();
        }
    }

    /**
     * @description 连接网络
     * @param ip 
     * @param port 
     * @param protocol 协议类型 ws / wss 
     */
    public connect(ip: string, port: number | string = null, protocol: WebSocketType = "wss") {
        if (!this.enabled) {
            if (CC_DEBUG) cc.warn(`请求先启用`)
            return;
        }
        if (port) {
            if (typeof port == "string" && port.length > 0) {
                this._wsClient && this._wsClient.initWebSocket(ip, port, protocol);
            } else if (typeof port == "number" && port > 0) {
                this._wsClient && this._wsClient.initWebSocket(ip, port.toString(), protocol);
            } else {
                this._wsClient && this._wsClient.initWebSocket(ip, null, protocol);
            }
        } else {
            this._wsClient && this._wsClient.initWebSocket(ip, null, protocol);
        }
    }

    /**
     * @description 清除定时发送心跳的定时器id
     */
    private stopSendHartSchedule() {
        if (this._sendHartId != -1) {
            clearInterval(this._sendHartId);
            this._sendHartId = -1;
        }
    }

    /**
     * @description 启动心跳发送
     */
    private startSendHartSchedule() {
        let self = this;
        this._sendHartId = setInterval(() => {
            self._curRecvHartTimeOutCount = self._curRecvHartTimeOutCount + 1;
            if (self._curRecvHartTimeOutCount > self.getMaxHeartbeatTimeOut()) {
                self.stopSendHartSchedule();
                self.onHeartbeatTimeOut();
                return;
            }
            self.sendHeartbeat();
        }, self.getHeartbeatInterval());

    }

    /**
     * @description 发送请求
     * @param msg 消息
     */
    protected sendBuffer(buffer: Uint8Array) {
        this._wsClient && this._wsClient.send(buffer);
    }

    public close(isEnd: boolean = false) {
        this.stopSendHartSchedule();
        this._wsClient && this._wsClient.close(isEnd);
    }

    /**@description 网络是否连接成功 */
    public get isConnected() {
        if (this._wsClient) {
            return this._wsClient.isConnected;
        }
        return false;
    }

}