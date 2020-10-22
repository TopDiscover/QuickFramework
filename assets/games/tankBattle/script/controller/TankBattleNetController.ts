/**
 * @description 网络控制器
 * 
 */

import { injectService } from "../../../../script/framework/decorator/Decorators";
import { LobbyService } from "../../../../script/common/net/LobbyService";
import Controller from "../../../../script/framework/controller/Controller";
import { Manager } from "../../../../script/common/manager/Manager";
import { MainCmd } from "../../../../script/common/protocol/CmdNetID";
import { SUB_CMD_GAME, TankBattleConfig } from "../protocol/TankBattleProtocal";
import { TankBettle } from "../data/TankBattleGameData";
import TankBattleChangeStageView from "../view/TankBattleChangeStageView";
import { ViewZOrder } from "../../../../script/common/config/Config";
import TankBattleGameView from "../view/TankBattleGameView";

const { ccclass, property } = cc._decorator;

@ccclass
@injectService(LobbyService.instance)
export default class TankBattleNetController extends Controller<LobbyService> {
    
    protected bindingEvents(){
        super.bindingEvents()
        this.registerEvent(MainCmd.CMD_GAME,SUB_CMD_GAME.CMD_GAME_CONFIG,this.onGameSaveConfig,TankBattleConfig);
    }

    protected get bundle( ) : string{
        return TankBettle.gameData.bundle;
    }

    private onGameSaveConfig( data: TankBattleConfig ) {
        //收到存储配置成功
        Manager.uiManager.open({bundle:this.bundle,type:TankBattleChangeStageView,zIndex:ViewZOrder.UI,args:[TankBettle.gameData.currentLevel]})
    }
}

Manager.netManager.push(TankBattleNetController);
