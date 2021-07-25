
import { _decorator } from 'cc';
import { TankBettle } from '../data/TankBattleGameData';
import { TankBattleEntity } from './TankBattleEntity';
const { ccclass, property } = _decorator;

@ccclass('TankBattleAI')
export class TankBattleAI extends TankBattleEntity {

    /**@description 拥有者 */
    public owner: TankBattleAI = null!;
    public bulletType : typeof TankBattleAI = null!;
    /** @description 是否是AI敌人*/
    public isAI = false;
    public config: TankBettle.TankConfig = null!;
    /** @description 子弹 */
    public bullet: TankBattleAI | null= null;
    public thisType = "TankBattleAI";

    /**@description 当前是否正常移动 */
    protected isMoving = false;
    public _direction: TankBettle.Direction = TankBettle.Direction.UP;
    /**@description 移动方向 */
    public get direction() {
        return this._direction;
    }
    public set direction(value) {
        let old = this._direction;
        this._direction = value;
        if (old != this._direction) {
            //改变了动画，立即响应
            this.isMoving = false;
        }
    }

    move(owner: TankBattleAI){

    }
}

