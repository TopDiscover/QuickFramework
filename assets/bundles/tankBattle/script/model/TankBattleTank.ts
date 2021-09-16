import { instantiate, _decorator, Node, BoxCollider2D, Tween, UITransform, Vec3,Animation, tween, Sprite, randomRange, randomRangeInt, IPhysics2DContact, Rect, Vec2 } from "cc";
import { TankBettle } from "../data/TankBattleConfig";
import { TankBattleAI } from "./TankBattleAI";

const { ccclass, property } = _decorator;
@ccclass
export default class TankBettleTank extends TankBattleAI {

    protected isWaitingChange = false;

    /**@description 当前位置 */
    protected curPosition  = new Vec3();
    /**@description 移动之前的位置 */
    protected prevPosition = new Vec3();

    /**@description 死亡动画 */
    protected dieAction = new Vec3();

    onDestroy() {
        Tween.stopAllByTarget(this.curPosition);
        Tween.stopAllByTarget(this.dieAction);
        this.stopAllActions();
    }

    move() {

    }

    public shoot() {
        if ( !this.logic ) return false;
        if (this.bullet) {
            //正在发射
            return false;
        } else {
            let prefab = this.logic.bulletPrefab;
            if( !prefab ) return false;
            let bulletNode = instantiate(this.logic.bulletPrefab);
            if( bulletNode ){
                this.bullet = bulletNode.addComponent(this.bulletType);
                this.bullet.move(this);
            }
            return true;
        }
    }

    /**@description 出生 */
    public born() {

    }

    /**@description 受伤 */
    public hurt() {

    }

    public die() {

    }

    protected stopAllActions(){

    }

    changeDirection(other?: BoxCollider2D) {

    }

    protected onBeginContact (self: BoxCollider2D, other: BoxCollider2D, contact: IPhysics2DContact | null) {
        this.onBulletCollision(self, other);
        this.onBlockCollision(self, other);
    }

    protected getPlayer(node: Node): TankBettleTank {
        let player = node.getComponent(TankBettleTankPlayer);
        if (player) {
            return player;
        }
        return node.getComponent(TankBettleTankEnemy) as TankBettleTankEnemy;
    }

    /**@description 处理与地图元素的碰撞 */
    protected onBlockCollision(self: BoxCollider2D, other: BoxCollider2D) {
        //有阻挡才处理
        if (other.group == TankBettle.GROUP.Wall ||
            other.group == TankBettle.GROUP.StoneWall ||
            other.group == TankBettle.GROUP.Boundary ||
            other.group == TankBettle.GROUP.Home ||
            other.group == TankBettle.GROUP.Water) {
            //停止移动的动作，恢复之前的位置
            Tween.stopAllByTarget(this.curPosition);
            //把自己恢复到未碰撞前的位置
            this.node.setPosition(this.prevPosition);
            this.isMoving = false;
            if (this.isAI && other.group == TankBettle.GROUP.Home) {
                //如果是AI碰撞到老巢，直接GameOver
                this.logic && this.logic.gameOver();
            }
            if (this.isAI) {
                this.changeDirection(other);
            }
        } else if (other.group == TankBettle.GROUP.Player) {
            let player = this.getPlayer(other.node);
            if (this.isAI) {

            } else {
                //自己不是AI
                if (player.isAI) {
                    Tween.stopAllByTarget(this.curPosition);
                    this.node.setPosition(this.prevPosition);
                    this.isMoving = false;
                }
            }
        }
    }

