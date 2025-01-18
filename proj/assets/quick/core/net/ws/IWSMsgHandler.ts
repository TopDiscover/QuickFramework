export interface IWSMsgHandler {
	onS?(cmd: string, handleType: any, handleFunc: Function, isQueue: boolean, target: any): any;

	offS?(target: any, cmd?: string): any;

	send?(msg: Message): any;
}