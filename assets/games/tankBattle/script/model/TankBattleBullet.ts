import { TankBettle } from "../data/TankBattleGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBettleBullet extends cc.Component {

    init( type : TankBettle.BULLET_TYPE , dir : TankBettle.Direction ){
        
    }
}

