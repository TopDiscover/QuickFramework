import SettingView from "../../../../script/common/component/SettingView";
import { ViewZOrder } from "../../../../script/common/config/Config";
import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import { Manager } from "../../../../script/common/manager/Manager";
import { BUNDLE_RESOURCES } from "../../../../script/framework/base/Defines";
import UIView from "../../../../script/framework/ui/UIView";


const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOneView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/GameOneView";
    }

    private testNode : cc.Node = null;

    onLoad(){
        super.onLoad();
        let goback = cc.find("goBack",this.node);
        goback.on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        });
        goback.zIndex = 10;

        this.audioHelper.playMusic("audio/background",this.bundle);

        cc.find("setting",this.node).on(cc.Node.EventType.TOUCH_END,this.onSetting,this);

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }

    private onSetting(){
        Manager.uiManager.open({
            type:SettingView,
            bundle:BUNDLE_RESOURCES,
            zIndex:ViewZOrder.UI,
            name:"设置界面"
        })
    }
}
