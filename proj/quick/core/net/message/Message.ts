import { DEBUG } from "cc/env";

export abstract class IMessage {
    /**@description 发送或接收的字节数据流 */
    abstract buffer: SocketBuffer;
    /**@description 消息命令码 */
    abstract get cmd(): string | number
}

export abstract class MessageHead extends IMessage {
    //编码数据
    abstract encode(data: IMessage): boolean
    //解码数据
    abstract decode(data: MessageEvent): boolean
}


export abstract class Message extends IMessage {
    //编码数据
    abstract encode(): boolean
    //解码数据
    abstract decode(data: SocketBuffer): boolean
}

export class RPCData {
    constructor(
        cmd : string, 
        send : Message, 
        type : { new (): Message } | string ,
        resolve : (data : any) => void,
        timeout : number,
    ) {
        this.cmd = cmd;
        this.send = send;
        this.resolve = resolve;
        this.timeout = timeout;
        this.type = type;
        this._timeOutId = setTimeout(() => {
            DEBUG && Log.e(`${this.cmd} 超时`);
            this.onTimeout?.();
            this.resolve(null);
        }, timeout);
    }
    cmd: string;
    send: Message;
    resolve: (data: any) => void;
    timeout: number;
    type : { new (): Message } | string ;
    private _timeOutId: number = -1
    onTimeout : () => void = null!;
    stop(){
        clearTimeout(this._timeOutId);
    }
}