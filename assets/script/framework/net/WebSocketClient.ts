import { CustomNetEventType } from "../event/EventApi";

/**
 * @description websocket封装
 */
export default class WebSocketClinet {

    private _tag: string = "[WebSocketClinet]";
    private _ip: string = "";
    private _port: string = null;
    private _protocol : string = "wss";
    private _dataArr = [];
    /**@description 是否处于等待连接状态 */
    private _isWaitingConnect = false;

    /** 连接超时时间 默认为10*/
    private _conTimeOut: number = 10;
    public set connectTimeOut( value : number ){
        this._conTimeOut = value;
    }
    public get connectTimeOut( ) : number{
        return this._conTimeOut;
    }
    /** 发送超时设置 默认为10*/
    private _sendTimeOut: number = 10;
    public set sendTimeOut( value : number ){
        this._sendTimeOut = value;
    }
    public get sendTimeOut( ) : number{
        return this._sendTimeOut;
    }

    private _ws: WebSocket = null;

    private _onOpen : ( )=>void = null;
    public set onOpen( value : ()=> void){
        this._onOpen = value;
    }
    /**@description 网络连接成功 */
    public get onOpen( ){
        return this._onOpen;
    }

    private _onClose : (ev )=>void = null;
    public set onClose( value : (ev )=>void ){
        this._onClose = value;
    }
    /**@description 网络关闭 */
    public get onClose( ){
        return this._onClose;
    }

    private _onMessage : ({data : Uint8Array})=> void = null;
    public set onMessage( value : ({data : Uint8Array})=>void){
        this._onMessage = value;
    }
    /**@description 接收网络数据 */
    public get onMessage(){
        return this._onMessage;
    }

    private _onError : ( ev : Event )=>void = null;
    public set onError( value : (ev : Event)=>void ){
        this._onError = value;
    }
    /**@description 网络连接错误 */
    public get onError(){
        return this._onError;
    }

    private _closeEvent = null;

    private init(ip: string, port: string , protocol : string ) {
        this._ip = ip;
        this._port = port;
        this._protocol = protocol;
        this._dataArr = [];
        this._conTimeOut = 10;
        this._sendTimeOut = 10;
        this._closeEvent = null;
    }


    private connectWebSocket( ip : string , port: string , protocol : string ){
        this.init(ip, port,protocol);
        if (!this._ip ) return;
        let fullUrl = `${protocol}://${this._ip}`;
        if(this._port){
            fullUrl = fullUrl +`:${this._port}`;
        }
        if ( CC_DEBUG) cc.log(this._tag,`initWebSocket : ${fullUrl}`);


        if(CC_JSB && protocol == "wss"){
            let pemFileUrl = cc.url.raw("resources/cacert/cacert.pem");
            if(cc.loader.md5Pipe){
                pemFileUrl = cc.loader.md5Pipe.transformURL(pemFileUrl)
            }
            this._ws = new (<any>(WebSocket))(fullUrl,[],pemFileUrl);
        }else{
            this._ws = new WebSocket(fullUrl);
        }
        //cc.log(this._tag,`new websocket readyState : ${this._ws.readyState}`);
        this._ws.binaryType = "arraybuffer";

        //打开socket
        this._ws.onopen = this.__onConected.bind(this);

        //收消息
        this._ws.onmessage = this.__onMessage.bind(this);

        //socket关闭
        this._ws.onclose = this.__onClose.bind(this);

        //错误处理
        this._ws.onerror = this.__onError.bind(this);
    }

