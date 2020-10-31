
import { Service } from "../../framework/base/Service";
import { GameEventInterface } from "../../framework/base/GameEventInterface";
import { IMessage } from "../../framework/net/Message";
import { MainCmd, SUB_CMD_SYS } from "../protocol/CmdNetID";

/**
 * @description service公共基类
 */

export class CommonService extends Service implements GameEventInterface {

    protected static _instance: CommonService = null;
    public static get instance() { return this._instance || (this._instance = new CommonService()); }

    /**
     * @description 发送心跳
     */
    protected sendHeartbeat() {
        //发送心跳
        if (this.heartbeat) {
            this.send(new this.heartbeat() );
        }else{
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
        super.onHeartbeatTimeOut();
        cc.warn(`心跳超时，您已经断开网络`);
    }
    /**
     * @description 是否为心跳消息
     */
    protected isHeartBeat(data: IMessage): boolean {
        //示例
        return data.mainCmd == MainCmd.CMD_SYS && data.subCmd == SUB_CMD_SYS.CMD_SYS_HEART_ACK;
    }

    onEnterBackground() {

    }

    onEnterForgeground(inBackgroundTime: number) {

    }
}