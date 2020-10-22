import { TankBettle } from "../data/TankBattleGameData";
import TankBettleBullet from "./TankBattleBullet";

const { ccclass, property } = cc._decorator;
@ccclass
export default class TankBettleTank extends cc.Component {


    /** @description 是否自动 */
    private isAI = false;
    /** @description 子弹是否在运行中 */
    private isShooting = false;
    /** @description 坦克速度 */
    private speed = 1;
    /** @description 子弹 */
    private bullet: TankBettleBullet = null;
    /**@description 当前是否已经销毁 */
    private isDestroyed = false;
    /**@description 移动方向 */
    public direction : TankBettle.Direction = TankBettle.Direction.UP;
    /**@description 射击概率 */
    private shootRate = 0.6;
    /**@description 是否碰到墙或者坦克 */
    private isHit = false;
    /**@description 控制敌方坦克切换方向的时间 */
    private frame = 0;
    private tempPositon : cc.Vec2 = cc.v2(0,0);
    private isProtected = false;

    move() {
        if (this.isAI && TankBettle.gameData.emenyStopTime > 0) {
            return;
        }
        this.tempPositon.x = this.node.x;
        this.tempPositon.y = this.node.y;

        if (this.isAI) {
            this.frame++;
            if ( this.frame % 100 == 0 || this.isHit ) {
                this.direction = parseInt((Math.random() * 4).toString())
                this.isHit = false;
                this.frame = 0;
            }
        }

        if ( this.direction == TankBettle.Direction.UP ){
            this.tempPositon.y += this.speed;
        }else if( this.direction == TankBettle.Direction.DOWN){
            this.tempPositon.y -= this.speed;
        }else if( this.direction == TankBettle.Direction.RIGHT){
            this.tempPositon.x += this.speed;
        }else if( this.direction == TankBettle.Direction.LEFT){
            this.tempPositon.x -= this.speed;
        }
        if( !this.isHit ){
            this.node.x = this.tempPositon.x;
            this.node.y = this.tempPositon.y;
        }
    }

    public shoot( type : TankBettle.BULLET_TYPE ){
        if (this.isAI && TankBettle.gameData.emenyStopTime > 0 ) {
            return;
        } 
        if ( this.isShooting ){
            //正在发射
            return;
        }else{
            let temp = this.node.position;
            let bulletNode = cc.instantiate(TankBettle.gameData.bulletPrefab);
            this.bullet = bulletNode.addComponent(TankBettleBullet);
            this.bullet.init(type,this.direction);
            
        }
    }

    /**@description 出生 */
    public born(){
        this.isHit = false;
        //出生动画
        this.isProtected = true;
        let aniNode = cc.instantiate(TankBettle.gameData.animationPrefab);
        this.node.addChild(aniNode);
        let animation = aniNode.getComponent(cc.Animation);
        animation.play("tank_protected")
        cc.tween(aniNode).delay(5).call(()=>{
            aniNode.removeFromParent()
            this.isProtected = false;
        }).removeSelf().start()
    }

    onCollisionEnter(other){
        this.isHit = true;
    }

    onCollisionStay(other) {
        
    }
    
    onCollisionExit () {
        
    }
    
}
