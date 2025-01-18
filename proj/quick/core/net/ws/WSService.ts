/**
 * @description websocket服务
 */

import { DEBUG } from "cc/env";
import { Macro } from "../../../defines/Macros";
import { Net } from "../Net";
import { WSFlow } from "./WSFlow";
import { WSMsgHandler } from "./WSMsgHandler";
import { NORMAL_CLOSE_CODE } from "./WSProxy";
import { WSReconnect } from "./WSReconnect";
import { IWSServerOptions, IWSServerOptionsBase, WSServer } from "./WSServer";

export interface IWSServiceOptions extends IWSServerOptionsBase {
    /**@description 是否启用心跳 默认为 true */
    heartbeat?: boolean;
    /**@description 心跳间隔 默认为 2000ms */
    heartbeatInterval?: number;
    /**@description 丢包心跳次数 默认为 5次 如果5次收不到心跳，则认为连接已断开 */
    lostHeartbeat?: number;
    /**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连,默认60秒 */
    maxEnterBackgroundTime?: number;
    /**@description 是否启用网络重连 默认为 true */
    enableReconnect?: boolean;
    /**@description 重连次数 默认为 3 */
    reconnectTimes?: number;
    /**@description 是否输出心跳消息的日志 默认为 false */
    printHeartbeatLog?: boolean;
}

export abstract class WSService implements IWSMsgHandler {

    /**@description Service所属模块，如Lobby,game */
    static module: string = Macro.UNKNOWN;
    /**@description 该字段由ServiceManager指定 */
    module = Macro.UNKNOWN;

    constructor(module: string) {
        this.module = module;
        this._reconnect = new WSReconnect(this);
        this._handler = new WSMsgHandler(this);
    }

    /**@description 心跳定时器 */
    private _heartbeatTimer: number = -1;

    /**@description 心跳超时计时器 */
    private _lostHeartbeat: number = 0;

    private _backgroundTimeOutId: number = -1

    protected _options: IWSServiceOptions = null!
    get options() {
        return this._options;
    }
    set options(v: IWSServiceOptions) {
        this._options = v;
        this.options.tag = this.module;
        this.options.heartbeat = this.options.heartbeat == undefined ? true : this.options.heartbeat;
        this.options.heartbeatInterval = this.options.heartbeatInterval || 2000;
        this.options.lostHeartbeat = this.options.lostHeartbeat || 5;
        this.options.maxEnterBackgroundTime = this.options.maxEnterBackgroundTime || 60000;
        this.options.enableReconnect = this.options.enableReconnect == undefined ? true : this.options.enableReconnect;
        this.options.reconnectTimes = this.options.reconnectTimes || 3;
        this.options.printHeartbeatLog = this.options.printHeartbeatLog == undefined ? false : this.options.printHeartbeatLog;

        const serverOptions = this.options as IWSServerOptions;
        serverOptions.onOpen = async (ev: Event) => {
            this.flows.openFlow.exec(this);
            if (this.options.heartbeat) {
                this._lostHeartbeat = 0;
                this.doSendHeartbeat();
                this.startHeartbeat();
            }
        };
        serverOptions.onClose = (ev: CloseEvent) => {
            this.flows.closeFlow.exec(this);
            if (ev.code != NORMAL_CLOSE_CODE) {
                this.flows.reconnectFlow.exec(this);
            }
            if (this.options.heartbeat) {
                this.stopHeartbeat();
            }
        };

        serverOptions.onMessage = async (ev: MessageEvent) => {
            if (this.options.heartbeat) {
                this._lostHeartbeat = 0;
                this.startHeartbeat();
            }

            // 先对包头进行解析
            let header = await this.doDecodeHeader(ev);
            if (!header) {
                DEBUG && Log.e(`${this.options.tag} decode header error`);
                return;
            }

            if (await this.doIsHeartBeat(header)) {
                // 心跳消息,路过处理,应该不会有人注册心跳吧
                if (DEBUG && this.options.printHeartbeatLog) {
                    Log.d(`${this.options.tag} receive heartbeat message`);
                }
                return;
            }
            this.handler.onMessage(header, this.options.tag);
        };

        serverOptions.onError = (ev: Event) => {
            if (this.options.heartbeat) {
                this.stopHeartbeat();
            }
        };

        if (!this.server) {
            this.server = new WSServer();
        }
        this.server.options = serverOptions
    }

    private get data() {
        return App.stageData;
    }

    serviceType: Net.ServiceType = Net.ServiceType.Unknown;

    /**@description 服务器 */
    private server: WSServer = null!;
    get isConnected() { return this.server.isConnected }

    /**@description 重连 */
    protected _reconnect: WSReconnect = null!;
    /**@description 重连 */
    get reconnect() { return this._reconnect }

    /**@description 消息处理 */
    protected _handler: WSMsgHandler = null!;
    /**@description 消息处理 */
    get handler() { return this._handler }

    /**@description 优先级,值越大优先级越高 */
    priority: number = 0

    readonly flows = {
        /**@description 网络连接成功调用 */
        openFlow: new WSFlow<WSService>(),
        /**@description 网络断开调用 */
        closeFlow: new WSFlow<WSService>(),
        /**@description 重连调用 */
        reconnectFlow: new WSFlow<WSService>(true),
        /**@description 发送心跳调用 */
        sendHeartbeatFlow: new WSFlow<WSService>(true),
        /**@description 判断消息是否是心跳包 */
        isHeartBeatFlow: new WSFlow<{
            service: WSService,
            message: Message,
            result: boolean,
        }>(true),
        /**@description 包头解析 */
        decodeHeaderFlow: new WSFlow<{
            service: WSService,
            message: MessageEvent,
            result: Message
        }>(true),
        /**@description 包头打包 */
        encodeHeaderFlow: new WSFlow<{
            service: WSService,
            message: Message
            result: { isSuccess: boolean, message: Message }
        }>(true),
        /**@description 解析数据(包体) */
        decodeMessageFlow: new WSFlow<{
            service: WSService,
            message: Message,
            listenerData: Net.ListenerData,
            result: any,
        }>(true),
    }

