import { Macro } from "../../defines/Macros";

/**@description 这个地方做下特殊处理，防止外面的人进行修改 */
const addListeners = Symbol("addListeners");
const removeEventListeners = Symbol("removeEventListeners");


export class Logic {
    /**@description logic bundle，管理器设置 */
    static bundle = Macro.UNKNOWN;
    /**@description logic bundle，管理器设置 */
    bundle: string = Macro.UNKNOWN;

    protected gameView : GameView = null!;

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

    /**@description 重置游戏逻辑 */
    reset( gameView : GameView ) {

    }

    onLoad( gameView : GameView ):void{
        this.gameView = gameView;
        this.addEvents();
        this[addListeners]();
    }
    update(dt: number): void{}
    onDestroy():void{
        this[removeEventListeners]();
    }


    private [addListeners]() {
        this._events.forEach((func,name)=>{
            Manager.dispatcher.add(name,func,this);
        });
    }

    private [removeEventListeners]() {
        this._events.forEach((func,name)=>{
            Manager.dispatcher.remove(name,this);
        });
        this._events.clear();
    }
}