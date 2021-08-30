
export abstract class IMessage {
    //等待发送数据
    abstract getData(): any
    abstract getMsgID(): string
}

export abstract class Codec extends IMessage {
    //编码数据
    abstract pack(data: any): boolean
    //解码数据
    abstract unPack(data: any): boolean
}


export abstract class Message extends IMessage {
    //编码数据
    abstract encode(): boolean
    //解码数据
    abstract decode(data: any): boolean
}