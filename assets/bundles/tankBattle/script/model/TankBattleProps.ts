import { BoxCollider2D, Component, IPhysics2DContact, Tween, tween, UIOpacity, _decorator } from "cc";
import { TankBettle } from "../data/TankBattleConfig";
import { TankBattleEntity } from "./TankBattleEntity";
import { TankBettleTankPlayer } from "./TankBattleTank";

const { ccclass, property } = _decorator;
@ccclass
export default class TankBattleProps extends TankBattleEntity {

    public type: TankBettle.PropsType = null!;
    public curOpacity : UIOpacity = null!;
    onLoad(){
        let time = TankBettle.PROPS_DISAPPEAR;
        this.curOpacity = this.node.getComponent(UIOpacity) as UIOpacity;
        let op = this.curOpacity;
        tween(this.curOpacity)
        .delay(time - 5)
        .sequence(
            tween(op).delay(0.4).to(0.1,{opacity:0}),
            tween(op).delay(0.4).to(0.1,{opacity:255})
        )
        .repeat(5)
        .call(()=>{
            this.node.destroy();
        })
        .start();
    }

     protected onBeginContact (self: BoxCollider2D, other: BoxCollider2D, contact: IPhysics2DContact | null) {
        if ( !this.logic ) return;
        if (other.group == TankBettle.GROUP.Player) {
            let player = other.node.getComponent(TankBettleTankPlayer)
            if( player ){
                this.logic.playEffect(TankBettle.AUDIO_PATH.PROP);
                if( this.type == TankBettle.PropsType.LIVE ){
                    this.logic && this.logic.addPlayerLive(player.isOnePlayer);
                    
                }else if( this.type == TankBettle.PropsType.BOOM_ALL_ENEMY ){
                    this.logic && this.logic.onMapRemoveAllEnemy();
                }else if( this.type == TankBettle.PropsType.GOD ){
                    player.addStatus(TankBettle.PLAYER_STATUS.PROTECTED)
                }else if( this.type == TankBettle.PropsType.STRONG_BULLET){
                    player.addStatus(TankBettle.PLAYER_STATUS.STRONG);
                }else if( this.type == TankBettle.PropsType.STRONG_MY_SELF){
                    player.addLive()
                }else if( this.type == TankBettle.PropsType.TIME){
                    this.data.addGameTime();
                }
                Tween.stopAllByTarget(this.curOpacity);
                this.node.removeFromParent();
                this.node.destroy();
            }
        }
    }
}
