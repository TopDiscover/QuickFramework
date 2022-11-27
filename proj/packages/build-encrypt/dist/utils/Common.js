"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Common = void 0;
/**
 * 基础函数类
 */
class Common {
    /**
     * @description 添加日志
     * @param {*} message
     * @param {*} obj
     * @returns
     */
    log(message, obj = null) {
        if (typeof obj == "function") {
            return;
        }
        if (obj) {
            Editor.log("[资源替换]", message, obj);
        }
        else {
            Editor.log("[资源替换]", message);
        }
    }
}
exports.Common = Common;
