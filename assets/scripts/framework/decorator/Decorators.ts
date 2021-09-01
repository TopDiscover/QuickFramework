
/**
 * @description 各种装饰器定义
 */

import { js } from "cc"
import { DEBUG } from "cc/env"
import { Codec } from "../core/net/message/Message"

export function setServiceByClassName(name: string) {
    // if(CC_DEBUG)    
    return function (target: any) {
        let __load = target.prototype.onLoad
        target.prototype.onLoad = function () {
            if (DEBUG) {
                log(`[setService] ${js.getClassName(this)} onLoad`)
            }
            let service = Manager.serviceManager.getServiceByNmame(name)
            if (DEBUG && !service) {
                log(`[ByNameSetService] 在 ${js.getClassName(this)} 注入[${name}]失败! `)
                service = null
            }
            this._service = service
            __load && __load.call(this)
        }
    }
}
export function setService(service: Service) {
    return function (target: any) {
        let __load = target.prototype.onLoad
        target.prototype.onLoad = function () {
            if (DEBUG) {
                log(`[setService] ${js.getClassName(this)} onLoad`)
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
            if (DEBUG) {
                log(`[setServiceCodec] ${js.getClassName(this)} onLoad`)
            }
            if (this._service) {
                this._service.Codec = header
            }

            __load && __load.call(this)
        }
    }
}

export function setClassName() {
    return function (target:any) {
        let frameInfo = (<any>cc['_RF']).peek()
        let script = frameInfo.script;
        js.setClassName(script, target)
    }
}