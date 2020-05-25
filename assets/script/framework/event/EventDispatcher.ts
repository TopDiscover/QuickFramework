import { getSingleton } from "../base/Singleton";

/**
 * @description 事件派发器，原生的，当前节点没有在运行时，无法收到消息
 */

 interface IEvent{
     type: string , // 事件类型
     target : any, //事件target
     callback : ( (data : any )=>void ) | string ;//事件回调
 }

export function eventDispatcher(){
    return getSingleton(EventDispatcher);
}

class EventDispatcher{

    private static _instance : EventDispatcher = null;
    public static Instance(){return this._instance || (this._instance = new EventDispatcher());}
    private logTag = `[EventDispatcher] `;
    private _eventCaches : {[key:string] : Array<IEvent>} = null;
    constructor(){
        this._eventCaches = {};
    }
    /**
     * @description 添加事件
     * @param type 事件类型
     * @param callback 事件回调
     * @param target target
     */
    public addEventListener( type : string , callback : ( ( data : any )=>void ) | string, target : any ){
        if ( !type || !callback || !target ) return;
        let eventCaches : Array<IEvent> = this._eventCaches[type] || [];
        let hasSame = false;
        for( let i = 0 ; i < eventCaches.length ; i++ ){
            if ( eventCaches[i].target === target ){
                hasSame = true;
                break;
            }
        }
        if ( hasSame ){
            return;
        }
        let newEvent : IEvent = { type : type , callback : callback , target : target};
        eventCaches.push(newEvent);
        this._eventCaches[type] = eventCaches;
    }

    /**
     * @description 移除事件
     * @param type 事件类型
     * @param target 
     */
    public removeEventListener( type : string , target : any ){
        if ( !type || !target ){
            return;
        }
        let eventCaches : Array<IEvent> = this._eventCaches[type];
        if ( !eventCaches ){
            return;
        }
        for( let i = 0 ; i < eventCaches.length ; i++ ){
            if ( eventCaches[i].target === target){
                eventCaches.splice(i,1);
                break;
            }
        }
        if ( eventCaches.length == 0){
            delete this._eventCaches[type];
        }
    }

    /**
     * @description 派发事件
     * @param type 事件类型
     * @param data 事件数据
     */
    public dispatchEvent( type : string , data? : any ){
        if ( !type ) return;
        let eventCaches : Array<IEvent> = this._eventCaches[type];
        if ( !eventCaches ) return;
        for ( let i = 0 ; i < eventCaches.length ; i++ )
        {
            let event = eventCaches[i];
            try {
                if ( typeof Reflect == "object" ){
                    if ( typeof event.callback == "string" ){
                        let func = Reflect.get(event.target,event.callback);
                        if ( func ){
                            if ( CC_DEBUG ) cc.log(`${this.logTag} apply string func : ${event.callback} class : ${cc.js.getClassName(event.target)}`);
                            Reflect.apply(func.bind(event.target),event.target,[data]);
                        }else{
                            if ( CC_DEBUG ) cc.error(`${this.logTag} class : ${cc.js.getClassName(event.target)} no func : ${event.callback}`);
                        }
                    }
                    else{
                        Reflect.apply( event.callback,event.target,[data]);
                    }
                }else{
                    if ( typeof event.callback == "string" ){
                        if ( event.target && event.callback ){
                            let func = event.target[event.callback];
                            if ( func && typeof func == "function" ){
                                func.apply(event.target,[data]);
                            }else{
                                if ( CC_DEBUG ) cc.error(`${event.callback} is not function`);
                            }
                        }else{
                            if ( CC_DEBUG ) cc.error(`target or callback is null`);
                        }
                    }else{
                        if ( event.callback && event.target ){
                            event.callback.apply(event.target,[data]);
                        }else{
                            if ( CC_DEBUG ) cc.error(`callback is null`);
                        }
                    }
                }
                
            } catch (error) {
                cc.error(error);
            }
        }
    }
 }

 window.dispatch = function (name : string  , data? : any) {
    if ( CC_DEBUG ) cc.log(`[dispatch] ${name} data : ${data}`);
    let ev = new cc.Event.EventCustom(name, true);
    if (data) ev.setUserData(data);
    cc.director.dispatchEvent(ev);
    //向自己封闭的管理器中也分发
    eventDispatcher().dispatchEvent(name, data);
}