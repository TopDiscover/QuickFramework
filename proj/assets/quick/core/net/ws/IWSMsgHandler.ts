export interface IWSMsgHandler {
	onS?(cmd: string, handleType: any, handleFunc: Function, isQueue: boolean, target: any): any;

	offS?(target: any, cmd?: string): any;

	send?(msg: Message): any;

	sendRPC?<T extends Message>(data: Message, type : { new (): T } | string, cmd:string, timeout: number): Promise<T | null>
}