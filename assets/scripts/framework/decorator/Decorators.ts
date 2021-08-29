
/**
 * @description 各种装饰器定义
 */
import { Service } from "../support/net/service/Service";

export function injectService(service: Service) {
    return function (target: any) {
        let __load = target.prototype.onLoad;
        target.prototype.onLoad = function () {
            if ( CC_DEBUG ) cc.log(`[injectService] ${cc.js.getClassName(this)} ---onLoad----`);
            this.service = service;
            __load && __load.call(this);
        }
    }
}

/**
* @description 生成key 如果需要改变请 连带decorators 中的protoHandle 方法一起改动，这两个地方使用的同一个生成规则
* @param mainCmd 
* @param subCmd 
*/
export function makeKey(mainCmd: number, subCmd: number): string {
    let key = `[${mainCmd}]:[${subCmd}]`;
    return key;
}
