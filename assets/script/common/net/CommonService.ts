/*
 * @Author: your name
 * @Date: 2019-11-20 19:04:21
 * @LastEditTime: 2020-04-10 16:03:39
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \ddz\assets\common\base\CommonService.ts
 */

import { Service } from "../../framework/base/Service";
import { GameEventInterface } from "../../framework/base/GameEventInterface";
import { Message } from "../../framework/net/Message";
import { JsonMessage } from "../../framework/net/JsonMessage";
import { MainCmd, SUB_CMD_GAME, SUB_CMD_SYS } from "../protocol/CmdNetID";

export class CommonMessage extends JsonMessage {
}

/**
 * @description service公共基类
 */

export class CommonService extends Service implements GameEventInterface {

    protected static _instance: CommonService = null;
    public static get instance() { return this._instance || (this._instance = new CommonService()); }

    /**@description 公共的消息解析类型，必须包含对消息码的解析与打包 */
    protected get commonMessageType(): typeof Message {
        return CommonMessage;
    }

    /**
     * @description 发送心跳
     */
    protected sendHeartbeat() {
        //发送心跳
        let msg = new CommonMessage();
        msg.mainCmd = MainCmd.CMD_SYS;
        msg.subCmd = SUB_CMD_SYS.CMD_SYS_HEART_ACK;
        this.send(msg);
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