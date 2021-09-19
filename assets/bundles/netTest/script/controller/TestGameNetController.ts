/**
 * @description 游戏测试
 */

import { setService } from "../../../../scripts/framework/decorator/Decorators";
import Controller from "../../../../scripts/framework/componects/Controller";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { GameService } from "../../../../scripts/common/net/GameService";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "../../../hall/script/protocol/LobbyCmd";
import { TestBinaryMessage } from "../../../hall/script/protocol/TestBinaryMessage";
import { TestJsonMessage } from "../../../hall/script/protocol/TestJsonMessage";
import { GetCmdKey } from "../../../hall/script/controller/GetCmdKey";
import { Net } from "../../../../scripts/framework/core/net/Net";
import { HallProtoConfig } from "../../../hall/proto/HallProtoConfig";
import { _decorator } from "cc";
const { ccclass, property } = _decorator;

@ccclass
@setService(GameService.instance)
export default class TestGameNetController extends Controller<GameService> {

    protected addEvents() {
        super.addEvents()
        this.addNetEvent(GetCmdKey(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_JSON_MSG), this.onTestJsonMessage, TestJsonMessage);
        this.addNetEvent(HallProtoConfig.CMD_ROOM_INFO.cmd, this.onTestProtoMessage,HallProtoConfig.CMD_ROOM_INFO.className);
        this.addNetEvent(GetCmdKey(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_BINARY_MSG), this.onTestBinaryMessage, TestBinaryMessage);
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
    protected onNetOpen(event: Net.ServiceEvent) {
        let result = super.onNetOpen(event);
        if (result) dispatch(CommonEvent.GAME_SERVICE_CONNECTED, this.service);
        return result;
    }

    protected onNetClose(event: Net.ServiceEvent) {
        let result = super.onNetClose(event);
        if (result) dispatch(CommonEvent.GAME_SERVICE_CLOSE, this.service);
        return result;
    }

}

Manager.hallNetManager.register(TestGameNetController);
