import SettingView from "../../../../scripts/common/component/SettingView";
import { UIView } from "../../../../scripts/framework/support/ui/UIView";


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
            dispatch(td.Logic.Event.ENTER_HALL);
        });
        goback.zIndex = 10;

        this.audioHelper.playMusic("audio/background",this.bundle);

        cc.find("setting",this.node).on(cc.Node.EventType.TOUCH_END,this.onSetting,this);

        dispatchEnterComplete({type:td.Logic.Type.GAME,views:[this]});
    }

    private onSetting(){
        Manager.uiManager.open({
            type:SettingView,
            bundle:td.Macro.BUNDLE_RESOURCES,
            zIndex:td.ViewZOrder.UI,
            name:"设置界面"
        })
    }
}
