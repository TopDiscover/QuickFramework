/**
 * @description 地图绘制
 */

import { MapLevel } from "../data/TankBattleLevel";
import { TankBettle } from "../data/TankBattleGameData";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TankBattleMap extends cc.Component {

    /**@description 用于克隆的节点 */
    private _blockPrefab: cc.Node = null;

    /**@description 设置克隆的节点，如墙，地板等 */
    public setPrefabs(node: cc.Node) {
        this._blockPrefab = node
    }

    public setLevel(level: number) {
        if (!!!this._blockPrefab) {
            cc.error(`请先设置预置节点`);
            return
        }

        //清空当前地图的东西
        this.node.removeAllChildren(true)

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
                        this.node.addChild(node);
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

}
