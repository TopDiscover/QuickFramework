/**
 * @description 事件处理组件
 */

export type EventCallback = (...any: any[]) => void;

export interface EventAgrs {
    /**
     * @description 绑定事件类型
     */
    bind: "Dispatcher" | "Game" | "Input" | "Node";
    /**@description 事件类型名 */
    type: string;
    /**
     * @description 绑定事件的节点，bindType 为 NODE,必选参数,其它可以不用
     */
    node?: cc.Node;
    /**@description 绑定回调 */
    cb?: EventCallback;
    /**@description node.on参数中的target */
    target?: unknown;
    /**@description node.on参数中的useCapture */
    useCapture?: any;
    /**@description 回调会在第一时间被触发后删除自身*/
    once?: boolean;
}



export interface IEventProcessor {
    addEvents(): void;
    /**
     * @description 注册事件
     * @param args 
     */
    on(args: EventAgrs): void;
    /**
     * @description 注册只响应一次的事件
     * @param args 
     */
    once(args: EventAgrs): void;
    /**
     * @description 反注册事件
     * @param args 
     */
    off(args: EventAgrs): void;

    /**
     * @description 注册绑定到 App.dispatcher 的事件
     * @param eventName 
     * @param func 
     */
    onD(eventName: string, func: EventCallback): void;
    /**
     * @description 注册绑定到 App.dispatcher 只响应一次的事件
     * @param eventName 
     * @param func 
     */
    onceD(eventName: string, func: EventCallback): void;
    /**
     * @description 反注册绑定到 App.dispatcher 的事件
     * @param eventName 
     * @param func 
     */
    offD(eventName: string): void;

    /**
     * @description 注册 game 的特定事件类型回调。
     * @param type 
     * @param cb 
     */
    onG(type: string, cb: EventCallback): void;
    /**
     * @description 注册 game 的特定事件类型回调，回调会在第一时间被触发后删除自身。
     * @param type 
     * @param cb 
     */
    onceG(type: string, cb: EventCallback): void;
    /**
     * @description 反注册 game 事件
     * @param type 
     * @param cb 
     */
    offG(type: string, cb: EventCallback): void;

    /**
     * @description 注册 输入事件。
     * @param type 
     * @param cb 
     */
    onI(eventType: string, cb: EventCallback): void;
    /**
     * @description 注册 输入事件，回调会在第一时间被触发后删除自身。
     * @param type 
     * @param cb 
     */
    onceI(eventType: string, cb: EventCallback): void;
    /**
     * @description 反注册 输入事件
     * @param type 
     * @param cb 
     */
    offI(eventType: string, cb: EventCallback): void;

    /**
     * @description 注册节点事件
     * @param node 
     * @param type 
     * @param cb 
     * @param target
     * @param useCapture 
     */
    onN(node: cc.Node, type: string, cb: EventCallback, target?: unknown, useCapture?: any): void;
    /**
     * @description 注册节点事件，回调会在第一时间被触发后删除自身。
     * @param node 
     * @param type 
     * @param cb 
     * @param target
     * @param useCapture 
     */
    onceN(node: cc.Node, type: string, cb: EventCallback, target?: unknown, useCapture?: any): void;
    /**
     * @description 反注册 注册节点事件
     * @param node 
     * @param type 
     * @param cb 
     * @param target
     * @param useCapture 
     */
    offN(node: cc.Node, type: string, cb: EventCallback, target?: unknown, useCapture?: any): void;
}

export class EventProcessor implements IEventProcessor {

    /**@description Dispatcher 事件 */
    private _eventsD: Map<string, EventAgrs> = new Map();
    /**@description game 事件 */
    private _eventsG: EventAgrs[] = [];
    /**@description  输入事件*/
    private _eventsI: EventAgrs[] = [];

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    onD(name: string, func: EventCallback) {
        this.on({
            bind: "Dispatcher",
            type: name,
            cb: func
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
            cb: cb,
        })
    }
    onceG(type: string, cb: EventCallback): void {
        this.once({
            bind: "Game",
            type: type,
            cb: cb,
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
            cb: cb,
        })
    }
    onceI(eventType: string, cb: EventCallback): void {
        this.once({
            bind: "Input",
            type: eventType,
            cb: cb,
        });
    }

    offI(eventType: string, cb: EventCallback): void {
        this.off({
            bind: "Input",
            type: eventType,
            cb: cb
        });
    }

