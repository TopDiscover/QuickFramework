/**
 * @description 装饰器定义
 */

import { Component, find, isValid, js, Node } from "cc";
import GameView from "../core/ui/GameView";
const _FIND_OPTIONS_ = "_FIND_OPTIONS_"

interface FIND_TYPE<T> {
    new(): T;
}

interface FindOption<T> {
    path: string;
    type: FIND_TYPE<T>;
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


function __find<T>(path: string, node: Node, type: FIND_TYPE<T>) {
    let temp = find(path, node);
    if (js.isChildClassOf(type, Component)) {
        let comp = temp?.getComponent(type)
        return comp;
    }
    return temp;
}

/**
 * @description 当onLoad时，按指定节点搜索路径，注入节点或组件到指定成员变量
 * @param path 相对于当前脚本this.node的搜索路径
 * @param type 查找组件类型
 * @returns 
 */
export function inject<T extends Component | Node>(path: string, type: FIND_TYPE<T>) {
    return function (target: any, member: string) {
        if (!(target instanceof Component)) {
            Log.e("无法注入,仅支持 Component 组件")
            return;
        }
        let obj: any = target;
        if (!Reflect.has(target, _FIND_OPTIONS_)) {
            let __onLoad = obj.onLoad
            obj.onLoad = function () {
                let self = this;
                let fOption = Reflect.get(self, _FIND_OPTIONS_)
                for (let key in fOption) {
                    let ele: FindOption<T> = Reflect.get(fOption, key)
                    if (!Reflect.get(self, ele.member)) {
                        Reflect.defineProperty(self, ele.member, {
                            enumerable: true,
                            configurable: true,
                            get() {
                                if (!isValid(self[key])) {
                                    self[key] = __find(ele.path, self.node, ele.type);
                                }
                                return self[key];
                            },
                            set(v) {
                                self[key] = v;
                            }
                        })
                    }
                }
                __onLoad && Reflect.apply(__onLoad, this, arguments);
            }
            Reflect.defineProperty(target, _FIND_OPTIONS_, { value: {} })
        }

        let option: FindOption<T> = { path: path, type: type, member: member }
        let attribute = `__${member}`
        let fOption = Reflect.get(target, _FIND_OPTIONS_)
        Reflect.defineProperty(fOption, attribute, { value: option, enumerable: true })
    }
}