import { DEBUG } from "cc/env";
import { Macro } from "../../../defines/Macros";

/**
 * @description 该模块只负责对网络消息的返回处理
 */
export abstract class Handler {
    
    /**@description Sender所属模块，如聊天,vip, */
	static module : string = Macro.UNKNOWN;
    /**@description 该字段由NetHelper指定 */
    module : string = "";
    
    /**@description 绑定Service对象 */
    protected abstract service : Service | null;

    /**
     * @description 注册网络事件
     * @param cmd cmd
     * @param func 处理函数
     * @param handleType 处理数据类型
     * @param isQueue 接收到消息，是否进行队列处理
     */
    protected register(cmd:string,func : (data:any)=>void,handleType ?: any , isQueue = true ){
        if( this.service ){
            this.service.addListener(cmd,handleType,func,isQueue,this);
            return;
        }
        if( DEBUG ){
            Log.e(`必须绑定Service`);
        }
    }

    /**
     * @description 反注册网络消息处理
     * @param cmd 如果为null，则反注册当前对象注册过的所有处理过程，否则对特定cmd反注册
     **/
    protected unregister(cmd?:string){
        if( this.service ){
            this.service.removeListeners(this,cmd)
            return;
        }
        if( DEBUG ){
            Log.e(`必须绑定Service`);
        }
    }

    /**
     * @description 该方法会在Handler创建时，调用，可直接在此处注册自己的网络事件
     */
    onLoad( ):void{
        if ( this.service ){
            this.service.attach(this);
        }
    }

    /**
     * @description 该方法会在Handler销毁时，调用
     */
    onDestroy():void{
        if (this.service ){
            this.service.detach(this);
        }
        //移除当前Handler绑定事件
        this.unregister();
    }

    /**@description 网络连接成功 */
    onOpen( service : Service , ev : Event | null ) {
        
    }

    /**@description 网络关闭 */
    onClose(service : Service , ev : Event) {
        
    }

    /**@description 网络错误 */
    onError(service : Service , ev : Event) {
        
    }

}

