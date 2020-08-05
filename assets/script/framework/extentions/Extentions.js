/**
 * @description 对cocos 进行扩展，本脚本以插件方式运行
 * 
 * 
 */

window.md5 = function md5(data) {
    return this.CryptoJS.MD5(data);
}

window.makeRemoteUrl = function (remoteUrl) {
    return `${remoteUrl.path}/${remoteUrl.fileName}`;
}

window.parseRemoteUrl = function (url) {
    url = url.replace(/\s*/g, "");

    let data = { url: null, path: null, fileName: null };
    data.url = url;
    //摘取文件
    let fileName = data.url.slice(data.url.lastIndexOf("/") + 1);
    let fileDir = data.url.substr(0, data.url.length - fileName.length - 1);
    let md5path = fileDir;
    if (CC_JSB) {
        md5path = window.md5(fileDir).toString();
        data.path = md5path;
    } else {
        data.path = fileDir;
    }
    data.fileName = fileName;
    return data;
}

Date.prototype.format = function (format) {
    var date = {
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
    var param = [];
    for (var i = 0, l = arguments.length; i < l; i++) {
        param.push(arguments[i]);
    }
    var statment = param[0]; // get the first element(the original statement)
    if ( typeof statment != "string" ){
        cc.error(`String.format error,first param is not a string`);
        return "";
    }
    param.shift(); // remove the first element from array
    if ( Array.isArray(param[0]) && param.length == 1 ){
        param = param[0];
    }
    return statment.replace(/\{(\d+)\}/g, function (m, n) {
        return param[n];
    });
}

