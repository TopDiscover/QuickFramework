
/**
 * @description 各种装饰器定义
 */
import { Codec } from "../support/net/message/Message";
import { Service } from "../support/net/service/Service";

// export function injectService(service: Service) {
//     return function (target: any) {
//         let __load = target.prototype.onLoad;
//         target.prototype.onLoad = function () {
//             if (CC_DEBUG) cc.log(`[injectService] ${cc.js.getClassName(this)} ---onLoad----`);
//             this._service = service;
//             __load && __load.call(this);
//         }
//     }
// }

// /**
// * @description 生成key 如果需要改变请 连带decorators 中的protoHandle 方法一起改动，这两个地方使用的同一个生成规则
// * @param mainCmd 
// * @param subCmd 
// */
// export function makeKey(mainCmd: number, subCmd: number): string {
//     let key = `[${mainCmd}]:[${subCmd}]`;
//     return key;
// }



export function setServiceByClassName(name: string) {
    // if(CC_DEBUG)    
    return function (target: any) {
        let __load = target.prototype.onLoad
        target.prototype.onLoad = function () {
            if (CC_DEBUG) {
                cc.log(`[setService] ${cc.js.getClassName(this)} onLoad`)
            }
            let service = Manager.serviceManager.getServiceByNmame(name)
            if (CC_DEBUG && !service) {
                cc.log(`[ByNameSetService] 在 ${cc.js.getClassName(this)} 注入[${name}]失败! `)
                service = null
            }
            this._service = service
            __load && __load.call(this)
        }
    }
}
export function setService(service: Service) {
    return function (target: any) {
        debugger
        let __load = target.prototype.onLoad
        target.prototype.onLoad = function () {
            if (CC_DEBUG) {
                cc.log(`[setService] ${cc.js.getClassName(this)} onLoad`)
            }
            this._service = service
            __load && __load.call(this)
        }
    }
}

export function setServiceCodec(header: typeof Codec) {
    return function (target: any) {
        let __load = target.prototype.onLoad
        target.prototype.onLoad = function () {
            if (CC_DEBUG) {
                cc.log(`[setServiceCodec] ${cc.js.getClassName(this)} onLoad`)
            }
            if (this._service) {
                this._service.Codec = header
            }

            __load && __load.call(this)
        }
    }
}