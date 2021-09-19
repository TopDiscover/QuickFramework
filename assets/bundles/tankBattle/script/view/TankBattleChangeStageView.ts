import UIView from "../../../../scripts/framework/core/ui/UIView";

const {ccclass, property} = cc._decorator;

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
            this.logic?.onShowMapLevel(this.level);
        }).start()
    }

    private onStartQuitFinished(type: string, state: cc.AnimationState){
        this.close()
    }
}
