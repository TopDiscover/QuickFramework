import { DEBUG } from "cc/env";

/**@description 网络相关 */
export namespace Net {
	/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */
	export type HandleFunc = (handleTypeData: any) => number;
	
	export interface DecodeData{
		cmd: string,
		type: (new () => Message) | string, //解包类型	
	}

	export interface ListenerData extends DecodeData{
		func: HandleFunc, //处理函数
		isQueue: boolean,//是否进入消息队列，如果不是，收到网络消息返回，会立即回调处理函数
		data?: any, //解包后的数据
		target?: any, //处理者
	}
	export type Type = "ws" | "wss";
	export enum ServiceType {
		Unknown,
		Json,
		Proto,
		BinaryStream,
	}
	export interface HeartbeatClass<T extends Message> {
		type: ServiceType;
		new(): T;
	}

	export class RPCData implements DecodeData {
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
}

/**@description proto 网络相关 */
export namespace Proto {

	/**@description 绑定信息 */
	export interface BindConfig {
		/**@description cmd */
		cmd: string | number;
		/**@description  proto解析的类型名*/
		className: string;
	}

	/**@description 解析配置 */
	export interface decodeConfig {
		/**@description  proto解析的类型名*/
		className: string;
		/**@description proto网络字节流 */
		buffer: Uint8Array;
	}
}

