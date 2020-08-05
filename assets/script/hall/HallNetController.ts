/**
 * @description 登录场景逻辑流程控制器  
 */

import { LobbyService } from "../common/net/LobbyService";
import { injectService } from "../framework/decorator/Decorators";
import Controller from "../framework/controller/Controller";
import { MainCmd, SubCmd, UpdateMoney } from "./HallMessage";
import { HallEvent } from "./HallEvent";

const { ccclass, property } = cc._decorator;

@ccclass
@injectService(LobbyService.instance)
export default class HallNetController extends Controller<LobbyService> {

    protected bindingEvents(){
        super.bindingEvents()
        this.registerEvent(MainCmd.LOBBY_UPDATE,SubCmd.UPDATE_MONEY,this.onMoneyUpdate,UpdateMoney);
    }

    private onMoneyUpdate( data : UpdateMoney ){
        //通知变更金钱
        dispatch(HallEvent.UPDATE_MONEY,data.count);
    }

}