    /**@description 处理来自子弹的碰撞 */
    private onBulletCollision(self: BoxCollider2D, other: BoxCollider2D) {
        if (other.group == TankBettle.GROUP.Bullet) {
            let bullet = other.node.getComponent(this.bulletType);
            if (bullet)
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
        this.config = this.data.playerConfig;
        this.thisType = "TankBettleTankPlayer";
    }

    /**@description 是否是玩家1 */
    public isOnePlayer = false;

    /**@description 玩家状态 */
    private _status: Map<TankBettle.PLAYER_STATUS, boolean> = new Map();

    /**@description 打白色砖墙状态 */
    private _strongNode: Node = null!;

    protected stopAllActions(){
        Tween.stopAllByTarget(this.dieAction);
        Tween.stopAllByTarget(this.curPosition);
    }

    onLoad() {
        this._strongNode = new Node();
        this.node.addChild(this._strongNode);
    }

    addLive() {
        this.config.live++;
        this.logic && this.logic.updateGameInfo();
    }

    shoot() {
        if ( !this.logic ) return true;
        if (super.shoot()) {
            this.logic.playEffect(TankBettle.AUDIO_PATH.ATTACK);
        }
        return true;
    }

    public addStatus(status: TankBettle.PLAYER_STATUS) {
        if ( !this.logic ) return;
        this._status.set(status, true);
        if (status == TankBettle.PLAYER_STATUS.PROTECTED) {
            let aniNode = instantiate(this.logic.animationPrefab) as Node;
            this.node.addChild(aniNode);
            let animation = aniNode.getComponent(Animation) as Animation;
            animation.play("tank_protected");
            aniNode.setPosition(new Vec3());
            tween(aniNode).delay(TankBettle.PLAYER_STATUS_EXIST_TIME).call(() => {
                this.removeStatus(TankBettle.PLAYER_STATUS.PROTECTED)
            }).removeSelf().start()
        } else if (status == TankBettle.PLAYER_STATUS.STRONG) {
            Tween.stopAllByTarget(this._strongNode);
            tween(this._strongNode).delay(TankBettle.PLAYER_STATUS_EXIST_TIME).call(() => {
                this.removeStatus(status);
            }).start();
        }
    }

    public hasStatus(status: TankBettle.PLAYER_STATUS) {
        return this._status.has(status);
    }

    public removeStatus(status: TankBettle.PLAYER_STATUS) {
        this._status.delete(status);
    }

    /**@description 出生 */
    public born() {
        //出生动画
        this.addStatus(TankBettle.PLAYER_STATUS.PROTECTED);
    }

    public hurt() {
        if ( !this.logic ) return;
        if (this.hasStatus(TankBettle.PLAYER_STATUS.PROTECTED)) {
            //受保护下
            return;
        }
        this.config.live--;
        if (this.config.live == 0) {
            this.stopAllActions();
            let aniNode = instantiate(this.logic.animationPrefab) as Node;
            this.node.addChild(aniNode);
            let animation = aniNode.getComponent(Animation) as Animation;
            animation.play("tank_boom");
            let state = animation.getState("tank_boom");
            //玩家销毁声音
            this.logic.playEffect(TankBettle.AUDIO_PATH.PLAYERCRACK);
            aniNode.setPosition(new Vec3())
            tween(this.dieAction).delay(state.duration).call(() => {
                this.stopAllActions();
                this.logic && this.logic.onMapRemovePlayer(this);
            }).start()
        }
        if (this.logic) this.logic.updateGameInfo();
    }

    move() {
        if (this.isMoving) {
            return;
        }
        Tween.stopAllByTarget(this.curPosition);
        this.isMoving = true;
        if (this.direction == TankBettle.Direction.UP) {
            this.node.angle = 0;
            this.curPosition.set(this.node.position);
            tween(this.curPosition)
                .by(this.config.time, { y : this.config.distance },{onUpdate:(target)=>{
                    this.prevPosition.set(this.node.position);
                    this.node.setPosition(target as Vec3);
                }})
                .call(() => {
                    this.isMoving = false;
                })
                .start();
        } else if (this.direction == TankBettle.Direction.DOWN) {
            this.node.angle = 180;
            this.curPosition.set(this.node.position);
            tween(this.curPosition)
                .by(this.config.time, { y : -this.config.distance },{onUpdate:(target)=>{
                    this.prevPosition.set(this.node.position);
                    this.node.setPosition(target as Vec3);
                }})
                .call(() => {
                    this.isMoving = false;
                })
                .start();
        } else if (this.direction == TankBettle.Direction.RIGHT) {
            this.node.angle = -90;
            this.curPosition.set(this.node.position);
            tween(this.curPosition)
                .by(this.config.time, { x : this.config.distance},{onUpdate : (target)=>{
                    this.prevPosition.set(this.node.position);
                    this.node.setPosition(target as Vec3);
                }})
                .call(() => {
                    this.isMoving = false;
                })
                .start();
        } else if (this.direction == TankBettle.Direction.LEFT) {
            this.node.angle = 90;
            this.curPosition.set(this.node.position);
            tween(this.curPosition)
                .by(this.config.time, { x : -this.config.distance },{onUpdate:(target)=>{
                    this.prevPosition.set(this.node.position);
                    this.node.setPosition(target as Vec3);
                }})
                .call(() => {
                    this.isMoving = false;
                })
                .start();
        }
    }
}

export class TankBettleTankEnemy extends TankBettleTank {

