import { Service } from "./Service";
import { Component, js, _decorator } from "cc";
import { DEBUG } from "cc/env";

/**
 * @description 事件处理组件
 */

const { ccclass, property } = _decorator;

/**@description 这个地方做下特殊处理，防止外面的人进行修改 */
const addListeners = Symbol("addListeners");
const removeEventListeners = Symbol("removeEventListeners");

interface EventArgs {
    name?: string,
    func?: (data: any) => any;
    mainCmd?: number,
    subCmd?: number,
    handleType?: any,
    isQueue?: boolean,
}

@ccclass
export default class EventComponent extends Component {

    protected _service: Service | null = null;
    protected logTag = `[EventComponent]`;

    private _events: EventArgs[] = [];

    private _getEventArgs(): EventArgs | null {
        if (arguments.length < 2) {
            if (DEBUG) error(`注册事件参数错误`);
            return null;
        }

        let args: EventArgs = {};
        if (typeof arguments[0] == "string") {
            //普通消息注册
            args.name = arguments[0];
            args.func = arguments[1];
        } else {
            //网络消息注册
            args.mainCmd = arguments[0];
            args.subCmd = arguments[1];
            args.handleType = null;
            args.isQueue = true;
            if (arguments.length >= 3) {
                args.func = arguments[2];
            }
            if (arguments.length >= 4) {
                args.handleType = arguments[3];
            }
            if (arguments.length >= 5) {
                args.isQueue = arguments[4];
            }
        }
        return args;
    }

    /**
     * @description 注册网络事件 ，在onLoad中注册，在onDestroy自动移除
     * @param manCmd 
     * @param subCmd 
     * @param func 处理函数
     * @param handleType 消息解析类型
     * @param isQueue 是否加入队列
     */
    registerEvent(manCmd: number, subCmd: number, func: (data: any) => void, handleType?: any, isQueue?: boolean): void;
    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param eventName 
     * @param func 
     */
    registerEvent(eventName: string, func: (data: any) => void): void;
    registerEvent(): void {
        let args = this._getEventArgs.apply(this, <any>arguments);
        if (args) {
            this._events.push(args);
        }
    }

    /**
     * @description 注册网络事件 ，在onLoad中注册，在onDestroy自动移除
     * @param manCmd 
     * @param subCmd 
     * @param func 处理函数
     * @param handleType 消息解析类型 如果不注册类型，返回的是服务器未进行解析的源数据，需要自己进行解包处理
     * @param isQueue 是否加入队列
     */
    addEvent(manCmd: number, subCmd: number, func: (data: any) => void, handleType?: any, isQueue?: boolean): void;
    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param eventName 
     * @param func 
     */
    addEvent(eventName: string, func: (data: any) => void): void;
    addEvent() {
        let event = this._getEventArgs.apply(this, <any>arguments);
        if (event) {
            this._events.push(event);

            if (event.name) {
                Manager.eventDispatcher.addEventListener(event.name, event.func as any, this);
            } else {
                //网络消息事件注册
                if (this._service) {
                    if (event.mainCmd && event.subCmd) {
                        this._service.addListener(
                            event.mainCmd,
                            event.subCmd,
                            event.handleType,
                            event.func as any,
                            event.isQueue as boolean,
                            this
                        );
                    } else {
                        error(this.logTag, `注册的网络回调有误 class : ${js.getClassName(this)} manCmd : ${event.mainCmd} subCmd : ${event.subCmd}`);
                    }
                }
            }
        }
    }

    /**
     * @description 删除注册网络事件
     * @param manCmd 主cmd
     * @param subCmd 子cmd
     */
    removeEvent(manCmd: number, subCmd: number): void;
    /**
     * @description 删除普通事件
     * @param eventName 事件名
     */
    removeEvent(eventName: string): void;
    removeEvent() {
        if (arguments.length < 1) {
            if (DEBUG) error(`参数有误`);
            return;
        }
        if (arguments.length == 1) {
            //事件移除
            Manager.eventDispatcher.removeEventListener(arguments[0], this);
            //删除本地事件
            let i = this._events.length;
            while (i--) {
                if (this._events[i].name == arguments[0]) {
                    this._events.splice(i, 1);
                }
            }

        } else {
            //删除网络消息
            let mainCmd = arguments[0];
            let subCmd = arguments[1];
            if (this._service && typeof mainCmd == "number" && typeof subCmd == "number") {
                this._service.removeListeners(this, mainCmd, subCmd);
            }
            //删除本地事件
            let i = this._events.length;
            while (i--) {
                if (this._events[i].mainCmd == mainCmd && this._events[i].subCmd == subCmd) {
                    this._events.splice(i, 1);
                }
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
            if (event.name) {
                //普通事件注册
                Manager.eventDispatcher.addEventListener(event.name, event.func as any, this);
            } else {
                //网络消息事件注册
                if (this._service) {
                    if (event.mainCmd && event.subCmd) {
                        this._service.addListener(
                            event.mainCmd,
                            event.subCmd,
                            event.handleType,
                            event.func as any,
                            event.isQueue as boolean,
                            this
                        )
                    } else {
                        error(this.logTag, `注册的网络回调有误 class : ${js.getClassName(this)} manCmd : ${event.mainCmd} subCmd : ${event.subCmd}`);
                    }
                }
            }
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
