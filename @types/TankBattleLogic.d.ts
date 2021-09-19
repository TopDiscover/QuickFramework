declare type TankBattleGameView = import("../assets/bundles/tankBattle/script/view/TankBattleGameView").default;
declare type TankBattleLogic = import("../assets/bundles/tankBattle/script/logic/TankBattleLogic").TankBattleLogic;
declare type TankBattleMapCtrl = import("../assets/bundles/tankBattle/script/logic/TankBattleMapCtrl").default;
declare interface TankBattleGameInfo{
    /**@description  玩家的生命*/
    playerOneLive : string;
    playerTwoLive : string;
    /**@description  玩家的坦克数量*/
    playerOneTankLive : string;
    playerTwoTankLive : string;
    /**@description 当前关卡 */
    level : string;
    /**@description 当前剩余敌人数量 */
    curLeftEnemy : number;
}