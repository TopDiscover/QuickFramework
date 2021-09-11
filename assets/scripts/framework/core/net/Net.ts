/**@description 网络相关 */
export namespace Net {
	/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */
	export type HandleFunc = (handleTypeData: any) => number;
	export interface ListenerData {
		cmd : string,//事件名，如果是主命令跟子命令，按自己的需要返回固定组合如，mainCmd 1 subCmd 2 eventName = "1_2" | "12" 单个消夏码直接返回 "1"
		func: HandleFunc, //处理函数
		type: (new() => Message) | string, //解包类型
		isQueue: boolean,//是否进入消息队列，如果不是，收到网络消息返回，会立即回调处理函数
		data?: any, //解包后的数据
		target?: any, //处理者
	}
	export type Type = "ws" | "wss";
	/**@description 网络事件 */
	export enum NetEvent {
		/**@description 网络打开 */
		ON_OPEN = "NetEvent_ON_OPEN",
		/**@description 网络关闭 */
		ON_CLOSE = "NetEvent_ON_CLOSE",
		/**@description 网络错误 */
		ON_ERROR = "NetEvent_ON_ERROR",
		/**@description 应用层主动调用网络层close */
		ON_CUSTOM_CLOSE = "NetEvent_ON_CUSTOM_CLOSE",
	}
	export interface ServiceEvent{
		service: Service;
		event : Event;
	}
	export enum ServiceType {
		Unknown,
		Json,
		Proto,
		BinaryStream,
	}
	export interface HeartbeatClass<T extends Message>{
		type : ServiceType;
		new():T;
	}
	export interface ProtoConfig{
		/**@description 命令码 */
		cmd : string | number;
		/**@description proto文件路径 */
		url : string;
		/**@description 所有bundle */
		bundle : BUNDLE_TYPE;
		/**@description proto Root 可不用设置，由内部创建，这个root后面在看看，现在是每个proto都会自己创建一个root */
		root ?: protobuf.Root;
	}

	export interface ProtoData{
		cmd : string | number;
		className : string;
		buffer : Uint8Array;
	}
}