import { TankBettle } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";
import TankBattleMap from "./TankBattleMap";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TankBettleTank extends cc.Component {


    /** @description 是否自动 */
    private isAI = false;
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
    /**@description 当前是否已经销毁 */
    private isDestroyed = false;
    /**@description 移动方向 */
    public direction: TankBettle.Direction = TankBettle.Direction.UP;
    /**@description 射击概率 */
    private shootRate = 0.6;
    /**@description 是否碰到墙或者坦克 */
    private isHit = false;
    /**@description 控制敌方坦克切换方向的时间 */
    private frame = 0;
    /**@description 当前是否正常移动 */
    private isMoving = false;
    private isProtected = false;

    /**@description 玩家状态 */
    private _status : TankBettle.PLAYER_STATUS[] = [];

    public addStatus( status : TankBettle.PLAYER_STATUS ){
        this._status.push(status);
    }

    public hasStatus( status : TankBettle.PLAYER_STATUS ){
        for( let i = 0 ; i < this._status.length ; i++ ){
            if( this._status[i] == status ){
                return true;
            }
        }
        return false;
    }

    move() {
        if (this.isMoving) {
            return;
        }
        if (this.isAI && TankBettle.gameData.emenyStopTime > 0) {
            return;
        }

        if (this.isAI) {
            this.frame++;
            if (this.frame % 100 == 0 || this.isHit) {
                this.direction = parseInt((Math.random() * 4).toString())
                this.isHit = false;
                this.frame = 0;
            }
        }

        this.node.stopAllActions();
        this.isMoving = true;
        if (this.direction == TankBettle.Direction.UP) {
            this.node.angle = 0;
            cc.tween(this.node).delay(0).by(this.time, { y: this.distance }).call(()=>{this.isMoving = false;}).start();
        } else if (this.direction == TankBettle.Direction.DOWN) {
            this.node.angle = 180;
            cc.tween(this.node).delay(0).by(this.time, { y: -this.distance }).call(()=>{this.isMoving = false;}).start();
        } else if (this.direction == TankBettle.Direction.RIGHT) {
            this.node.angle = -90;
            cc.tween(this.node).delay(0).by(this.time, { x: this.distance }).call(()=>{this.isMoving = false;}).start();
        } else if (this.direction == TankBettle.Direction.LEFT) {
            this.node.angle = 90;
            cc.tween(this.node).delay(0).by(this.time, { x: -this.distance }).call(()=>{this.isMoving = false;}).start();
        }

    }

    public shoot() {
        if (this.isAI && TankBettle.gameData.emenyStopTime > 0) {
            return;
        }
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
    public born( ) {
        this.isHit = false;
        //出生动画
        this.isProtected = true;
        let aniNode = cc.instantiate(TankBettle.gameData.animationPrefab);
        this.node.addChild(aniNode);
        let animation = aniNode.getComponent(cc.Animation);
        animation.play("tank_protected")
        cc.tween(aniNode).delay(5).call(() => {
            aniNode.removeFromParent()
            this.isProtected = false;
        }).removeSelf().start()
    }

    /**
     * @description 当碰撞产生的时候调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        if( this.isValidCollision( other,me) ){
            this.isHit = true;
            cc.log(`onCollisionEnter=>${other.node.name}`)
            if (other.node.group == TankBettle.GROUP.Wall || 
                other.node.group == TankBettle.GROUP.StoneWall || 
                other.node.group == TankBettle.GROUP.Boundary) {
                this.node.stopAllActions()
            }
        }
    }

    /**
     * @description 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionStay(other: cc.BoxCollider, me: cc.BoxCollider) {
        if( this.isValidCollision(other,me) ){
            cc.log(`onCollisionStay=>${other.node.name}`)
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
    }

    /**
     * @description 当碰撞结束后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionExit(other: cc.BoxCollider, me: cc.BoxCollider) {
        if( this.isValidCollision(other,me) ){
            cc.log(`onCollisionExit=>${other.node.name}`)
            this.isMoving = false;
        }
    }

    /**@description 测试是否是一个有效的碰撞 */
    private isValidCollision( other : cc.BoxCollider , me : cc.BoxCollider ){
        if( other.node.group == TankBettle.GROUP.Bullet ){
            //取出子弹
            let bullet = other.node.getComponent(TankBettleBullet);
            let result = bullet.owner == this;
            return !result;
        }
        return true;
    }

}
