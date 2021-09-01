/**
 * @description 事件处理组件
 */

import { Component, _decorator } from "cc";

const { ccclass, property } = _decorator;

/**@description 这个地方做下特殊处理，防止外面的人进行修改 */
const addListeners = Symbol("addListeners");
const removeEventListeners = Symbol("removeEventListeners");

interface EventArgs {
    name?: string,
    func?: (data: any) => any;
    handleType?: any,
    isQueue?: boolean,
}
type fn = (data: any) => void

@ccclass
export default class EventComponent extends Component {

    protected _service: Service | null = null;
    protected logTag = `[EventComponent]`;

    private _events: EventArgs[] = [];
    addNetEvent(cmd: string, func: fn, handlerType?: any, isQueue: boolean = false) {
        //普通消息
        if (this._service) {
            this._service.addListener(
                cmd,
                handlerType,
                func as any,
                isQueue,
                this
            );
        }
    }

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    addUIEvent(name: string, func: (data: any) => void) {
        let args = { name: name, func: func }
        this._events.push(args)
    }

    removeEvent(eventName: string) {
        //事件移除
        Manager.eventDispatcher.removeEventListener(arguments[0], this);

        if (this._service) { this._service.removeListeners(this, eventName) }
        //删除本地事件
        let i = this._events.length
        while (i--) {
            if (this._events[i].name == eventName) {
                this._events.splice(i, 1)
            }
        }

    }
    protected addEvents() {

    }

    onLoad() {
        this.addEvents();
        this[addListeners]();
    }

    onDestroy() {
        this[removeEventListeners]();
    }

    [addListeners]() {
        for (let i = 0; i < this._events.length; i++) {
            let event = this._events[i];
            Manager.eventDispatcher.addEventListener(event.name as string, event.func, this);
        }
    }

    [removeEventListeners]() {
        for (let i = 0; i < this._events.length; i++) {
            let event = this._events[i];
            if (event.name) {
                //普通事件注册
                Manager.eventDispatcher.removeEventListener(event.name, this);
            }
        }

        if (this._service) {
            this._service.removeListeners(this);
            this._service = null;
        }
    }
}
