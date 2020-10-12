import { injectService } from "../../../framework/decorator/Decorators";
import { LobbyService } from "../../net/LobbyService";
import Controller from "../../../framework/controller/Controller";
import { MainCmd, SUB_CMD_GAME } from "../../protocol/CmdNetID";
import { Manager } from "../../manager/Manager";
import { EnterGameFail, EnterGameSuccess } from "../../protocol/CmdGame";
import { GameConfig } from "../../base/HotUpdate";

const { ccclass, property } = cc._decorator;

@ccclass
@injectService(LobbyService.instance)
export default class GameNetController extends Controller<LobbyService> {
    
    protected bindingEvents(){
        super.bindingEvents()
        this.registerEvent(MainCmd.CMD_GAME,SUB_CMD_GAME.CMD_GAME_ENTER_FAIL,this.onGameEnterFail,EnterGameFail);
        this.registerEvent(MainCmd.CMD_GAME,SUB_CMD_GAME.CMD_GAME_ENTER_SUCCESS,this.onGameEnterSuccess,EnterGameSuccess);
    }

    private onGameEnterSuccess( data: EnterGameSuccess ) {
        Manager.gameManager.enterGame(new GameConfig(data.name,data.subpackageName,data.gameType));
    }

    private onGameEnterFail( data : EnterGameFail ){
        //做进入游戏失败的处理
        Manager.tips.show(data.reason);
        //todo : 
    }
}

Manager.netManager.push(GameNetController);