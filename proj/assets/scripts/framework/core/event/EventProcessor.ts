/**
 * @description 事件处理组件
 */

export interface QuickEvent {
    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    addEvent(name: string, func: Function): void;
    removeEvent(eventName: string): void;
    addEvents(): void;
}

export default class EventProcessor implements QuickEvent {

    private _events: Map<string, Function> = new Map();

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    addEvent(name: string, func: Function) {
        if (this._events.has(name)) {
            Log.e(`${name} 重复注册`);
            return;
        }
        App.dispatcher.add(name, func, this);
        this._events.set(name, func);
    }

    removeEvent(eventName: string) {
        if (this._events.has(eventName)) {
            //事件移除
            App.dispatcher.remove(eventName, this);
            //删除本地事件
            this._events.delete(eventName);
        }
    }
    addEvents() {

    }

    onLoad(...args: any[]) {
        this.addEvents();
    }

    onDestroy(...args: any[]) {
        this._events.forEach((func, name) => {
            App.dispatcher.remove(name, this);
        });
        this._events.clear();
    }
}
