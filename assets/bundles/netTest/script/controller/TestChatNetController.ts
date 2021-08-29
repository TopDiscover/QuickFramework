/**
 * @description 聊天测试
 */

import { setService } from "../../../../scripts/framework/decorator/Decorators";
import Controller from "../../../../scripts/framework/componects/Controller";
import { ChatService } from "../../../../scripts/common/net/ChatService";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "../../../hall/script/protocol/LobbyCmd";
import { TestBinaryMessage } from "../../../hall/script/protocol/TestBinaryMessage";
import { TestJsonMessage } from "../../../hall/script/protocol/TestJsonMessage";
import { TestProtoMessage } from "../../../hall/script/protocol/TestProtoMessage";
const { ccclass, property } = cc._decorator;

@ccclass
@setService(ChatService.instance)
export default class TestChatNetController extends Controller<ChatService> {

    protected bindingEvents() {
        super.bindingEvents()
        this.registerEvent(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_JSON_MSG, this.onTestJsonMessage, TestJsonMessage, true);
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

    protected onNetOpen(event: td.Net.ServiceEvent) {
        let result = super.onNetOpen(event);
        if (result) dispatch(CommonEvent.CHAT_SERVICE_CONNECTED, this.service);
        return result;
    }

    protected onNetClose(event: td.Net.ServiceEvent) {
        let result = super.onNetClose(event);
        if (result) dispatch(CommonEvent.CHAT_SERVICE_CLOSE, this.service);
        return result;
    }

}

Manager.hallNetManager.register(TestChatNetController);