    constructor() {
        super();
        this.isAI = true;
        this.config = new TankBettle.TankConfig();
        this.thisType = "TankBettleTankEnemy";
    }

    private shootNode: Node = null!;
    private changeNode: Node = null!;
    private delayChangeNode: Node = null!;
    public _type: TankBettle.EnemyType = null!;

    public set type(value:TankBettle.EnemyType) {
        this._type = value;
        let spriteFrameKey = "";
        if (value == TankBettle.EnemyType.NORMAL) {
            spriteFrameKey = "tank_0_0";
        } else if (value == TankBettle.EnemyType.SPEED) {
            spriteFrameKey = "tank_3_0";
        } else if (value == TankBettle.EnemyType.STRONG) {
            spriteFrameKey = "tank_4_0";
        }
        let sprite = this.node.getComponent(Sprite);
        this.logic && this.logic.loadImage(sprite,spriteFrameKey);
    }

    protected stopAllActions(){
        this.stopShootAction();
        Tween.stopAllByTarget(this.curPosition);
        Tween.stopAllByTarget(this.changeNode);
        Tween.stopAllByTarget(this.delayChangeNode);
        Tween.stopAllByTarget(this.dieAction);
    }
    private stopShootAction() {
        Tween.stopAllByTarget(this.shootNode);
    }

    onLoad() {
        let node = new Node();
        this.node.addChild(node)
        this.shootNode = node;
        this.changeNode = new Node();
        this.node.addChild(this.changeNode);
        this.delayChangeNode = new Node();
        this.node.addChild(this.delayChangeNode);
        this.startDelayChange();
    }

    private startDelayChange() {
        let delay = randomRange(this.config.changeInterval.min, this.config.changeInterval.max);
        Tween.stopAllByTarget(this.delayChangeNode);
        tween(this.shootNode).delay(delay).call(() => {
            this.changeDirection();
            this.startDelayChange();
        }).start();
    }

    public hurt() {
        this.config.live--;
        if (this._type == TankBettle.EnemyType.STRONG) {
            let sprite = this.node.getComponent(Sprite) as Sprite;
            let spriteFrameKey = "tank_5_0"
            if (this.config.live == 1) {
                spriteFrameKey = "tank_6_0"
            }
            this.logic && this.logic.loadImage(sprite,spriteFrameKey);
        }
        if (this.config.live == 0) {
            this.die()
        }
    }

    public die() {
        if ( !this.logic ) return;
        this.stopAllActions();
        let aniNode = instantiate(this.logic.animationPrefab) as Node;
        this.node.addChild(aniNode);
        let animation = aniNode.getComponent(Animation) as Animation;
        animation.play("tank_boom");
        let state = animation.getState("tank_boom");
        this.logic.playEffect(TankBettle.AUDIO_PATH.ENEMYCRACK);
        aniNode.setPosition(new Vec3());
        tween(this.dieAction).delay(state.duration).call(() => {
            this.stopAllActions();
            this.logic && this.logic.onMapRemoveEnemy(this.node);
        }).start()
    }

    /**@description 开始射击 */
    public startShoot() {
        let delay = randomRange(this.config.shootInterval.min, this.config.shootInterval.max);
        this.stopShootAction();
        tween(this.shootNode).delay(delay).call(() => {
            this.shoot();
            this.startShoot();
        }).start();
    }

