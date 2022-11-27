/**
 * 基础函数类
 */
 export class Common {
    /**
     * @description 添加日志
     * @param {*} message 
     * @param {*} obj 
     * @returns 
     */
    log(message: any, obj: any = null) {
        if (typeof obj == "function") {
            return;
        }
        if (obj) {
            Editor.log("[资源替换]", message, obj);
        } else {
            Editor.log("[资源替换]", message);
        }
    }
}