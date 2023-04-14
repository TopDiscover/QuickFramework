/**
 * @description 事件处理组件
 */

import { Node, NodeEventType } from "cc";

export interface EventAgrs{
    /**
     * @description 绑定事件类型
     */
    bind : "Dispatcher" | "Game" | "Input" | "Node";
    /**@description 事件类型名 */
    type : string | NodeEventType;
    /**
     * @description 绑定事件的节点，bindType 为 NODE,必选参数,其它可以不用
     */
    node ?: Node;
    /**@description 绑定回调 */
    cb ?: Function;
    /**@description node.on参数中的target */
    target?:unknown;
    /**@description node.on参数中的useCapture */
    useCapture?:any;
}

export interface IEventProcessor {
    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    onD(name: string, func: Function): void;
    addEvents(): void;
    /**
     * @description 注册事件
     * @param args 
     */
    on(args:EventAgrs):void;
    /**
     * @description 注册只响应一次的事件
     * @param args 
     */
    once(args:EventAgrs):void;
    /**
     * @description 反注册事件
     * @param args 
     */
    off(args:EventAgrs):void;
    
    /**
     * @description 注册绑定到 App.dispatcher 的事件
     * @param eventName 
     * @param func 
     */
    onD(eventName : string , func : Function):void;
    /**
     * @description 注册绑定到 App.dispatcher 只响应一次的事件
     * @param eventName 
     * @param func 
     */
    onceD(eventName:string , func : Function):void;
    /**
     * @description 反注册绑定到 App.dispatcher 的事件
     * @param eventName 
     * @param func 
     */
    offD(eventName:string , func : Function):void;

}

export class EventProcessor implements IEventProcessor {
   
    
    private _events: Map<string, EventAgrs> = new Map();

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    onD(name: string, func: Function) {
        this.on({
            bind : "Dispatcher",
            type : name,
            cb:func
        });
    }

    onceD(eventName: string, func: Function): void {
        this.once({
            bind : "Dispatcher",
            type : eventName,
            cb : func,
        });
    }
    offD(eventName: string, func: Function): void {
        this.off({
            bind : "Dispatcher",
            type : eventName,
        });
    }

    addEvents() {

    }

    onLoad(...args: any[]) {
        this.addEvents();
    }

    onDestroy(...args: any[]) {
        this._events.forEach((args, name) => {
            App.dispatcher.remove(args.type, args.target);
        });
        this._events.clear();
    }

    on(args:EventAgrs): void {
        switch(args.bind){
            case "Dispatcher":{
                if( !args.target){
                    args.target = this;
                }
                if (this._events.has(args.type)) {
                    Log.e(`${args.type} 重复注册`);
                    return;
                }
                App.dispatcher.add(args.type, args.cb!, args.target);
                this._events.set(args.type, args);
            }
            break;
            default:{
                Log.e("不支持的绑定事件类型")
            }
        }
    }
    once(args:EventAgrs): void {
        switch(args.bind){
            case "Dispatcher":{
                if (!args.target){
                    args.target = this;
                }
                if (this._events.has(args.type)) {
                    Log.e(`${args.type} 重复注册`);
                    return;
                }
                App.dispatcher.add(args.type, args.cb!, args.target,true);
                this._events.set(args.type,args);
            }
            break;
            default:{
                Log.e("不支持的绑定事件类型")
            }
        }
    }
    
    off(args:EventAgrs): void {
        switch(args.bind){
            case "Dispatcher":{
                if ( !args.target ){
                    args.target = this;
                }
                if (this._events.has(args.type)) {
                    //事件移除
                    App.dispatcher.remove(args.type, args.target);
                    //删除本地事件
                    this._events.delete(args.type);
                }
            }
            break;
            default:{
                
            }
        }
    }
}
