/**
 * @description 装饰器定义
 */

import GameView from "../core/ui/GameView";

const finddataKey = "[[Finddata]]"
const findOptions = "[[Findoption]]"

type FindOptionType = typeof cc.Component | typeof cc.Node;

interface FindOption {
    path: string;
    type: FindOptionType;
    member: string;
}

/**
 * @description bundle入口程序注册
 * @param className 入口类名
 * @param bundle bundle名
 * @param type GameView 类型
 * @returns 
 */
export function registerEntry(className: string, bundle: string, type: typeof GameView) {
    return function (target: any) {
        target["__classname__"] = className;
        target.bundle = bundle;
        App.entryManager.register(target, type)
    }
}

/**
 * @description 当onLoad时，按指定节点搜索路径，注入节点或组件到指定成员变量
 * @param path 相对于当前脚本this.node的搜索路径
 * @param type 查找组件类型
 * @returns 
 */
export function inject(path: string, type: FindOptionType) {
    return function (target: any, member: string) {
        if (!(target instanceof cc.Component)) {
            Log.e("无法注入,仅支持 Component 组件")
            return;
        }
        let obj: any = target;
        if (!Reflect.has(target, findOptions)) {
            let funName = "onLoad"
            let aHookFun = obj[funName];
            obj[funName] = function () {
                // Log.d(this, this.node.name)
                if (!Reflect.has(this, finddataKey)) {
                    Reflect.defineProperty(this, finddataKey, { value: {} })
                }
                let self: any = this
                let fOption = Reflect.get(self, findOptions)
                for (let key in fOption) {
                    let ele : FindOption = Reflect.get(fOption, key)
                    self.__defineGetter__(ele.member, function () {
                        if (!Reflect.has(self[finddataKey], key)) {
                            let node = cc.find(ele.path,self.node);
                            if ( cc.js.isChildClassOf(ele.type,cc.Component)){
                                let comp = node?.getComponent(ele.type as any);
                                if ( Reflect.has(self[finddataKey],key) ){
                                    self[finddataKey][key] = comp;
                                }else{
                                    Reflect.defineProperty(self[finddataKey],key,{ value : comp , writable : true});
                                }
                            }else{
                                if ( Reflect.has(self[finddataKey],key) ){
                                    self[finddataKey][key] = node;
                                }else{
                                    Reflect.defineProperty(self[finddataKey],key,{ value : node , writable : true});
                                }
                            }
                        }
                        return self[finddataKey][key]
                    })

                    self.__defineSetter__(ele.member, function (val: any) {
                        if (Reflect.has(self[finddataKey], key)) {
                            self[finddataKey][key] = val
                        } else {
                            Reflect.defineProperty(self[finddataKey], key, { value: val, writable: true })
                        }
                    })
                }
                aHookFun && Reflect.apply(aHookFun, this, arguments);
            }
            Reflect.defineProperty(target, findOptions, { value: {} })
        }

        let option: FindOption = { path: path, type: type, member: member }
        let attribute = "__" + member + "__"
        let fOption = Reflect.get(target, findOptions)
        Reflect.defineProperty(fOption, attribute, { value: option, enumerable: true })
    }
}