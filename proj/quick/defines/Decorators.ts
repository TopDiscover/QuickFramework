/**
 * @description 装饰器定义
 */

import { Component, find, isValid, js, Node } from "cc";
import { DEBUG } from "cc/env";
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

function initWaitToApp(){
    if ( typeof WaitToApp == "undefined" ){
        WaitToApp = {} as any;
        (<any>window)["WaitToApp"] = WaitToApp;
    }
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
        if ( typeof App == "object" ){
            target["__classname__"] = className;
            target.bundle = bundle;
            App.entryManager.register(target, type)
        }else{
            initWaitToApp();
            if ( !WaitToApp.entrys ){
                WaitToApp.entrys = {};
            }
            let name = `${className}|${bundle}`;
            if ( !WaitToApp.entrys[name] ){
                WaitToApp.entrys[name] = { target , type};
            }
        }
    }
}

/**@description 待注册信息重新注入到App中 */
export function toApp(){
    if (typeof WaitToApp == "object") {
        if (typeof WaitToApp.entrys == "object") {
            Object.keys(WaitToApp.entrys).forEach(v => {
                let [className, bundle] = v.split("|");
                let { target , type } = WaitToApp.entrys[v];
                target["__classname__"] = className;
                target.bundle = bundle;
                App.entryManager.register(target, type as any)
            })
        }
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
 * @description 当onLoad时，自动对所有注入的成员变量设置set&get方法,当成员变量首次调用时对成员变量赋值
 * @param path 相对于当前脚本this.node的搜索路径,当rootPath非空，则以rootPath为根节点查找
 * @param type 查找组件类型
 * @param rootPath 相对于this.node 的搜索路径，不传入时，以当的this.node为根节点进行查找
 * @returns 
 */
function injectComp<T extends Component | Node>(path: string, type: FIND_TYPE<T>, rootPath?: string) {
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
                                let node = self.node;
                                if (ele.root) {
                                    let rootMemberName = `__${ele.root.replace(/\//g, "_")}`
                                    if (!isValid(self[rootMemberName])) {
                                        self[rootMemberName] = __find(ele.root, node, Node);
                                    }
                                    node = self[rootMemberName];
                                    if (DEBUG && !isValid(node)) {
                                        Log.e(`${js.getClassName(self)}.${ele.root}节点不存在!!!`)
                                    }
                                }

                                if (!isValid(self[key])) {
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


            let __onDestroy = obj.onDestroy
            obj.onDestroy = function () {
                let self = this;
                let fOption = Reflect.get(self, _FIND_OPTIONS_)
                for (let key in fOption) {
                    let ele: FindOption<T> = Reflect.get(fOption, key)
                    Reflect.deleteProperty(self, ele.member);
                }
                __onDestroy && Reflect.apply(__onDestroy, this, arguments);
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
interface INJECT_OPTION {
    type: any,
    member: string,
    tag: InjectType,
}

function _inject<T extends Logic | GameData | ISingleton>(type: ({ new(): T } | string), tag: InjectType) {
    return function (target: any, member: string) {
        let obj: any = target;
        let __onLoad = obj.onLoad;
        if (!__onLoad) {
            Log.e("无法注入")
            return;
        }
        if (!Reflect.has(target, __MEMBER_INJECT__)) {
            obj.onLoad = function () {
                let self = this;
                let fOption = Reflect.get(self, __MEMBER_INJECT__);
                for (let key in fOption) {
                    const ele: INJECT_OPTION = Reflect.get(fOption, key)
                    if (!Reflect.get(self, ele.member)) {
                        Reflect.defineProperty(self, ele.member, {
                            enumerable: true,
                            configurable: true,
                            get() {
                                if (ele.tag == "logic") {
                                    return App.logicManager.get(ele.type, false);
                                } else if (ele.tag == "singleton") {
                                    return Singleton.get(ele.type, false);
                                } else if (ele.tag == "data") {
                                    return App.dataCenter.get(ele.type, false);
                                } else if (ele.tag == "service") {
                                    return App.serviceManager.get(ele.type, false);
                                } else if (ele.tag == "handler") {
                                    return App.handlerManager.get(ele.type, false);
                                }
                                return null;
                            },
                        })
                    }
                }
                __onLoad && Reflect.apply(__onLoad, this, arguments);
            };

            let __onDestroy = obj.onDestroy
            obj.onDestroy = function () {
                let self = this;
                let fOption = Reflect.get(self, __MEMBER_INJECT__)
                for (let key in fOption) {
                    let ele: FindOption<T> = Reflect.get(fOption, key)
                    Reflect.deleteProperty(self, ele.member);
                }
                __onDestroy && Reflect.apply(__onDestroy, this, arguments);
            }

            Reflect.defineProperty(target, __MEMBER_INJECT__, { value: {} });
        }

        let option: INJECT_OPTION = { type, member, tag };
        let attribute = `__member_inject_${member}`;
        let fOption = Reflect.get(target, __MEMBER_INJECT__)
        Reflect.defineProperty(fOption, attribute, {
            value: option,
            enumerable: true,
        });
    }
}

/**
 * @description 当onLoad时，自动对所有注入的成员变量设置set&get方法,当成员变量首次调用时对成员变量赋值
 * @param path 相对于当前脚本this.node的搜索路径,当rootPath非空，则以rootPath为根节点查找
 * @param type 查找组件类型
 * @param rootPath 相对于this.node 的搜索路径，不传入时，以当的this.node为根节点进行查找
 * @returns 
 */
export function inject<T extends Component | Node>(path: string, type: FIND_TYPE<T>, rootPath?: string):Function;
/**
 * @description 注入
 * @param data 
 */
export function inject<T extends Logic>(data: InjectParam<T>):Function;
export function inject<T extends GameData>(data: InjectParam<T>):Function;
export function inject<T extends ISingleton>(data: InjectParam<T>):Function;
export function inject<T extends WSService>(data: InjectParam<T>):Function;
export function inject<T extends Handler>(data: InjectParam<T>):Function;
export function inject() : Function{
    if (typeof arguments[0] == "string") {
        let path = arguments[0];
        let type = arguments[1];
        let root = undefined;
        if (arguments.length >= 3) {
            root = arguments[2];
        }
        return injectComp(path, type, root);
    } else {
        let data: InjectParam<unknown> = arguments[0];
        return _inject(data.type as any, data.name);
    }
}