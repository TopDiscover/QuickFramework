/**
 * @description 事件处理组件
 */

import { Component, NodeEventType, _decorator } from "cc";
import EventProcessor, { QuickEvent, EventAgrs } from "../core/event/EventProcessor";
import { BindEventType } from "../defines/Enums";

const { ccclass, property } = _decorator;

@ccclass
export default class EventComponent extends Component implements QuickEvent{

    private _eventProcessor = new EventProcessor;

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    addEvent(name: string, func: Function) {
        this.on({
            bindType : BindEventType.CUSTOM,
            type : name,
            cb : func,
        });
    }

    removeEvent(eventName: string) {
        this.off({
            bindType : BindEventType.CUSTOM,
            type : eventName,
        });
    }
    
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

    addEvents() {

    }

    onLoad() {
        this.addEvents();
    }

    onDestroy() {
        this._eventProcessor.onDestroy();
    }
}
