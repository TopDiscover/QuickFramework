/**
 * @description 事件处理组件
 */

import { IEventProcessor, EventAgrs, EventProcessor, EventCallback } from "../core/event/EventProcessor";

const { ccclass, property } = cc._decorator;

@ccclass
export default class EventComponent extends cc.Component implements IEventProcessor {


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

    onI(eventType: string, cb: EventCallback): void {
        this.on({
            bind: "Input",
            type: eventType,
            cb: cb
        })
    }
    onceI(eventType: string, cb: EventCallback): void {
        this.once({
            bind: "Input",
            type: eventType,
            cb: cb
        })
    }
    offI(eventType: string, cb: EventCallback): void {
        this.off({
            bind: "Input",
            type: eventType,
            cb: cb
        })
    }

    onN(node: cc.Node, type: string, cb: EventCallback, target?: unknown, useCapture?: any): void {
        this.on({
            bind: "Node",
            type: type,
            cb: cb,
            target: target,
            useCapture: useCapture,
            node: node
        })
    }
    onceN(node: cc.Node, type: string, cb: EventCallback, target?: unknown, useCapture?: any): void {
        this.once({
            bind: "Node",
            type: type,
            cb: cb,
            target: target,
            useCapture: useCapture,
            node: node
        })
    }
    offN(node: cc.Node, type: string, cb: EventCallback, target?: unknown, useCapture?: any): void {
        this.off({
            bind: "Node",
            type: type,
            cb: cb,
            target: target,
            useCapture: useCapture,
            node: node
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