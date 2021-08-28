/**
 * @description 游戏测试
 */

import { injectService } from "../../../../scripts/framework/decorator/Decorators";
import Controller from "../../../../scripts/framework/controller/Controller";
import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
import { GameService } from "../../../../scripts/common/net/GameService";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "../../../hall/script/protocol/LobbyCmd";
import { TestBinaryMessage } from "../../../hall/script/protocol/TestBinaryMessage";
import { TestJsonMessage } from "../../../hall/script/protocol/TestJsonMessage";
import { TestProtoMessage } from "../../../hall/script/protocol/TestProtoMessage";
import { ServiceEvent } from "../../../../scripts/framework/base/Service";
const { ccclass, property } = cc._decorator;

@ccclass
@injectService(GameService.instance)
export default class TestGameNetController extends Controller<GameService> {

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
        if (result) dispatch(CommonEvent.GAME_SERVICE_CONNECTED, this.service);
        return result;
    }

    protected onNetClose(event: ServiceEvent) {
        let result = super.onNetClose(event);
        if (result) dispatch(CommonEvent.GAME_SERVICE_CLOSE, this.service);
        return result;
    }

}

Manager.hallNetManager.register(TestGameNetController);
