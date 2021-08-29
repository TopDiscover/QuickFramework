/**
 * @description 全局函数扩展 
 */

window.md5 = function md5(data) {
    return CryptoJS.MD5(data);
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

/**@description utf8字符串转字节序 */
function utf8ToBytes(string, units) {
    units = units || Infinity
    let codePoint
    const length = string.length
    let leadSurrogate = null
    const bytes = []

    for (let i = 0; i < length; ++i) {
        codePoint = string.charCodeAt(i)

        // is surrogate component
        if (codePoint > 0xD7FF && codePoint < 0xE000) {
            // last char was a lead
            if (!leadSurrogate) {
                // no lead yet
                if (codePoint > 0xDBFF) {
                    // unexpected trail
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                } else if (i + 1 === length) {
                    // unpaired lead
                    if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                    continue
                }

                // valid lead
                leadSurrogate = codePoint

                continue
            }

            // 2 leads in a row
            if (codePoint < 0xDC00) {
                if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
                leadSurrogate = codePoint
                continue
            }

            // valid surrogate pair
            codePoint = (leadSurrogate - 0xD800 << 10 | codePoint - 0xDC00) + 0x10000
        } else if (leadSurrogate) {
            // valid bmp char, but last char was a lead
            if ((units -= 3) > -1) bytes.push(0xEF, 0xBF, 0xBD)
        }

        leadSurrogate = null

        // encode utf8
        if (codePoint < 0x80) {
            if ((units -= 1) < 0) break
            bytes.push(codePoint)
        } else if (codePoint < 0x800) {
            if ((units -= 2) < 0) break
            bytes.push(
                codePoint >> 0x6 | 0xC0,
                codePoint & 0x3F | 0x80
            )
        } else if (codePoint < 0x10000) {
            if ((units -= 3) < 0) break
            bytes.push(
                codePoint >> 0xC | 0xE0,
                codePoint >> 0x6 & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
            )
        } else if (codePoint < 0x110000) {
            if ((units -= 4) < 0) break
            bytes.push(
                codePoint >> 0x12 | 0xF0,
                codePoint >> 0xC & 0x3F | 0x80,
                codePoint >> 0x6 & 0x3F | 0x80,
                codePoint & 0x3F | 0x80
            )
        } else {
            throw new Error('Invalid code point')
        }
    }

    return bytes
}

/**@description utf-8 Uint8Array转字符串 */
window.Utf8ArrayToString = function (array) {
    let out, i, len, c;
    let char2, char3;
    out = "";
    len = array.length;
    i = 0;
    while (i < len) {
        c = array[i++];
        switch (c >> 4) {
            case 0: case 1: case 2: case 3: case 4: case 5: case 6: case 7:
                // 0xxxxxxx
                out += String.fromCharCode(c);
                break;
            case 12: case 13:
                // 110x xxxx   10xx xxxx
                char2 = array[i++];
                out += String.fromCharCode(((c & 0x1F) << 6) | (char2 & 0x3F));
                break;
            case 14:
                // 1110 xxxx  10xx xxxx  10xx xxxx
                char2 = array[i++];
                char3 = array[i++];
                out += String.fromCharCode(((c & 0x0F) << 12) |
                    ((char2 & 0x3F) << 6) |
                    ((char3 & 0x3F) << 0));
                break;
        }
    }
    return out;
}

/**@description utf8字符串转Uint8Array */
window.StringToUtf8Array = function( data ){
    let bytes = utf8ToBytes(data)
    let result = new Uint8Array(bytes);
    return result
}

function toNamespace(key, value, namespace) {
    let space = createNamespace(namespace);
    if (typeof value == "object") {
        if (!space[key]) {
            space[key] = value;
        } else {
            let keys = Object.keys(value);
            keys.forEach((subKey, index, source) => {
                space[key][subKey] = value[subKey];
            });
        }
    } else {
        space[key] = value;
    }
}

function createNamespace(namespace) {
    let _window = window;
    if (!_window.td) {
        _window.td = {};
    }
    if (namespace && namespace.length > 0) {
        if (!_window.td[namespace]) {
            _window.td[namespace] = {}
        }
        return _window.td[namespace];
    }
    return _window.td;
}

window.toNamespace = toNamespace;

window.createNamespace = createNamespace;

/**@description 获取根据类型获取单列 */
function getSingleton(SingletonClass) {
    return SingletonClass.Instance();
}
window.getSingleton = getSingleton;
createNamespace();