    /**
     * 
     * @param ip ip
     * @param port 端口
     */
    public initWebSocket(ip: string, port: string, protocol : string ) {
        if ( ip == undefined || ip == null || ip.length < 0 ){
            if ( CC_DEBUG ) cc.error(this._tag,`init websocket error ip : ${ip} port : ${port}`);
            return;
        }
        //先判断当前是否已经有连接
        if ( this._ws ){
            //cc.log(this._tag,`============initWebSocket111=================`);
            //已经有连接，查看现在的websocket状态
            if ( this._ws.readyState == WebSocket.CONNECTING ){
                //当前正在建立连接
                //查看当前连接中的地址是否跟要连接的相同
                if ( this._ip == ip && this._port == port ){
                    //cc.warn(this._tag,"socket正在连接中");
                    return;
                }
                else{
                    if ( CC_DEBUG ) cc.error(this._tag,`当前有正在连接的socket??`);
                }
            }else if ( this._ws.readyState == WebSocket.OPEN ){
                //当前连接已经打开
                if ( this._ip == ip && this._port == port ){
                    if ( CC_DEBUG ) cc.warn(this._tag,`当前连接已经是打开的，不重复连接`);
                }
                else{
                    if ( CC_DEBUG ) cc.error(this._tag,`当前已经存在连接，请先关闭${this._ip}:${this._port} 再连接 ${ip} : ${port}`);
                }
            }else if( this._ws.readyState == WebSocket.CLOSING ){
                //连接正在关闭，等连接关闭后在进行重新连接
                this._isWaitingConnect = true;
                this._ip = ip;
                this._port = port;
                if ( CC_DEBUG ) cc.warn(this._tag,`当前网络关闭连接中，关闭完成后重新连接`);
            }else{
                //连接处于关闭状态，直接创建新的连接
                this._ws = null;
                this.connectWebSocket(ip,port,protocol);
            }
        }else{
            //cc.log(this._tag,`============initWebSocket=================`);
            this.connectWebSocket(ip,port,protocol);
        }
        
    }

    private __onConected(event) {
        if ( this._ws ){
            if ( CC_DEBUG ) cc.log(this._tag,`onConected state : ${this._ws.readyState}`);
        }
        if ( this._dataArr.length > 0 ){
            for ( let i = 0 ; i < this._dataArr.length ; i++ ){
                this.sendBinary(this._dataArr[i]);
            }
            this._dataArr = [];
        }
        if ( this.onOpen ) this.onOpen();
    }

    private __onMessage(arraybuffer : MessageEvent ) {
        let dataArr = new Uint8Array(arraybuffer.data);
        if ( this.onMessage ) this.onMessage({data : dataArr});
    }

    private __onClose(event ) {

        this._ws = null;
        if ( this._closeEvent ){
            event = this._closeEvent;
            this._closeEvent = null;
        }

        if ( event ){
            if ( CC_DEBUG ) cc.log(this._tag,`onClose type : ${event.type}`);
        }
        else{
            if ( CC_DEBUG ) cc.log(this._tag,`onClose`);
        }

        //等待关闭后连接
        if ( this._isWaitingConnect ){
            if ( CC_DEBUG ) cc.log(this._tag,`收到连接关闭，有等待连接的网络，重连连接网络`);
            this._closeEvent = null;
            this.connectWebSocket(this._ip,this._port,this._protocol);
            this._isWaitingConnect = false;
        }else{
            if ( this.onClose ) this.onClose(event);
        }
    }

    private __onError(event : Event ) {
        if ( event ){
            if ( CC_DEBUG ) cc.error(this._tag,`onError`,event);
        }else{
            if ( CC_DEBUG ) cc.error(this._tag,`onError`);
        }
        if ( this.onError ) this.onError(event);
    }

    public sendBinary( buffer ){
        if ( !this._ws || !buffer ){
            return;
        }
        if ( this._ws.readyState === WebSocket.OPEN ){
            this._ws.send(buffer);
        }
        else{
            //放入发送队列
            
            //如果当前连接正在连接中
            if ( this._ws.readyState == WebSocket.CONNECTING ){
                this._dataArr.push(buffer);
            }
            else{
                //关闭或者正在关闭状态
                let content = this._ws.readyState == WebSocket.CLOSING ? `网络正在关闭` : `网络已经关闭`;
                if ( CC_DEBUG ) cc.warn(this._tag,`发送消息失败: ${content}`);
                //this._dataArr.push(buffer);
            }
        }
    }

    /**@description 关闭网络 */
    public close( ){
        if ( this._ws ){
            this._closeEvent = {type : CustomNetEventType.CLOSE};
            this._ws.close();
        }
        //清空发送
        this._dataArr = [];
        if ( CC_DEBUG ) cc.log(this._tag,`close websocket`);
    }
}
