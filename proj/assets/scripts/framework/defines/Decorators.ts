/**
 * @description 装饰器定义
 */

import GameView from "../core/ui/GameView";

const __FIND_OPTIONS__ = "__FIND_OPTIONS__"

type FindOptionType = typeof cc.Component | typeof cc.Node;

interface FindOption {
    path: string;
    type: FindOptionType;
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
        if (Reflect.getOwnPropertyDescriptor(target, __FIND_OPTIONS__) === undefined) {
            Reflect.defineProperty(target, __FIND_OPTIONS__, {
                value: {}
            });
            //重写onLoad函数
            let __onLoad = obj.onLoad;
            obj.onLoad = function () {
                let desc = Reflect.getOwnPropertyDescriptor(target, __FIND_OPTIONS__);
                if (desc) {
                    let keys = Object.keys(desc.value);
                    keys.forEach(v => {
                        let key = v;
                        let option = desc?.value[key] as FindOption;
                        let node = cc.find(option.path, this.node);
                        if (cc.js.isChildClassOf(option.type, cc.Component)) {
                            this[key] = node?.getComponent(option.type as any);
                            if (CC_DEBUG) {
                                if (!this[key]) {
                                    Log.w(`${cc.js.getClassName(this)}.${member}无法找到${path}${cc.js.getClassName(option.type)}组件`)
                                }
                            }
                        } else {
                            this[key] = node;
                            if (CC_DEBUG) {
                                if (!this[key]) {
                                    Log.w(`${cc.js.getClassName(this)}.${member}无法找到${path}节点`)
                                }
                            }
                        }
                    })
                }
                __onLoad && Reflect.apply(__onLoad, this, arguments);
            }
        }

        if (obj[__FIND_OPTIONS__][member]) {
            throw `${cc.js.getClassName(target)}.${member}注入已经存在!!!`;
        }
        let option: FindOption = {
            path,
            type
        };
        obj[__FIND_OPTIONS__][member] = option;
    }
}