
import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../script/common/event/LogicEvent";
import { BUNDLE_REMOTE } from "../../../../script/framework/base/Defines";
import UIView from "../../../../script/framework/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadTestView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/LoadTestView";
    }

    onLoad(){
        super.onLoad();
        cc.find("goback",this.node).on(cc.Node.EventType.TOUCH_END,this.onGoback,this);

        this.content = cc.find("content",this.node);

        let op = cc.find("op",this.node);
        cc.find("loadFont",op).on(cc.Node.EventType.TOUCH_END,this.onLoadFont,this);

        cc.find("loadImg",op).on(cc.Node.EventType.TOUCH_END,this.onLoadImg,this);

        cc.find("loadNetImg",op).on(cc.Node.EventType.TOUCH_END,this.onLoadNetImg,this);

        dispatchEnterComplete({ type: LogicType.GAME, views: [this] });
    }

    private onGoback(){
        dispatch(LogicEvent.ENTER_HALL);
    }

    private onLoadFont( ){
        if( this.content.getChildByName("font") ){
            return;
        }
        this.content.removeAllChildren();
        let node = new cc.Node();
        node.name = "font";
        this.content.addChild(node);
        let label = node.addComponent(cc.Label);
        label.loadFont({font:"font/number",view:this,completeCallback:(font)=>{
            if( font ){
                label.string = "+12345678.9万";
            }
        },bundle:this.bundle});
    }

    private onLoadImg(){
        let name = "testImg";
        if( this.content.getChildByName(name) ){
            return;
        }
        this.content.removeAllChildren();
        let node = new cc.Node();
        this.content.addChild(node);
        node.name = name;
        let sp = node.addComponent(cc.Sprite);
        sp.loadImage({url:"texture/timg",view:this});
    }

    private onLoadNetImg(){
        let name = "netimg";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let node = new cc.Node();
        this.content.addChild(node);
        node.name = name;
        let sp = node.addComponent(cc.Sprite);
        sp.loadRemoteImage({
            url:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1625394063,1937534251&fm=26&gp=0.jpg",
            view:this,
            defaultBundle:this.bundle,
            defaultSpriteFrame:"texture/timg"
        });
    }
}
