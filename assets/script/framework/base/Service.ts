import { ServerConnector } from "../net/ServerConnector";
import { EventApi } from "../event/EventApi";
import { makeKey } from "../decorator/Decorators";
import { Message, MessageHeader, IMessage } from "../net/Message";

/**
 * @description 与服务器之间消息收发基类,注册消息并转发
 */

/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */
export type MessageHandleFunc = (handleTypeData: any) => number;

export interface ProtoListenerData {
    mainCmd: number, // main cmd
    subCmd: number, //sub cmd
    func: MessageHandleFunc, //处理函数
    type: typeof Message, //解包类型
    isQueue: boolean,//是否进入消息队列，如果不是，收到网络消息返回，会立即回调处理函数
    data?: any, //解包后的数据
    target?: any, //处理者
}

export class Service extends ServerConnector {
    private _messageHeader : typeof MessageHeader = MessageHeader;
    /**@description 数据流消息包头定义类型 */
    public set messageHeader( value : typeof MessageHeader ){
        this._messageHeader = value;
    }
    private _Heartbeat : typeof Message = null;
    /**@description 心跳的消息定义类型 */
    public get heartbeat() : typeof Message{
        return this._Heartbeat;
    }
    public set heartbeat( value : typeof Message ){
        this._Heartbeat = value;
    }

    public serviceName = "CommonService";
    /**@description 值越大，优先级越高 */
    public priority : number = 0;

    /**
     * @description 发送心跳
     */
    protected sendHeartbeat() {
        super.sendHeartbeat();
    }
    /**
     * @description 获取最大心跳超时的次数
     */
    protected getMaxHeartbeatTimeOut(): number {
        return super.getMaxHeartbeatTimeOut();
    }
    /**
     * @description 心跳超时
     */
    protected onHeartbeatTimeOut() {
        super.onHeartbeatTimeOut();
    }
    /**
     * @description 是否为心跳消息
     */
    protected isHeartBeat(data: IMessage): boolean {
        return super.isHeartBeat(data);
    }
    protected onOpen() {
        super.onOpen();
        dispatch(EventApi.NetEvent.ON_OPEN,{service: this,event : null});
    }
    protected onClose(ev: Event) {
        super.onClose(ev);
        dispatch(EventApi.NetEvent.ON_CLOSE,{service: this,event : ev});
    }
    protected onError(ev: Event) {
        super.onError(ev);
        dispatch(EventApi.NetEvent.ON_ERROR,{service: this,event : ev});
    }
    protected onMessage(data: Uint8Array) {

        //先对包信进行解析
        let header = new this._messageHeader();
        if (!header.decode(data)) {
            cc.error(`decode header error`);
            return;
        }
        super.onMessage(data);
        if ( this.isHeartBeat(header) ){
            //心跳消息，路过处理，应该不会有人注册心跳吧
            return;
        }
        cc.log(`recv data main cmd : ${header.mainCmd} sub cmd : ${header.subCmd} buffer length : ${header.size}`);
        let key = makeKey(header.mainCmd, header.subCmd);

        if (!this._listeners[key]) {
            cc.warn(`no find listener data main cmd : ${header.mainCmd} sub cmd : ${header.subCmd}`);
            return;
        }
        if (this._listeners[key].length <= 0) {
            return;
        }
        let listenerDatas = this._listeners[key];
        let queueDatas = [];

        for (let i = 0; i < listenerDatas.length; i++) {
            //预先存储的解析类型 //同一个命令使用同一类类型
            let obj: Message = null;
            if (listenerDatas[i].type) {
                obj = new listenerDatas[i].type();
                //解包
                obj.decode(header.buffer);
            } else {
                //把数据放到里面，让后面使用都自己解析
                obj = header.buffer as any;
            }

            if (listenerDatas[i].isQueue) {
                //需要加入队列处理
                queueDatas.push(this.copyListenerData(listenerDatas[i], obj));
            }
            else {
                //不需要进入队列处理
                try {
                    listenerDatas[i].func && listenerDatas[i].func.call(listenerDatas[i].target, obj);
                } catch (error) {
                    cc.error(error);
                }

            }
        }

        if (queueDatas.length > 0) {
            this._masseageQueue.push(queueDatas);
        }
    }

    /** 监听集合*/
    private _listeners: { [key: string]: ProtoListenerData[] } = {};

    /** 消息处理队列 */
    private _masseageQueue: Array<ProtoListenerData[]> = new Array<ProtoListenerData[]>();

    /** 是否正在处理消息 ，消息队列处理消息有时间，如执行一个消息需要多少秒后才执行一下个*/
    private _isDoingMessage: boolean = false;

    /** @description 可能后面有其它特殊需要，特定情况下暂停消息队列的处理, true为停止消息队列处理 */
    private _isPause: boolean = false;

    /**
     * @description 暂停消息队列消息处理
     */
    public pauseMessageQueue() {
        this._isPause = true;
    }

    /**
     * @description 恢复消息队列消息处理
     */
    public resumeMessageQueue() {
        this._isPause = false;
    }

