import { Macro } from "../../../defines/Macros";

/**
 * @description NetHelper 网络辅助管理 对 Sender 及 Handler的管理
 */
export default class NetHelper {
    private static _instance: NetHelper = null!;
    public static Instance() { return this._instance || (this._instance = new NetHelper()); }

    /**@description 所有Sender */
    private _senders : Map<string,Sender> = new Map();
    /**@description 所有Handler */
    private _handlers : Map<string,Handler> = new Map();

    /**
     * @description 获取Sender
     * @param senderClassOrSenderModule sender类型或模块名 
     * @param isCreate 传入类型时有效 如果不存在，则创建，默认为创建
     * @returns 
     */
    getSender<T extends Sender>( senderClassOrSenderModule : SenderClass<T> | string , isCreate = true ) : T | null{
        if ( typeof senderClassOrSenderModule == "string" ){
            if ( this._senders.has(senderClassOrSenderModule) ){
                return <T>this._senders.get(senderClassOrSenderModule);
            }
        }else{
            if ( senderClassOrSenderModule.module == Macro.UNKNOWN ){
                if ( CC_DEBUG ){
                    Log.e(`未指定Sender的所属模块`);
                }
                return null;
            }
            if ( this._senders.has(senderClassOrSenderModule.module) ){
                return <T>this._senders.get(senderClassOrSenderModule.module);
            }
            if ( isCreate ){
                let data = new senderClassOrSenderModule();
                data.module = senderClassOrSenderModule.module;
                data.onLoad();
                this._senders.set(data.module,data);
                return <T>data;
            }
        }
        return null;
    }

    /**
     * @description 销毁sender
     * @param senderClassOrSenderModule 
     * @returns 
     */
    destorySender<T extends Sender>( senderClassOrSenderModule : SenderClass<T> | string ){
        let module = this.getSenderModule(senderClassOrSenderModule);
        let sender = this._senders.get(module);
        if ( sender ){
            sender.onDestroy();
            this._senders.delete(module);
            return true;
        }
        return false;
    }

    /**
     * @description 清除Sender
     * @param exclude 需要排除Sender
     */
    clearSender<T extends Sender>( exclude ?: (SenderClass<T> | string)[]){
        this._senders.forEach((data,key)=>{
            if ( !this.isInExcludeSender(data,exclude) ){
                this.destorySender(key);
            }
        });
    }

    private isInExcludeSender< T extends Sender>( data : T , exclude ?: (SenderClass<T> | string)[]){
        if ( !exclude ) return false;
        for( let i = 0 ; i < exclude.length ; i++){
            let module = this.getSenderModule(exclude[i]);
            if ( data.module == module ){
                return true;
            }
        }
        return false;
    }

    private getSenderModule<T extends Sender>( senderClassOrSenderModule : SenderClass<T> | string ){
        let module = "";
        if ( typeof senderClassOrSenderModule == "string" ){
            module = senderClassOrSenderModule;
        }else{
            module = senderClassOrSenderModule.module;
        }
        return module;
    }

    /**
     * @description 获取Handler
     * @param ClassOrModule Handler类型或模块名 
     * @param isCreate 传入类型时有效 如果不存在，则创建，默认为false
     * @returns 
     */
     getHandler<T extends Handler>( ClassOrModule : HandlerClass<T> | string , isCreate = false ) : T | null{
        if ( typeof ClassOrModule == "string" ){
            if ( this._handlers.has(ClassOrModule) ){
                return <T>this._handlers.get(ClassOrModule);
            }
        }else{
            if ( ClassOrModule.module == Macro.UNKNOWN ){
                if ( CC_DEBUG ){
                    Log.e(`未指定Sender的所属模块`);
                }
                return null;
            }
            if ( this._handlers.has(ClassOrModule.module) ){
                return <T>this._handlers.get(ClassOrModule.module);
            }
            if ( isCreate ){
                let data = new ClassOrModule();
                data.module = ClassOrModule.module;
                data.onLoad();
                this._handlers.set(data.module,data);
                return <T>data;
            }
        }
        return null;
    }

    /**
     * @description 销毁Handler
     * @param ClassOrModule 
     * @returns 
     */
    destoryHandler<T extends Handler>( ClassOrModule : HandlerClass<T> | string ){
        let module = this.getHandlerModule(ClassOrModule);
        let handler = this._handlers.get(module);
        if ( handler ){
            handler.onDestroy();
            this._handlers.delete(module);
            return true;
        }
        return false;
    }

    /**
     * @description 清除Handler
     * @param exclude 需要排除Handler
     */
    clearHandler<T extends Handler>( exclude ?: (HandlerClass<T> | string)[]){
        this._handlers.forEach((data,key)=>{
            if ( !this.isInExcludeHandler(data,exclude) ){
                this.destoryHandler(key);
            }
        });
    }

    private isInExcludeHandler< T extends Handler>( data : T , exclude ?: (HandlerClass<T> | string)[]){
        if ( !exclude ) return false;
        for( let i = 0 ; i < exclude.length ; i++){
            let module = this.getHandlerModule(exclude[i]);
            if ( data.module == module ){
                return true;
            }
        }
        return false;
    }

    private getHandlerModule<T extends Handler>( ClassOrModule : HandlerClass<T> | string ){
        let module = "";
        if ( typeof ClassOrModule == "string" ){
            module = ClassOrModule;
        }else{
            module = ClassOrModule.module;
        }
        return module;
    }

    print( delegate : NetHelperPrintDelegate<Sender,Handler> ){
        if ( delegate.printSender ){
            this._senders.forEach((data)=>{
                delegate.printSender && delegate.printSender(data);
            });
        }
        if ( delegate.printHander ){
            this._handlers.forEach((data)=>{
                delegate.printHander && delegate.printHander(data);
            });
        }
    }

}