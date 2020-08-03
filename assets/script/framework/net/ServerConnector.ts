import WebSocketClinet from "./WebSocketClient";

export class Message{
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd : number = 0;
    /**@description 消息数据主体 */
    data : any = null;
}

/**@description 服务器连接器代码*/
export interface ServerConnectorDelegate{
    /**@description 打包数据 */
    encode( data : Message) : any;
    /**@description 解析数据 */
    decode( data: Uint8Array ): Message;
    /**@description 发送心跳 */
    sendHeartbeat();
    /**@description 获取心跳超时的最大次数 */
    getMaxHeartbeatTimeOut():number;
    /**@description 心跳超时 */
    onHeartbeatTimeOut();
    /**@description 是否是心跳消息 */
    isHeartBeat( data : Message);
    /**@description 网络打开 */
    onOpen();
    /**@description 网络关闭 */
    onClose( ev : Event );
    /**@description 网络错误 */
    onError( ev : Event );
    /**@description 收到网络消息 */
    onMessage( msg : Message );
}

/**
 * @description 服务器连接器
 */

export class ServerConnector {

    /**
     * @description websocket实例由外部设置方可使用
     */
    private _wsClient: WebSocketClinet = null;

    private _delegate: ServerConnectorDelegate = null;
    /**@description 代理 */
    protected set delegate( value ){
        this._delegate = value;
    }
    protected get delegate( ){
        return this._delegate;
    }

    constructor(){
        this._wsClient = new WebSocketClinet();
        this._wsClient.onClose = this._onClose.bind(this);
        this._wsClient.onError = this._onError.bind(this);
        this._wsClient.onMessage = this._onMessage.bind(this);
        this._wsClient.onOpen = this._onOpen.bind(this);
    }

    private _sendHartId: number = -1; //发送心跳包的间隔id
    private _curRecvHartTimeOutCount: number = 0;//当前接收心跳超时的次数

    /**
     * @description 连接网络
     * @param ip 
     * @param port 
     * @param protocol 协议类型 ws / wss 
     */
    public connect(ip: string, port: number | string = null, protocol : string = "wss" ) {
        if ( port ){
            if ( typeof port == "string" && port.length > 0 ){
                this._wsClient && this._wsClient.initWebSocket(ip,port,protocol);
            }else if ( typeof port == "number" && port > 0 ){
                this._wsClient && this._wsClient.initWebSocket(ip,port.toString(),protocol);
            }else{
                this._wsClient && this._wsClient.initWebSocket(ip,null,protocol);
            }
        }else{
            this._wsClient && this._wsClient.initWebSocket(ip,null,protocol);
        }
    }

    /**
     * @description 连接网络成功
     */
    private _onOpen() {
        this._curRecvHartTimeOutCount = 0;
        this.stopSendHartSchedule();
        this.sendHeartbeat();
        this.startSendHartSchedule();
        this.delegate && this.delegate.onOpen();
    }

    private _onClose( ev ){
        //停止心跳发送，已经没有意义
        this.stopSendHartSchedule();
        this.delegate && this.delegate.onClose(ev);
    }

    private _onError( ev : Event ){
        //网络连接出错误，停止心跳发送
        this.stopSendHartSchedule();
        this.delegate && this.delegate.onError(ev);
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

    private _errorDelegate(){
        cc.error(`请指定ServerConnector的代理`);
    }

    /**
     * @description 启动心跳发送
     */
    private startSendHartSchedule() {
        let self = this;
        if ( this._delegate ){
            this._sendHartId = setInterval(() => {
                self._curRecvHartTimeOutCount = self._curRecvHartTimeOutCount + 1;
                if (self._curRecvHartTimeOutCount > self.delegate.getMaxHeartbeatTimeOut()) {
                    self.stopSendHartSchedule();
                    self.delegate.onHeartbeatTimeOut();
                    return;
                }
                self.sendHeartbeat();
            }, self.delegate.getMaxHeartbeatTimeOut());
        }else{
            this._errorDelegate();
        }
    }

    /**
     * @description 发送心跳
     */
    private sendHeartbeat() {
        this.delegate ? this.delegate.sendHeartbeat() : this._errorDelegate();
    }

    //收到心跳
    private recvHeartbeat() {
        this._curRecvHartTimeOutCount = 0;
    }

    /**
     * @description 收到网络请求
     * @param value 
     */
    private _onMessage(data: Uint8Array ) {
        if ( this.delegate ){
            let msg = this.delegate.decode(data);
            if ( msg ){
                this.recvHeartbeat();
                this.delegate.onMessage(msg);
            }else{
                if ( CC_DEBUG ) { cc.error(`网络数据解析错误`) };
            }
        }else{
            this._errorDelegate();
        }
    }

    /**
     * @description 发送请求
     * @param msg 消息
     */
    public sendRequest(msg : Message) {
        if ( this.delegate ){
            let buf = this.delegate.encode(msg);
            if ( buf ){
                if ( this.delegate.isHeartBeat(msg) ){
                    if ( CC_DEBUG) cc.log(`send request main cmd : ${msg.mainCmd} , sub cmd : ${msg.subCmd} buffer length : ${buf.length}`);
                }else{
                    cc.log(`send request main cmd : ${msg.mainCmd} , sub cmd : ${msg.subCmd} buffer length : ${buf.length}`);
                }
                this._wsClient && this._wsClient.sendBinary(buf);
            }else{
                cc.error(`encode message error ! mainCmd : ${ msg.mainCmd} subCmd : ${msg.subCmd}`);
            }
            
        }else{
            this._errorDelegate();
        }
    }

    public close(){
        this.stopSendHartSchedule();
        this._wsClient && this._wsClient.close();
    }

}