/**
 * @description 聊天测试
 */

import { ChatService } from "../../../../scripts/common/net/ChatService";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "../../../hall/script/protocol/LobbyCmd";
import { TestBinaryMessage } from "../../../hall/script/protocol/TestBinaryMessage";
import { TestJsonMessage } from "../../../hall/script/protocol/TestJsonMessage";
import { GetCmdKey } from "../../../hall/script/net/GetCmdKey";
import { HallProtoConfig } from "../../../hall/proto/HallProtoConfig";
import { Handler } from "../../../../scripts/framework/core/net/service/Handler";

export default class ChatHandler extends Handler {
    static module = "Chat"
    protected get service(){
        return Manager.serviceManager.get(ChatService);
    }
    onLoad() {
        super.onLoad()
        this.register(GetCmdKey(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_JSON_MSG), this.onTestJsonMessage, TestJsonMessage, true);
        this.register(HallProtoConfig.CMD_ROOM_INFO.cmd, this.onTestProtoMessage, HallProtoConfig.CMD_ROOM_INFO.className);
        this.register(GetCmdKey(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_BINARY_MSG), this.onTestBinaryMessage, TestBinaryMessage);
    }

    private onTestJsonMessage(data: TestJsonMessage) {
        dispatch(CommonEvent.TEST_JSON_MSG, data.hello);
    }

    private onTestProtoMessage(data: tp.RoomInfo) {
        dispatch(CommonEvent.TEST_PROTO_MSG, data.name);
    }

    private onTestBinaryMessage(data: TestBinaryMessage) {
        dispatch(CommonEvent.TEST_BINARY_MSG, data.vHello)
    }
}
