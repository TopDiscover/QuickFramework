
import { MainCmd, SUB_CMD_SYS } from "../protocol/CmdDefines";
import { Net } from "../../framework/core/net/Net";
import { Config } from "../config/Config";
import { Service } from "../../framework/core/net/service/Service";
import { Global } from "../data/Global";
import { Macro } from "../../framework/defines/Macros";
import { ReconnectHandler } from "./ReconnectHandler";

/**
 * @description service公共基类
 */
export class CommonService extends Service {

    private get data() {
        return Manager.dataCenter.get(Global) as Global;
    }
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
        Log.d(this.module, `maxEnterBackgroundTime ${value}`);
        this._maxEnterBackgroundTime = value;
    }

    constructor(){
        super();
        this.reconnectHandler = new ReconnectHandler(this);
    }
    

    /**
    * @description 连接网络
    */
    public connect() {
        super.connect_server(this.ip, this.port, this.protocol);
    }

    /**
     * @description 发送心跳
     */
    protected sendHeartbeat() {
        //发送心跳
        if (this.heartbeat) {
            this.send(new this.heartbeat());
        } else {
            Log.e("请先设置心跳解析类型")
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
        Log.w(`${this.module} 心跳超时，您已经断开网络`);
        this.close();
        Manager.serviceManager.reconnect(this);
    }
    /**
     * @description 是否为心跳消息
     */
    protected isHeartBeat(data: Message): boolean {
        //示例
        return data.cmd == String(MainCmd.CMD_SYS) + String(SUB_CMD_SYS.CMD_SYS_HEART)
    }

    onEnterBackground() {
        if (this.data.userInfo.where == Macro.BUNDLE_RESOURCES) {
            return;
        }
        let me = this;
        me._backgroundTimeOutId = setTimeout(() => {
            //进入后台超时，主动关闭网络
            Log.d(`进入后台时间过长，主动关闭网络，等玩家切回前台重新连接网络`);
            me.close();
            Manager.alert.close(Config.RECONNECT_ALERT_TAG);
        }, me.maxEnterBackgroundTime * 1000);
    }

    onEnterForgeground(inBackgroundTime: number) {
        if (this._backgroundTimeOutId != -1) {
            Log.d(`清除进入后台的超时关闭网络定时器`);
            clearTimeout(this._backgroundTimeOutId);
            Log.d(`在后台时间${inBackgroundTime} , 最大时间为: ${this.maxEnterBackgroundTime}`)
            //登录界面，不做处理
            if (this.data.userInfo.where == Macro.BUNDLE_RESOURCES) {
                return;
            }
            if (inBackgroundTime > this.maxEnterBackgroundTime) {
                Log.d(`从回台切换，显示重新连接网络`);
                this.close();
                Manager.alert.close(Config.RECONNECT_ALERT_TAG);
                Manager.serviceManager.reconnect(this);
            }
        }
    }
}