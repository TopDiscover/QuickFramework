import { TankBettle } from "../data/TankBattleConfig";
import { TankBattleGameData } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";
import { TankBettleTankPlayer } from "./TankBattleTank";

const {ccclass, property} = cc._decorator;
@ccclass
export default class TankBattleBlock extends cc.Component {

    public type : TankBettle.BLOCK_TYPE = null;

    protected get data( ){
        return Manager.dataCenter.getData(TankBattleGameData) as TankBattleGameData;
    }

    protected get logic():TankBattleLogic | null{
        return Manager.logicManager.getLogic<TankBattleLogic>(this.data.bundle);
    }

   /**
     * @description 当碰撞产生的时候调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        //处理受到来自子弹的碰撞
        this.handBullet(other,me);
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

    private removeSelf(){
        this.node.removeFromParent();
        this.node.destroy();
    }

    private handBullet( other:cc.BoxCollider , me : cc.BoxCollider ){
        if( other.node.group == TankBettle.GROUP.Bullet ){
            //受到来处子弹的碰撞
            switch( this.type ){
                case TankBettle.BLOCK_TYPE.GRASS: //草丛
                case TankBettle.BLOCK_TYPE.ICE:{ //冰面
                    //直接穿过，不做处理
                }
                break;
                case TankBettle.BLOCK_TYPE.WALL:{
                    //把自己移除
                    this.removeSelf();
                }
                break;
                case TankBettle.BLOCK_TYPE.STONE_WALL:{
                    let bullet = other.node.getComponent(TankBettleBullet);
                    if( bullet && bullet.owner instanceof TankBettleTankPlayer ){
                        if( bullet.owner.hasStatus(TankBettle.PLAYER_STATUS.STRONG) ){
                           this.removeSelf();
                        }
                    }
                }
                break;
                case TankBettle.BLOCK_TYPE.HOME:{
                    //老巢
                    if ( this.logic ) this.logic.gameOver();
                }
                break;
            }
        }
    }
}
