import { TankBettle } from "../data/TankBattleGameData";
import TankBettleTank, { TankBettleTankEnemy, TankBettleTankPlayer } from "./TankBattleTank";

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
            .by(this.owner.config.bulletTime, { y: this.owner.config.bulletDistance})
            .repeatForever()
            .start();
        } else if (this.owner.direction == TankBettle.Direction.DOWN) {
            cc.tween(this.node).delay(0)
            .by(this.owner.config.bulletTime, { y: -this.owner.config.bulletDistance })
            .repeatForever()
            .start();
        } else if (this.owner.direction == TankBettle.Direction.RIGHT) {
            cc.tween(this.node).delay(0)
            .by(this.owner.config.bulletTime, { x: this.owner.config.bulletDistance })
            .repeatForever()
            .start();
        } else if (this.owner.direction == TankBettle.Direction.LEFT) {
            cc.tween(this.node).delay(0).
            by(this.owner.config.bulletTime, { x: -this.owner.config.bulletDistance })
            .repeatForever()
            .start();
        }
    }

    /**
     * @description 当碰撞产生的时候调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        // cc.log(`Bullet : onCollisionEnter=>${other.node.name}`)
        if (other.node.group == TankBettle.GROUP.Wall || 
            other.node.group == TankBettle.GROUP.StoneWall || 
            other.node.group == TankBettle.GROUP.Boundary ||
            other.node.group == TankBettle.GROUP.Home ) {
            //撞到了墙或边界
            this.removeSelf();
        }else if( other.node.group == TankBettle.GROUP.Bullet ){
            //子弹与子弹相撞
            //同阵营子弹不抵消
            let bullet = other.node.getComponent(TankBettleBullet);
            if( this.owner.isAI ){
                //敌人打出的子弹 与玩家子弹相互抵消
                if( !bullet.owner.isAI ){
                    this.removeSelf();
                }
            }else{
                //玩家打出子弹 与 敌人的子弹相互抵消
                if( bullet.owner.isAI ){
                   this.removeSelf();
                }
            }
        }else if( other.node.group == TankBettle.GROUP.Player ){
            //子弹与玩家相撞
            let tank = this.getPlayer(other.node);
            if( this.owner.isAI ){
                //敌人子弹不参打敌人
                if( !tank.isAI ){
                   this.removeSelf();
                }
            }else{
                if( tank.isAI ){
                    //只有打到敌人才消失
                   this.removeSelf();
                }
            }
            
        }else{
            //其它情况子弹继续走自己的路
        }
    }

    private removeSelf(){
        this.node.stopAllActions();
        this.owner.bullet = null;
        this.node.removeFromParent();
        this.node.destroy();
    }

    private getPlayer( node : cc.Node ) : TankBettleTank{
        let player = node.getComponent(TankBettleTankPlayer);
        if( player ){
            return player;
        }
        return node.getComponent(TankBettleTankEnemy);
    }

    /**
     * @description 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionStay(other: cc.BoxCollider, me: cc.BoxCollider) {
        // cc.log(`Bullet : onCollisionStay=>${other.node.name}`)
        
    }

    /**
     * @description 当碰撞结束后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionExit(other: cc.BoxCollider, me: cc.BoxCollider) {
        // cc.log(`Bullet : onCollisionExit=>${other.node.name}`)
    }

}

