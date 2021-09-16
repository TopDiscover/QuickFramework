import UIView from "../../../../scripts/framework/core/ui/UIView";
import { _decorator,Node, find, Label ,Animation, AnimationState, tween} from "cc";


const {ccclass, property} = _decorator;

@ccclass
export default class TankBattleChangeStageView extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleChangeStageView";
    }

    private level = 0;
    private logic : TankBattleLogic = null!;
    onLoad(){
        super.onLoad()
        if ( this.args ){
            this.level = this.args[0];
            this.logic = this.args[1];
        }
        let node = find("level",this.node) as Node
        (node.getComponent(Label) as Label).language = Manager.makeLanguage(["stage",this.level + 1],this.bundle);
        //获取动画
        let comp = this.node.getComponent(Animation) as Animation;
        comp.on(Animation.EventType.FINISHED,this.onStartFinished,this)
        comp.playOnLoad = true;
    }

    private onStartFinished(type: string, state: AnimationState){
        tween(this.node).delay(1.0).call(()=>{
            let comp = this.node.getComponent(Animation) as Animation;
            comp.off(Animation.EventType.FINISHED,this.onStartFinished,this);
            comp.on(Animation.EventType.FINISHED,this.onStartQuitFinished,this)
            comp.play("startQuit");
            this.logic?.onShowMapLevel(this.level);
        }).start()
    }

    private onStartQuitFinished(type: string, state: AnimationState){
        this.close()
    }
}
