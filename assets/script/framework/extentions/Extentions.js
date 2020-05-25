/**
 * @description 对cocos 进行扩展，本脚本以插件方式运行
 * 
 * 
 */

window.md5 = function md5(data) {
    return this.CryptoJS.MD5(data);
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
    param.shift(); // remove the first element from array
    return statment.replace(/\{(\d+)\}/g, function (m, n) {
        return param[n];
    });
}

