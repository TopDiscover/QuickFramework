/**
 * @description 网络控制器
 * 
 */

import { injectService } from "../../../../script/framework/decorator/Decorators";
import { LobbyService } from "../../../../script/common/net/LobbyService";
import Controller from "../../../../script/framework/controller/Controller";
import { MainCmd } from "../../../../script/common/protocol/CmdDefines";
import { SUB_CMD_GAME, TankBattleConfig } from "../protocol/TankBattleProtocal";
import { TankBettle } from "../data/TankBattleGameData";
import TankBattleChangeStageView from "../view/TankBattleChangeStageView";

const { ccclass, property } = cc._decorator;

@ccclass
@injectService(LobbyService.instance)
export default class TankBattleNetController extends Controller<LobbyService> {
    
    protected bindingEvents(){
        super.bindingEvents()
        cc.log("TankBattleNetController=>bindingEvents")
        this.registerEvent(MainCmd.CMD_GAME,SUB_CMD_GAME.CMD_GAME_CONFIG,this.onGameSaveConfig,TankBattleConfig);
    }

    protected get bundle( ) : string{
        return TankBettle.gameData.bundle;
    }

    private onGameSaveConfig( data: TankBattleConfig ) {
        //收到存储配置成功
        TankBettle.gameData.gameStatus = TankBettle.GAME_STATUS.INIT;
        Manager.uiManager.open({bundle:this.bundle,type:TankBattleChangeStageView,zIndex:td.ViewZOrder.UI,args:[TankBettle.gameData.currentLevel]})
    }
}

