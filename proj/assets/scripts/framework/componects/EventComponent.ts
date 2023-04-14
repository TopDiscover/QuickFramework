/**
 * @description 事件处理组件
 */

import { IEventProcessor, EventAgrs, EventProcessor } from "../core/event/EventProcessor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventComponent extends cc.Component implements IEventProcessor{
    

    private _eventProcessor = new EventProcessor;
    
    on(args: EventAgrs): void {
        if( !args.target ){
            args.target = this;
        }
        this._eventProcessor.on(args);
    }
    once(args: EventAgrs): void {
        if ( !args.target ){
            args.target = this;
        }
        this._eventProcessor.once(args);
    }
    off(args: EventAgrs): void {
        if ( !args.target ){
            args.target = this;
        }
        this._eventProcessor.off(args);
    }

    onD(eventName: string, func: Function): void {
        this.on({
            bind : "Dispatcher",
            type : eventName,
            cb : func,
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

    onLoad() {
        this.addEvents();
    }

    onDestroy() {
        this._eventProcessor.onDestroy();
    }
}