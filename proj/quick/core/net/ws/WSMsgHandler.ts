/**
 * @description WebSocket 消息处理管理器
 */

import { DEBUG } from "cc/env";
import { Net } from "../Net";

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

    public async update(dt: number) {

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
        let result : any = null!;
        for (let i = 0; i < datas.length; i++) {
            let data = datas[i];
            result = await this.doSafeCall(data.func, data.data, data.target, result);
        }

        this._isDoingMessage = false;
    }

    public onMessage(data: Message, tag?: string) {
        DEBUG && Log.d(`${tag} recv data main cmd : ${data.cmd}`);
        this.addQueue(data)
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
            const data = this._RPCQueue[i];
            try {
                data.resolve(null);
            } catch (err) {
                Log.e(err);
            }
            data.stop();
        }
        this._RPCQueue = [];
        this._isDoingMessage = false;
    }

    public onS(cmd: string, type: any, func: Net.MessageHandleFunc, isQueue: boolean, target: any) {
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
                func: func,
                type: type,
                isQueue: isQueue,
                target: target
            });
        }
        else {
            this._listeners[key] = [];
            this._listeners[key].push({
                cmd: cmd,
                func: func,
                type: type,
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

    private async addQueue(data: Message) {
        const recvCmd = data.cmd;
        let queueDatas: Net.ListenerData[] = [];

        // 先处理RPC消息
        // 记录已经解析过的数据，防止重新解析数据
        let alreadyParse: { [key: string]: any } = [];

        for (let i = this._RPCQueue.length - 1; i >= 0; i--) {
            const repData = this._RPCQueue[i];
            let obj: Message = data
            obj = await this.decode(null!, data, repData) as Message
            if (!obj) { continue }
            alreadyParse[recvCmd] = obj;
            if (recvCmd != repData.cmd) {
                continue;
            }
            try {
                repData.resolve(obj)
            } catch (err) {
                Log.e(err);
            }
            repData.stop();
            this._RPCQueue.splice(i, 1);
        }

        if (!(this._listeners[recvCmd] && this._listeners[recvCmd].length > 0)) {
            alreadyParse = {};
            return;
        }
        const listenerDatas = this._listeners[recvCmd];

        let result : any = null!;
        for (let i = 0; i < listenerDatas.length; i++) {
            const listenerData = listenerDatas[i];
            let obj: Message = data
            if (alreadyParse[listenerData.cmd]) {
                obj = alreadyParse[listenerData.cmd];
            } else {
                obj = await this.decode(listenerData, data) as Message
            }

            if (listenerData.isQueue) {
                //需要加入队列处理
                queueDatas.push(this.copy(listenerData, obj));
            }
            else {
                //不需要进入队列处理
                result = await this.doSafeCall(listenerData.func, obj, listenerData.target, result);
            }
        }

        alreadyParse = {};

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

    private async doCall(func: Net.MessageHandleFunc, data: any, target: any, result: any) {
        try {
            let callResult = func.call(target, data, result);
            if (callResult instanceof Promise) {
                return await callResult;
            } else {
                return callResult;
            }
        } catch (err) {
            Log.e(err);
            return null;
        }
    }

    /**
     * @description 做一个调用超时处理
     * @param func 
     * @param data 
     * @param target 
     * @param result 
     * @returns 
     */
    private async doSafeCall(func: Net.MessageHandleFunc, data: any, target: any, result: any): Promise<any> {
        try {
            // 设置调用超时
            return await Promise.race([
                this.doCall(func, data, target, result),
                new Promise((_, reject) => 
                    setTimeout(() => reject(new Error('Call timeout')), this.service.options.maxHandleTimeout)
                )
            ]);
        } catch (error) {
            Log.e(`Safe call failed: ${error}`);
            // 即使调用失败也继续处理下一个消息
            return null;
        }
    }
}