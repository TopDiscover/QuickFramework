/**
 * @description 装饰器定义
 */

import GameView from "../core/ui/GameView";
import { GameData } from "../data/GameData";
import { Singleton } from "../utils/Singleton";
const _FIND_OPTIONS_ = "_FIND_OPTIONS_"

interface FIND_TYPE<T> {
    new(): T;
}

interface FindOption<T> {
    path: string;
    type: FIND_TYPE<T>;
    member: string;
    root?: string;
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


function __find<T>(path: string, node: cc.Node, type: FIND_TYPE<T>) {
    let temp = cc.find(path, node);
    if (cc.js.isChildClassOf(type, cc.Component)) {
        let comp = temp?.getComponent(type)
        return comp;
    }
    return temp;
}

/**
 * @description 当onLoad时，自动对所有注入的成员变量设置set&get方法,当成员变量首次调用时对成员变量赋值
 * @param path 相对于当前脚本this.node的搜索路径,当rootPath非空，则以rootPath为根节点查找
 * @param type 查找组件类型
 * @param rootPath 相对于this.node 的搜索路径，不传入时，以当的this.node为根节点进行查找
 * @returns 
 */
export function inject<T extends cc.Component | cc.Node>(path: string, type: FIND_TYPE<T>, rootPath?: string) {
    return function (target: any, member: string) {
        if (!(target instanceof cc.Component)) {
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
                                let node = self.node;
                                if (ele.root) {
                                    let rootMemberName = `__${ele.root.replace(/\//g, "_")}`
                                    if (!cc.isValid(self[rootMemberName])) {
                                        self[rootMemberName] = __find(ele.root, node, cc.Node);
                                    }
                                    node = self[rootMemberName];
                                    if (CC_DEBUG && !cc.isValid(node)) {
                                        Log.e(`${cc.js.getClassName(self)}.${ele.root}节点不存在!!!`)
                                    }
                                }

                                if (!cc.isValid(self[key])) {
                                    self[key] = __find(ele.path, node, ele.type);
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

        let option: FindOption<T> = { path: path, type: type, member: member, root: rootPath }
        let attribute = `__${member}`
        let fOption = Reflect.get(target, _FIND_OPTIONS_)
        Reflect.defineProperty(fOption, attribute, { value: option, enumerable: true })
    }
}

const __MEMBER_INJECT__ = "__MEMBER_INJECT__";

function _inject<T extends Logic | GameData | ISingleton>(type: ({ new(): T } | string), tag: "logic" | "data" | "singleton" | "service") {
    return function (target: any, member: string) {
        let obj: any = target;
        let __onLoad = obj.onLoad;
        if (!__onLoad) {
            Log.e("无法注入")
            return;
        }
        if (!Reflect.has(target, __MEMBER_INJECT__)) {
            let self = this;
            obj.onLoad = function () {
                let self = this;
                let fOption = Reflect.get(self, __MEMBER_INJECT__);
                for (let key in fOption) {
                    const ele = Reflect.get(fOption, key)
                    if (!Reflect.get(self, ele.member)) {
                        Reflect.defineProperty(self, ele.member, {
                            enumerable: true,
                            configurable: true,
                            get() {
                                if (ele.tag == "logic") {
                                    return App.logicManager.get(ele.type,false);
                                } else if (ele.tag == "singleton") {
                                    return Singleton.get(ele.type,false);
                                } else if (ele.tag == "data") {
                                    return App.dataCenter.get(ele.type,false);
                                } else if (ele.tag == "service"){
                                    return App.serviceManager.get(ele.type,false);
                                }
                            },
                        })
                    }
                }
                __onLoad && Reflect.apply(__onLoad, this, arguments);
            };

            Reflect.defineProperty(target, __MEMBER_INJECT__, { value: {} });
        }

        let option = { type, member, tag };
        let attribute = `__member_inject_${member}`;
        let fOption = Reflect.get(target, __MEMBER_INJECT__)
        Reflect.defineProperty(fOption, attribute, {
            value: option,
            enumerable: true,
        });
    }
}

/**
 * @description 注入Logic,要先创建了，才能注入
 * @param type 
 * @returns 
 */
export function injectLogic<T extends Logic>(type: ({ new(): T } | string) ) {
    return _inject(type,"logic");
}

/**
 * @description 注入Data,要先创建了，才能注入
 * @param type 
 * @returns 
 */
export function injectData<T extends GameData>(type: ({ new(): T } | string) ) {
   return _inject(type,"data");
}

/**
 * @description 单列注入，需要先创建，才能注入
 * @param type 
 * @returns 
 */
export function injectSingleton<T extends ISingleton>(type: ({ new(): T } | string)) {
    return _inject(type,"singleton")
}

export function injectService< T extends Service >( type : ({ new(): T } | string)){
    return _inject(type,"service")
}