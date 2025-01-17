/**
 * @description websocket服务
 */

import { Macro } from "../../../defines/Macros";
import { Codec, IMessage } from "../message/Message";
import { Net } from "../Net";
import { Process } from "../service/Process";
import { IWSServerOptions, WSServer } from "./WSServer";

export interface IWSServiceOptions extends IWSServerOptions {
    /**@description 是否启用心跳 默认为 true */
    heartbeat?: boolean;
    /**@description 心跳间隔 默认为 5000ms */
    heartbeatInterval?: number;
    /**@description 丢包心跳次数 默认为 5次 如果5次收不到心跳，则认为连接已断开 */
    lostHeartbeat?: number;
    /**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连,默认60秒 */
    maxEnterBackgroundTime?: number;
    /**@description 是否启用网络重连 默认为 true */
    enableReconnect?: boolean
}

export abstract class WSService implements IService{
    
    /**@description Service所属模块，如Lobby,game */
    static module: string = Macro.UNKNOWN;
    /**@description 该字段由ServiceManager指定 */
    module = Macro.UNKNOWN;

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
        this.options.heartbeatInterval = this.options.heartbeatInterval || 5000;
        this.options.lostHeartbeat = this.options.lostHeartbeat || 5;
        this.options.maxEnterBackgroundTime = this.options.maxEnterBackgroundTime || 60000;
        this.options.enableReconnect = this.options.enableReconnect == undefined ? true : this.options.enableReconnect;
        const originalOpen = this.options.onOpen;
        this.options.onOpen = (ev: Event) => {
            originalOpen?.(ev);
            App.serviceManager.onOpen(ev, this);
            if (this.options.heartbeat) {
                this._lostHeartbeat = 0;
                this.sendHeartbeat();
                this.startHeartbeat();
            }
        };
        const originalClose = this.options.onClose;
        this.options.onClose = (ev: CloseEvent) => {
            originalClose?.(ev);
            App.serviceManager.onClose(ev, this);
            if (this.options.heartbeat) {
                this.stopHeartbeat();
            }
        };

        const originalMessage = this.options.onMessage;
        this.options.onMessage = (ev: MessageEvent) => {
            originalMessage?.(ev);
            if (this.options.heartbeat) {
                this._lostHeartbeat = 0;
                this.startHeartbeat();
            }

            // 先对包头进行解析
            let header = new this._Process.Codec
            if (!header.unPack(ev.data)) {
                Log.e(`decode header error`);
                return;
            }

            if (this.isHeartBeat(header)) {
                // 心跳消息,路过处理,应该不会有人注册心跳吧
                return;
            }
            this._Process.onMessage(header);
        };

        const originalError = this.options.onError;
        this.options.onError = (ev: Event) => {
            originalError?.(ev);
            App.serviceManager.onError(ev, this);
            if (this.options.heartbeat) {
                this.stopHeartbeat();
            }
        };

        if (!this.server) {
            this.server = new WSServer();
        }
        this.server.options = this.options
    }

    private get data() {
        return App.stageData;
    }

    serviceType: Net.ServiceType = Net.ServiceType.Unknown;

    /**@description 服务器 */
    server: WSServer = null!;

    private _Process: Process = new Process();
    set Process(v: typeof Process) {
        if (v == null) { return }
        this._Process = new v;
        this._Process.serviceType = this.serviceType;
    }

    /**@description 数据流消息包头定义类型 */
    public set Codec(v: new () => Codec) {
        this._Process.Codec = v
    }

    private _Heartbeat: Net.HeartbeatClass<Message> = null!;
    /**@description 心跳的消息定义类型 */
    public get heartbeat(): Net.HeartbeatClass<Message> { return this._Heartbeat }
    public set heartbeat(value: Net.HeartbeatClass<Message>) {
        this._Heartbeat = value;
        this.serviceType = value.type;
        this._Process.serviceType = value.type;
    }

    /**@description 优先级,值越大优先级越高 */
    priority: number = 0

    /**
     * @description 启动心跳
     */
    protected startHeartbeat() {
        this._heartbeatTimer = setTimeout(() => {
            this._lostHeartbeat++;
            if (this._lostHeartbeat > this.options.lostHeartbeat) {
                this.stopHeartbeat();
                this.server.stop().then(() => {
                    App.serviceManager.reconnect(this);
                })
                return;
            }
            this.sendHeartbeat();
        }, this.options.heartbeatInterval);
    }

    /**
     * @description 停止心跳
     */
    protected stopHeartbeat() {
        clearTimeout(this._heartbeatTimer);
    }

    /**
     * @description 发送心跳
     */
    protected abstract sendHeartbeat();

    /**
     * @description 是否为心跳消息
     */
    protected abstract isHeartBeat(data: IMessage): boolean

    /**@description 启动服务器 */
    start() {
        return this.server.start();
    }

    /**@description 停止服务器 */
    stop() {
        this._Process.close();
        return this.server.stop();
    }

    /**
     * @description 发送数据
     * @param data 
     */
    send(data: Message) {
        if (this._Process.Codec) {
            if (data.encode()) {
                let header = new this._Process.Codec
                header.pack(data)
                if (CC_DEBUG) {
                    if (this.isHeartBeat(data)) {
                        Log.d(`send heartbeat cmd : ${data.cmd} `);
                    } else {
                        Log.d(`send cmd : ${data.cmd} `);
                    }
                }
                this.server.send(header.buffer);
            } else {
                CC_DEBUG && Log.e("encode error")
            }
        } else {
            CC_DEBUG && Log.e("请求指定数据包头处理类型")
        }
    }

    addListener(cmd: string, handleType: any, handleFunc: Function, isQueue: boolean, target: any) {
        this._Process.addListener(cmd, handleType, handleFunc as any, isQueue, target)
    }

    removeListeners(target: any, cmd?: string) {
        this._Process.removeListeners(target, cmd)
    }

    /**
     * @description 暂停消息队列处理
     */
    pause() {
        this._Process.isPause = true;
    }

    /**
     * @description 恢复消息队列处理
     */
    resume() {
        this._Process.isPause = false;
    }

    /**
     * @description 更新
     * @param dt 
     */
    update(dt: number) {
        this._Process.handMessage();
    }

    onEnterBackground() {
        if (this.data.isLoginStage()) {
            return;
        }
        this._backgroundTimeOutId = setTimeout(() => {
            //进入后台超时，主动关闭网络
            Log.d(`进入后台时间过长，主动关闭网络，等玩家切回前台重新连接网络`);
            App.alert.close(Macro.RECONNECT_ALERT_TAG);
            this.server.stop();
        }, this.options.maxEnterBackgroundTime);
    }

    async onEnterForgeground(inBackgroundTime: number) {
        if (this._backgroundTimeOutId != -1) {
            Log.d(`清除进入后台的超时关闭网络定时器`);
            clearTimeout(this._backgroundTimeOutId);
            Log.d(`在后台时间${inBackgroundTime} , 最大时间为: ${this.options.maxEnterBackgroundTime}`)
            //登录界面，不做处理
            if (this.data.isLoginStage()) {
                return;
            }
            if (inBackgroundTime * 1000 > this.options.maxEnterBackgroundTime) {
                Log.d(`从回台切换，显示重新连接网络`);
                App.alert.close(Macro.RECONNECT_ALERT_TAG);
                await this.server.stop();
                App.serviceManager.reconnect(this);
            }
        }
    }


    /**
     * @description 重新处理
     */
    async reconnect() {
        let time = 0.3;
        let count = 1;
        await App.utils.delayMs(time * 1000);
        
    }
}