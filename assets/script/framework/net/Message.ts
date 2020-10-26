

//ArrayBuffer转字符串
export function ab2str(buffer: ArrayBuffer): Promise<string | ArrayBuffer> {
    return new Promise((resolve) => {
        var b = new Blob([buffer]);
        var r = new FileReader();
        r.readAsText(b, 'utf-8');
        r.onload = () => { resolve(r.result) }
    });
}
//字符串转字符串ArrayBuffer
export function str2ab(str: string): Promise<string | ArrayBuffer> {
    return new Promise((resolve) => {
        var b = new Blob([str], { type: 'text/plain' });
        var r = new FileReader();
        r.readAsArrayBuffer(b);
        r.onload = () => { resolve(r.result) }
    });
}

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

/**@description 与服务器交互的消息 */
export class Message {
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd: number = 0;
    /**@description 发送或接收的消息流 */
    buffer: Uint8Array = null;

    /**@description 打包数据 */
    encode(): boolean {
        return true;
    }
    /**@description 解析数据 */
    decode(data: Uint8Array): boolean {
        return true;
    }
}