import { ViewZOrder } from "../../../../scripts/common/config/Config";
import { Logic } from "../../../../scripts/framework/core/logic/Logic";
import { setClassName } from "../../../../scripts/framework/decorator/Decorators";
import { TankBettle } from "../data/TankBattleConfig";
import { TankBattleGameData } from "../data/TankBattleGameData";
import { MapLevel } from "../data/TankBattleLevel";
import TankBettleBullet from "../model/TankBattleBullet";
import { TankBettleTankPlayer } from "../model/TankBattleTank";
import TankBattleChangeStageView from "../view/TankBattleChangeStageView";
import TankBattleGameOver from "../view/TankBattleGameOver";
import TankBattleStartView from "../view/TankBattleStartView";

@setClassName()
export class TankBattleLogic extends Logic {

    private get data() {
        return Manager.dataCenter.getData(TankBattleGameData) as TankBattleGameData;
    }

    /**@description 游戏的各种预置 */
    gamePrefabs: cc.Node | null = null;

    mapCtrl : TankBattleMapCtrl = null!;

    /**@description 子弹预置 */
    public get bulletPrefab() {
        if (this.gamePrefabs)
            return this.gamePrefabs.getChildByName("bullet");
        return null;
    }

    /**@description 动画预置 */
    public get animationPrefab() {
        if (this.gamePrefabs)
            return this.gamePrefabs.getChildByName("tank_animations")
        return null;
    }

    /**@description 获取玩家的预置 */
    public getPlayerPrefab(isOne: boolean) {
        if (isOne) {
            return this.gamePrefabs ? this.gamePrefabs.getChildByName("player_1") : null;
        } else {
            return this.gamePrefabs ? this.gamePrefabs.getChildByName("player_2") : null;
        }
    }

    /**@description 获取敌人的预置 */
    public getEnemyPrefab(type: number) {
        return this.gamePrefabs ? this.gamePrefabs.getChildByName(`tank_${type}`) : null;
    }

    /**@description 根据当前类型取当道具预置 */
    public getPropsPrefab(type: TankBettle.PropsType) {
        return this.gamePrefabs ? this.gamePrefabs.getChildByName(`item_${type}`) : null;
    }

    gameView: TankBattleGameView = null!;

    initMap( mapCtrl : TankBattleMapCtrl ){
        this.mapCtrl = mapCtrl;
        this.mapCtrl.onLoad();
    }

    /**@description 打开选择人数界面 */
    onOpenSlectedView() {
        this.data.gameStatus = TankBettle.GAME_STATUS.SELECTED;
        Manager.uiManager.open({ type: TankBattleStartView, bundle: this.bundle, zIndex: ViewZOrder.UI, args: [this] });
    }

    /**@description 打开过渡切换游戏关卡界面 */
    onOpenChangeView() {
        this.data.gameStatus = TankBettle.GAME_STATUS.INIT;
        Manager.uiManager.open({ bundle: this.bundle, type: TankBattleChangeStageView, zIndex: ViewZOrder.UI, args: [this.data.currentLevel,this] })
    }

    /**@description 下一关 */
    nextLevel() {
        let level = this.data.currentLevel + 1;
        if (level >= MapLevel.length) {
            level = 0
        }
        this.data.curLeftEnemy = TankBettle.MAX_ENEMY;
        this.data.currentLevel = level;
        this.onOpenChangeView();
    }

    /**@description 上一关 */
    prevLevel() {
        let level = this.data.currentLevel - 1;
        if (level < 0) {
            level = MapLevel.length - 1
        }
        this.data.currentLevel = level;
        this.data.curLeftEnemy = TankBettle.MAX_ENEMY;
        this.onOpenChangeView();
    }

    /**@description 更新游戏信息 */
    updateGameInfo() {

        let gameInfo = {} as TankBattleGameInfo;
        //当前关卡
        gameInfo.level = (this.data.currentLevel + 1).toString();
        //玩家的生命
        gameInfo.playerOneLive = (this.data.playerOneLive < 0 ? 0 : this.data.playerOneLive).toString();
        gameInfo.playerTwoLive = (this.data.playerTwoLive < 0 ? 0 : this.data.playerTwoLive).toString();
        gameInfo.playerOneTankLive = "";
        gameInfo.playerTwoTankLive = "";
        if( this.mapCtrl.playerOne && this.mapCtrl.playerOne.config.live > 0 ){
            gameInfo.playerOneTankLive = `-${this.mapCtrl.playerOne.config.live}`
        }
        if( this.mapCtrl.playerTwo && this.mapCtrl.playerTwo.config.live > 0 ){
            gameInfo.playerTwoTankLive = `-${this.mapCtrl.playerTwo.config.live}`
        }
        //当前剩余敌人数量 
        gameInfo.curLeftEnemy = this.data.curLeftEnemy;

        if (this.gameView) {
            this.gameView.showGameInfo(gameInfo);
        }
    }

    /**
     * @description 显示地图
     * @param level 关卡数
     */
    showMap(level: number) {
        /**@description 当前地图 */
        if (this.gameView && this.mapCtrl) {
            this.mapCtrl.setLevel(level);

            if (this.data.isSingle) {
                this.data.reducePlayerLive(true);
                this.mapCtrl.addPlayer(true)
            } else {
                this.data.reducePlayerLive(true)
                this.data.reducePlayerLive(false)
                this.mapCtrl.addPlayer(true);
                this.mapCtrl.addPlayer(false);
            }
            this.data.isNeedReducePlayerLive = true;
            this.updateGameInfo();
            this.data.gameStatus = TankBettle.GAME_STATUS.GAME;
            //生成道具
            this.mapCtrl.startCreateProps();
            this.gameView.audioHelper.playMusic(TankBettle.AUDIO_PATH.START, this.bundle, false);
        }
    }

