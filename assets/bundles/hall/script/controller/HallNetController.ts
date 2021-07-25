/**
 * @description 大厅网络逻辑流程控制器  
 */

import { injectService } from "../../../../script/framework/decorator/Decorators";
import { LobbyService } from "../../../../script/common/net/LobbyService";
import Controller from "../../../../script/framework/controller/Controller";
import { MainCmd } from "../../../../script/common/protocol/CmdDefines";
import { TestProtoMessage } from "../protocol/TestProtoMessage";
import { TestBinaryMessage } from "../protocol/TestBinaryMessage";
import { CommonEvent } from "../../../../script/common/event/CommonEvent";
import { SUB_CMD_LOBBY } from "../protocol/LobbyCmd";
import { TestJsonMessage } from "../protocol/TestJsonMessage";
import { ServiceEvent } from "../../../../script/framework/base/Defines";
const { ccclass, property } = cc._decorator;

@ccclass
@injectService(LobbyService.instance)
export default class HallNetController extends Controller<LobbyService> {

    protected bindingEvents() {
        super.bindingEvents()
        this.registerEvent(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_JSON_MSG, this.onTestJsonMessage, TestJsonMessage);
        this.registerEvent(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_PROTO_MSG, this.onTestProtoMessage, TestProtoMessage);
        this.registerEvent(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_BINARY_MSG, this.onTestBinaryMessage, TestBinaryMessage);
    }

    private onTestJsonMessage(data: TestJsonMessage) {
        dispatch(CommonEvent.TEST_JSON_MSG, data.hello);
    }

    private onTestProtoMessage(data: TestProtoMessage) {
        dispatch(CommonEvent.TEST_PROTO_MSG, data.data.hello);
    }

    private onTestBinaryMessage(data: TestBinaryMessage) {
        dispatch(CommonEvent.TEST_BINARY_MSG, data.hello)
    }

    protected onNetOpen(event: ServiceEvent) {
        let result = super.onNetOpen(event);
        if (result) dispatch(CommonEvent.LOBBY_SERVICE_CONNECTED, this.service);
        return result;
    }

    protected onNetClose(event: ServiceEvent) {
        let result = super.onNetClose(event);
        if (result) dispatch(CommonEvent.LOBBY_SERVICE_CLOSE, this.service);
        return result;
    }

}

Manager.hallNetManager.register(HallNetController);
