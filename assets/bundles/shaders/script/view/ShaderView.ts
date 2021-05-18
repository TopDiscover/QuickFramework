import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import { ResourceCacheData } from "../../../../script/framework/base/Defines";
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

        let gray = cc.find("graySprite",op);
        if( gray ){
            gray.on(cc.Node.EventType.TOUCH_END,this.onGraySprite,this);
        }

        dispatchEnterComplete({type:LogicType.GAME,views:[this]});
    }

    private onLoading(){
        let name = "loading";
        if( this.content.getChildByName(name) ){
            return;
        }
        this.content.removeAllChildren();
        let prefab = this.prefabs.getChildByName("loading");
        let loadingNode = cc.instantiate(prefab);
        loadingNode.name = name;
        this.content.addChild(loadingNode);
        loadingNode.position = cc.v3();
    }

    private onGraySprite(){
       let name = "graySprite";
       if( this.content.getChildByName(name)){
           return;
       }
       this.content.removeAllChildren();
       let node = new cc.Node();
       let sp = node.addComponent(cc.Sprite);
       node.name = name;
       this.content.addChild(node);
       sp.loadImage({
           url : "texture/content",
           view : this,
           completeCallback:(data)=>{
               //加载新的灰色材质
               cc.load({
                   url : "material/sprite_gray",
                   view:this,
                   type : cc.Material,
                   onComplete : (data : ResourceCacheData)=>{
                       sp.setMaterial(0,(<cc.Material>data.data));
                   }
               })
           }
       });
    }
}