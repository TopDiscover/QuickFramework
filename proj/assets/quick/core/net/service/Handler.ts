import { EventProcessor } from "../../event/EventProcessor";
import { Macro } from "../../../defines/Macros";
import { Net } from "../Net";

/**
 * @description 该模块只负责对网络消息的返回处理
 */
export abstract class Handler extends EventProcessor implements ISingleton, IWSMsgHandler {

    /**@description Sender所属模块，如聊天,vip, */
    static module: string = Macro.UNKNOWN;
    protected _module: string = Macro.UNKNOWN;
    /**@description 该字段由NetHelper指定 */
    get module() {
        return this._module;
    }
    set module(value) {
        this._module = value
    }

    /**@description 绑定Service对象 */
    protected abstract service : WSService;

    onS(
        cmd: string,
        type: any,
        func: Net.MessageHandleFunc,
        isQueue = true) {
        let service = this.service;
        if (service && service.onS) {
            service.onS(cmd, type, func, isQueue, this);
            return;
        }
        if (CC_DEBUG) {
            Log.w(`未绑定Service`);
        }
    }

    offS(cmd?: string) {
        let service = this.service;
        if (service && service.offS) {
            service.offS(this, cmd)
            return;
        }
        if (CC_DEBUG) {
            Log.w(`未绑定Service`);
        }
    }

    async send(msg: Message) {
        let service = this.service;
        if (service && service.send) {
            return await service.send(msg);
        }
        if (CC_DEBUG) {
            Log.e(`必须绑定Service`);
        }
        return false;
    }

    async sendRPC<T extends Message>(data: Message, type: { new(): T } | string, cmd: string, timeout: number = Macro.DEFAULT_RPC_TIEMEOUT) {
        let service = this.service;
        if (service && service.sendRPC) {
            return await service.sendRPC(data, type, cmd, timeout);
        }
        if (CC_DEBUG) {
            Log.e(`必须绑定Service`);
        }
        return null;
    }

    /**
     * @description 该方法会在Handler销毁时，调用
     */
    onDestroy(): void {
        //移除当前Handler绑定事件
        this.offS();
        super.onDestroy();
    }

    debug() {
        Log.d(this.module);
    }

    destory() {
        this.onDestroy();
    }

    init() {
        this.onLoad();
    }
}

