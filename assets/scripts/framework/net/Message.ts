import { USING_LITTLE_ENDIAN } from "../base/Defines";

/**@description utf-8 Uint8Array转字符串 */
export function Utf8ArrayToStr(array: any) {

    let decoder = new TextDecoder("utf-8");
    let result = decoder.decode(array);

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

export interface IMessage {
    /**@description 消息主cmd码 */
    mainCmd: number;
    /**@description 消息子cmd码 */
    subCmd: number;
    /**@description 发送或接收的消息流 */
    buffer: Uint8Array;
}

/**@description 与服务器交互的消息 */
export class Message implements IMessage {
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd: number = 0;
    /**@description 发送或接收的消息流 */
    buffer: Uint8Array = null!;

    /**@description 打包数据 */
    encode(): boolean {
        return true;
    }
    /**@description 解析数据 */
    decode(data: Uint8Array): boolean {
        return true;
    }
}

/**
 * @description 数据包头默认处理，如果各公司有差异，自行处理 
 * @example 示例以 mainCmd + subCmd + dataSize <=> 4 + 4 + 4
 */
export class MessageHeader implements IMessage {
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd: number = 0;
    /**@description 数据buffer */
    buffer: Uint8Array = null!;
    /**@description 数据大小 */
    private _dataSize: number = 0;
    /**
     * @description 通过当前数据包体，拼接数据包头，mainCmd subCmd 还在Message中
     * @param msg 数据体对象
     */
    encode(msg: Message): boolean {
        this.mainCmd = msg.mainCmd;
        this.subCmd = msg.subCmd;
        this._dataSize = 0;
        let offset = 0;

        /**第一种写法 */
        if (msg.buffer) {
            //如果有包体，先放入包体
            this._dataSize = msg.buffer.length;
        }

        let buffer = new ArrayBuffer(this._dataSize + this.headerSize);
        let dataView = new DataView(buffer);
        dataView.setUint32(offset,this.mainCmd,USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        dataView.setUint32(offset,this.subCmd,USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        dataView.setUint32(offset,this._dataSize,USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        if( msg.buffer ){
            //感觉这里的复制数据有点low啊
            for( let i = 0 ; i < msg.buffer.byteLength ; i++ ){
                dataView.setUint8(offset,msg.buffer[i]);
                offset += Uint8Array.BYTES_PER_ELEMENT;
            }
        }
        let result = new Uint8Array(dataView.buffer);

        this.buffer = result;
        return true;
    }
    /**
     * @description 解析mainCmd subCmd 到Message中，返回数据包体数据流 
     * @param data 网络数据流
     * @param msg 数据体对象，主要用来取出 mainCmd subCmd
     */
    decode(data: Uint8Array): boolean {
        let dataView = new DataView(data.buffer);
        //取包头
        let offset = 0;
        this.mainCmd = dataView.getUint32(offset, USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        this.subCmd = dataView.getUint32(offset, USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        this._dataSize = dataView.getUint32(offset, USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        let buffer = dataView.buffer.slice(offset, dataView.buffer.byteLength)
        this.buffer = new Uint8Array(buffer);
        return this._dataSize == this.buffer.length;
    }

    /**@description 总数据大小 */
    get size() {
        return this._dataSize + this.headerSize;
    }

    /**@description 包体大小 */
    get dataSize() {
        return this._dataSize;
    }

    /**@description 包头大小 */
    get headerSize() {
        return 3 * Uint32Array.BYTES_PER_ELEMENT;
    }
}