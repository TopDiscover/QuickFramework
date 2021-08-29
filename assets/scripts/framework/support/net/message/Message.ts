
abstract class IMessage {
    //等待发送数据
    abstract get Data(): any
    abstract get MsgID(): string
}

export abstract class Codec extends IMessage {
    //编码数据
    abstract Pack(data: any): boolean
    //解码数据
    abstract UnPack(data: any): boolean
}


export abstract class Message extends IMessage {
    //编码数据
    abstract Encode(): boolean
    //解码数据
    abstract Decode(data: any): boolean
}