    onN(node: cc.Node, type: string, cb: EventCallback, target?: unknown, useCapture?: any): void {
        this.on({
            bind: "Node",
            type: type,
            cb: cb,
            target: target,
            useCapture: useCapture,
            node: node,
        });
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
        });
    }

    addEvents() {

    }

    onLoad(...args: any[]) {
        this.addEvents();
    }

    onDestroy(...args: any[]) {
        this._cleanD();
        this._cleanG();
        this._cleanI();
        this._cleanN();
    }

    on(args: EventAgrs): void {
        switch (args.bind) {
            case "Dispatcher": this._onD(args); break;
            case "Game": this._onG(args); break;
            case "Input": this._onI(args); break;
            case "Node": this._onN(args); break;
            default: Log.e(`on ${args.bind} 未知事件类型`)
        }
    }
    once(args: EventAgrs): void {
        args.once = true;
        this.on(args);
    }

    off(args: EventAgrs): void {
        switch (args.bind) {
            case "Dispatcher": this._offD(args); break;
            case "Game": this._offG(args); break;
            case "Input": this._offI(args); break;
            case "Node": this._offN(args); break;
            default: Log.e(`off ${args.bind} 未知事件类型`)
        }
    }

    private _onD(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        if (this._eventsD.has(args.type)) {
            Log.e(`${args.type} 重复注册`);
            return;
        }
        App.dispatcher.add(args.type, args.cb!, args.target, args.once);
        this._eventsD.set(args.type, args);
    }

    private _offD(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        if (this._eventsD.has(args.type)) {
            //事件移除
            App.dispatcher.remove(args.type, args.target);
            //删除本地事件
            this._eventsD.delete(args.type);
        }
    }

    private _cleanD() {
        this._eventsD.forEach((args, name) => {
            App.dispatcher.remove(args.type, args.target);
        });
        this._eventsD.clear();
    }

    private _onG(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        if (this._has(this._eventsG, args)) {
            return;
        }
        if (args.once) {
            cc.game.once(args.type, args.cb!, args.target);
        } else {
            cc.game.on(args.type, args.cb!, args.target);
        }
        this._eventsG.push(args);
    }

    private _offG(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        cc.game.off(args.type, args.cb, args.target);
        for (let i = 0; i < this._eventsG.length; i++) {
            const ele = this._eventsG[i];
            if (ele.type == args.type && ele.cb == args.cb && ele.target == ele.target) {
                this._eventsG.splice(i, 1);
                break;
            }
        }
    }

    private _cleanG() {
        for (let i = 0; i < this._eventsG.length; i++) {
            const ele = this._eventsG[i];
            cc.game.off(ele.type, ele.cb, ele.target);
        }
        this._eventsG = [];
    }

    private _onI(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        if (this._has(this._eventsI, args)) {
            return;
        }
        if (args.once) {
            cc.systemEvent.once(args.type as unknown as any, args.cb!, args.target);
        } else {
            cc.systemEvent.on(args.type as unknown as any, args.cb!, args.target);
        }
        this._eventsI.push(args);
    }

    private _offI(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        cc.systemEvent.off(args.type as unknown as any, args.cb, args.target);
        for (let i = 0; i < this._eventsI.length; i++) {
            const ele = this._eventsI[i];
            if (ele.type == args.type && ele.cb == args.cb && ele.target == ele.target) {
                this._eventsI.splice(i, 1);
                break;
            }
        }
    }

    private _cleanI() {
        for (let i = 0; i < this._eventsI.length; i++) {
            const ele = this._eventsI[i];
            cc.systemEvent.off(ele.type as unknown as any, ele.cb, ele.target);
        }
        this._eventsI = [];
    }

    private _onN(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        if (!cc.isValid(args.node)) {
            return;
        }
        if (args.once) {
            args.node?.once(args.type,args.cb,args.target,args.useCapture);
        } else {
            args.node?.on(args.type, args.cb!, args.target, args.useCapture);
        }
    }

    private _offN(args: EventAgrs) {
        if (!args.target) {
            args.target = this;
        }
        if (!cc.isValid(args.node)) {
            return;
        }
        args.node?.off(args.type,args.cb,args.target,args.useCapture);
    }

    private _cleanN() {
        
    }

    private _has(datas: EventAgrs[], args: EventAgrs) {
        for (let i = 0; i < datas.length; i++) {
            const element = datas[i];
            if (element.type == args.type &&
                element.cb == args.cb &&
                element.target == args.target) {
                return true;
            }
        }
        return false;
    }
}
