/**
 * @description WebSocket 消息处理管理器
 */

import { DEBUG } from "cc/env";
import { Net } from "../Net";

type MessageHandleFunc = (handleTypeData: any) => number;

export class WSMsgHandler {

    constructor(service: WSService) {
        this.service = service;
    }

    private service: WSService;

    /** 监听集合*/
    protected _listeners: { [key: string]: Net.ListenerData[] } = {};
    /** 消息处理队列 */
    protected _masseageQueue: Array<Net.ListenerData[]> = new Array<Net.ListenerData[]>();

    /** 是否正在处理消息，消息队列处理消息有时间，如执行一个消息需要多少秒后才执行一下个 */
    protected _isDoingMessage: boolean = false;

    /** @description 可能后面有其它特殊需要，特定情况下暂停消息队列的处理, true为停止消息队列处理 */
    public isPause: boolean = false;

    /** @description RPC消息队列 */
    protected _RPCQueue: Net.RPCData[] = [];

    /**
     * @description 添加RPC消息
     * @param data RPC消息
     */
    addRPC(data: Net.RPCData) {
        data.onTimeout = () => {
            this.removeRPC(data)
        };
        this._RPCQueue.push(data);
    }

    /**
     * @description 移除RPC消息
     * @param data RPC消息
     */
    removeRPC(data: Net.RPCData) {
        for (let i = 0; i < this._RPCQueue.length; i++) {
            if (this._RPCQueue[i] == data) {
                this._RPCQueue.splice(i, 1);
                break;
            }
        }
    }

    public update(dt: number) {

        //如果当前暂停了消息队列处理，不再处理消息队列
        if (this.isPause) return;

        //如果当前有函数正在处理
        if (this._isDoingMessage) return;
        //如果当前执行队列为空
        if (this._masseageQueue.length == 0) return;

        let datas = this._masseageQueue.shift();
        if (datas == undefined) return;
        if (datas.length == 0) return;

        this._isDoingMessage = true;
        let handleTime = 0;
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            if (data.func instanceof Function) {
                try {
                    let tempTime = data.func.call(data.target, data.data);
                    if (typeof tempTime == "number") {
                        handleTime = Math.max(handleTime, tempTime);
                    }
                } catch (err) {
                    Log.e(err);
                }
            }
        }

        if (handleTime == 0) {
            //立即进行处理
            this._isDoingMessage = false;
        }
        else {
            App.uiManager.mainController?.scheduleOnce(() => {
                this._isDoingMessage = false;
            }, handleTime);
        }
    }

    public onMessage(data: Message, tag?: string) {
        DEBUG && Log.d(`${tag} recv data main cmd : ${data.cmd}`);
        let key = String(data.cmd);
        if (!this._listeners[key]) {
            DEBUG && Log.w(`${tag} no find listener data main cmd : ${data.cmd}`);
            return;
        }
        if (this._listeners[key].length <= 0) {
            return;
        }

        this.addQueue(key, data, true)
    }

    /**
     * @description 销毁
     */
    public destroy() {
        this.stop();
        this._listeners = {};
    }

    public stop() {
        this._masseageQueue = [];
        // 一次回调完RPC消息
        for (let i = 0; i < this._RPCQueue.length; i++) {
            this._RPCQueue[i].resolve(null);
            this._RPCQueue[i].stop();
        }
        this._RPCQueue = [];
        this._isDoingMessage = false;
    }

    public onS(cmd: string, handleType: any, handleFunc: MessageHandleFunc, isQueue: boolean, target: any) {
        let key = cmd;

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
                cmd: cmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
        else {
            this._listeners[key] = [];
            this._listeners[key].push({
                cmd: cmd,
                func: handleFunc,
                type: handleType,
                isQueue: isQueue,
                target: target
            });
        }
    }

    public offS(target: any, cmd?: string) {
        if (cmd) {
            let self = this;
            Object.keys(this._listeners).forEach((value) => {
                let datas = self._listeners[value];
                let i = datas.length;
                while (i--) {
                    if (datas[i].target == target && datas[i].cmd == cmd) {
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
                    if (datas[j].target == target && datas[i].cmd == cmd) {
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

    private async decode(o: Net.ListenerData, header: Message, rpcData: Net.RPCData = null!): Promise<Message | null> {
        if (this.service.flows.decodeMessageFlow.nodes.length > 0) {
            
            let decodeData: Net.DecodeData = rpcData;
            if (!decodeData) {
                decodeData = o;
            }
            const result = await this.service.flows.decodeMessageFlow.exec({
                service: this.service,
                message: header,
                decodeData: decodeData,
                result: null
            });
            if (result) {
                return result.result
            }
            return null!;
        } else {
            DEBUG && Log.e(`${this.service.options.tag} decodeMessageFlow 未注册`);
            return null;
        }
    }

    private async addQueue(key: string, data: Message, encode: boolean) {
        if (this._listeners[key].length <= 0) { return }
        let listenerDatas = this._listeners[key];
        let queueDatas = [];

        // 先处理RPC消息
        for (let i = this._RPCQueue.length - 1; i >= 0; i--) {
            const repData = this._RPCQueue[i];
            let obj: Message = data
            if (encode) {
                obj = await this.decode(null!, data, repData) as Message
                if (!obj) { continue }
                if (data.cmd != repData.cmd) {
                    continue;
                }
                repData.resolve(obj)
                repData.stop();
                this._RPCQueue.splice(i, 1);
            }
        }

        for (let i = 0; i < listenerDatas.length; i++) {
            let obj: Message = data
            if (encode) {
                obj = await this.decode(listenerDatas[i], data) as Message
            }

            if (listenerDatas[i].isQueue) {
                //需要加入队列处理
                queueDatas.push(this.copy(listenerDatas[i], obj));
            }
            else {
                //不需要进入队列处理
                try {
                    listenerDatas[i].func && listenerDatas[i].func.call(listenerDatas[i].target, obj);
                } catch (err) {
                    Log.e(err);
                }

            }
        }
        if (queueDatas.length > 0) {
            this._masseageQueue.push(queueDatas);
        }
    }

    /**
     * @description 复制proto协议监听数据
     * @param input 
     * @param data 
     */
    private copy(input: Net.ListenerData, data: any): Net.ListenerData {
        return {
            type: input.type,
            func: input.func,
            isQueue: input.isQueue,
            data: data,
            target: input.target,
            cmd: input.cmd
        };
    }
}