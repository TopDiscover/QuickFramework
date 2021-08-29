import { Codec } from "./Message";

interface MessageStruct {
    mainCmd: number
    subCmd: number
    buffer: Uint8Array
}
export class DefaultCodec extends Codec {
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd: number = 0;
    /**@description 数据buffer */
    buffer: Uint8Array = null!;
    /**@description 数据大小 */
    private _dataSize: number = 0;
    headerSize: number = 3 * Uint32Array.BYTES_PER_ELEMENT;
    /**
     * @description 通过当前数据包体，拼接数据包头，mainCmd subCmd 还在Message中
     * @param msg 数据体对象
     */


    getData(): any { return this.buffer }

    pack(data: MessageStruct): boolean {
        this.mainCmd = data.mainCmd;
        this.subCmd = data.subCmd;
        this._dataSize = 0;
        let offset = 0;

        /**第一种写法 */
        if (data.buffer) {
            //如果有包体，先放入包体
            this._dataSize = data.buffer.length;
        }

        let buffer = new ArrayBuffer(this._dataSize + this.headerSize);
        let dataView = new DataView(buffer);
        dataView.setUint32(offset, this.mainCmd, td.Macro.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        dataView.setUint32(offset, this.subCmd, td.Macro.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        dataView.setUint32(offset, this._dataSize, td.Macro.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        if (data.buffer) {
            //感觉这里的复制数据有点low啊
            for (let i = 0; i < data.buffer.byteLength; i++) {
                dataView.setUint8(offset, data.buffer[i]);
                offset += Uint8Array.BYTES_PER_ELEMENT;
            }
        }
        let result = new Uint8Array(dataView.buffer);

        this.buffer = result;
        return true;
    }
    unPack(data: any): boolean {
        let dataView = new DataView(data.buffer);
        //取包头
        let offset = 0;
        this.mainCmd = dataView.getUint32(offset, td.Macro.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        this.subCmd = dataView.getUint32(offset, td.Macro.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        this._dataSize = dataView.getUint32(offset, td.Macro.USING_LITTLE_ENDIAN);
        offset += Uint32Array.BYTES_PER_ELEMENT;
        let buffer = dataView.buffer.slice(offset, dataView.buffer.byteLength)
        this.buffer = new Uint8Array(buffer);
        return this._dataSize == this.buffer.length;
    }


    getMsgID(): string {
        return String(this.mainCmd) + String(this.subCmd)
    }

}