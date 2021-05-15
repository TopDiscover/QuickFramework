import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import UIView from "../../../../script/framework/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderView extends UIView {

    static getPrefabUrl(){
        return "prefabs/ShaderView";
    }

    private prefabs : cc.Node = null;

    onLoad(){
        super.onLoad();

        cc.find("goback",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        },this);

        this.prefabs = cc.find("prefabs",this.node);

        let op = cc.find("op",this.node);

        let loading = cc.find("loading",op);
        this.content = cc.find("content",this.node);

        loading.on(cc.Node.EventType.TOUCH_END,this.onLoading,this);

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }

    private onLoading(){
        this.content.removeAllChildren();
        let prefab = this.prefabs.getChildByName("loading");
        let loadingNode = cc.instantiate(prefab);
        this.content.addChild(loadingNode);
        loadingNode.position = cc.v3();
    }
}
