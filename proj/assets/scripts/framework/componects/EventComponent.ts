/**
 * @description 事件处理组件
 */

import EventProcessor, { QuickEvent } from "../core/event/EventProcessor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventComponent extends cc.Component implements QuickEvent{
    
    private _eventProcessor = new EventProcessor;

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    addEvent(name: string, func: Function) {
        this._eventProcessor.addEvent(name,func);
    }

    removeEvent(eventName: string) {
        this._eventProcessor.removeEvent(eventName);
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