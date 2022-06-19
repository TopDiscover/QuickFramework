/**
 * @description 事件处理组件
 */
export default class OnlyEventComponent {

    get node() {
        return Manager.uiManager.componentRoot;
    }

    private _events: Map<string, Function> = new Map();

    /**
     * 注册事件 ，在onLoad中注册，在onDestroy自动移除
     * @param name 
     * @param func 
     */
    protected addEvent(name: string, func: Function) {
        if (this._events.has(name)) {
            Log.e(`${name} 重复注册`);
            return;
        }
        Manager.dispatcher.add(name, func, this);
        this._events.set(name, func);
    }

    protected removeEvent(eventName: string) {
        if (this._events.has(eventName)) {
            //事件移除
            Manager.dispatcher.remove(eventName, this);
            //删除本地事件
            this._events.delete(eventName);
        }
    }
    protected addEvents() {

    }

    onLoad() {
        this.addEvents();
    }

    onDestroy() {
        this._events.forEach((func, name) => {
            Manager.dispatcher.remove(name, this);
        });
        this._events.clear();
    }
}
