import { BoxCollider2D, Component, Contact2DType, IPhysics2DContact, _decorator } from "cc";
import { TankBettle } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";
import { TankBattleEntity } from "./TankBattleEntity";
import { TankBettleTankPlayer } from "./TankBattleTank";

const { ccclass, property } = _decorator;
@ccclass
export default class TankBattleBlock extends TankBattleEntity {

    public type: TankBettle.BLOCK_TYPE = null!;

    protected onBeginContact(selfCollider: BoxCollider2D, otherCollider: BoxCollider2D, contact: IPhysics2DContact | null) {
        // 只在两个碰撞体开始接触时被调用一次
        this.handBullet(selfCollider, otherCollider);
    }

    private removeSelf() {
        this.node.removeFromParent();
        this.node.destroy();
    }

    private handBullet(self: BoxCollider2D, other: BoxCollider2D) {
        if (other.group == TankBettle.GROUP.Bullet) {
            //受到来处子弹的碰撞
            switch (this.type) {
                case TankBettle.BLOCK_TYPE.GRASS: //草丛
                case TankBettle.BLOCK_TYPE.ICE: { //冰面
                    //直接穿过，不做处理
                }
                    break;
                case TankBettle.BLOCK_TYPE.WALL: {
                    //把自己移除
                    this.removeSelf();
                }
                    break;
                case TankBettle.BLOCK_TYPE.STONE_WALL: {
                    let bullet = other.node.getComponent(TankBettleBullet);
                    if (bullet && bullet.owner instanceof TankBettleTankPlayer) {
                        if (bullet.owner.hasStatus(TankBettle.PLAYER_STATUS.STRONG)) {
                            this.removeSelf();
                        }
                    }
                }
                    break;
                case TankBettle.BLOCK_TYPE.HOME: {
                    //老巢
                    this.data.gameOver();
                }
                    break;
            }
        }
    }
}
