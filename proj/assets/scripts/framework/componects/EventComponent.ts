/**
 * @description 事件处理组件
 */

import { Component, NodeEventType, _decorator, __private } from "cc";
import { IEventProcessor, EventAgrs, EventProcessor, EventCallback } from "../core/event/EventProcessor";

const { ccclass, property } = _decorator;

@ccclass
export default class EventComponent extends Component implements IEventProcessor {

    private _eventProcessor = new EventProcessor;

    on(args: EventAgrs): void {
        if (!args.target) {
            args.target = this;
        }
        this._eventProcessor.on(args);
    }
    once(args: EventAgrs): void {
        if (!args.target) {
            args.target = this;
        }
        this._eventProcessor.once(args);
    }
    off(args: EventAgrs): void {
        if (!args.target) {
            args.target = this;
        }
        this._eventProcessor.off(args);
    }

    onD(eventName: string, func: EventCallback): void {
        this.on({
            bind: "Dispatcher",
            type: eventName,
            cb: func,
        });
    }

    onceD(eventName: string, func: EventCallback): void {
        this.once({
            bind: "Dispatcher",
            type: eventName,
            cb: func,
        });
    }

    offD(eventName: string): void {
        this.off({
            bind: "Dispatcher",
            type: eventName,
        });
    }

    onG(type: string, cb: EventCallback): void {
        this.on({
            bind: "Game",
            type: type,
            cb: cb
        })
    }
    onceG(type: string, cb: EventCallback): void {
        this.once({
            bind: "Game",
            type: type,
            cb: cb
        });
    }
    offG(type: string, cb: EventCallback): void {
        this.off({
            bind: "Game",
            type: type,
            cb: cb
        });
    }

    onI<K extends keyof __private._cocos_input_input__InputEventMap>(eventType: K, cb: EventCallback): void {
        this.on({
            bind : "Input",
            type : eventType,
            cb : cb
        })
    }
    onceI<K extends keyof __private._cocos_input_input__InputEventMap>(eventType: K, cb: EventCallback): void {
        this.once({
            bind : "Input",
            type : eventType,
            cb : cb
        })
    }
    offI<K extends keyof __private._cocos_input_input__InputEventMap>(eventType: K, cb: EventCallback): void {
        this.off({
            bind : "Input",
            type : eventType,
            cb : cb
        })
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
