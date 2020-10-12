import UIView from "../../../script/framework/ui/UIView";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../../script/common/event/LogicEvent";
import { BUNDLE_REMOTE } from "../../../script/framework/base/Defines";

const {ccclass, property} = cc._decorator;

@ccclass
export default class GameOneView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/GameOneView";
    }

    onLoad(){
        super.onLoad();

        cc.find("goBack",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            dispatch(LogicEvent.ENTER_HALL);
        });

        let icon = cc.find("cocos",this.node)
        let btnLoad = cc.find("loadImg",this.node);

        let children = this.node.children;
        children.forEach(element => {
            cc.log(element.name)
        });
        
        btnLoad.on(cc.Node.EventType.TOUCH_END,()=>{
            // icon.getComponent(cc.Sprite).loadRemoteImage({
            //     url:"https://www.baidu.com/img/flexible/logo/pc/result.png",
            //     view:this,
            //     bundle:BUNDLE_REMOTE,
            //     completeCallback:()=>{
            //         cc.log("下载完成")
            //     }
            // })
            let spine = cc.find("spine",this.node).getComponent(sp.Skeleton);
            spine.loadRemoteSkeleton({
                view:this,
                path:"http://192.168.3.104/hotupdate",
                name:"VIP_CX1",
                completeCallback:( data : sp.SkeletonData)=>{
                    spine.animation = 'loop';
                    spine.premultipliedAlpha = false;
                    spine.loop = true
                }
            })
            
        });

        
        


        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }
}
