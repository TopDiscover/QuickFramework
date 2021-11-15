import { Config } from "../../../../scripts/common/config/Config";
import GameView from "../../../../scripts/framework/core/ui/GameView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class ShaderView extends GameView {

    static getPrefabUrl(){
        return "prefabs/ShaderView";
    }

    private prefabs : cc.Node = null;

    onLoad(){
        super.onLoad();

        cc.find("goback",this.node).on(cc.Node.EventType.TOUCH_END,()=>{
            this.enterBundle(Config.BUNDLE_HALL);
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

        let circle = cc.find("circleSprite",op);
        if( circle ){
            circle.on(cc.Node.EventType.TOUCH_END,this.onCircleSprite,this);
        }

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
           complete:(data)=>{
               //加载新的灰色材质
               loadRes({
                   url : "material/sprite_gray",
                   view:this,
                   type : cc.Material,
                   onComplete : (data)=>{
                       sp.setMaterial(0,(<cc.Material>data.data));
                   }
               })
           }
       });
    }

    /**
     * @description 使用shader使用图片显示成圆形
     */
    private onCircleSprite(){
        let name = "circleSprite";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let node = new cc.Node();
        let sp = node.addComponent(cc.Sprite);
        node.name = name;
        this.content.addChild(node);
        sp.loadImage({
            url:"texture/content",
            view:this,
            complete:(data)=>{
                loadRes({
                    url:"material/sprite_circle",
                    view:this,
                    type:cc.Material,
                    onComplete:(data)=>{
                        sp.setMaterial(0,(<cc.Material>data.data));
                    }
                });
            }
        })
    }
}
