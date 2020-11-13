import UIView from "../../../script/framework/ui/UIView";
import { LogicEvent, dispatchEnterComplete, LogicType } from "../../../script/common/event/LogicEvent";
import { BUNDLE_REMOTE, ResourceInfo } from "../../../script/framework/base/Defines";
import { Manager } from "../../../script/framework/Framework";
import GameOne1 from "./GameOne1";
import { ViewZOrder } from "../../../script/common/config/Config";

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

        let icon = cc.find("cocos",this.node)
        let btnLoad = cc.find("loadImg",this.node);
        btnLoad.zIndex = 10;

        let children = this.node.children;
        children.forEach(element => {
            cc.log(element.name)
        });

        let unload = cc.find("unload",this.node);
        unload.on(cc.Node.EventType.TOUCH_END,()=>{
            // let info = new ResourceInfo();
            // info.bundle = this.bundle;
            // info.url = "texture/tiger";
            // Manager.assetManager.releaseAsset(info);
            // let data = Manager.uiManager.getViewData(this.className);
            // if( this.testNode ){
            //     this.testNode.removeFromParent();
            //     this.testNode.destroy();
            //     this.testNode = null;
            //     data.loadData.clear();
            // }
            Manager.uiManager.open({type:GameOne1,bundle:this.bundle,zIndex:ViewZOrder.UI});
        });

        unload.zIndex = 10;

        
        btnLoad.on(cc.Node.EventType.TOUCH_END,()=>{
            // icon.getComponent(cc.Sprite).loadRemoteImage({
            //     url:"https://www.baidu.com/img/flexible/logo/pc/result.png",
            //     view:this,
            //     bundle:BUNDLE_REMOTE,
            //     completeCallback:()=>{
            //         cc.log("下载完成")
            //     }
            // })
            // let spine = cc.find("spine",this.node).getComponent(sp.Skeleton);
            // spine.loadRemoteSkeleton({
            //     view:this,
            //     path:"http://192.168.3.104/hotupdate",
            //     name:"VIP_CX1",
            //     completeCallback:( data : sp.SkeletonData)=>{
            //         spine.animation = 'loop';
            //         spine.premultipliedAlpha = false;
            //         spine.loop = true
            //     }
            // })

            if( this.testNode ){
                return;
            }

            let node = new cc.Node();
            let sp = node.addComponent(cc.Sprite);

            sp.loadImage({
                url:"texture/tiger",
                view:this,
                bundle:this.bundle,
                completeCallback:(data)=>{
                    cc.log("下载完成")
                }
            })

            this.node.addChild(node);
            this.testNode = node;
            
        });

        
        


        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }
}
