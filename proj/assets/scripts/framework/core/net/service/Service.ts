import { DEBUG } from "cc/env";
import { Macro } from "../../../defines/Macros";
import { Codec, IMessage, Message } from "../message/Message";
import { Net } from "../Net";
import { ServerConnector } from "../socket/ServerConnector";
import { Process } from "./Process";


/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */


export abstract class Service extends ServerConnector implements IService {
    /**@description Service所属模块，如Lobby,game */
    static module: string = Macro.UNKNOWN;
    /**@description 该字段由ServiceManager指定 */
    module = Macro.UNKNOWN;

    /**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连 */
    abstract maxEnterBackgroundTime : number;
    /**@description 连接服务器 */
    abstract connect(): void;

    /**
     * @description 发送心跳
     */
    protected abstract sendHeartbeat():void ;
    /**
     * @description 是否为心跳消息
     */
    protected abstract isHeartBeat(data: IMessage): boolean;

    /**@description 进入后台网络处理 */
    abstract onEnterBackground() : void;

    /**
     * @description 进入前台网络处理
     * @param inBackgroundTime 进入后面总时间
     **/
    abstract onEnterForgeground(inBackgroundTime: number) : void;

    /**@description 网络重连 */
    reconnectHandler: ReconnectHandler | null = null;

    private _Process: Process = new Process()
    public set Process(val: typeof Process) {
        if (val == null) { return }
        this._Process = new val;
        this._Process.serviceType = this.serviceType;
    }

    /**@description 数据流消息包头定义类型 */
    public set Codec(value: new () => Codec) { this._Process.Codec = value }
    // protected get messageHeader() { return this._messageHeader }

    private _Heartbeat: Net.HeartbeatClass<Message> = null!;
    /**@description 心跳的消息定义类型 */
    public get heartbeat(): Net.HeartbeatClass<Message> { return this._Heartbeat }
    public set heartbeat(value: Net.HeartbeatClass<Message>) { 
        this._Heartbeat = value;
        this.serviceType = value.type;
        this._Process.serviceType = value.type;
    }

    /**@description 值越大，优先级越高 */
    public priority: number = 0;

    serviceType : Net.ServiceType = Net.ServiceType.Unknown;

    protected onOpen(ev: Event) {
        super.onOpen(ev);
        Manager.serviceManager.onOpen(ev,this);
    }

    protected onClose(ev: Event) {
        super.onClose(ev);
        Manager.serviceManager.onClose(ev,this);
    }
    protected onError(ev: Event) {
        super.onError(ev);
        Manager.serviceManager.onError(ev,this);
    }

    protected onMessage(data: MessageEvent) {
        this.recvHeartbeat();
        //先对包信进行解析
        let header = new this._Process.Codec;
        if (!header.unPack(data)) {
            Log.e(`decode header error`);
            return;
        }
        
        if (this.isHeartBeat(header)) {
            //心跳消息，路过处理，应该不会有人注册心跳吧
            this.onRecvHeartBeat();
            return;
        }
        super.onMessage(data);
        this._Process.onMessage(header)
    }

    /**@description 收到心跳 */
    protected onRecvHeartBeat(){

    }

    /**
  * @description 添加服务器数据监听
  * @param handleType 处理类型，指你用哪一个类来进行解析数据
  * @param handleFunc 处理回调
  * @param isQueue 是否进入消息队列
  */
    public addListener(cmd: string, handleType: any, handleFunc: Function, isQueue: boolean, target: any) {
        this._Process.addListener(cmd, handleType, handleFunc as any, isQueue, target)
    }

    public removeListeners(target: any, eventName?: string) {
        this._Process.removeListeners(target, eventName)
    }

    protected addMessageQueue(key: string, data: any, encode: boolean = false) {
        this._Process.addMessageQueue(key, data, encode)
    }

    /**
     * @description 暂停消息队列消息处理
     */
    public pauseMessageQueue() { this._Process.isPause = true }

    /**
     * @description 恢复消息队列消息处理
     */
    public resumeMessageQueue() { this._Process.isPause = false }

    public handMessage() { this._Process.handMessage() }


    /**
     * @description 重置
     */
    public reset() { this._Process.reset() }

    public close(isEnd: boolean = false) {
        //清空消息处理队列
        this._Process.close()
        //不能恢复这个队列，可能在重新连接网络时，如游戏的Logic层暂停掉了处理队列去加载资源，期望加载完成资源后再恢复队列的处理
        //this.resumeMessageQueue();
        super.close(isEnd);
    }


    public send(msg: Message) {
        if (this._Process.Codec) {
            if (msg.encode()) {
                let header = new this._Process.Codec
                header.pack(msg)
                if (this.isHeartBeat(msg)) {
                    if (DEBUG) Log.d(`send request cmd : ${msg.cmd} `);
                } else {
                    Log.d(`send request main cmd : ${msg.cmd} `);
                }
                this.sendBuffer(header.buffer);
            } else {
                Log.e(`encode error`);
            }
        } else { Log.e("请求指定数据包头处理类型") }

    }

    destory(){
        if ( this.reconnectHandler ){
            this.reconnectHandler.onDestroy();
        }
    }
}
