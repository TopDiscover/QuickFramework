import { EventProcessor } from "../../event/EventProcessor";
import { Macro } from "../../../defines/Macros";

/**
 * @description 该模块只负责对网络消息的返回处理
 */
export abstract class Handler extends EventProcessor implements ISingleton{

    /**@description Sender所属模块，如聊天,vip, */
    static module: string = Macro.UNKNOWN;
    protected _module : string = Macro.UNKNOWN;
    /**@description 该字段由NetHelper指定 */
    get module(){
        return this._module;
    }
    set module(value){
        this._module = value
    }

    /**@description 绑定Service对象 */
    protected abstract service : any;

    /**
     * @description 注册网络事件
     * @param cmd cmd
     * @param func 处理函数
     * @param handleType 处理数据类型
     * @param isQueue 接收到消息，是否进行队列处理
     */
    protected onS(cmd: string, func: (data: any) => void, handleType?: any, isQueue = true) {
        let service : IService = this.service;
        if (service && service.addListener ) {
            service.addListener(cmd, handleType, func, isQueue, this);
            return;
        }
        if( CC_DEBUG ){
            Log.w(`未绑定Service`);
        }
    }

    /**
     * @description 反注册网络消息处理
     * @param cmd 如果为null，则反注册当前对象注册过的所有处理过程，否则对特定cmd反注册
     **/
    protected offS(cmd?: string) {
        let service : IService = this.service;
        if (service && service.removeListeners) {
            service.removeListeners(this, cmd)
            return;
        }
        if( CC_DEBUG ){
            Log.w(`未绑定Service`);
        }
    }

    /**
     * @description 该方法会在Handler销毁时，调用
     */
    onDestroy(): void {
        //移除当前Handler绑定事件
        this.offS();
        super.onDestroy();
    }

    debug(){
        Log.d(this.module);
    }

    destory(){
        this.onDestroy();
    }

    init(){
        this.onLoad();
    }
}

