import { TankBettle } from "../data/TankBattleGameData";
import { TankBettleTankPlayer } from "./TankBattleTank";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TankBattleProps extends cc.Component {

    public type: TankBettle.PropsType = null;

    onLoad(){
        let time = TankBettle.PROPS_DISAPPEAR;
        cc.tween(this.node).delay(time -3).blink(3,5).call(()=>{
            this.node.removeFromParent();
            this.node.destroy();
        }).start();
    }

    /**
      * @description 当碰撞产生的时候调用
      * @param other 产生碰撞的另一个碰撞组件
      */
    private onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        if (other.node.group == TankBettle.GROUP.Player) {
            let player = other.node.getComponent(TankBettleTankPlayer)
            if( player ){
                TankBettle.gameData.playPropsAudio();
                if( this.type == TankBettle.PropsType.LIVE ){
                    TankBettle.gameData.addPlayerLive(player.isOnePlayer);
                    
                }else if( this.type == TankBettle.PropsType.BOOM_ALL_ENEMY ){
                    TankBettle.gameData.gameMap.removeAllEnemy();
                }else if( this.type == TankBettle.PropsType.GOD ){
                    player.addStatus(TankBettle.PLAYER_STATUS.PROTECTED)
                }else if( this.type == TankBettle.PropsType.STRONG_BULLET){
                    player.addStatus(TankBettle.PLAYER_STATUS.STRONG);
                }else if( this.type == TankBettle.PropsType.STRONG_MY_SELF){
                    player.addLive()
                }else if( this.type == TankBettle.PropsType.TIME){
                    TankBettle.gameData.addGameTime();
                }
                this.node.stopAllActions();
                this.node.removeFromParent();
                this.node.destroy();
            }
        }
    }

    /**
     * @description 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionStay(other: cc.BoxCollider, me: cc.BoxCollider) {

    }

    /**
     * @description 当碰撞结束后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionExit(other: cc.BoxCollider, me: cc.BoxCollider) {

    }

    private removeSelf() {
        this.node.removeFromParent();
        this.node.destroy();
    }
}
