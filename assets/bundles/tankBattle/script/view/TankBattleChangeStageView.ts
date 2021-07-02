import UIView from "../../../../scripts/framework/ui/UIView";
import { TankBettle } from "../data/TankBattleGameData";
import { Manager } from "../../../../scripts/common/manager/Manager";
import { _decorator,Node, find, Label ,Animation, AnimationState, tween, AnimationClip} from "cc";


const {ccclass, property} = _decorator;

@ccclass
export default class TankBattleChangeStageView extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleChangeStageView";
    }

    onLoad(){
        super.onLoad()
        let level : number = this.args ? this.args[0] : 0;
        let node = find("level",this.node) as Node
        (node.getComponent(Label) as Label).language = Manager.makeLanguage(["stage",level + 1],this.bundle);

        //获取动画
        let comp = this.node.getComponent(Animation) as Animation;

        comp.on(Animation.EventType.FINISHED,this.onStartFinished,this)
        comp.playOnLoad = true;
        // comp.createState(comp.clips[0] as AnimationClip);
        // comp.play()
    }

    private onStartFinished(type: string, state: AnimationState){
        tween(this.node).delay(1.0).call(()=>{
            let comp = this.node.getComponent(Animation) as Animation;
            comp.off(Animation.EventType.FINISHED,this.onStartFinished,this);
            comp.on(Animation.EventType.FINISHED,this.onStartQuitFinished,this)
            comp.play("startQuit");
            let level : number = this.args ? this.args[0] : 0;
            dispatch(TankBettle.EVENT.SHOW_MAP_LEVEL,level);
        }).start()
    }

    private onStartQuitFinished(type: string, state: AnimationState){
        dispatch(TankBettle.EVENT.CHANGE_STAGE_FINISHED)
        this.close()
    }
}
