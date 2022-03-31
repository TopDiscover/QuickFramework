import { tween, Tween } from "cc";
import { DEBUG } from "cc/env";
import { Macro } from "../../../defines/Macros";

/**
 * @description 该模块只负责对网络消息的返回处理
 */
export abstract class Handler {

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
    protected abstract get service(): Service | null;

    /**@description 当前actionID,每执行一个,+1 */
    private curentAcitonID = 0;
    private actions: Map<number, string> = new Map();

    protected delayCall(func: Function, time: number, name ?: string, ...args: any[]) {
        this.curentAcitonID++;
        let id = this.curentAcitonID;
        tween(this).tag(this.curentAcitonID).delay(time).call(() => {
            if (this) {
                try {
                    // Log.e(`${this.module} 回调id : ${id} name : ${name ? name : id.toString()}`);
                    this.stopAction(id);
                    func(...args);
                } catch (err) {
                    Log.e(err);
                }
            }
        }).start();
        // Log.e(`${this.module} 启动id : ${id} name : ${name ? name : id.toString()}`);
        this.actions.set(id, name ? name : id.toString());
        return id;
    }

    protected stopAction(id: number) {
        //最小值
        if ( id <= 0 ) return;
        // Log.e(`${this.module} 停止id : ${id} name : ${this.actions.get(id)}`);
        Tween.stopAllByTag(id);
        this.actions.delete(id);
    }

    protected stopActions(){
        this.actions.clear();
        Tween.stopAllByTarget(this);
    }

    /**
     * @description 注册网络事件
     * @param cmd cmd
     * @param func 处理函数
     * @param handleType 处理数据类型
     * @param isQueue 接收到消息，是否进行队列处理
     */
    protected register(cmd: string, func: (data: any) => void, handleType?: any, isQueue = true) {
        if (this.service) {
            this.service.addListener(cmd, handleType, func, isQueue, this);
            return;
        }
        if (DEBUG) {
            Log.e(`必须绑定Service`);
        }
    }

    /**
     * @description 反注册网络消息处理
     * @param cmd 如果为null，则反注册当前对象注册过的所有处理过程，否则对特定cmd反注册
     **/
    protected unregister(cmd?: string) {
        if (this.service) {
            this.service.removeListeners(this, cmd)
            return;
        }
        if (DEBUG) {
            Log.e(`必须绑定Service`);
        }
    }

    /**
     * @description 该方法会在Handler创建时，调用，可直接在此处注册自己的网络事件
     */
    onLoad(): void {

    }

    /**
     * @description 该方法会在Handler销毁时，调用
     */
    onDestroy(): void {
        this.stopActions();
        //移除当前Handler绑定事件
        this.unregister();
    }

}

