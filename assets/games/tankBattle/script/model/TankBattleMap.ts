/**
 * @description 地图绘制
 */

import { MapLevel } from "../data/TankBattleLevel";
import { TankBettle } from "../data/TankBattleGameData";
import { TankBettleTankPlayer, TankBettleTankEnemy } from "./TankBattleTank";
import TankBettleBullet from "./TankBattleBullet";
import TankBattleBlock from "./TankBattleBlock";
import TankBattleGameView from "../view/TankBattleGameView";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleMap extends cc.Component {

    /**@description 用于克隆的节点 */
    private _blockPrefab: cc.Node = null;

    /**@description 设置克隆的节点，如墙，地板等 */
    public setPrefabs(node: cc.Node) {
        this._blockPrefab = node
    }

    /**@description 玩家1 */
    private playerOne: TankBettleTankPlayer = null;
    /**@description 玩家2 */
    private playerTwo: TankBettleTankPlayer = null;
    private outWall: cc.Node[] = [];

    public owner: TankBattleGameView = null;

    /**@description 敌人 */
    private _enemys: cc.Node[] = [];
    private _waitEnemy: cc.Node[] = [];

    /**@description 老家 */
    private _heart: cc.Node = null;

    protected onLoad() {
        this.node.children.forEach(node => {
            this.outWall.push(node);
        })
        this.node.removeAllChildren(false);
    }

    protected onDestroy() {
        this.outWall.forEach((value) => {
            value.destroy();
        });
        this._waitEnemy.forEach((value)=>{
            value.destroy();
        });
        this._waitEnemy = [];
        this.outWall = [];
    }

    protected update() {
        this.addEnemy();
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
        if (TankBettle.gameData.gameStatus == TankBettle.GAME_STATUS.GAME && //游戏状态下
            TankBettle.gameData.curLeftEnemy > 0 && //有剩余敌人
            this._enemys.length < TankBettle.MAX_APPEAR_ENEMY) { //可以生产敌人
            let type: TankBettle.EnemyType = cc.randomRangeInt(TankBettle.EnemyType.MIN, TankBettle.EnemyType.MAX + 1);
            let prefab = TankBettle.gameData.getEnemyPrefab(type);
            let randomPos = this.randomEnemyPosition(prefab);
            let enemyNode = this._waitEnemy.shift();
            if (enemyNode == null) {
                // cc.log("生成新敌机")
                enemyNode = cc.instantiate(prefab);
            }else{
                // cc.log("从上次未生成的敌人里面取出")
            }
            this.node.addChild(enemyNode, TankBettle.ZIndex.TANK);
            let enemy = enemyNode.addComponent(TankBettleTankEnemy);
            enemyNode.position = randomPos.position;
            enemy.direction = this.randomEnemyDirction(randomPos.bornPosition);
            enemyNode.getComponent(cc.BoxCollider).enabled = false;
            if (this.checkBornPosition(randomPos.position, enemyNode)) {
                enemy.move();
                enemy.startShoot();
                this._enemys.push(enemyNode);
                enemyNode.getComponent(cc.BoxCollider).enabled = true;
                TankBettle.gameData.curLeftEnemy -= 1;
                TankBettle.gameData.gameView.showGameInfo();
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
            if( this.intersects(enemy,node) ){
                result = false;
                break;
            }
        }
        if (result) {
            //检测出生的敌机是否跟玩家位置重叠
            if( this.playerOne && this.intersects(node,this.playerOne.node)){
                // cc.log("与玩家1重叠")
                return false;
            }
            if( this.playerTwo && this.intersects(node,this.playerTwo.node) ){
                // cc.log("与玩家2重叠")
                return false;
            }
        }
        return result;
    }

    public removeAllEnemy() {
        let size = this._enemys.length;
        for (let i = 0; i < this._enemys.length; i++) {
            let enemy = this._enemys[i];
            enemy.removeFromParent();
        }
        this._enemys = [];
        this.checkGamePass();
    }

    public removeEnemy(enemy: cc.Node) {
        let i = this._enemys.length;
        while (i--) {
            if (this._enemys[i] == enemy) {
                enemy.removeFromParent();
                this._enemys.splice(i, 1);
            }
        }
        this.checkGamePass();
    }

    /**@description 检测游戏是否通关了 */
    private checkGamePass() {
        if (TankBettle.gameData.curLeftEnemy <= 0) {
            if (this._enemys.length <= 0) {
                //通关了
                TankBettle.gameData.gameView.nextLevel();
            }
        }
    }

    public setLevel(level: number) {
        if (!!!this._blockPrefab) {
            cc.error(`请先设置预置节点`);
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

    public addPlayer(isOne: boolean) {

        let playerNode = cc.instantiate(TankBettle.gameData.getPlayerPrefab(true))
        if (isOne) {
            this.playerOne = playerNode.addComponent(TankBettleTankPlayer);
            this.playerOne.isOnePlayer = isOne;
            playerNode.x = this.node.width / 2 - 2 * playerNode.width
            playerNode.y = -this.node.height + playerNode.height / 2;
            this.node.addChild(playerNode, TankBettle.ZIndex.TANK);
            this.playerOne.born();
            TankBettle.gameData.playerOneLive--;
        } else {
            this.playerTwo = playerNode.addComponent(TankBettleTankPlayer);
            this.playerTwo.isOnePlayer = isOne;
            playerNode.x = this.node.width / 2 + 2 * playerNode.width;
            playerNode.y = -this.node.height + playerNode.height / 2;
            this.node.addChild(playerNode, TankBettle.ZIndex.TANK);
            this.playerTwo.born();
            TankBettle.gameData.playerTwoLive--;
        }
    }

    public removePlayer(player: TankBettleTankPlayer) {
        if (player.isOnePlayer) {
            let isOne = player.isOnePlayer;
            player.node.removeFromParent();
            if (TankBettle.gameData.playerOneLive > 0) {
                this.addPlayer(isOne);
                TankBettle.gameData.gameView.showGameInfo();
            }else{
                TankBettle.gameData.gameMap.gameOver();
            }
        }
    }

    public addBullet(bullet: TankBettleBullet) {
        this.node.addChild(bullet.node, TankBettle.ZIndex.BULLET);
    }

    public onKeyDown(ev: cc.Event.EventKeyboard) {
        switch (ev.keyCode) {
            case cc.macro.KEY.a: {
                this._handlePlayerMove(this.playerTwo, TankBettle.Direction.LEFT);
            } break;
            case cc.macro.KEY.w: {
                this._handlePlayerMove(this.playerTwo, TankBettle.Direction.UP);
            } break;
            case cc.macro.KEY.s: {
                this._handlePlayerMove(this.playerTwo, TankBettle.Direction.DOWN);
            } break;
            case cc.macro.KEY.d: {
                this._handlePlayerMove(this.playerTwo, TankBettle.Direction.RIGHT);
            } break;
            case cc.macro.KEY.left: {
                this._handlePlayerMove(this.playerOne, TankBettle.Direction.LEFT);
            } break;
            case cc.macro.KEY.up: {
                this._handlePlayerMove(this.playerOne, TankBettle.Direction.UP);
            } break;
            case cc.macro.KEY.down: {
                this._handlePlayerMove(this.playerOne, TankBettle.Direction.DOWN);
            } break;
            case cc.macro.KEY.right: {
                this._handlePlayerMove(this.playerOne, TankBettle.Direction.RIGHT);
            } break;
            case cc.macro.KEY.enter: {
                this._handlePlayerShoot(this.playerOne);
            } break;
            case cc.macro.KEY.space: {
                this._handlePlayerShoot(this.playerTwo);
            } break;
            case cc.macro.KEY.t: {
                this.addEnemy();
            } break;
            case cc.macro.KEY.r: {
                this.removeAllEnemy();
            } break;
        }
    }

    private _handlePlayerMove(player: TankBettleTankPlayer, dir: TankBettle.Direction) {
        if (player) {
            player.direction = dir;
            player.move();
        }
    }

    private _handlePlayerShoot(player: TankBettleTankPlayer) {
        if (player) {
            player.shoot();
        }
    }

    public gameOver() {
        if (this._heart) {
            let sprite = this._heart.getComponent(cc.Sprite);
            sprite.loadImage({ url: { urls: ["texture/images"], key: "heart_0" }, view: this.owner, bundle: this.owner.bundle });
            //如果老家被干，去碰撞体
            this._heart.getComponent(cc.BoxCollider).enabled = false;
        }
    }
}
