import { Reconnect } from "../../../../common/net/Reconnect";
import { Message } from "../message/Message";
import { Service } from "../service/Service";

export abstract class ICommonService extends Service implements GameEventInterface {
    /**@description 网络重连 */
    public reconnect: Reconnect = null!;

    private _maxEnterBackgroundTime: number = td.Config.MAX_INBACKGROUND_TIME;
    private _backgroundTimeOutId: number = -1;
    /**@description 进入后台的最大允许时间，超过了最大值，则进入网络重连 */
    public get maxEnterBackgroundTime() {
        return this._maxEnterBackgroundTime;
    }
    public connect(): void { }

    public set maxEnterBackgroundTime(value: number) {
        if (value < td.Config.MIN_INBACKGROUND_TIME || value > td.Config.MAX_INBACKGROUND_TIME) {
            value = td.Config.MIN_INBACKGROUND_TIME;
        }
        cc.log(this.serviceName, `maxEnterBackgroundTime ${value}`);
        this._maxEnterBackgroundTime = value;
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
     * @description 心跳超时
     */
    protected onHeartbeatTimeOut(): void {
        super.onHeartbeatTimeOut()
    }
    /**
     * @description 是否为心跳消息
     */
    protected abstract isHeartBeat(data: Message): boolean

    protected onError(ev: Event): void {
        super.onError(ev)
    }

    protected onClose(ev: Event): void {
        super.onClose(ev)
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
                if (view) { return }
                if (inBackgroundTime > self.maxEnterBackgroundTime) {
                    cc.log(`从回台切换，显示重新连接网络`);
                    self.close();
                    Manager.serviceManager.tryReconnect(self);
                }
            });
        }
    }
}
