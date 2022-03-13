import { Component, tween, _decorator,Animation, instantiate, Prefab ,Node, Vec3} from "cc";
import { CELL_SIZE, EFFECTS_CONFIG, EliminateEffect } from "../data/EliminateDefines";
import EliminateGameView from "./EliminateGameView";

const { ccclass, property } = _decorator;
//游戏操作网络视图
@ccclass
export default class EliminateEffectsView extends Component {

    view: EliminateGameView = null!;

    playEffect(effects: EliminateEffect[]){
        if( !effects || effects.length <= 0 ){
            return;
        }
        
        let soundMap : any = {};//同一时间，同一声音是否播放过，防止重复播放
        effects.forEach((cmd)=>{
            tween(this.node)
            .delay(cmd.playTime)
            .call(()=>{
                let node : Node = null!;
                let animation : Animation | null = null;
                let cache = Manager.cache.get(this.view.bundle,(<any>EFFECTS_CONFIG)[cmd.action].url);
                if(　!cache ){
                    return;
                }
                node = instantiate((<Prefab>cache.data));            
                if( node ){
                    node.setPosition(new Vec3(CELL_SIZE * (cmd.pos.x - 0.5),CELL_SIZE * (cmd.pos.y - 0.5)));
                    this.node.addChild(node);
                }

                animation = node.getComponent(Animation);
                if( animation ){
                    animation.play((<any>EFFECTS_CONFIG)[cmd.action].action);
                    if( cmd.action == "crush"){
                        !soundMap[`${cmd.action}${cmd.playTime}`] && this.view.playEliminate(cmd.step as number);
                        soundMap[`${cmd.action}${cmd.playTime}`] = true;
                    }
                    animation.on(Animation.EventType.FINISHED,()=>{
                        node.destroy();
                    });
                }
            })
            .start();
        });
    }
}
