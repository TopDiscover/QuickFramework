import { TankBettle } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TankBettleTank extends cc.Component {


    /** @description 是否自动 */
    isAI = false;
    /** @description 子弹是否在运行中 */
    isShooting = false;
    /** @description 坦克速度 */
    speed = 1;
    /** @description 子弹 */
    bullet: TankBettleBullet = null;
    /**@description 当前是否已经销毁 */
    isDestroyed = false;
    /**@description 移动方向 */
    direction : TankBettle.Direction = TankBettle.Direction.UP;
    /**@description 射击概率 */
    shootRate = 0.6;
    /**@description 是否碰到墙或者坦克 */
    isHit = false;
    /**@description 控制敌方坦克切换方向的时间 */
    frame = 0;
    tempPositon : cc.Vec2 = cc.v2(0,0);

    move() {
        if (this.isAI && TankBettle.gameData.emenyStopTime > 0) {
            return;
        }
        this.tempPositon.x = this.node.x;
        this.tempPositon.y = this.node.y;

        if ( this.direction == TankBettle.Direction.UP ){
            this.tempPositon.y += this.speed;
        }else if( this.direction == TankBettle.Direction.DOWN){
            this.tempPositon.y -= this.speed;
        }else if( this.direction == TankBettle.Direction.RIGHT){
            this.tempPositon.x += this.speed;
        }else if( this.direction == TankBettle.Direction.LEFT){
            this.tempPositon.x -= this.speed;
        }
        this.checkHit();
        if( this.isHit ){
            this.node.x = this.tempPositon.x;
            this.node.y = this.tempPositon.y;
        }
    }

    checkHit(){
        
    }
}