    public move() {
        Tween.stopAllByTarget(this.curPosition);
        if (this.direction == TankBettle.Direction.UP) {
            this.node.angle = 0;
            this.curPosition.set(this.node.position);
            tween().target(this.curPosition)
                .by(this.config.time, { y : this.config.distance },{onUpdate:(target)=>{
                    if( this.data.isInMapRange( target as Vec3)){
                        this.prevPosition.set(this.node.position);
                        this.node.setPosition(target as Vec3);
                    }else{
                        //超出边界
                        // log("超出边界");
                        Tween.stopAllByTarget(this.curPosition);
                        this.node.setPosition(this.prevPosition);
                        this.changeDirection();
                    }
                }})
                .repeatForever()
                .start();
        } else if (this.direction == TankBettle.Direction.DOWN) {
            this.node.angle = 180;
            this.curPosition.set(this.node.position);
            tween().target(this.curPosition)
                .by(this.config.time, { y : -this.config.distance },{onUpdate:(target)=>{
                    if( this.data.isInMapRange( target as Vec3)){
                        this.prevPosition.set(this.node.position);
                        this.node.setPosition(target as Vec3);
                    }else{
                        //超出边界
                        // log("超出边界");
                        Tween.stopAllByTarget(this.curPosition);
                        this.node.setPosition(this.prevPosition);
                        this.changeDirection();
                    }
                }})
                .repeatForever()
                .start();
        } else if (this.direction == TankBettle.Direction.RIGHT) {
            this.node.angle = -90;
            this.curPosition.set(this.node.position);
            tween(this.curPosition).target(this.curPosition)
                .by(this.config.time, { x : this.config.distance },{onUpdate:(target)=>{
                    if( this.data.isInMapRange( target as Vec3)){
                        this.prevPosition.set(this.node.position);
                        this.node.setPosition(target as Vec3);
                    }else{
                        //超出边界
                        // log("超出边界");
                        Tween.stopAllByTarget(this.curPosition);
                        this.node.setPosition(this.prevPosition);
                        this.changeDirection();
                    }
                }})
                .repeatForever()
                .start();
        } else if (this.direction == TankBettle.Direction.LEFT) {
            this.node.angle = 90;
            this.curPosition.set(this.node.position);
            tween().target(this.curPosition)
                .by(this.config.time, { x: -this.config.distance },{onUpdate:(target)=>{
                    if( this.data.isInMapRange( target as Vec3)){
                        this.prevPosition.set(this.node.position);
                        this.node.setPosition(target as Vec3);
                    }else{
                        //超出边界
                        // log("超出边界");
                        Tween.stopAllByTarget(this.curPosition);
                        this.node.setPosition(this.prevPosition);
                        this.changeDirection();
                    }
                }})
                .repeatForever()
                .start();
        }
    }

    private delayMove(other?: BoxCollider2D) {
        this.isWaitingChange = false;
        let except: TankBettle.Direction = null!;
        let allDir = [];
        let trans = this.node.getComponent(UITransform) as UITransform;

        if (this.node.position.x <= trans.width) {
            //在最左
            // cc.log(`在最左`)
            except = TankBettle.Direction.LEFT;
        }
        if( !this.node.parent ) return;
        let parentTrans = this.node.parent.getComponent(UITransform) as UITransform;
        if (this.node.position.x >= parentTrans.width - trans.width) {
            // cc.log("在最右")
            except = TankBettle.Direction.RIGHT;
        }

        for (let i = TankBettle.Direction.MIN; i <= TankBettle.Direction.MAX; i++) {
            if (this.direction != i && i != except) {
                allDir.push(i);
            }
        }
        let randomValue = randomRangeInt(0, allDir.length);
        this.direction = allDir[randomValue];
        this.move();
    }

    changeDirection(other?: BoxCollider2D) {

        if (other && other.group == TankBettle.GROUP.Player) {
            let player = this.getPlayer(other.node);
            if (!player.isAI) {
                //玩家与自己相撞，无视
                this.move();
                return;
            }
        }

        if (this.isWaitingChange) {
            return;
        }
        this.isWaitingChange = true;
        let delay = randomRange(0.5, 1);
        Tween.stopAllByTarget(this.changeNode);
        tween(this.changeNode).delay(delay).call(() => { this.delayMove(other) }).start();
    }
}
