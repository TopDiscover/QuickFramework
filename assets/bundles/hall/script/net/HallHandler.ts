/**
 * @description 大厅网络逻辑流程控制器  
 */
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { TestBinaryMessage } from "../protocol/TestBinaryMessage";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { SUB_CMD_LOBBY } from "../protocol/LobbyCmd";
import { TestJsonMessage } from "../protocol/TestJsonMessage";
import { GetCmdKey } from "./GetCmdKey";
import { HallProtoConfig } from "../../proto/HallProtoConfig";
import { Handler } from "../../../../scripts/framework/core/net/service/Handler";

export default class HallHandler extends Handler {
    static module = "Lobby"
    protected get service(){
        return Manager.serviceManager.get(LobbyService);
    }
    onLoad() {
        super.onLoad()
        this.register(GetCmdKey(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_JSON_MSG), this.onTestJsonMessage, TestJsonMessage);
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
