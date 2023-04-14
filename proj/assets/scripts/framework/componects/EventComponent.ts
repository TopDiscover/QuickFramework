/**
 * @description 事件处理组件
 */

import { Component, NodeEventType, _decorator } from "cc";
import { IEventProcessor, EventAgrs, EventProcessor } from "../core/event/EventProcessor";
import { BindEventType } from "../defines/Enums";

const { ccclass, property } = _decorator;

@ccclass
export default class EventComponent extends Component implements IEventProcessor{
    

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
            bindType : BindEventType.DISPATCHER,
            type : eventName,
            cb : func,
        });
    }

    onceD(eventName: string, func: Function): void {
        this.once({
            bindType : BindEventType.DISPATCHER,
            type : eventName,
            cb : func,
        });
    }

    offD(eventName: string, func: Function): void {
        this.off({
            bindType : BindEventType.DISPATCHER,
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
