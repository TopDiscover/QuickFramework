import { eventDispatcher } from "../event/EventDispatcher";

/**
 * @description 事件处理组件
 */

const { ccclass, property } = cc._decorator;

/**@description 这个地方做下特殊处理，防止外面的人进行修改 */
const addListeners = Symbol("addListeners");
const removeEventListeners = Symbol("removeEventListeners");

interface EventArgs {
    name?: string,
    func?: (data: any) => any;
}

@ccclass
export default class EventComponent extends cc.Component {

    protected logTag = `[EventComponent]`;

    private _events: EventArgs[] = [];
    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param eventName 
     * @param func 
     */
    registerEvent(eventName: string, func: (data: any) => void) {
        this._events.push({ name: eventName, func: func });
    }

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param eventName 
     * @param func 
     */
    addEvent(eventName: string, func: (data: any) => void) {
        let event = { name: eventName, func: func };
        this._events.push(event);
        eventDispatcher().addEventListener(event.name, event.func, this);
    }

    /**
     * @description 删除普通事件
     * @param eventName 事件名
     */
    removeEvent(eventName: string) {
        //事件移除
        eventDispatcher().removeEventListener(eventName, this);
        //删除本地事件
        let i = this._events.length;
        while (i--) {
            if (this._events[i].name == eventName) {
                this._events.splice(i, 1);
            }
        }
    }

    protected bindingEvents() {

    }

    onLoad() {
        this.bindingEvents();
        this[addListeners]();
    }

    onDestroy() {
        this[removeEventListeners]();
    }

    [addListeners]() {

        for (let i = 0; i < this._events.length; i++) {
            let event = this._events[i];
            //普通事件注册
            eventDispatcher().addEventListener(event.name, event.func, this);
        }
    }

    [removeEventListeners]() {
        for (let i = 0; i < this._events.length; i++) {
            let event = this._events[i];
            if (event.name) {
                //普通事件注册
                eventDispatcher().removeEventListener(event.name, this);
            }
        }
    }
}
