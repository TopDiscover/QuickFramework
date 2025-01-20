import { Net } from "../Net";

export interface IWSMsgHandler {
	/**
	 * @description 注册网络事件
	 * @param cmd 命令码
	 * @param type 处理数据类型
	 * @param func 处理函数(返回的网络数据,处理结果)，
	 * 如果有多个处理函数，result 为上一个处理函数的处理结果
	 * 首次调用时 result 为 null
	 * @param isQueue 接收到消息，是否进行队列处理
	 * @param target 处理函数所属对象
	 */
	onS?(
		cmd: string,
		type: any,
		func: Net.MessageHandleFunc,
		isQueue: boolean,
		target: any
	): void;

	/**
	 * @description 反注册网络消息处理
	 * @param cmd 如果为null，则反注册当前对象注册过的所有处理过程，否则对特定cmd反注册
	 * @param target 处理函数所属对象
	 */
	offS?(target: any, cmd?: string): any;

	/**
	 * @description 发送数据
	 * @param data 
	 */
	send?(msg: Message): Promise<boolean>;

	/**
	 * @description 发送RPC异步调用
	 * @param data 发送数据
	 * @param type RPC返回处理类型
	 * @param cmd 返回命令码
	 * @param timeout 超时时间
	 * @example
	 * ```ts
	 *  this.sendRPC(new LoginReq(), LoginRsp, 'LoginReq', 10).then(res => {
	 *      if (res) {
	 *          
	 *      }
	 *  })
	 * ```
	 * @returns 
	 */
	sendRPC?<T extends Message>(data: Message, type: { new(): T } | string, cmd: string, timeout: number): Promise<T | null>
}