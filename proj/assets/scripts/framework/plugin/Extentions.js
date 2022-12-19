/**
 * @description 全局函数扩展 
 */

window.md5 = function md5(data) {
    return CryptoJS.MD5(data);
}

Date.prototype.format = function (format) {

    let self = this;
    let date = {
        "M+": self.getMonth() + 1,
        "d+": self.getDate(),
        "h+": self.getHours(),
        "m+": self.getMinutes(),
        "s+": self.getSeconds(),
        "q+": Math.floor((self.getMonth() + 3) / 3),
        "S+": self.getMilliseconds()
    };
    
    let replaceYear = function(){
        return self.getFullYear().toString();
    }
    format = format.replace(/(y+)/i,replaceYear)
    
    let replace = function(){
        let $2 = arguments[2];
        let value = date[arguments[0]];
        let str = $2.length == 1 ? `${value}` : `00${value}`.substring(value.toString().length);
        return str
    }
    for (let k in date) {
        format = format.replace(new RegExp(`(${k})`),replace.bind(null,k))
    }
    return format;
};

/**@description 返回当前时间的秒数 */
Date.timeNow = function () {
    return Math.floor(Date.now() / 1000);
}

/**@description 返回当前时间格式化后的字符串 */
Date.format = function(format,date){
    if ( date ){
        return date.format(format);
    }else{
        let now = new Date();
        return now.format(format);
    }
}

String.format = function () {
    var param = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        param.push(arguments[i]);
    }
    var statment = param[0]; // get the first element(the original statement)
    if (typeof statment != "string") {
        if (!EDITOR)
            console.error(`String.format error,first param is not a string`);
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

window.Log = console;
window.Log.e = console.error;
window.Log.d = console.log;
window.Log.w = console.warn;
window.Log.dump = console.debug;
