/**
 * @description 对cocos 进行扩展，本脚本以插件方式运行
 * 
 * 
 */

import { EDITOR } from "cc/env";
import { log } from "cc"

window.md5 = function md5(data) {
    return (<any>this).CryptoJS.MD5(data);
}

Date.prototype.format = function (format) {
    var date: any = {
        "M+": this.getMonth() + 1,
        "d+": this.getDate(),
        "h+": this.getHours(),
        "m+": this.getMinutes(),
        "s+": this.getSeconds(),
        "q+": Math.floor((this.getMonth() + 3) / 3),
        "S+": this.getMilliseconds()
    };
    if (/(y+)/i.test(format)) {
        format = format.replace(RegExp.$1, (this.getFullYear() + '').substr(4 - RegExp.$1.length));
    }
    for (var k in date) {
        if (new RegExp("(" + k + ")").test(format)) {
            format = format.replace(RegExp.$1, RegExp.$1.length == 1 ?
                date[k] : ("00" + date[k]).substr(("" + date[k]).length));
        }
    }
    return format;
};

/**@description 返回当前时间的秒数 */
Date.timeNow = function () {
    return Math.floor(Date.timeNowMillisecons() / 1000);
}
/**@description 返回当前时间的毫秒数 */
Date.timeNowMillisecons = function () {
    let now = new Date();
    return now.getTime();
}

String.format = function () {
    var param: any = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        param.push(arguments[i]);
    }
    var statment = param[0]; // get the first element(the original statement)
    if (typeof statment != "string") {
        if (!EDITOR)
            error(`String.format error,first param is not a string`);
        return "";
    }
    param.shift(); // remove the first element from array
    if (Array.isArray(param[0]) && param.length == 1) {
        param = param[0];
    }
    return statment.replace(/\{(\d+)\}/g, function (m, n) {
        return param[n];
    });
}

function toNamespace(key:string,value:any,namespace?:string):void{
    let space = createNamespace(namespace);
    if (typeof value == "object" ){
        if (!space[key]){
            space[key] = value;
        }else{
            let keys = Object.keys(value);
            keys.forEach((subKey,index,source)=>{
                space[key][subKey] = value[subKey];
            });
        }
    }else{
        space[key] = value;
    }
}

function createNamespace(namespace?:string) {
    let _window : any = window;
    if (!_window.td){
        _window.td = {};
    }
    if ( namespace && namespace.length > 0 ){
        if ( !_window.td[namespace] ){
            _window.td[namespace] = {}
        }
        return _window.td[namespace];
    }
    return _window.td;
}

window.toNamespace = toNamespace;

window.createNamespace = createNamespace;

/**@description 获取根据类型获取单列 */
function getSingleton<T>( SingletonClass : Singleton<T>){
    return SingletonClass.Instance();
}
window.getSingleton = getSingleton;
createNamespace();
export function extentionsInit() {
    createNamespace();
    if ( !EDITOR ){
        log("全局扩展初始化");
    }
}
