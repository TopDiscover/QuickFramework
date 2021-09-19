/**
 * @description 地图绘制
 */

import { TankBettle } from "../data/TankBattleConfig";
import { TankBattleGameData } from "../data/TankBattleGameData";
import { MapLevel } from "../data/TankBattleLevel";
import TankBattleBlock from "../model/TankBattleBlock";
import TankBettleBullet from "../model/TankBattleBullet";
import TankBattleProps from "../model/TankBattleProps";
import { TankBettleTankEnemy, TankBettleTankPlayer } from "../model/TankBattleTank";
import TankBattleGameView from "../view/TankBattleGameView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleMapCtrl {

    protected get data( ){
        return Manager.dataCenter.getData(TankBattleGameData) as TankBattleGameData;
    }

    protected get logic():TankBattleLogic | null{
        return Manager.logicManager.getLogic<TankBattleLogic>(this.data.bundle);
    }
    
    /**@description 用于克隆的节点 */
    private _blockPrefab: cc.Node = null;

    /**@description 设置克隆的节点，如墙，地板等 */
    public setPrefabs(node: cc.Node) {
        this._blockPrefab = node
    }

    node : cc.Node = null!;

    /**@description 玩家1 */
    public playerOne: TankBettleTankPlayer = null;
    /**@description 玩家2 */
    public playerTwo: TankBettleTankPlayer = null;
    private outWall: cc.Node[] = [];

    public owner: TankBattleGameView = null;

    /**@description 敌人 */
    private _enemys: cc.Node[] = [];
    private _waitEnemy: cc.Node[] = [];

    /**@description 老家 */
    private _heart: cc.Node = null;

    /**@description 道具生成节点 */
    public propsProductNode : cc.Node = null;
    /**@description 待销毁的敌人 */
    private _waitingDestory : cc.Node[] = [];
    /**@description 放入按钮事件 */
    private _keyboardEvents : Map<number,cc.Event.EventKeyboard> = new Map();

    onLoad() {
        this.node.children.forEach(node => {
            this.outWall.push(node);
        })
        this.node.removeAllChildren(false);
        let node = new cc.Node();
        this.node.addChild(node);
        this.propsProductNode = node;
    }

    onDestroy() {
        this.outWall.forEach((value) => {
            value.destroy();
        });
        this.clear()
        this.outWall = [];
        cc.Tween.stopAllByTarget(this.propsProductNode);
        this.propsProductNode = null;
    }

    update() {
        this.addEnemy();
        this.doKeyboardEvents();
    }

    /**@description 随机敌人出生点位置 */
    private randomEnemyPosition(enemyNode: cc.Node): { position: cc.Vec3, bornPosition: TankBettle.EnemyBornPosition } {
        let pos = cc.randomRangeInt(TankBettle.EnemyBornPosition.MIN, TankBettle.EnemyBornPosition.MAX + 1)
        // cc.log(`pos : ${pos}`);
        let outPosition = cc.v3(0, 0, 0);
        let outBornPosition = TankBettle.EnemyBornPosition.RIGHT;
        if (pos == 0) {
            //左
            outPosition.x = enemyNode.width / 2;
            outPosition.y = -enemyNode.height / 2;
            outBornPosition = TankBettle.EnemyBornPosition.LEFT;
        } else if (pos == 1) {
            //中
            outPosition.x = this.node.width / 2;
            outPosition.y = -enemyNode.height / 2;
            outBornPosition = TankBettle.EnemyBornPosition.MIDDLE;
        } else {
            //右
            outPosition.x = this.node.width - enemyNode.width / 2;
            outPosition.y = -enemyNode.height / 2;
            outBornPosition = TankBettle.EnemyBornPosition.RIGHT;
        }
        return { position: outPosition, bornPosition: outBornPosition };
    }

    /**@description 随机出生点敌人的初始方向 */
    private randomEnemyDirction(bornPosition: TankBettle.EnemyBornPosition) {
        let allDir = [TankBettle.Direction.LEFT, TankBettle.Direction.RIGHT, TankBettle.Direction.DOWN];
        if (bornPosition == TankBettle.EnemyBornPosition.LEFT) {
            allDir = [TankBettle.Direction.DOWN, TankBettle.Direction.RIGHT];
        } else if (bornPosition == TankBettle.EnemyBornPosition.RIGHT) {
            allDir = [TankBettle.Direction.DOWN, TankBettle.Direction.LEFT]
        }
        let value = cc.randomRangeInt(0, allDir.length);
        let outDir = allDir[value]
        return outDir;
    }

    public addEnemy() {
        //要在游戏中且当前剩余敌人数量要大于0才创建
        if( this._waitingDestory.length > 0 ){
            return;
        }
        if (this.data.gameStatus == TankBettle.GAME_STATUS.GAME && //游戏状态下
            this.data.curLeftEnemy > 0 && //有剩余敌人
            this._enemys.length < TankBettle.MAX_APPEAR_ENEMY) { //可以生产敌人
            let type: TankBettle.EnemyType = cc.randomRangeInt(TankBettle.EnemyType.MIN, TankBettle.EnemyType.MAX + 1);
            let prefab = this.logic.getEnemyPrefab(type);
            let randomPos = this.randomEnemyPosition(prefab);
            let enemyNode = this._waitEnemy.shift();
            if (enemyNode == null) {
                // cc.log("生成新敌机")
                enemyNode = cc.instantiate(prefab);
            } else {
                // cc.log("从上次未生成的敌人里面取出")
            }
            this.node.addChild(enemyNode, TankBettle.ZIndex.TANK);
            let enemy = enemyNode.getComponent(TankBettleTankEnemy);
            if (!enemy) {
                enemy = enemyNode.addComponent(TankBettleTankEnemy);
            }
            enemy.type = type;
            enemy.config = this.data.getEnemyConfig(type);
            enemyNode.position = randomPos.position;
            enemy.direction = this.randomEnemyDirction(randomPos.bornPosition);
            enemyNode.getComponent(cc.BoxCollider).enabled = false;
            if (this.checkBornPosition(randomPos.position, enemyNode)) {
                enemy.move();
                enemy.startShoot();
                this._enemys.push(enemyNode);
                enemyNode.getComponent(cc.BoxCollider).enabled = true;
                this.data.curLeftEnemy -= 1;
                this.logic.updateGameInfo();
            } else {
                // cc.log("生成敌机周围有敌机，不出现")
                enemyNode.removeFromParent(false);
                this._waitEnemy.push(enemyNode);
            }
        }
    }

    private intersects(node: cc.Node, other: cc.Node) {
        let box = node.getBoundingBox();
        let otherBox = other.getBoundingBox();
        let scale = 3;//如果新出生的敌机，如果在附近有敌机或玩家，不生成，以免出来就产生碰撞
        let width = box.width * scale;
        let height = box.height * scale;
        let newBox = cc.rect(box.x - (width - box.width) / 2, box.y - (height - box.height) / 2, width, height)
        if (newBox.intersects(otherBox)) {
            // cc.log(`生成的敌机离${other.name}太近`);
            return true;
        }
        return false;
    }
    private checkBornPosition(pos: cc.Vec3, node: cc.Node) {
        let result = true;
        for (let i = 0; i < this._enemys.length; i++) {
            let enemy = this._enemys[i];
            if (this.intersects(enemy, node)) {
                result = false;
                break;
            }
        }
        if (result) {
            //检测出生的敌机是否跟玩家位置重叠
            if (this.playerOne && this.intersects(node, this.playerOne.node)) {
                // cc.log("与玩家1重叠")
                return false;
            }
            if (this.playerTwo && this.intersects(node, this.playerTwo.node)) {
                // cc.log("与玩家2重叠")
                return false;
            }
        }
        return result;
    }

    /**@description 删除当前屏幕的敌人 */
    public removeAllEnemy() {
        for (let i = 0; i < this._enemys.length; i++) {
            let enemy = this._enemys[i];
            enemy.getComponent(TankBettleTankEnemy).die();
            this._waitingDestory.push(enemy)
        }
        this._enemys = [];
        this.checkGamePass();
    }

    public removeEnemy(enemy: cc.Node) {
        let i = this._enemys.length;
        while (i--) {
            if (this._enemys[i] == enemy) {
                enemy.removeFromParent();
                enemy.destroy();
                this._enemys.splice(i, 1);
            }
        }
        i = this._waitingDestory.length;
        while(i--){
            if( this._waitingDestory[i] == enemy ){
                enemy.removeFromParent();
                enemy.destroy();
                this._waitingDestory.splice(i,1);
            }
        }
        this.checkGamePass();
    }

    /**@description 检测游戏是否通关了 */
    private checkGamePass() {
        if (this.data.curLeftEnemy <= 0 ) {
            if (this._enemys.length <= 0) {
                //通关了
                this.data.isNeedReducePlayerLive = false;
                this.logic.nextLevel();
            }
        }
    }

    public setLevel(level: number) {
        if (!!!this._blockPrefab) {
            Log.e(`请先设置预置节点`);
            return
        }

        //清空当前地图的东西
        this.node.removeAllChildren(true)

        //添加四周的墙
        this.outWall.forEach((value) => {
            this.node.addChild(cc.instantiate(value));
        });

        //清空
        this._enemys = [];

        let data = MapLevel[level];
        //地图数据
        let x = 0;
        let y = 0;
        let tempBlock = this._blockPrefab.getChildByName("block_1");
        let prefebSize: cc.Size = cc.size(tempBlock.width, tempBlock.height)
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            y = -((i + 1) * prefebSize.height / 2 + i * prefebSize.height / 2)
            for (let j = 0; j < element.length; j++) {
                const blockData = element[j];
                if (blockData > 0 && blockData != TankBettle.BLOCK_TYPE.ANOTHREHOME) {
                    let name = "block_" + blockData.toString()
                    let prefab = this._blockPrefab.getChildByName(name)
                    if (prefab) {
                        let node = cc.instantiate(prefab)
                        let block = node.addComponent(TankBattleBlock)
                        block.type = blockData;
                        if (blockData == TankBettle.BLOCK_TYPE.HOME) {
                            this._heart = node;
                        }
                        this.node.addChild(node, TankBettle.ZIndex.BLOCK);
                        x = (j + 1) * prefebSize.width / 2 + j * prefebSize.width / 2
                        node.x = x;
                        node.y = y;
                        if (blockData == TankBettle.BLOCK_TYPE.HOME) {
                            //自己的老家，放在最中间
                            x = this.node.width / 2
                            node.x = x;
                            node.y -= prefebSize.height / 2
                        }
                    }
                }
            }
        }
    }

    protected randomPropPosition( ){
        let tank = this.logic.getPlayerPrefab(true);
        let xMin = tank.width / 2;
        let xMax = this.node.width - tank.width /2 ;
        let yMin = -tank.height/2;
        let yMax = -this.node.height + tank.height/2;
        let x = cc.randomRange(xMin,xMax);
        let y = cc.randomRange(yMin,yMax);
        return cc.v3(x,y,0);
    }

    private createProps( ){
        let type = cc.randomRangeInt(TankBettle.PropsType.MIN,TankBettle.PropsType.MAX);
        let prefab = this.logic.getPropsPrefab(type);
        let node = cc.instantiate(prefab);
        let props = node.addComponent(TankBattleProps);
        props.type = type;
        this.node.addChild(node,TankBettle.ZIndex.PROPS);
        node.position = this.randomPropPosition();
    }

    public startCreateProps() {
        if( this.data.gameStatus == TankBettle.GAME_STATUS.GAME ){
            let time = cc.randomRange(TankBettle.PROPS_CREATE_INTERVAL.min,TankBettle.PROPS_CREATE_INTERVAL.max)
            cc.Tween.stopAllByTarget(this.propsProductNode);
            cc.tween(this.propsProductNode).delay(time).call(()=>{
                this.createProps();
                this.startCreateProps();
            }).start();
        }
    }

    public addPlayer(isOne: boolean) {

        let playerNode = cc.instantiate(this.logic.getPlayerPrefab(isOne))
        if (isOne) {
            this.playerOne = playerNode.addComponent(TankBettleTankPlayer);
            this.playerOne.isOnePlayer = isOne;
            playerNode.x = this.node.width / 2 - 2 * playerNode.width
            playerNode.y = -this.node.height + playerNode.height / 2;
            this.node.addChild(playerNode, TankBettle.ZIndex.TANK);
            this.playerOne.born();
        } else {
            this.playerTwo = playerNode.addComponent(TankBettleTankPlayer);
            this.playerTwo.isOnePlayer = isOne;
            playerNode.x = this.node.width / 2 + 2 * playerNode.width;
            playerNode.y = -this.node.height + playerNode.height / 2;
            this.node.addChild(playerNode, TankBettle.ZIndex.TANK);
            this.playerTwo.born();
        }
    }

    public removePlayer(player: TankBettleTankPlayer) {
        let isOne = player.isOnePlayer;
        player.node.removeFromParent();
        player.node.destroy();
        if (this.data.isSingle) {
            this.playerOne = null;
            if (this.data.playerOneLive > 0) {
                this.addPlayer(isOne);
                this.data.reducePlayerLive(true);
                this.logic.updateGameInfo();
            } else {
                this.logic.gameOver();
            }
        } else {
            //双人
            if (isOne) {
                this.playerOne = null;
                if (this.data.playerOneLive > 0) {
                    this.addPlayer(isOne);
                }
                this.data.reducePlayerLive(true)
            } else {
                this.playerTwo = null;
                if (this.data.playerTwoLive > 0) {
                    this.addPlayer(isOne);
                }
                this.data.reducePlayerLive(false)
            }
            this.logic.updateGameInfo();
            if (this.data.playerTwoLive < 0 && this.data.playerOneLive < 0) {
                this.logic.gameOver();
            }
        }
    }

    public addBullet(bullet: TankBettleBullet) {
        this.node.addChild(bullet.node, TankBettle.ZIndex.BULLET);
    }

    public onKeyDown(ev: cc.Event.EventKeyboard) {
        if( !this._keyboardEvents.has(ev.keyCode) ){
            this._keyboardEvents.set(ev.keyCode,ev);
        }
    }

    public onKeyUp(ev: cc.Event.EventKeyboard) {
        if( this._keyboardEvents.has(ev.keyCode) ){
            this._keyboardEvents.delete(ev.keyCode);
        }
    }

    private doKeyboardEvents(){
        if( this._keyboardEvents.has(cc.macro.KEY.a) ){
            this._handlePlayerMove(this.playerTwo, TankBettle.Direction.LEFT);
        }else if( this._keyboardEvents.has(cc.macro.KEY.w)){
            this._handlePlayerMove(this.playerTwo, TankBettle.Direction.UP);
        }else if( this._keyboardEvents.has(cc.macro.KEY.s)){
            this._handlePlayerMove(this.playerTwo, TankBettle.Direction.DOWN);
        }else if( this._keyboardEvents.has(cc.macro.KEY.d)){
            this._handlePlayerMove(this.playerTwo, TankBettle.Direction.RIGHT);
        }
        
        if( this._keyboardEvents.has(cc.macro.KEY.left)){
            this._handlePlayerMove(this.playerOne, TankBettle.Direction.LEFT);
        }else if( this._keyboardEvents.has(cc.macro.KEY.up)){
            this._handlePlayerMove(this.playerOne, TankBettle.Direction.UP);
        }else if( this._keyboardEvents.has(cc.macro.KEY.down)){
            this._handlePlayerMove(this.playerOne, TankBettle.Direction.DOWN);
        }else if( this._keyboardEvents.has(cc.macro.KEY.right)){
            this._handlePlayerMove(this.playerOne, TankBettle.Direction.RIGHT);
        }
        
        if( this._keyboardEvents.has(cc.macro.KEY.enter)){
            this._handlePlayerShoot(this.playerOne);
        }
        if( this._keyboardEvents.has(cc.macro.KEY.space)){
            if( this.data.isSingle ){
                this._handlePlayerShoot(this.playerOne);
            }
            this._handlePlayerShoot(this.playerTwo);
        }
    }

    private _handlePlayerMove(player: TankBettleTankPlayer, dir: TankBettle.Direction) {
        if (this.data.gameStatus == TankBettle.GAME_STATUS.GAME) {
            if (player) {
                player.direction = dir;
                player.move();
            }
        }
    }

    private _handlePlayerShoot(player: TankBettleTankPlayer) {
        if (this.data.gameStatus == TankBettle.GAME_STATUS.GAME) {
            if (player) {
                player.shoot();
            }
        }
    }

    public gameOver() {
        if (this._heart) {
            let aniNode = cc.instantiate(this.logic.animationPrefab);
            this._heart.addChild(aniNode);
            let animation = aniNode.getComponent(cc.Animation);
            let state = animation.play("king_boom");
            aniNode.x = 0;
            aniNode.y = 0;
            cc.tween(aniNode).delay(state.duration).call(() => {
                aniNode.removeFromParent()
                aniNode.destroy();
                let sprite = this._heart.getComponent(cc.Sprite);
                this.logic.loadImage(sprite,"heart_0");
            }).removeSelf().start()
        }
    }

    public clear(){
        this._waitingDestory.forEach((value)=>{
            value.destroy();
        });
        this._waitingDestory = [];
        this._waitEnemy.forEach((value) => {
            value.destroy();
        });
        this._waitEnemy = [];

        for (let i = 0; i < this._enemys.length; i++) {
            let enemy = this._enemys[i];
            enemy.removeFromParent();
            enemy.destroy();
        }
        this._enemys = [];
    }
}