    /**
     * @description 添加服务器数据监听
     * @param mainCmd main command
     * @param subCmd sub command
     * @param handleType 处理类型，指你用哪一个类来进行解析数据
     * @param handleFunc 处理回调
     * @param isQueue 是否进入消息队列
     */
    public addListener(
        mainCmd: number,
        subCmd: number,
        handleType: any,
        handleFunc: MessageHandleFunc,
        isQueue: boolean,
        target: any) {
        let key = makeKey(mainCmd, subCmd);
        if (this._listeners[key]) {
            let hasSame = false;
            for (let i = 0; i < this._listeners[key].length; i++) {
                if (this._listeners[key][i].target === target) {
                    hasSame = true;
                    break;
                }
            }
            if (hasSame) {
                return;
            }
            this._listeners[key].push({
                mainCmd: mainCmd,
                subCmd: subCmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
        else {
            this._listeners[key] = [];
            this._listeners[key].push({
                mainCmd: mainCmd,
                subCmd: subCmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
    }

    public removeListeners(target: any, mainCmd?: number, subCmd?: number) {

        if (mainCmd && subCmd) {
            let self = this;
            Object.keys(this._listeners).forEach((value) => {
                let datas = self._listeners[value];
                let i = datas.length;
                while (i--) {
                    if (datas[i].target == target && datas[i].mainCmd == mainCmd && datas[i].subCmd == subCmd) {
                        datas.splice(i, 1);
                    }
                }
                if (datas.length == 0) {
                    delete self._listeners[value];
                }
            });

            //移除网络队列中已经存在的消息
            let i = this._masseageQueue.length;
            while (i--) {
                let datas = this._masseageQueue[i];
                let j = datas.length;
                while (j--) {
                    if (datas[j].target == target && datas[j].mainCmd == mainCmd && datas[j].subCmd == subCmd) {
                        datas.splice(j, 1);
                    }
                }
                if (datas.length == 0) {
                    this._masseageQueue.splice(i, 1);
                }
            }

        } else {
            let self = this;
            Object.keys(this._listeners).forEach((value: string, index: number, arr: string[]) => {
                let datas = self._listeners[value];

                let i = datas.length;
                while (i--) {
                    if (datas[i].target == target) {
                        datas.splice(i, 1);
                    }
                }

                if (datas.length == 0) {
                    delete self._listeners[value];
                }
            })

            //移除网络队列中已经存在的消息
            let i = this._masseageQueue.length;
            while (i--) {
                let datas = this._masseageQueue[i];
                let j = datas.length;
                while (j--) {
                    if (datas[j].target == target) {
                        datas.splice(j, 1);
                    }
                }
                if (datas.length == 0) {
                    this._masseageQueue.splice(i, 1);
                }
            }
        }
    }

    /**
     * @description 发送请求
     * @param msg msg
     */
    public send(msg: Message) {
        //发送请求数据
        if( this._messageHeader ){
            if( msg.encode() ){
                let header = new this._messageHeader();
                header.encode(msg);
                if (this.isHeartBeat(msg)) {
                    if (CC_DEBUG) cc.log(`send request main cmd : ${msg.mainCmd} , sub cmd : ${msg.subCmd} `);
                } else {
                    cc.log(`send request main cmd : ${msg.mainCmd} , sub cmd : ${msg.subCmd} `);
                }
                this.sendBuffer(header.buffer);
            }else{
                cc.error(`encode error`);
            }
           
        }else{
            cc.error("请求指定数据包头处理类型")
        }
    }

    /**
     * @description 复制proto协议监听数据
     * @param input 
     * @param data 
     */
    private copyListenerData(input: ProtoListenerData, data: any): ProtoListenerData {
        return {
            mainCmd: input.mainCmd,
            subCmd: input.subCmd,
            type: input.type,
            func: input.func,
            isQueue: input.isQueue,
            data: data,
            target: input.target
        };
    }

    /**
     * @description 消息队列处理，由框架调用
     */
    public handMessage() {

        //如果当前暂停了消息队列处理，不再处理消息队列
        if (this._isPause) return;

        //如果当前有函数正在处理
        if (this._isDoingMessage) return;
        //如果当前执行队列为空
        if (this._masseageQueue.length == 0) return;

        let datas = this._masseageQueue.shift();
        if (datas == undefined) return;
        if (datas.length == 0) return;

        this._isDoingMessage = true;
        let handleTime = 0;
        if (CC_DEBUG) cc.log("---handMessage---");
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            if (data.func instanceof Function) {
                try {
                    let tempTime = data.func.call(data.target, data.data);
                    if (typeof tempTime == "number") {
                        handleTime = Math.max(handleTime, tempTime);
                    }
                } catch (error) {
                    cc.error(error);
                }
            }
        }

        if (handleTime == 0) {
            //立即进行处理
            this._isDoingMessage = false;
        }
        else {
            Manager.uiManager.getCanvasComponent().scheduleOnce(() => {
                this._isDoingMessage = false;
            }, handleTime);
        }
    }

    /**
     * @description 重置
     */
    public reset() {
        this._isDoingMessage = false;
        this._listeners = {};
        this._masseageQueue = [];
        this.resumeMessageQueue();
    }

    public close( isEnd : boolean = false) {

        //清空消息处理队列
        this._masseageQueue = [];
        this._isDoingMessage = false;
        //不能恢复这个队列，可能在重新连接网络时，如游戏的Logic层暂停掉了处理队列去加载资源，期望加载完成资源后再恢复队列的处理
        //this.resumeMessageQueue();
        super.close(isEnd);
    }
}
