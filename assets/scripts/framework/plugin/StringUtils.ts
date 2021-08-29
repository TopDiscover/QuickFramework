/**@description utf-8 Uint8Array转字符串 */
export function Utf8ArrayToStr(array) {
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

export function StringToUtf8Array(data: string) {

    // 可惜支持率太底了，用不了
    // let encoder = new TextEncoder();
    // let temp = encoder.encode(data);

    let bytes = utf8ToBytes(data)
    let result = new Uint8Array(bytes);
    return result
}

/**@description utf8字符串转字节序 */
function utf8ToBytes(string: string, units?: any) {
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