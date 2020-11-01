import { TankBettle } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TankBettleTank extends cc.Component {


    /** @description 是否自动 */
    public isAI = false;
    /** @description 坦克time时间内移动的距离 */
    private distance = 5;
    /**@description 坦克每次移动distance距离需要的时间 */
    private time = 0.1;
    /**@description 坦克子弹在bulletTime时间内移动的距离 */
    public bulletDistance = 10;
    /**@description 坦克子弹每次移动bulletDistance距离需要的时间*/
    public bulletTime = 0.1;
    /** @description 子弹 */
    public bullet: TankBettleBullet = null;
    /**@description 移动方向 */
    public direction: TankBettle.Direction = TankBettle.Direction.UP;
    /**@description 当前是否正常移动 */
    private isMoving = false;
    /**@description 如果是补撞方，自己位置保持不动，让来撞方，退出碰撞区域 */
    public isStand = false;

    move() {
        if (this.isMoving) {
            return;
        }

        this.node.stopAllActions();
        this.isMoving = true;
        if (this.direction == TankBettle.Direction.UP) {
            this.node.angle = 0;
            cc.tween(this.node).delay(0).by(this.time, { y: this.distance }).call(() => { this.isMoving = false; }).start();
        } else if (this.direction == TankBettle.Direction.DOWN) {
            this.node.angle = 180;
            cc.tween(this.node).delay(0).by(this.time, { y: -this.distance }).call(() => { this.isMoving = false; }).start();
        } else if (this.direction == TankBettle.Direction.RIGHT) {
            this.node.angle = -90;
            cc.tween(this.node).delay(0).by(this.time, { x: this.distance }).call(() => { this.isMoving = false; }).start();
        } else if (this.direction == TankBettle.Direction.LEFT) {
            this.node.angle = 90;
            cc.tween(this.node).delay(0).by(this.time, { x: -this.distance }).call(() => { this.isMoving = false; }).start();
        }

    }

    public shoot() {
        if (this.bullet) {
            //正在发射
            return;
        } else {
            let bulletNode = cc.instantiate(TankBettle.gameData.bulletPrefab);
            this.bullet = bulletNode.addComponent(TankBettleBullet);
            this.bullet.move(this);
        }
    }

    /**@description 出生 */
    public born() {

    }

    /**
     * @description 当碰撞产生的时候调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        if (this.isValidCollision(other, me)) {
            cc.log(`onCollisionEnter=>${other.node.name}`)
            if (other.node.group == TankBettle.GROUP.Wall ||
                other.node.group == TankBettle.GROUP.StoneWall ||
                other.node.group == TankBettle.GROUP.Boundary ||
                other.node.group == TankBettle.GROUP.Player) {
                this.node.stopAllActions()
                if( other.node.group == TankBettle.GROUP.Player ){
                    let tank = this.getPlayer(other.node);
                    if( tank ){
                        if( this.isStand ){
                            tank.isStand = false;
                        }else{
                            tank.isStand = true;
                        }
                    }
                }
            }
        }
    }

    private getPlayer( node : cc.Node ) : TankBettleTank {
        let player = node.getComponent(TankBettleTankPlayer);
        if( player ){
            return player;
        }
        let enemy = node.getComponent(TankBettleTankEnemy);
        if( enemy ){
            return enemy;
        }
        return null;
    }

    /**
     * @description 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionStay(other: cc.BoxCollider, me: cc.BoxCollider) {
        if (this.isValidCollision(other, me)) {
            cc.log(`onCollisionStay=>${other.node.name}`)
            if (other.node.group == TankBettle.GROUP.Player) {
                if( this.isStand ){
                    this.tryExitCollision();
                }
            }else{
                this.tryExitCollision();
            }
        }
    }

    private tryExitCollision() {
        //退出碰撞区域
        if (this.direction == TankBettle.Direction.UP) {
            this.node.y -= 1;
        } else if (this.direction == TankBettle.Direction.DOWN) {
            this.node.y += 1;
        } else if (this.direction == TankBettle.Direction.RIGHT) {
            this.node.x -= 1;
        } else if (this.direction == TankBettle.Direction.LEFT) {
            this.node.x += 1;
        }
    }

    /**
     * @description 当碰撞结束后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionExit(other: cc.BoxCollider, me: cc.BoxCollider) {
        if (this.isValidCollision(other, me)) {
            cc.log(`onCollisionExit=>${other.node.name}`)
            this.isMoving = false;
            if (other.node.group == TankBettle.GROUP.Player) {
                this.isStand = false;
            }
        }
    }

    /**@description 测试是否是一个有效的碰撞 */
    private isValidCollision(other: cc.BoxCollider, me: cc.BoxCollider) {
        //与子弹的碰撞
        if (other.node.group == TankBettle.GROUP.Bullet) {
            //取出子弹
            let bullet = other.node.getComponent(TankBettleBullet);
            if( this.isAI ){
                if( bullet.owner.isAI ){
                    //敌人的子弹不打敌人
                    return false;
                }
            }else{
                if( !bullet.owner.isAI ){
                    //玩家的子弹不打玩家
                    return false;
                }
            }
            return true;
        } else if (other.node.group == TankBettle.GROUP.Player) {
            return true;
        }
        return true;
    }

}

export class TankBettleTankPlayer extends TankBettleTank {

    /**@description 是否是玩家1 */
    public isOnePlayer = false;

    /**@description 玩家状态 */
    private _status: TankBettle.PLAYER_STATUS[] = [];

    public addStatus(status: TankBettle.PLAYER_STATUS) {
        this._status.push(status);
        if (status == TankBettle.PLAYER_STATUS.PROTECTED) {
            let aniNode = cc.instantiate(TankBettle.gameData.animationPrefab);
            this.node.addChild(aniNode);
            let animation = aniNode.getComponent(cc.Animation);
            animation.play("tank_protected")
            cc.tween(aniNode).delay(5).call(() => {
                aniNode.removeFromParent()
                this.removeStatus(TankBettle.PLAYER_STATUS.PROTECTED)
            }).removeSelf().start()
        }
    }

    public hasStatus(status: TankBettle.PLAYER_STATUS) {
        for (let i = 0; i < this._status.length; i++) {
            if (this._status[i] == status) {
                return true;
            }
        }
        return false;
    }

    public removeStatus(status: TankBettle.PLAYER_STATUS) {
        let i = this._status.length;
        while (i--) {
            if (this._status[i] == status) {
                this._status.splice(i, 1);
            }
        }
    }

    /**@description 出生 */
    public born() {
        //出生动画
        this.addStatus(TankBettle.PLAYER_STATUS.PROTECTED);
    }
}

export class TankBettleTankEnemy extends TankBettleTank{
    constructor(){
        super();
        this.isAI = true;
    }
}
