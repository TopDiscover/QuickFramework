
import { Reconnect } from "./Reconnect";
import { ICommonService } from "../../framework/core/net/socket/ICommonService";
import { MainCmd, SUB_CMD_SYS } from "../protocol/CmdDefines";
import { Net } from "../../framework/core/net/Net";
import { Config } from "../config/Config";

/**
 * @description service公共基类
 */

export class CommonService extends ICommonService implements GameEventInterface {

    protected static _instance: CommonService = null!;
    public static get instance() { return this._instance || (this._instance = new CommonService()); }
    // protected ip = ""
    // protected port: number = null;
    // protected protocol: WebSocketType = "wss"
    protected ip = "localhost";
    protected port = 3000;
    protected protocol: Net.Type = "ws"

    protected _maxEnterBackgroundTime: number = Config.MAX_INBACKGROUND_TIME;
    protected _backgroundTimeOutId: any = -1;
    /**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连 */
    public get maxEnterBackgroundTime() {
        return this._maxEnterBackgroundTime;
    }
    public set maxEnterBackgroundTime(value: number) {
        if (value < Config.MIN_INBACKGROUND_TIME || value > Config.MAX_INBACKGROUND_TIME) {
            value = Config.MIN_INBACKGROUND_TIME;
        }
        cc.log(this.serviceName, `maxEnterBackgroundTime ${value}`);
        this._maxEnterBackgroundTime = value;
    }

    /**
    * @description 连接网络
    */
    public connect() {
        super.connect_server(this.ip, this.port, this.protocol);
    }

    /**@description 网络重连 */
    public reconnect: Reconnect = null!;
    constructor() {
        super();
        this.reconnect = new Reconnect(this);
    }

    /**
     * @description 发送心跳
     */
    protected sendHeartbeat() {
        //发送心跳
        if (this.heartbeat) {
            this.send(new this.heartbeat());
        } else {
            cc.error("请先设置心跳解析类型")
        }
    }
    /**
     * @description 获取最大心跳超时的次数
     */
    protected getMaxHeartbeatTimeOut(): number {
        return super.getMaxHeartbeatTimeOut();
    }

    protected getHeartbeatInterval() {
        return super.getHeartbeatInterval();
    }

    /**
     * @description 心跳超时
     */
    protected onHeartbeatTimeOut() {
        cc.warn(`${this.serviceName} 心跳超时，您已经断开网络`);
        this.close();
        Manager.serviceManager.tryReconnect(this, true);
    }
    /**
     * @description 是否为心跳消息
     */
    protected isHeartBeat(data: Message): boolean {
        //示例
        return data.cmd == String(MainCmd.CMD_SYS) + String(SUB_CMD_SYS.CMD_SYS_HEART)
    }

    onEnterBackground() {
        let me = this;
        Manager.uiManager.getView("LoginView").then(view => {
            me._backgroundTimeOutId = setTimeout(() => {
                //进入后台超时，主动关闭网络
                cc.log(`进入后台时间过长，主动关闭网络，等玩家切回前台重新连接网络`);
                me.close();
            }, me.maxEnterBackgroundTime * 1000);
        });
    }

    onEnterForgeground(inBackgroundTime: number) {
        if (this._backgroundTimeOutId != -1) {
            cc.log(`清除进入后台的超时关闭网络定时器`);
            clearTimeout(this._backgroundTimeOutId);
            let self = this;
            //登录界面，不做处理
            Manager.uiManager.getView("LoginView").then((view) => {
                cc.log(`在后台时间${inBackgroundTime} , 最大时间为: ${self.maxEnterBackgroundTime}`)
                if (view) {
                    return;
                }
                if (inBackgroundTime > self.maxEnterBackgroundTime) {
                    cc.log(`从回台切换，显示重新连接网络`);
                    self.close();
                    Manager.serviceManager.tryReconnect(self);
                }
            });
        }
    }

    protected onError(ev: Event) {
        super.onError(ev)
        Manager.uiManager.getView("LoginView").then(view => {
            if (view) return;
            Manager.serviceManager.tryReconnect(this);
        });
    }

    protected onClose(ev: Event) {
        super.onClose(ev)
        if (ev.type == Net.NetEvent.ON_CUSTOM_CLOSE) {
            cc.log(`${this.serviceName} 应用层主动关闭Socket`);
            return;
        }
        Manager.uiManager.getView("LoginView").then(view => {
            if (view) return;
            Manager.serviceManager.tryReconnect(this);
        });
    }
}