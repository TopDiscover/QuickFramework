
import { Service, MessageProcessType } from "../../framework/base/Service";
import { GameEventInterface } from "../../framework/base/GameEventInterface";
import { Message } from "../../framework/net/Message";
import { MainCmd, SUB_CMD_SYS } from "../protocol/CmdNetID";
import { HeartbeatJson } from "../protocol/HeartbetJson";
import { HeartbeatProto } from "../protocol/HeartbetProto";
import { HeartbeatBinary } from "../protocol/HeartbetBinary";

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
        if (this.messageProcessType == MessageProcessType.Json ) {
            this.send(new HeartbeatJson() );
        }else if (this.messageProcessType == MessageProcessType.Proto ) {
            this.send(new HeartbeatProto());
        }else if( this.messageProcessType == MessageProcessType.BinaryStream ){
            this.send(new HeartbeatBinary())
        }else{
            cc.error("未支持的数据处理类型")
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
    protected isHeartBeat(data: Message): boolean {
        //示例
        return data.mainCmd == MainCmd.CMD_SYS && data.subCmd == SUB_CMD_SYS.CMD_SYS_HEART_ACK;
    }

    onEnterBackground() {

    }

    onEnterForgeground(inBackgroundTime: number) {

    }
}