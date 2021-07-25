import { CELL_SIZE, EFFECTS_CONFIG, EliminateEffect } from "../data/EliminateDefines";
import EliminateGameView from "./EliminateGameView";

const { ccclass, property } = cc._decorator;
//游戏操作网络视图
@ccclass
export default class EliminateEffectsView extends cc.Component {

    view: EliminateGameView = null;

    playEffect(effects: EliminateEffect[]){
        if( !effects || effects.length <= 0 ){
            return;
        }
        
        let soundMap = {};//同一时间，同一声音是否播放过，防止重复播放
        effects.forEach((cmd)=>{
            let delay = cc.delayTime(cmd.playTime);
            let callFunc = cc.callFunc(()=>{
                let node : cc.Node = null;
                let animation : cc.Animation = null;
                let cache = Manager.cacheManager.get(this.view.bundle,EFFECTS_CONFIG[cmd.action].url);
                if(　!cache ){
                    return;
                }
                node = cc.instantiate((<cc.Prefab>cache.data));            
                if( node ){
                    node.x = CELL_SIZE * (cmd.pos.x - 0.5);
                    node.y = CELL_SIZE * (cmd.pos.y - 0.5);
                    this.node.addChild(node);
                }

                animation = node.getComponent(cc.Animation);
                if( animation ){
                    animation.play(EFFECTS_CONFIG[cmd.action].action);
                    if( cmd.action == "crush"){
                        !soundMap[`${cmd.action}${cmd.playTime}`] && this.view.playEliminate(cmd.step);
                        soundMap[`${cmd.action}${cmd.playTime}`] = true;
                    }
                    animation.on("finished",()=>{
                        node.destroy();
                    });
                }
                
            });
            this.node.runAction(cc.sequence(delay,callFunc));
        });
    }
}
