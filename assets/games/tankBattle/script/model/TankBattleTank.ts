import { TankBettle } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TankBettleTank extends cc.Component {


    /** @description 是否自动 */
    private isAI = false;
    /** @description 子弹是否在运行中 */
    private isShooting = false;
    /** @description 坦克time时间内移动的距离 */
    private distance = 5;
    /**@description 坦克每次移动的距离 */
    private time = 0.1;
    /** @description 子弹 */
    private bullet: TankBettleBullet = null;
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

    public shoot(type: TankBettle.BULLET_TYPE) {
        if (this.isAI && TankBettle.gameData.emenyStopTime > 0) {
            return;
        }
        if (this.isShooting) {
            //正在发射
            return;
        } else {
            let bulletNode = cc.instantiate(TankBettle.gameData.bulletPrefab);
            this.bullet = bulletNode.addComponent(TankBettleBullet);
            this.bullet.init(type, this.direction);
        }
    }

    /**@description 出生 */
    public born() {
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
    onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        this.isHit = true;
        cc.log(`onCollisionEnter=>${other.node.name}`)
        if (other.node.group == TankBettle.GROUP.Wall || other.node.group == TankBettle.GROUP.StoneWall) {
            this.node.stopAllActions()
            this.isMoving = false;
        }
    }

    /**
     * @description 当碰撞产生后，碰撞结束前的情况下，每次计算碰撞结果后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    onCollisionStay(other: cc.BoxCollider, me: cc.BoxCollider) {
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

    /**
     * @description 当碰撞结束后调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    onCollisionExit(other: cc.BoxCollider, me: cc.BoxCollider) {
        cc.log(`onCollisionExit=>${other.node.name}`)
    }

}
