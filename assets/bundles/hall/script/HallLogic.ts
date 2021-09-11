import { LogicImpl } from "../../../scripts/framework/core/logic/LogicImpl";
import HallView from "./view/HallView";
import { HallData } from "./data/HallData";
import { HallLanguage } from "./data/HallLanguage";
import { Logic } from "../../../scripts/framework/core/logic/Logic";
import { MainCmd } from "../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "./protocol/LobbyCmd";

class HallLogic extends LogicImpl {

    logicType: Logic.Type = Logic.Type.HALL;

    language = new HallLanguage;

    get bundle() {
        return HallData.bundle;
    }

    addEvents() {
        super.addEvents();
        this.addUIEvent(Logic.Event.ENTER_HALL, this.onEnterHall);
        this.addUIEvent(Logic.Event.ENTER_COMPLETE, this.onEnterComplete);
    }

    private onEnterHall() {
        console.log("login hall")
        Manager.language.addSourceDelegate(this.language);
        //添加大厅网络组件
        Manager.hallNetManager.addNetControllers();
        //加载大厅proto文件
        //后面再优化下用到时，再加载，但可能会收到消息后，没加载proto文件会有消息延迟，建议先加载
        Manager.protoTypeManager.register({ 
            cmd : String(MainCmd.CMD_LOBBY) + String(SUB_CMD_LOBBY.TEST_PROTO_MSG),
            url : "proto/test2",
            bundle : this.bundle});
        Manager.protoTypeManager.load([String(MainCmd.CMD_LOBBY) + String(SUB_CMD_LOBBY.TEST_PROTO_MSG)]).then((isSuccess)=>{
            Manager.uiManager.open({ type: HallView, bundle: this.bundle });
        });
    }

    public onEnterComplete(data: Logic.EventData) {
        super.onEnterComplete(data);
        if (data.type == Logic.Type.LOGIN) {
            //进入登录界面，移除大厅的网络组件
            Manager.hallNetManager.removeNetControllers();
        }
    }
}

Manager.logicManager.push(HallLogic);
