import { UIView } from "../../../../scripts/framework/support/ui/UIView";
import { TankBettle } from "../data/TankBattleGameData";


const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleChangeStageView extends UIView {

    public static getPrefabUrl() {
        return "prefabs/TankBattleChangeStageView";
    }

    onLoad(){
        super.onLoad()
        let level : number = this.args[0]
        let node = cc.find("level",this.node)
        node.getComponent(cc.Label).language = Manager.makeLanguage(["stage",level + 1],this.bundle);

        //获取动画
        let comp = this.node.getComponent(cc.Animation)

        comp.on(cc.Animation.EventType.FINISHED,this.onStartFinished,this)
        comp.play()
    }

    private onStartFinished(type: string, state: cc.AnimationState){
        cc.tween(this.node).delay(1.0).call(()=>{
            let comp = this.node.getComponent(cc.Animation);
            comp.off(cc.Animation.EventType.FINISHED,this.onStartFinished,this);
            comp.on(cc.Animation.EventType.FINISHED,this.onStartQuitFinished,this)
            comp.play("startQuit");
            dispatch(TankBettle.EVENT.SHOW_MAP_LEVEL,this.args[0]);
        }).start()
    }

    private onStartQuitFinished(type: string, state: cc.AnimationState){
        dispatch(TankBettle.EVENT.CHANGE_STAGE_FINISHED)
        this.close()
    }
}
