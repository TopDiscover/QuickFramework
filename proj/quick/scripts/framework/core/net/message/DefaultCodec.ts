import { Macro } from "../../../defines/Macros";
import { ByteArray } from "../../../plugin/ByteArray";
import { Codec, IMessage } from "./Message";

export interface MessageStruct extends IMessage{
    mainCmd: number
    subCmd: number
}
export class DefaultCodec extends Codec {
    /**@description 消息主cmd码 */
    mainCmd: number = 0;
    /**@description 消息子cmd码 */
    subCmd: number = 0;
    /**@description 数据buffer */
    buffer: Uint8Array = null!;
    headerSize: number = 3 * Uint32Array.BYTES_PER_ELEMENT;

    pack(data: MessageStruct): boolean {
        this.mainCmd = data.mainCmd;
        this.subCmd = data.subCmd;
        let dataSize = 0;
        /**第一种写法 */
        if (data.buffer) {
            //如果有包体，先放入包体
            dataSize = data.buffer.length;
        }

        let buffer = new ByteArray()
        buffer.endian = Macro.USING_LITTLE_ENDIAN;
        buffer.writeUnsignedInt(this.mainCmd);
        buffer.writeUnsignedInt(this.subCmd);
        buffer.writeUnsignedInt(dataSize);
        if ( data.buffer ){
            let dataBuffer = new ByteArray(data.buffer as Uint8Array);
            buffer.writeBytes(dataBuffer);
        }
        this.buffer = buffer.bytes;
        return true;
    }
    unPack(event: MessageEvent): boolean {
        let dataView = new ByteArray(event.data);
        dataView.endian = Macro.USING_LITTLE_ENDIAN;
        //取包头
        this.mainCmd = dataView.readUnsignedInt();
        this.subCmd = dataView.readUnsignedInt();
        let dataSize = dataView.readUnsignedInt();
        let buffer = dataView.buffer.slice(dataView.position)
        this.buffer = new Uint8Array(buffer);
        return dataSize == this.buffer.length;
    }


    get cmd(){return String(this.mainCmd) + String(this.subCmd);} 

}