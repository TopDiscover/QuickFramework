/**
 * @description 装饰器定义
 */

import GameView from "../core/ui/GameView";

export function registerEntry(className:string,bundle:string,type:typeof GameView){
    return function(target : any){
        target["__classname__"] = className;
        target.bundle = bundle;
        App.entryManager.register(target,type)
    }
}
