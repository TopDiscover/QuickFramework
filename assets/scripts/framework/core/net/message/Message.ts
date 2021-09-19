
export abstract class IMessage {
    /**@description 发送或接收的字节数据流 */
    abstract buffer: SocketBuffer;
    /**@description 消息命令码 */
    abstract get cmd(): string | number
}

export abstract class Codec extends IMessage {
    //编码数据
    abstract pack(data: IMessage): boolean
    //解码数据
    abstract unPack(data: MessageEvent): boolean
}


export abstract class Message extends IMessage {
    //编码数据
    abstract encode(): boolean
    //解码数据
    abstract decode(data: SocketBuffer): boolean
}
