/**
 * @description 网络控制器
 * 
 */

import { setService } from "../../../../scripts/framework/decorator/Decorators";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import Controller from "../../../../scripts/framework/componects/Controller";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_GAME, TankBattleConfig } from "../protocol/TankBattleProtocal";
import { TankBettle } from "../data/TankBattleGameData";
import TankBattleChangeStageView from "../view/TankBattleChangeStageView";
import { GetCmdKey } from "../../../hall/script/controller/GetCmdKey";

const { ccclass, property } = cc._decorator;

@ccclass
@setService(LobbyService.instance)
export default class TankBattleNetController extends Controller<LobbyService> {

    protected addEvents() {
        super.addEvents()
        cc.log("TankBattleNetController=>bindingEvents")
        this.addNetEvent(GetCmdKey(MainCmd.CMD_GAME, SUB_CMD_GAME.CMD_GAME_CONFIG), this.onGameSaveConfig, TankBattleConfig);
    }

    protected get bundle(): string {
        return TankBettle.gameData.bundle;
    }

    private onGameSaveConfig(data: TankBattleConfig) {
        //收到存储配置成功
        TankBettle.gameData.gameStatus = TankBettle.GAME_STATUS.INIT;
        Manager.uiManager.open({ bundle: this.bundle, type: TankBattleChangeStageView, zIndex: td.ViewZOrder.UI, args: [TankBettle.gameData.currentLevel] })
    }
}

