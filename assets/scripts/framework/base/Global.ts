/**@description 请不要在此文件中引用其它文件 */
/**
 * @description 绑定对象到名字空间
 * @param key 
 * @param value 
 */
export function toNamespace(key:string,value:any):void{
    createNamespace();
    (<any>td)[key] = value;
}

export function createNamespace() {
    if (!window.td){
        (<any>window.td) = {};
    }
}

export const COMMON_LANGUAGE_NAME = "COMMON_LANGUAGE_NAME";

let TAG = {
    NetEvent: "NetEvent_",
};

export let EventApi = {
    NetEvent: {
        ON_OPEN: TAG.NetEvent + "ON_OPEN",
        ON_CLOSE: TAG.NetEvent + "ON_CLOSE",
        ON_ERROR: TAG.NetEvent + "ON_ERROR",
    },
    AdaptScreenEvent: "AdaptScreenEvent",
    CHANGE_LANGUAGE: "CHANGE_LANGUAGE",
}

export enum CustomNetEventType {
    /**@description 应用层主动调用网络层close */
    CLOSE = "CustomClose",
}

/**@description 网络数据全以大端方式进行处理 */
export const USING_LITTLE_ENDIAN = false;

/**@description 语言包路径使用前缀 */
export const USING_LAN_KEY = "i18n.";

/**@description 是否允许游戏启动后切换语言 */
export const ENABLE_CHANGE_LANGUAGE = true;

/**@description 远程资源bundle名 */
export const BUNDLE_REMOTE = "__Remote__Caches__";

/**@description resources 目录bundle名 */
export const BUNDLE_RESOURCES = 'resources';