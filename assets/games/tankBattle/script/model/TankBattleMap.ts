/**
 * @description 地图绘制
 */

import { MapLevel } from "../data/TankBattleLevel";
import { TankBettle } from "../data/TankBattleGameData";
import { TankBettleTankPlayer } from "./TankBattleTank";
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
    private playerOne : TankBettleTankPlayer = null;
    /**@description 玩家2 */
    private playerTwo : TankBettleTankPlayer = null;
    private outWall:cc.Node[] = [];

    public owner : TankBattleGameView = null;

    protected onLoad(){
        this.node.children.forEach(node=>{
            this.outWall.push(node);
        })
        this.node.removeAllChildren(false);
    }

    protected onDestroy(){
        this.outWall.forEach((value)=>{
            value.destroy();
        });
        this.outWall = [];
    }

    public setLevel(level: number) {
        if (!!!this._blockPrefab) {
            cc.error(`请先设置预置节点`);
            return
        }

        //清空当前地图的东西
        this.node.removeAllChildren(true)

        //添加四周的墙
        this.outWall.forEach((value)=>{
            this.node.addChild(cc.instantiate(value));
        });

        let data = MapLevel[level];
        //地图数据
        let x = 0;
        let y = 0;
        let tempBlock = this._blockPrefab.getChildByName("block_1");
        let prefebSize : cc.Size = cc.size(tempBlock.width,tempBlock.height)
        for (let i = 0; i < data.length; i++) {
            const element = data[i];
            y = -( (i + 1 ) * prefebSize.height /2 + i * prefebSize.height /2 )
            for (let j = 0; j < element.length; j++) {
                const blockData = element[j];
                if (blockData > 0 && blockData != TankBettle.BLOCK_TYPE.ANOTHREHOME ) {
                    let name = "block_" + blockData.toString()
                    let prefab = this._blockPrefab.getChildByName(name)
                    if (prefab) {
                        let node = cc.instantiate(prefab)
                        let block = node.addComponent(TankBattleBlock)
                        block.type = blockData;
                        this.node.addChild(node,TankBettle.ZIndex.BLOCK);
                        x = (j + 1) * prefebSize.width/2 + j * prefebSize.width/2
                        node.x = x;
                        node.y = y;
                        if ( blockData == TankBettle.BLOCK_TYPE.HOME ) {
                            //自己的老家，放在最中间
                            x = this.node.width/2
                            node.x = x;
                            node.y -= prefebSize.height/2
                        }
                    }
                }
            }
        }
    }

    public addPlayer( isOne : boolean){
        let playerNode = cc.instantiate(TankBettle.gameData.getPlayerPrefab(true))
        if (isOne) {
            this.playerOne = playerNode.addComponent(TankBettleTankPlayer);
            this.playerOne.isOnePlayer = isOne;
            playerNode.x = this.node.width / 2 - 2 * playerNode.width
            playerNode.y = -this.node.height + playerNode.height/2;
            this.playerOne.born();
        }else{
            this.playerTwo = playerNode.addComponent(TankBettleTankPlayer);
            this.playerTwo.isOnePlayer = isOne;
            playerNode.x = this.node.width / 2 + 2 * playerNode.width;
            playerNode.y = -this.node.height + playerNode.height /2;
            this.playerTwo.born();
        }
        this.node.addChild(playerNode,TankBettle.ZIndex.TANK);
    }

    public addBullet( bullet : TankBettleBullet ){
        this.node.addChild(bullet.node,TankBettle.ZIndex.BULLET);
    }

    public onKeyDown(ev:cc.Event.EventKeyboard){
        switch(ev.keyCode){
            case cc.macro.KEY.a:{
                this._handlePlayerMove(this.playerTwo,TankBettle.Direction.LEFT);
            }
            break;
            case cc.macro.KEY.w:{
                this._handlePlayerMove(this.playerTwo,TankBettle.Direction.UP);
            }
            break;
            case cc.macro.KEY.s:{
                this._handlePlayerMove(this.playerTwo,TankBettle.Direction.DOWN);
            }
            break;
            case cc.macro.KEY.d:{
                this._handlePlayerMove(this.playerTwo,TankBettle.Direction.RIGHT);
            }
            break;
            case cc.macro.KEY.left:{
                this._handlePlayerMove(this.playerOne,TankBettle.Direction.LEFT);
            }
            break;
            case cc.macro.KEY.up:{
                this._handlePlayerMove(this.playerOne,TankBettle.Direction.UP);
            }
            break;
            case cc.macro.KEY.down:{
                this._handlePlayerMove(this.playerOne,TankBettle.Direction.DOWN);
            }
            break;
            case cc.macro.KEY.right:{
                this._handlePlayerMove(this.playerOne,TankBettle.Direction.RIGHT);
            }
            break;
            case cc.macro.KEY.enter:{
                this._handlePlayerShoot( this.playerOne );
            }
            break;
            case cc.macro.KEY.space:{
                this._handlePlayerShoot( this.playerTwo );
            }
            break;
        }
        cc.log(ev.keyCode)
    }

    private _handlePlayerMove( player : TankBettleTankPlayer , dir : TankBettle.Direction){
        if (player) {
            player.direction = dir;
            player.move();
        }
    }

    private _handlePlayerShoot( player : TankBettleTankPlayer ){
        if( player ){
            player.shoot();
        }
    }

    public gameOver( block : TankBattleBlock ){
        let sprite = block.node.getComponent(cc.Sprite);
        sprite.loadImage({url:{urls:["texture/images"],key:"heart_0"},view:this.owner,bundle:this.owner.bundle})
    }
}