    /**
     * @description 启动心跳
     */
    protected startHeartbeat() {
        this.stopHeartbeat();
        this._heartbeatTimer = setInterval(() => {
            this._lostHeartbeat++;
            if (this._lostHeartbeat > this.options.lostHeartbeat!) {
                this.stopHeartbeat();
                this.server.stop().then(() => {
                    this.flows.reconnectFlow.exec(this);
                })
                return;
            }
            this.doSendHeartbeat();
        }, this.options.heartbeatInterval);
    }

    /**
     * @description 停止心跳
     */
    protected stopHeartbeat() {
        clearInterval(this._heartbeatTimer);
    }

    /**
     * @description 发送心跳
     */
    private doSendHeartbeat() {
        //发送心跳
        if (this.flows.sendHeartbeatFlow.nodes.length > 0) {
            this.flows.sendHeartbeatFlow.exec(this);
        } else {
            DEBUG && Log.e(`${this.options.tag} 心跳 sendHeartbeatFlow 消息未注册`);
        }
    }

    /**
     * @description 是否为心跳消息
     */
    private async doIsHeartBeat(data: Message) {
        if (this.flows.isHeartBeatFlow.nodes.length > 0) {
            const result = await this.flows.isHeartBeatFlow.exec({ service: this, message: data, result: false });
            return result!.result
        } else {
            DEBUG && Log.e(`${this.options.tag} 心跳 isHeartBeatFlow 消息未注册`);
            return false;
        }
    }

    private async doDecodeHeader(data: MessageEvent) {
        if (this.flows.decodeHeaderFlow.nodes.length > 0) {
            const result = await this.flows.decodeHeaderFlow.exec({ service: this, message: data, result: null! });
            return result!.result
        } else {
            DEBUG && Log.e(`${this.options.tag} 心跳 decodeHeaderFlow 消息未注册`);
            return null;
        }
    }

    private async doEncodeHeader(data: Message) {
        if (this.flows.encodeHeaderFlow.nodes.length > 0) {
            const result = await this.flows.encodeHeaderFlow.exec({ service: this, message: data, result: null! });
            return result!.result
        } else {
            DEBUG && Log.e(`${this.options.tag} 心跳 encodeHeaderFlow 消息未注册`);
            return null;
        }
    }

    /**@description 启动服务器 */
    start() {
        return this.server.start();
    }

    /**@description 停止服务器 */
    stop() {
        this.handler.stop();
        this.reconnect.stop();
        return this.server.stop();
    }

    /**
     * @description 发送数据
     * @param data 
     */
    async send(data: Message) {
        if (data.encode()) {
            let result = await this.doEncodeHeader(data);
            if (!result!.isSuccess) {
                DEBUG && Log.e(`${this.options.tag} encode header error`);
                return;
            }
            data = result!.message
            if (DEBUG) {
                if (await this.doIsHeartBeat(data)) {
                    if (this.options.printHeartbeatLog) {
                        Log.d(`${this.options.tag} send heartbeat message`);
                    }
                } else {
                    Log.d(`${this.options.tag} send cmd : ${data.cmd} `);
                }
            }
            this.server.send(data.buffer);
        } else {
            DEBUG && Log.e(`${this.options.tag} encode error`)
        }
    }

    onS(cmd: string, handleType: any, handleFunc: Function, isQueue: boolean, target: any) {
        this.handler.onS(cmd, handleType, handleFunc as any, isQueue, target)
    }

    offS(target: any, cmd?: string) {
        this.handler.offS(target, cmd)
    }

    /**
     * @description 暂停消息队列处理
     */
    pause() {
        this.handler.isPause = true;
    }

    /**
     * @description 恢复消息队列处理
     */
    resume() {
        this.handler.isPause = false;
    }

    /**
     * @description 更新
     * @param dt 
     */
    update(dt: number) {
        this.handler.update(dt);
    }

    onEnterBackground() {
        if (this.data.isLoginStage()) {
            return;
        }
        this._backgroundTimeOutId = setTimeout(() => {
            //进入后台超时，主动关闭网络
            DEBUG && Log.d(`${this.options.tag} 进入后台时间过长，主动关闭网络，等玩家切回前台重新连接网络`);
            App.alert.close(Macro.RECONNECT_ALERT_TAG);
            this.server.stop();
        }, this.options.maxEnterBackgroundTime);
    }

    onEnterForgeground(inBackgroundTime: number) {
        if (this._backgroundTimeOutId != -1) {
            DEBUG && Log.d(`${this.options.tag} 清除进入后台的超时关闭网络定时器`);
            clearTimeout(this._backgroundTimeOutId);
            DEBUG && Log.d(`${this.options.tag} 在后台时间${inBackgroundTime} , 最大时间为: ${this.options.maxEnterBackgroundTime}`)
            //登录界面，不做处理
            if (this.data.isLoginStage()) {
                return;
            }
            if (inBackgroundTime * 1000 > this.options.maxEnterBackgroundTime!) {
                DEBUG && Log.d(`${this.options.tag} 从回台切换，显示重新连接网络`);
                App.alert.close(Macro.RECONNECT_ALERT_TAG);
                return true;
            }
        }
        return false;
    }
}