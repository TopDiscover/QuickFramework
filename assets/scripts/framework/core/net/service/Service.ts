import { Codec, Message } from "../message/Message";
import { Net } from "../Net";
import { ServerConnector } from "../socket/ServerConnector";
import { Process } from "./Process";


/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */


export abstract class Service extends ServerConnector {
    private _Process: Process = new Process()
    public set Process(val: typeof Process) {
        if (val == null) { return }
        this._Process = new val;
        this._Process.serviceType = this.serviceType;
    }

    /**@description 数据流消息包头定义类型 */
    public set Codec(value: new () => Codec) { this._Process.Codec = value }
    // protected get messageHeader() { return this._messageHeader }

    private _Heartbeat: Net.HeartbeatClass<Message> = null;
    /**@description 心跳的消息定义类型 */
    public get heartbeat(): Net.HeartbeatClass<Message> { return this._Heartbeat }
    public set heartbeat(value: Net.HeartbeatClass<Message>) { 
        this._Heartbeat = value;
        this.serviceType = value.type;
        this._Process.serviceType = value.type;
    }

    public serviceName = "CommonService";
    /**@description 值越大，优先级越高 */
    public priority: number = 0;

    private serviceType : Net.ServiceType = Net.ServiceType.Unknown;

    protected onOpen() {
        super.onOpen();
        dispatch(Net.NetEvent.ON_OPEN, { service: this, event: null });
    }

    protected onClose(ev: Event) {
        super.onClose(ev);
        dispatch(Net.NetEvent.ON_CLOSE, { service: this, event: ev });
    }
    protected onError(ev: Event) {
        super.onError(ev);
        dispatch(Net.NetEvent.ON_ERROR, { service: this, event: ev });
    }

    protected onMessage(data: Uint8Array) {

        //先对包信进行解析
        let header = new this._Process.Codec;
        if (!header.unPack(data)) {
            cc.error(`decode header error`);
            return;
        }
        super.onMessage(data);
        if (this.isHeartBeat(header)) {
            //心跳消息，路过处理，应该不会有人注册心跳吧
            return;
        }
        this._Process.onMessage(header)
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

    protected addMessageQueue(key: string, data: any, encode?: boolean) {
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
                    if (CC_DEBUG) cc.log(`send request cmd : ${msg.cmd} `);
                } else {
                    cc.log(`send request main cmd : ${msg.cmd} `);
                }
                this.sendBuffer(header.buffer);
            } else {
                cc.error(`encode error`);
            }
        } else { cc.error("请求指定数据包头处理类型") }

    }
}