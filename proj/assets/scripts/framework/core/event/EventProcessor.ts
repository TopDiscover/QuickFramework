/**
 * @description 事件处理组件
 */

import { Node, NodeEventType } from "cc";
import { BindEventType } from "../../defines/Enums";

export interface EventAgrs{
    /**
     * @description 绑定事件类型
     */
    bindType : BindEventType;
    /**@description 事件类型名 */
    type : string | NodeEventType;
    /**
     * @description 绑定事件的节点，bindType 为 BindEventType.NODE,必选参数,其它可以不用
     */
    node ?: Node;
    /**@description 绑定回调 */
    cb ?: Function;
    /**@description node.on参数中的target */
    target?:unknown;
    /**@description node.on参数中的useCapture */
    useCapture?:any;
}

export interface QuickEvent {
    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    addEvent(name: string, func: Function): void;
    removeEvent(eventName: string): void;
    addEvents(): void;
    on(args:EventAgrs):void;
    once(args:EventAgrs):void;
    off(args:EventAgrs):void;
}

export default class EventProcessor implements QuickEvent {
    
    private _events: Map<string, EventAgrs> = new Map();

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    addEvent(name: string, func: Function) {
        this.on({
            bindType : BindEventType.CUSTOM,
            type : name,
            cb:func
        });
    }

    removeEvent(eventName: string) {
        this.off({
            bindType : BindEventType.CUSTOM,
            type : eventName
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
        switch(args.bindType){
            case BindEventType.CUSTOM:{
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
        switch(args.bindType){
            case BindEventType.CUSTOM:{
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
        switch(args.bindType){
            case BindEventType.CUSTOM:{
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
