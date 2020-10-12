import { injectService } from "../../../framework/decorator/Decorators";
import { LobbyService } from "../../net/LobbyService";
import Controller from "../../../framework/controller/Controller";
import { MainCmd, SUB_CMD_LOBBY } from "../../protocol/CmdNetID";
import { MailInfo } from "../../protocol/CmdLobby";
import { Manager } from "../../manager/Manager";
import { CommonEvent } from "../../event/CommonEvent";

const { ccclass, property } = cc._decorator;

@ccclass
@injectService(LobbyService.instance)
export default class LobbyNetController extends Controller<LobbyService> {
    
    protected bindingEvents(){
        super.bindingEvents()
        this.registerEvent(MainCmd.CMD_LOBBY,SUB_CMD_LOBBY.CMD_LOBBY_MAIL_RECV,this.onMailRecv,MailInfo);
    }

    private onMailRecv( data : MailInfo ){
        //做进入游戏失败的处理
        dispatch(CommonEvent.MAIL_RECV,data);
        //todo : 
        // Manager.uiManager.getView(MailView).then((view:MailView)=>{
        //     view.updateData(data)
        // });
    }
}

Manager.netManager.push(LobbyNetController);