    addPlayerLive(isOne: boolean) {
        if (isOne) {
            this.data.playerOneLive++;
        } else {
            this.data.playerTwoLive++;
        }
        this.updateGameInfo();
    }

    /**@description 游戏结束 */
    gameOver() {
        if (this.mapCtrl) {
            if (this.data.gameStatus == TankBettle.GAME_STATUS.OVER) {
                return;
            }
            this.data.gameStatus = TankBettle.GAME_STATUS.OVER;
            Manager.uiManager.open({ type: TankBattleGameOver, bundle: this.bundle, zIndex: ViewZOrder.UI, args: [this] });
            this.mapCtrl.gameOver();
        }
    }

    loadImage(sprite: cc.Sprite | null, spriteFrameKey: string) {
        if (this.gameView && sprite) {
            sprite.loadImage({ url: { urls: ["texture/images"], key: spriteFrameKey }, view: this.gameView, bundle: this.bundle });
        }
    }

    /**@description 清除地图 */
    mapClear() {
        if (this.mapCtrl) {
            this.mapCtrl.clear();
        }
    }

    onMapRemovePlayer(player: TankBettleTankPlayer) {
        if (this.mapCtrl) {
            this.mapCtrl.removePlayer(player);
        }
    }

    onMapRemoveEnemy(node: cc.Node) {
        if (this.mapCtrl) {
            this.mapCtrl.removeEnemy(node);
        }
    }

    onMapRemoveAllEnemy() {
        if (this.mapCtrl) {
            this.mapCtrl.removeAllEnemy();
        }
    }

    onMapAddBullet(bullet: TankBettleBullet) {
        if (this.mapCtrl) {
            this.mapCtrl.addBullet(bullet);
        }
    }

    playEffect( url : string ){
        if ( this.gameView ){
            this.gameView.audioHelper.playEffect(url,this.bundle,false);
        }
    }

    onShowMapLevel( level : number ){
        Manager.uiManager.close(TankBattleStartView);
        this.showMap(level);
    }

    onKeyUp(ev: cc.Event.EventKeyboard, type : TankBettle.ViewType , view ?: TankBattleStartView ) {
        if ( type == TankBettle.ViewType.GAME_VIEW ){
            if( this.mapCtrl){
                this.mapCtrl.onKeyUp(ev);
            }
            if (ev.keyCode == cc.macro.KEY.n) {
                //手动下一关，恢复下生命
                this.data.isSingle = this.data.isSingle;
                this.nextLevel();
            } else if (ev.keyCode == cc.macro.KEY.p) {
                //手动下一关，恢复下生命
                this.data.isSingle = this.data.isSingle;
                this.prevLevel();
            } else if( ev.keyCode == cc.macro.KEY.escape ){
                ev.stopPropagation();
                this.mapCtrl.clear();
                this.onOpenSlectedView();
            }
        }else if ( type == TankBettle.ViewType.START_VIEW ){
            if( this.data.gameStatus != TankBettle.GAME_STATUS.SELECTED || !view ){
                return;
            }
            if (ev.keyCode == cc.macro.KEY.down || ev.keyCode == cc.macro.KEY.up ) {
                let isSingle = false;
                if (view.isSingle()) {
                    view.updateSelectTank(isSingle);
                }else{
                    isSingle = true;
                    view.updateSelectTank(isSingle);
                }
                this.data.isSingle = isSingle;
            }else if( ev.keyCode == cc.macro.KEY.space || ev.keyCode == cc.macro.KEY.enter ){
                this.data.isSingle = this.data.isSingle;
                this.onOpenChangeView();
            }
        }
    }

    onKeyDown(ev: cc.Event.EventKeyboard,type : TankBettle.ViewType) {
        if ( type == TankBettle.ViewType.GAME_VIEW ){
            if (this.mapCtrl) {
                this.mapCtrl.onKeyDown(ev)
            }
        }
        
    }

    onLoad(gameView : GameView){
        super.onLoad(gameView);
    }

    update(dt:number){
        super.update(dt);
        this.mapCtrl.update();
    }

    onDestroy(){
        if ( this.mapCtrl ){
            this.mapCtrl.onDestroy();
        }
        super.onDestroy();
    }

    /**@description 吃道具播放声音 */
    public playPropsAudio() {
        this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.PROP, this.bundle, false);
    }

    /**@description 发射子弹声音 */
    public playAttackAudio() {
        this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.ATTACK, this.bundle, false);
    }

    /**@description 子弹销毁声音 */
    public bulletCrackAudio() {
        this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.BULLETCRACK, this.bundle, false);
    }

    /**@description 玩家销毁声音 */
    public playerCrackAudio() {
        this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.PLAYERCRACK, this.bundle, false);
    }

    /**@description 敌人销毁声音 */
    public enemyCrackAudio() {
        this.gameView.audioHelper.playEffect(TankBettle.AUDIO_PATH.ENEMYCRACK, this.bundle, false);
    }
}