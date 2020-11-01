import { TankBettle } from "../data/TankBattleGameData";
import TankBettleTank from "./TankBattleTank";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBettleBullet extends cc.Component {

    /**@description 拥有者 */
    public owner : TankBettleTank = null;

    private addBullet( ){
        TankBettle.gameData.gameMap.addBullet(this);
        if( this.owner.direction == TankBettle.Direction.UP ){
            this.node.x = this.owner.node.x;
            this.node.y = this.owner.node.y + this.owner.node.height /2 ;
            this.node.angle = 0;
        }else if( this.owner.direction == TankBettle.Direction.DOWN){
            this.node.x = this.owner.node.x;
            this.node.y = this.owner.node.y - this.owner.node.height/2;
            this.node.angle = 180;
        }else if( this.owner.direction == TankBettle.Direction.RIGHT){
            this.node.x = this.owner.node.x + this.owner.node.width /2;
            this.node.y = this.owner.node.y;
            this.node.angle = -90;
        }else if( this.owner.direction == TankBettle.Direction.LEFT){
            this.node.x = this.owner.node.x - this.owner.node.width/2;
            this.node.y = this.owner.node.y;
            this.node.angle = 90;
        }
    }

    move( owner : TankBettleTank ){
        this.owner = owner;
        //设置子弹的位置
        this.addBullet();

        if (this.owner.direction == TankBettle.Direction.UP) {
            cc.tween(this.node).delay(0)
            .by(this.owner.bulletTime, { y: this.owner.bulletDistance})
            .repeatForever()
            .start();
        } else if (this.owner.direction == TankBettle.Direction.DOWN) {
            cc.tween(this.node).delay(0)
            .by(this.owner.bulletTime, { y: -this.owner.bulletDistance })
            .repeatForever()
            .start();
        } else if (this.owner.direction == TankBettle.Direction.RIGHT) {
            cc.tween(this.node).delay(0)
            .by(this.owner.bulletTime, { x: this.owner.bulletDistance })
            .repeatForever()
            .start();
        } else if (this.owner.direction == TankBettle.Direction.LEFT) {
            cc.tween(this.node).delay(0).
            by(this.owner.bulletTime, { x: -this.owner.bulletDistance })
            .repeatForever()
            .start();
        }
    }

    /**
     * @description 当碰撞产生的时候调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        cc.log(`Bullet : onCollisionEnter=>${other.node.name}`)
        if (other.node.group == TankBettle.GROUP.Wall || 
            other.node.group == TankBettle.GROUP.StoneWall || 
            other.node.group == TankBettle.GROUP.Boundary ) {
            //撞到了墙或边界
            this.node.stopAllActions()
            this.node.removeFromParent()
            //取出子弹
            this.owner.bullet = null;
        }
    }

    /**
     * @description 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionStay(other: cc.BoxCollider, me: cc.BoxCollider) {
        cc.log(`Bullet : onCollisionStay=>${other.node.name}`)
        
    }

    /**
     * @description 当碰撞结束后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionExit(other: cc.BoxCollider, me: cc.BoxCollider) {
        cc.log(`Bullet : onCollisionExit=>${other.node.name}`)
    }

}

