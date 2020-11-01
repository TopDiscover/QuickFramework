import { TankBettle } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TankBettleTank extends cc.Component {

    /** @description 是否是AI敌人*/
    public isAI = false;
    public config: TankBettle.TankConfig = null;
    /** @description 子弹 */
    public bullet: TankBettleBullet = null;
    /**@description 移动方向 */
    public direction: TankBettle.Direction = TankBettle.Direction.UP;
    /**@description 当前是否正常移动 */
    protected isMoving = false;

    move() {

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

    /**@description 受伤 */
    public hurt() {

    }

    changeDirection(other: cc.BoxCollider) {
        
    }

    /**
     * @description 当碰撞产生的时候调用
     * @param other 产生碰撞的另一个碰撞组件
     */
    private onCollisionEnter(other: cc.BoxCollider, me: cc.BoxCollider) {
        this.onBulletCollision(other, me);
        this.onBlockCollision(other, me);
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

    protected getPlayer(node: cc.Node): TankBettleTank {
        let player = node.getComponent(TankBettleTankPlayer);
        if (player) {
            return player;
        }
        return node.getComponent(TankBettleTankEnemy);
    }

    /**@description 处理与地图元素的碰撞 */
    protected onBlockCollision(other: cc.BoxCollider, me: cc.BoxCollider) {
        //有阻挡才处理
        if (other.node.group == TankBettle.GROUP.Wall ||
            other.node.group == TankBettle.GROUP.StoneWall ||
            other.node.group == TankBettle.GROUP.Boundary ||
            other.node.group == TankBettle.GROUP.Home ||
            other.node.group == TankBettle.GROUP.Player ||
            other.node.group == TankBettle.GROUP.Water) {
            let wordPos = me.world.preAabb.center
            this.node.stopAllActions()
            //把自己恢复到未碰撞前的位置
            let pos = this.node.parent.convertToNodeSpaceAR(wordPos)
            this.checkPostion(pos);
            this.node.x = pos.x;
            this.node.y = pos.y;
            this.isMoving = false;
            if (this.isAI && other.node.group == TankBettle.GROUP.Home) {
                //如果是AI碰撞到老巢，直接GameOver
                TankBettle.gameData.gameMap.gameOver();
            }
            if( this.isAI ){
                this.changeDirection(other);
            }
        }
    }

    private checkPostion( pos : cc.Vec2 ){
        if( pos.x < this.node.width / 2 ){
            pos.x = this.node.width /2;
            pos.y = this.node.y;
        }
    }

    /**@description 处理来自子弹的碰撞 */
    private onBulletCollision(other: cc.BoxCollider, me: cc.BoxCollider) {
        if (other.node.group == TankBettle.GROUP.Bullet) {
            let bullet = other.node.getComponent(TankBettleBullet);
            if (this.isAI) {
                if (bullet.owner.isAI) {
                    //敌方子弹打敌方，不做处理
                    return;
                }
            } else {
                if (!bullet.owner.isAI) {
                    //两个玩家的子弹也不处理
                    return;
                }
            }
            //受到来处不同阵营的子弹攻击
            this.hurt();
        }
    }

}

export class TankBettleTankPlayer extends TankBettleTank {

    constructor() {
        super();
        this.config = new TankBettle.TankConfig();
    }

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

    public hurt() {
        if (this.hasStatus(TankBettle.PLAYER_STATUS.PROTECTED)) {
            //受保护下
            return;
        }
        this.config.live--;
        if (this.config.live <= 0) {
            TankBettle.gameData.gameMap.removePlayer(this);
        }
    }

    move() {
        if (this.isMoving) {
            return;
        }

        this.node.stopAllActions();
        this.isMoving = true;
        if (this.direction == TankBettle.Direction.UP) {
            this.node.angle = 0;
            cc.tween(this.node).delay(0).by(this.config.time, { y: this.config.distance }).call(() => { this.isMoving = false; }).start();
        } else if (this.direction == TankBettle.Direction.DOWN) {
            this.node.angle = 180;
            cc.tween(this.node).delay(0).by(this.config.time, { y: -this.config.distance }).call(() => { this.isMoving = false; }).start();
        } else if (this.direction == TankBettle.Direction.RIGHT) {
            this.node.angle = -90;
            cc.tween(this.node).delay(0).by(this.config.time, { x: this.config.distance }).call(() => { this.isMoving = false; }).start();
        } else if (this.direction == TankBettle.Direction.LEFT) {
            this.node.angle = 90;
            cc.tween(this.node).delay(0).by(this.config.time, { x: -this.config.distance }).call(() => { this.isMoving = false; }).start();
        }
    }
}

export class TankBettleTankEnemy extends TankBettleTank {
    constructor() {
        super();
        this.isAI = true;
        this.config = new TankBettle.TankConfig();
    }

    setConfig() {

    }

    public hurt() {
        this.config.live--;
        if (this.config.live <= 0) {
            TankBettle.gameData.gameMap.removeEnemy(this.node);
        }
    }

    public move() {
        this.node.stopAllActions();
        if (this.direction == TankBettle.Direction.UP) {
            this.node.angle = 0;
            cc.tween(this.node).delay(0)
                .by(this.config.time, { y: this.config.distance })
                .repeatForever()
                .start();
        } else if (this.direction == TankBettle.Direction.DOWN) {
            this.node.angle = 180;
            cc.tween(this.node).delay(0)
                .by(this.config.time, { y: -this.config.distance })
                .repeatForever()
                .start();
        } else if (this.direction == TankBettle.Direction.RIGHT) {
            this.node.angle = -90;
            cc.tween(this.node).delay(0)
                .by(this.config.time, { x: this.config.distance })
                .repeatForever()
                .start();
        } else if (this.direction == TankBettle.Direction.LEFT) {
            this.node.angle = 90;
            cc.tween(this.node).delay(0).
                by(this.config.time, { x: -this.config.distance })
                .repeatForever()
                .start();
        }
    }

    changeDirection(other: cc.BoxCollider) {
        let direction = this.direction;
        let otherDir = null;
        let isChange = true;
        // if (other.node.group == TankBettle.GROUP.Player) {
        //     let player = this.getPlayer(other.node);
        //     if (!player.isAI) {
        //         //玩家顶着，就不改变原来方向
        //         isChange = false;
        //     }else{
        //         otherDir = player.direction;
        //     }
        // }
        // if( isChange ){
        //     isChange = cc.randomInteger(1,10) == 1;
        // }
        // if (isChange) {
        //     let allDir: TankBettle.Direction[] = [];
        //     for (let i = TankBettle.Direction.UP; i <= TankBettle.Direction.RIGHT; i++) {
        //         if (i != this.direction && i != otherDir ) {
        //             allDir.push(i);
        //         }
        //     }
        //     direction = cc.randomInteger(0,allDir.length-1);
        // }

        // if( this.node.x < 0 ){
        //     cc.log(this.node.x);
        // }

        
        

        // this.direction = cc.randomInteger(TankBettle.Direction.MIN,TankBettle.Direction.MAX);
        // this.move();
    }
}
