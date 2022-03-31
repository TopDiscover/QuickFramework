/**@description 网络相关 */
export namespace Net {
	/** @description 处理函数声明 handleType 为你之前注册的handleType类型的数据 返回值number 为处理函数需要的时间 */
	export type HandleFunc = (handleTypeData: any) => number;
	export interface ListenerData {
		cmd: string,//事件名，如果是主命令跟子命令，按自己的需要返回固定组合如，mainCmd 1 subCmd 2 eventName = "1_2" | "12" 单个消夏码直接返回 "1"
		func: HandleFunc, //处理函数
		type: (new () => Message) | string, //解包类型
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

		export interface File {
			/**@description proto文件路径 */
			url: string;
			/**@description proto文件所有bundle */
			bundle: BUNDLE_TYPE;
			/**@description proto文件扩展名，默认为.proto */
			ext: string;
		}

		/**@description 模块配置 */
		export interface ModuleConfig {
			/**@description 模块名 */
			name: string;
			/**@description 模块下所有proto文件 */
			files: File[];
		}
	}
}

