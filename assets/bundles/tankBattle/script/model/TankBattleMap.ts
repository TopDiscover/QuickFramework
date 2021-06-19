/**
 * @description 地图绘制
 */

 import { MapLevel } from "../data/TankBattleLevel";
 import { TankBettle } from "../data/TankBattleGameData";
 import { TankBettleTankPlayer, TankBettleTankEnemy } from "./TankBattleTank";
 import TankBettleBullet from "./TankBattleBullet";
 import TankBattleBlock from "./TankBattleBlock";
 import TankBattleGameView from "../view/TankBattleGameView";
 import TankBattleProps from "./TankBattleProps";
import { Component, _decorator,Node,Animation, EventKeyboard, Tween, Vec3, randomRangeInt, UITransform, instantiate, BoxCollider2D, Rect, Size, randomRange, tween, macro, Sprite, size, Widget } from "cc";
 
 const { ccclass, property } = _decorator;
 
 @ccclass
 export default class TankBattleMap extends Component {
 
     /**@description 用于克隆的节点 */
     private _blockPrefab: Node = null!;
 
     /**@description 设置克隆的节点，如墙，地板等 */
     public setPrefabs(node: Node) {
         this._blockPrefab = node
     }
 
     /**@description 玩家1 */
     public playerOne: TankBettleTankPlayer|null = null;
     /**@description 玩家2 */
     public playerTwo: TankBettleTankPlayer|null = null;
     private outWall: Node[] = [];
 
     public owner: TankBattleGameView = null!;
 
     /**@description 敌人 */
     private _enemys: Node[] = [];
     private _waitEnemy: Node[] = [];
 
     /**@description 老家 */
     private _heart: Node = null!;
 
     /**@description 待销毁的敌人 */
     private _waitingDestory : Node[] = [];
     /**@description 放入按钮事件 */
     private _keyboardEvents : Map<number,EventKeyboard> = new Map();

     private nodes : Node[] = [];
 
     protected onLoad() {
         this.node.children.forEach(node => {
             this.outWall.push(node);
         })
         this.node.removeAllChildren();
        
         let thisTransform = this.getComponent(UITransform) as UITransform;
         for( let i = TankBettle.ZIndex.MIN ; i < TankBettle.ZIndex.MAX ; i++ ){
            let node = new Node();
            let transform = node.addComponent(UITransform);
            transform.setAnchorPoint(thisTransform.anchorPoint);
            transform.setContentSize(size(thisTransform.width,thisTransform.height));
            let widget = node.addComponent(Widget);
            widget.left = 0;
            widget.right = 0;
            widget.top = 0;
            widget.bottom = 0;
            this.node.addChild(node);
            this.nodes.push(node);
         }
     }

     private getNode( zIndex : TankBettle.ZIndex ){
         return this.nodes[zIndex - 1];
     }

     private addNodeChild( node : Node , zIndex : TankBettle.ZIndex ){
         this.getNode(zIndex).addChild(node);
     }
 
     protected onDestroy() {
         this.outWall.forEach((value) => {
             value.destroy();
         });
         this.clear()
         this.outWall = [];
         Tween.stopAllByTarget(this.getNode(TankBettle.ZIndex.PROPS));
     }
 
     protected update() {
         this.addEnemy();
         this.doKeyboardEvents();
     }
 
     /**@description 随机敌人出生点位置 */
     private randomEnemyPosition(enemyNode: Node): { position: Vec3, bornPosition: TankBettle.EnemyBornPosition } {
         let pos = randomRangeInt(TankBettle.EnemyBornPosition.MIN, TankBettle.EnemyBornPosition.MAX + 1)
         // cc.log(`pos : ${pos}`);
         let transform = enemyNode.getComponent(UITransform) as UITransform;
         let thisTransform = this.node.getComponent(UITransform) as UITransform;
         let outPosition = new Vec3();
         let outBornPosition = TankBettle.EnemyBornPosition.RIGHT;
         if (pos == 0) {
             //左
             outPosition.x = transform.width / 2;
             outPosition.y = -transform.height / 2;
             outBornPosition = TankBettle.EnemyBornPosition.LEFT;
         } else if (pos == 1) {
             //中
             outPosition.x = thisTransform.width / 2;
             outPosition.y = -transform.height / 2;
             outBornPosition = TankBettle.EnemyBornPosition.MIDDLE;
         } else {
             //右
             outPosition.x = thisTransform.width - transform.width / 2;
             outPosition.y = -transform.height / 2;
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
         let value = randomRangeInt(0, allDir.length);
         let outDir = allDir[value]
         return outDir;
     }
 
     public addEnemy() {
         //要在游戏中且当前剩余敌人数量要大于0才创建
         if( this._waitingDestory.length > 0 ){
             return;
         }
         if (TankBettle.gameData.gameStatus == TankBettle.GAME_STATUS.GAME && //游戏状态下
             TankBettle.gameData.curLeftEnemy > 0 && //有剩余敌人
             this._enemys.length < TankBettle.MAX_APPEAR_ENEMY) { //可以生产敌人
             let type: TankBettle.EnemyType = randomRangeInt(TankBettle.EnemyType.MIN, TankBettle.EnemyType.MAX + 1);
             let prefab = TankBettle.gameData.getEnemyPrefab(type) as Node;
             let randomPos = this.randomEnemyPosition(prefab);
             let enemyNode = this._waitEnemy.shift();
             if ( enemyNode == undefined) {
                 // cc.log("生成新敌机")
                 enemyNode = instantiate(prefab);
             } else {
                 // cc.log("从上次未生成的敌人里面取出")
             }
             this.addNodeChild(enemyNode,TankBettle.ZIndex.TANK);
             let enemy = enemyNode.getComponent(TankBettleTankEnemy);
             if (!enemy) {
                 enemy = enemyNode.addComponent(TankBettleTankEnemy);
             }
             enemy.type = type;
             enemy.config = TankBettle.gameData.getEnemyConfig(type);
             enemyNode.setPosition(randomPos.position);
             enemy.direction = this.randomEnemyDirction(randomPos.bornPosition);
             (enemyNode.getComponent(BoxCollider2D) as BoxCollider2D).enabled = false;
             if (this.checkBornPosition(randomPos.position, enemyNode)) {
                 enemy.move();
                 enemy.startShoot();
                 this._enemys.push(enemyNode);
                 (enemyNode.getComponent(BoxCollider2D)as BoxCollider2D).enabled = true;
                 TankBettle.gameData.curLeftEnemy -= 1;
                 TankBettle.gameData.updateGameInfo();
             } else {
                 // cc.log("生成敌机周围有敌机，不出现")
                 enemyNode.removeFromParent();
                 enemy.destroy();
                 this._waitEnemy.push(enemyNode);
             }
         }
     }
 
     private intersects(node: Node, other: Node) {
         let transform = node.getComponent(UITransform) as UITransform;
         let box = new Rect(node.position.x,node.position.y,transform.width,transform.height);
         transform = other.getComponent(UITransform) as UITransform;
         let otherBox = new Rect(other.position.x,other.position.y,transform.width,transform.height);
         let scale = 3;//如果新出生的敌机，如果在附近有敌机或玩家，不生成，以免出来就产生碰撞
         let width = box.width * scale;
         let height = box.height * scale;
         let newBox = new Rect(box.x - (width - box.width) / 2, box.y - (height - box.height) / 2, width, height)
         if (newBox.intersects(otherBox)) {
             // cc.log(`生成的敌机离${other.name}太近`);
             return true;
         }
         return false;
     }
     private checkBornPosition(pos: Vec3, node: Node) {
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
             enemy.getComponent(TankBettleTankEnemy)?.die();
             this._waitingDestory.push(enemy)
         }
         this._enemys = [];
         this.checkGamePass();
     }
 
     public removeEnemy(enemy: Node) {
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
         if (TankBettle.gameData.curLeftEnemy <= 0 ) {
             if (this._enemys.length <= 0) {
                 //通关了
                 TankBettle.gameData.isNeedReducePlayerLive = false;
                 TankBettle.gameData.nextLevel();
             }
         }
     }
 
     public setLevel(level: number) {
         if (!!!this._blockPrefab) {
             error(`请先设置预置节点`);
             return
         }
 
         //清空当前地图的东西
         this.node.removeAllChildren()
 
         //添加四周的墙
         this.outWall.forEach((value) => {
             this.node.addChild(instantiate(value));
         });

         //各层
         this.nodes.forEach((node)=>{
            node.removeAllChildren();
            this.node.addChild(node);
         });
 
         //清空
         this._enemys = [];
 
         let data = MapLevel[level];
         //地图数据
         let x = 0;
         let y = 0;
         let tempBlock = this._blockPrefab.getChildByName("block_1")?.getComponent(UITransform) as UITransform;
         let prefebSize = new Size(tempBlock.width, tempBlock.height)
         for (let i = 0; i < data.length; i++) {
             const element = data[i];
             y = -((i + 1) * prefebSize.height / 2 + i * prefebSize.height / 2)
             for (let j = 0; j < element.length; j++) {
                 const blockData = element[j];
                 if (blockData > 0 && blockData != TankBettle.BLOCK_TYPE.ANOTHREHOME) {
                     let name = "block_" + blockData.toString()
                     let prefab = this._blockPrefab.getChildByName(name)
                     if (prefab) {
                         let node = instantiate(prefab)
                         let block = node.addComponent(TankBattleBlock)
                         block.type = blockData;
                         if (blockData == TankBettle.BLOCK_TYPE.HOME) {
                             this._heart = node;
                         }
                         this.addNodeChild(node,TankBettle.ZIndex.BLOCK);
                         x = (j + 1) * prefebSize.width / 2 + j * prefebSize.width / 2;
                         node.setPosition(new Vec3(x,y));
                         if (blockData == TankBettle.BLOCK_TYPE.HOME) {
                             //自己的老家，放在最中间

                             let transform = this.node.getComponent(UITransform) as UITransform;

                             x = transform.width/ 2
                             node.setPosition(new Vec3(x, y - prefebSize.height/2));
                         }
                     }
                 }
             }
         }
     }
 
     protected randomPropPosition( ){
         let tank = TankBettle.gameData.getPlayerPrefab(true) as Node;
         let transform = tank.getComponent(UITransform) as UITransform;
         let thisTransform = this.node.getComponent(UITransform) as UITransform;
         let xMin = transform.width / 2;
         let xMax = thisTransform.width - transform.width /2 ;
         let yMin = -transform.height/2;
         let yMax = -thisTransform.height + transform.height/2;
         let x = randomRange(xMin,xMax);
         let y = randomRange(yMin,yMax);
         return new Vec3(x,y,0);
     }
 
     private createProps( ){
         let type = randomRangeInt(TankBettle.PropsType.MIN,TankBettle.PropsType.MAX);
         let prefab = TankBettle.gameData.getPropsPrefab(type);
         let node = instantiate(prefab) as Node;
         let props = node.addComponent(TankBattleProps);
         props.type = type;
         this.addNodeChild(node,TankBettle.ZIndex.PROPS);
         node.position = this.randomPropPosition();
     }
 
     public startCreateProps() {
         if( TankBettle.gameData.gameStatus == TankBettle.GAME_STATUS.GAME ){
             let time = randomRange(TankBettle.PROPS_CREATE_INTERVAL.min,TankBettle.PROPS_CREATE_INTERVAL.max);
             Tween.stopAllByTarget(this.getNode(TankBettle.ZIndex.PROPS));
             tween(this.getNode(TankBettle.ZIndex.PROPS)).delay(time).call(()=>{
                 this.createProps();
                 this.startCreateProps();
             }).start();
         }
     }
 
     public addPlayer(isOne: boolean) {
 
         let playerNode = instantiate(TankBettle.gameData.getPlayerPrefab(isOne)) as Node;
         let playerTrans = playerNode.getComponent(UITransform) as UITransform;
         let thisTrans = this.node.getComponent(UITransform) as UITransform;
         if (isOne) {
             this.playerOne = playerNode.addComponent(TankBettleTankPlayer);
             this.playerOne.isOnePlayer = isOne;
             playerNode.setPosition( new Vec3(
                thisTrans.width/2 - 2 * playerTrans.width,
                -thisTrans.height + playerTrans.height/2
             ));
             this.addNodeChild(playerNode,TankBettle.ZIndex.TANK);
             this.playerOne.born();
         } else {
             this.playerTwo = playerNode.addComponent(TankBettleTankPlayer);
             this.playerTwo.isOnePlayer = isOne;
             playerNode.setPosition(new Vec3(
                 thisTrans.width / 2 + 2 * playerTrans.width,
                 -thisTrans.height + playerTrans.height/2
             ));
             this.addNodeChild(playerNode,TankBettle.ZIndex.TANK);
             this.playerTwo.born();
         }
     }
 
     public removePlayer(player: TankBettleTankPlayer) {
         let isOne = player.isOnePlayer;
         player.node.removeFromParent();
         player.node.destroy();
         if (TankBettle.gameData.isSingle) {
             this.playerOne = null;
             if (TankBettle.gameData.playerOneLive > 0) {
                 this.addPlayer(isOne);
                 TankBettle.gameData.reducePlayerLive(true);
                 TankBettle.gameData.updateGameInfo();
             } else {
                 TankBettle.gameData.gameOver();
             }
         } else {
             //双人
             if (isOne) {
                 this.playerOne = null;
                 if (TankBettle.gameData.playerOneLive > 0) {
                     this.addPlayer(isOne);
                 }
                 TankBettle.gameData.reducePlayerLive(true)
             } else {
                 this.playerTwo = null;
                 if (TankBettle.gameData.playerTwoLive > 0) {
                     this.addPlayer(isOne);
                 }
                 TankBettle.gameData.reducePlayerLive(false)
             }
             TankBettle.gameData.updateGameInfo();
             if (TankBettle.gameData.playerTwoLive < 0 && TankBettle.gameData.playerOneLive < 0) {
                 TankBettle.gameData.gameOver();
             }
         }
     }
 
     public addBullet(bullet: TankBettleBullet) {
         this.addNodeChild(bullet.node,TankBettle.ZIndex.BULLET);
     }
 
     public onKeyDown(ev: EventKeyboard) {
         if( !this._keyboardEvents.has(ev.keyCode) ){
             this._keyboardEvents.set(ev.keyCode,ev);
         }
     }
 
     public onKeyUp(ev: EventKeyboard) {
         if( this._keyboardEvents.has(ev.keyCode) ){
             this._keyboardEvents.delete(ev.keyCode);
         }
     }
 
     private doKeyboardEvents(){
         if( this._keyboardEvents.has(macro.KEY.a) ){
             this._handlePlayerMove(this.playerTwo, TankBettle.Direction.LEFT);
         }else if( this._keyboardEvents.has(macro.KEY.w)){
             this._handlePlayerMove(this.playerTwo, TankBettle.Direction.UP);
         }else if( this._keyboardEvents.has(macro.KEY.s)){
             this._handlePlayerMove(this.playerTwo, TankBettle.Direction.DOWN);
         }else if( this._keyboardEvents.has(macro.KEY.d)){
             this._handlePlayerMove(this.playerTwo, TankBettle.Direction.RIGHT);
         }
         
         if( this._keyboardEvents.has(macro.KEY.left)){
             this._handlePlayerMove(this.playerOne, TankBettle.Direction.LEFT);
         }else if( this._keyboardEvents.has(macro.KEY.up)){
             this._handlePlayerMove(this.playerOne, TankBettle.Direction.UP);
         }else if( this._keyboardEvents.has(macro.KEY.down)){
             this._handlePlayerMove(this.playerOne, TankBettle.Direction.DOWN);
         }else if( this._keyboardEvents.has(macro.KEY.right)){
             this._handlePlayerMove(this.playerOne, TankBettle.Direction.RIGHT);
         }
         
         if( this._keyboardEvents.has(macro.KEY.enter)){
             this._handlePlayerShoot(this.playerOne);
         }
         if( this._keyboardEvents.has(macro.KEY.space)){
             if( TankBettle.gameData.isSingle ){
                 this._handlePlayerShoot(this.playerOne);
             }
             this._handlePlayerShoot(this.playerTwo);
         }
     }
 
     private _handlePlayerMove(player: TankBettleTankPlayer | null, dir: TankBettle.Direction) {
         if (TankBettle.gameData.gameStatus == TankBettle.GAME_STATUS.GAME) {
             if (player) {
                 player.direction = dir;
                 player.move();
             }
         }
     }
 
     private _handlePlayerShoot(player: TankBettleTankPlayer|null) {
         if (TankBettle.gameData.gameStatus == TankBettle.GAME_STATUS.GAME) {
             if (player) {
                 player.shoot();
             }
         }
     }
 
     public gameOver() {
         if (this._heart) {
             let aniNode = instantiate(TankBettle.gameData.animationPrefab) as Node;
             this._heart.addChild(aniNode);
             let animation = aniNode.getComponent(Animation) as Animation;
             let state = animation.getState("king_boom")
             animation.play("king_boom");
             aniNode.setPosition(new Vec3());
             tween(aniNode).delay(state.duration).call(() => {
                 aniNode.removeFromParent()
                 aniNode.destroy();
                 let sprite = this._heart.getComponent(Sprite) as Sprite;
                 sprite.loadImage({ url: { urls: ["texture/images"], key: "heart_0" }, view: this.owner, bundle: this.owner.bundle });
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
 