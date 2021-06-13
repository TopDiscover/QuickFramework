import { BoxCollider2D, Component, tween, UITransform, Vec3, _decorator ,Node, Tween, IPhysics2DContact} from "cc";
import { TankBettle } from "../data/TankBattleGameData";
import { TankBattleEntity } from "./TankBattleEntity";
import TankBettleTank, { TankBettleTankEnemy, TankBettleTankPlayer } from "./TankBattleTank";

const { ccclass, property } = _decorator;

@ccclass
export default class TankBettleBullet extends TankBattleEntity {

    /**@description 拥有者 */
    public owner: TankBettleTank = null!;

    /**@description 当前的位置 */
    private curPosition = new Vec3();

    private addBullet() {
        let transform = this.owner.node.getComponent(UITransform) as UITransform;
        this.data.gameMap?.addBullet(this);
        if (this.owner.direction == TankBettle.Direction.UP) {
            this.node.setPosition(new Vec3(this.owner.node.position.x, this.owner.node.position.y + transform.height / 2));
            this.node.angle = 0;
        } else if (this.owner.direction == TankBettle.Direction.DOWN) {
            this.node.setPosition(new Vec3(this.owner.node.position.x, this.owner.node.position.y - transform.height / 2));
            this.node.angle = 180;
        } else if (this.owner.direction == TankBettle.Direction.RIGHT) {
            this.node.setPosition(new Vec3(this.owner.node.position.x + transform.width / 2, this.owner.node.position.y));
            this.node.angle = -90;
        } else if (this.owner.direction == TankBettle.Direction.LEFT) {
            this.node.setPosition(new Vec3(this.owner.node.position.x - transform.width / 2, this.owner.node.position.y));
            this.node.angle = 90;
        }
    }

    move(owner: TankBettleTank) {
        this.owner = owner;
        //设置子弹的位置
        this.addBullet();

        if (this.owner.direction == TankBettle.Direction.UP) {
            this.curPosition.set(this.node.position);
            tween().target(this.curPosition)
                .by(this.owner.config.bulletTime, { y : this.owner.config.bulletDistance},{onUpdate:(target)=>{
                    this.node.setPosition(target as Vec3);
                }})
                .repeatForever()
                .start();
        } else if (this.owner.direction == TankBettle.Direction.DOWN) {
            this.curPosition.set(this.node.position);
            tween().target(this.curPosition)
                .by(this.owner.config.bulletTime, { y : -this.owner.config.bulletDistance},{onUpdate:(target)=>{
                    this.node.setPosition(target as Vec3);
                }})
                .repeatForever()
                .start();
        } else if (this.owner.direction == TankBettle.Direction.RIGHT) {
            this.curPosition.set(this.node.position);
            tween().target(this.curPosition)
                .by(this.owner.config.bulletTime, { x : this.owner.config.bulletDistance },{onUpdate:(target)=>{
                    this.node.setPosition(target as Vec3);
                }})
                .repeatForever()
                .start();
        } else if (this.owner.direction == TankBettle.Direction.LEFT) {
            this.curPosition.set(this.node.position);
            tween().target(this.curPosition)
                .by(this.owner.config.bulletTime, { x : -this.owner.config.bulletDistance },{onUpdate:(target)=>{
                    this.node.setPosition(target as Vec3);
                }})
                .repeatForever()
                .start();
        }
    }

    protected onBeginContact (self: BoxCollider2D, other: BoxCollider2D, contact: IPhysics2DContact | null) {
        // cc.log(`Bullet : onCollisionEnter=>${other.node.name}`)
        if (other.group == TankBettle.GROUP.Wall ||
            other.group == TankBettle.GROUP.StoneWall ||
            other.group == TankBettle.GROUP.Boundary ||
            other.group == TankBettle.GROUP.Home) {
            //撞到了墙或边界
            this.removeSelf();
        } else if (other.group == TankBettle.GROUP.Bullet) {
            //子弹与子弹相撞
            //同阵营子弹不抵消
            let bullet = other.node.getComponent(TankBettleBullet);
            if (bullet)
                if (this.owner.isAI) {
                    //敌人打出的子弹 与玩家子弹相互抵消
                    if (!bullet.owner.isAI) {
                        this.removeSelf();
                    }
                } else {
                    //玩家打出子弹 与 敌人的子弹相互抵消
                    if (bullet.owner.isAI) {
                        this.removeSelf();
                    }
                }
        } else if (other.group == TankBettle.GROUP.Player) {
            //子弹与玩家相撞
            let tank = this.getPlayer(other.node);
            if (this.owner.isAI) {
                //敌人子弹不参打敌人
                if (!tank.isAI) {
                    this.removeSelf();
                }
            } else {
                if (tank.isAI) {
                    //只有打到敌人才消失
                    this.removeSelf();
                }
            }

        } else {
            //其它情况子弹继续走自己的路
        }
    }

    private removeSelf() {
        //子弹销毁声音
        this.data.bulletCrackAudio();
        Tween.stopAllByTarget(this.curPosition);
        this.owner.bullet = null;
        this.node.removeFromParent();
        this.node.destroy();
    }

    private getPlayer(node: Node): TankBettleTank {
        let player = node.getComponent(TankBettleTankPlayer);
        if (player) {
            return player;
        }
        return node.getComponent(TankBettleTankEnemy) as TankBettleTankEnemy;
    }

}

