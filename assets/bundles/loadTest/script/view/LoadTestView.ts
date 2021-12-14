
import GameView from "../../../../scripts/framework/core/ui/GameView";
import { ButtonSpriteType } from "../../../../scripts/framework/defines/Enums";
import { Macro } from "../../../../scripts/framework/defines/Macros";
import { HallData } from "../../../hall/script/data/HallData";

const {ccclass, property} = cc._decorator;

@ccclass
export default class LoadTestView extends GameView {

    public static getPrefabUrl(){
        return "prefabs/LoadTestView";
    }

    private loadButton : cc.Node = null;

    onLoad(){
        super.onLoad();
        cc.find("goback",this.node).on(cc.Node.EventType.TOUCH_END,this.onGoback,this);

        this.content = cc.find("content",this.node);

        let op = cc.find("op",this.node);
        cc.find("loadFont",op).on(cc.Node.EventType.TOUCH_END,this.onLoadFont,this);

        cc.find("loadImg",op).on(cc.Node.EventType.TOUCH_END,this.onLoadImg,this);

        cc.find("loadNetImg",op).on(cc.Node.EventType.TOUCH_END,this.onLoadNetImg,this);

        this.loadButton = cc.find("loadButton",this.node);
        cc.find("loadButton",op).on(cc.Node.EventType.TOUCH_END,this.onLoadButton,this);

        cc.find("loadParticle",op).on(cc.Node.EventType.TOUCH_END,this.onLoadParticle,this);

        cc.find("loadSpine",op).on(cc.Node.EventType.TOUCH_END,this.onLoadSpine,this);
        cc.find("loadNetSpine",op).on(cc.Node.EventType.TOUCH_END,this.onLoadNetSpine,this);

        cc.find("loadDir",op).on(cc.Node.EventType.TOUCH_END,this.onLoadDir,this);

        cc.find("loadDragon",op).on(cc.Node.EventType.TOUCH_END,this.onLoadDragon,this);
    }

    private onGoback(){
        this.enterBundle(Macro.BUNDLE_HALL);
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
        label.loadFont({font:"font/number",view:this,complete:(font)=>{
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

    private onLoadButton(){
        let name = "button";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let button = cc.instantiate(this.loadButton);
        this.content.addChild(button);
        button.name = name;
        button.active = true;
        button.position = cc.v3(0,0,0);
        let btn = button.getComponent(cc.Button);
        btn.loadButton({
            normalSprite : "texture/btn_b",
            pressedSprite: "texture/btn_y",
            hoverSprite:"texture/btnbg",
            view: this,
            bundle : HallData.bundle,
            complete:(type,spriteFrame)=>{
                if( type == ButtonSpriteType.Norml ){
                    button.setContentSize(spriteFrame.getOriginalSize());
                    btn.target.setContentSize(spriteFrame.getOriginalSize());
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
        let node = new cc.Node();
        node.name = name;
        this.content.addChild(node);
        let sys = node.addComponent(cc.ParticleSystem);
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
        let node = new cc.Node();
        node.name = name;
        this.content.addChild(node);
        let spine = node.addComponent(sp.Skeleton);
        spine.loadSkeleton({
            view:this,
            url:"spine/raptor",
            complete:()=>{
                spine.setAnimation(0,"walk",true);
            }})
        node.y = - this.content.height /2;
        node.scale = 0.5;
    }

    private onLoadNetSpine(){
        let name = "onLoadNetSpine";
        if( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let node = new cc.Node();
        node.name = name;
        this.content.addChild(node);
        let spine = node.addComponent(sp.Skeleton);
        spine.loadRemoteSkeleton({
            view:this,
            path:"http://192.168.3.153",
            name:"raptor",
            complete:(data : sp.SkeletonData )=>{
                if( data ){
                    spine.setAnimation(0,"walk",true);
                }
            }
        })
        node.y = -this.content.height/2;
        node.scale = 0.7;
    }

    private onLoadDir(){
        let name = "onLoadDir";
        if( this.content.getChildByName(name) ){
            return;
        }
        this.content.removeAllChildren();
        let node = new cc.Node();
        node.name = name;
        this.content.addChild(node);
        //添加显示渲染节点
        node.addComponent(cc.Sprite);
        //添加动画
        let ani = node.addComponent(cc.Animation);
        loadDirRes({
            url:"texture/sheep",
            type:cc.SpriteFrame,
            view : this,
            onComplete:(data)=>{
                if( data.data ){
                    let arr : cc.SpriteFrame[] = (<cc.SpriteFrame[]>data.data);
                    let clip = cc.AnimationClip.createWithSpriteFrames(arr,arr.length);
                    clip.name = "run";
                    clip.wrapMode = cc.WrapMode.Loop;
                    ani.addClip(clip);
                    ani.play("run");
                }
            }
        })
    }

    private onLoadDragon(){
        let name = "onLoadDragon";
        if ( this.content.getChildByName(name)){
            return;
        }
        this.content.removeAllChildren();
        let node = new cc.Node();
        node.name = name;
        this.content.addChild(node);
        //添加动画
        let ani = node.addComponent(dragonBones.ArmatureDisplay);
        ani.loadDisplay({
            assetUrl : "dragonBones/NewDragonTest",
            atlasUrl : "dragonBones/texture",
            view : this,
            complete :(asset,atlas)=>{
                if ( asset && atlas ){
                    ani.armatureName = "armatureName";
                    ani.setAnimationCacheMode(dragonBones.ArmatureDisplay.AnimationCacheMode.REALTIME);
                    ani.timeScale = 1;
                    ani.playTimes = 0;
                    ani.playAnimation("stand", 0);
                }
            }
        })
        node.y = -this.content.height/2;
        node.scale = 0.9;
    }
}
