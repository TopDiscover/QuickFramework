
import { _decorator,Node, find,Animation, Label, Sprite, instantiate, Button, Vec2, Vec3, UITransform, ParticleSystem, ParticleSystem2D, sp, SpriteFrame, AnimationClip, Layers } from "cc";
import { dispatchEnterComplete, LogicEvent, LogicType } from "../../../../scripts/common/event/LogicEvent";
import { ResourceCacheData } from "../../../../scripts/framework/base/Defines";
import { loadDirRes } from "../../../../scripts/framework/extentions/CocosExtention";
import { ButtonSpriteMemberName } from "../../../../scripts/framework/extentions/Utils";
import UIView from "../../../../scripts/framework/ui/UIView";
import { HallData } from "../../../hall/script/data/HallData";

const {ccclass, property} = _decorator;

@ccclass
export default class LoadTestView extends UIView {

    public static getPrefabUrl(){
        return "prefabs/LoadTestView";
    }

    private loadButton : Node = null!;

    onLoad(){
        super.onLoad();
        find("goback",this.node)?.on(Node.EventType.TOUCH_END,this.onGoback,this);

        this.content = find("content",this.node) as Node;

        let op = find("op",this.node) as Node;
        find("loadFont",op)?.on(Node.EventType.TOUCH_END,this.onLoadFont,this);

        find("loadImg",op)?.on(Node.EventType.TOUCH_END,this.onLoadImg,this);

        find("loadNetImg",op)?.on(Node.EventType.TOUCH_END,this.onLoadNetImg,this);

        this.loadButton = find("loadButton",op) as Node;
        this.loadButton.on(Node.EventType.TOUCH_END,this.onLoadButton,this);

        find("loadParticle",op)?.on(Node.EventType.TOUCH_END,this.onLoadParticle,this);

        find("loadSpine",op)?.on(Node.EventType.TOUCH_END,this.onLoadSpine,this);
        find("loadNetSpine",op)?.on(Node.EventType.TOUCH_END,this.onLoadNetSpine,this);

        find("loadDir",op)?.on(Node.EventType.TOUCH_END,this.onLoadDir,this);

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
        let node = new Node();
        node.name = "font";
        node.layer = Layers.Enum.UI_2D;
        this.content.addChild(node);
        let label = node.addComponent(Label);
        label.string = "";
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
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        this.content.addChild(node);
        node.name = name;
        let sp = node.addComponent(Sprite);
        sp.loadImage({url:"texture/timg/spriteFrame",view:this});
    }

    private onLoadNetImg(){
        let name = "netimg";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        this.content.addChild(node);
        node.name = name;
        let sp = node.addComponent(Sprite);
        sp.loadRemoteImage({
            url:"https://ss0.bdstatic.com/70cFuHSh_Q1YnxGkpoWK1HF6hhy/it/u=1625394063,1937534251&fm=26&gp=0.jpg",
            view:this,
            defaultBundle:this.bundle,
            defaultSpriteFrame:"texture/timg"
        });
    }

    private onLoadButton(){
        let name = "button";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let button = instantiate(this.loadButton);
        this.content.addChild(button);
        button.name = name;
        button.setPosition(new Vec3());
        let btn = button.getComponent(Button) as Button;
        btn.loadButton({
            normalSprite : "texture/btn_b/spriteFrame",
            pressedSprite: "texture/btn_y/spriteFrame",
            hoverSprite:"texture/btnbg/spriteFrame",
            view: this,
            bundle : HallData.bundle,
            completeCallback:(type,spriteFrame)=>{
                if( type == ButtonSpriteMemberName.Norml && spriteFrame ){
                    let buttonTrans = button.getComponent(UITransform) as UITransform;
                    let targetTrans = btn.target.getComponent(UITransform) as UITransform;
                    buttonTrans.setContentSize(spriteFrame.originalSize);
                    targetTrans.setContentSize(spriteFrame.originalSize);
                }
            },
        })
    }

    private onLoadParticle(){
        let name = "onLoadParticle";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.name = name;
        this.content.addChild(node);
        let sys = node.addComponent(ParticleSystem2D);
        sys.loadFile({
            url:"particle/test",
            view:this,
        })
    }

    private onLoadSpine(){
        let name = "onLoadSpine";
        if( this.content.getChildByName(name)){
            return;
        }

        this.content.removeAllChildren();
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.name = name;
        this.content.addChild(node);
        let spine = node.addComponent(sp.Skeleton);
        spine.loadSkeleton({
            view:this,
            url:"spine/raptor",
            completeCallback:()=>{
                spine.setAnimation(0,"walk",true);
            }});
        let trans = this.content.getComponent(UITransform) as UITransform;
        node.setPosition(new Vec3(0,-trans.height/2));
        node.setScale(new Vec3(0.5,0.5));
    }

    private onLoadNetSpine(){
        let name = "onLoadNetSpine";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.name = name;
        this.content.addChild(node);
        let spine = node.addComponent(sp.Skeleton);
        spine.loadRemoteSkeleton({
            view:this,
            path:"http://192.168.3.153",
            name:"raptor",
            completeCallback:(data : sp.SkeletonData )=>{
                if( data ){
                    spine.setAnimation(0,"walk",true);
                }
            }
        });
        let trans = this.content.getComponent(UITransform) as UITransform;
        node.setPosition(new Vec3(0,-trans.height/2));
        node.setScale(new Vec3(0.7,0.7));
    }

    private onLoadDir(){
        let name = "onLoadDir";
        if( this.content.getChildByName(name) ){
            return;
        }
        this.content.removeAllChildren();
        let node = new Node();
        node.layer = Layers.Enum.UI_2D;
        node.name = name;
        this.content.addChild(node);
        //添加显示渲染节点
        node.addComponent(Sprite);
        //添加动画
        let ani = node.addComponent(Animation);
        loadDirRes({
            url:"texture/sheep",
            type:SpriteFrame,
            view : this,
            onComplete:(data:ResourceCacheData)=>{
                if( data.data ){
                    let arr : SpriteFrame[] = (<SpriteFrame[]>data.data);
                    let clip = AnimationClip.createWithSpriteFrames(arr,arr.length) as AnimationClip;
                    clip.name = "run";
                    clip.wrapMode = AnimationClip.WrapMode.Loop;
                    ani.createState(clip,"run");
                    // ani.addClip(clip);
                    ani.play("run");
                }
            }
        })
    }
}
