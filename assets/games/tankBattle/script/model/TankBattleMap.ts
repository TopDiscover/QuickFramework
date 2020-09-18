/**
 * @description 地图绘制
 */

import { Level } from "../data/TankBattleLevel";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TankBattleMap extends cc.Component {

    /**@description 用于克隆的节点 */
    private _blockPrefab : cc.Node = null;

    /**@description 设置克隆的节点，如墙，地板等 */
    public setPrefabs( node : cc.Node ){
        this._blockPrefab = cc.find("block",node)
    }

    public setLevel( level : number ){
        if ( !!!this._blockPrefab ) {
            cc.error(`请先设置预置节点`);
            return
        }
        let data = Level[level];
        //地图数据
        for (let i = 0; i < data.length ; i++) {
            const element = data[i];
            for (let j = 0; j < element.length; j++) {
                const blockData = element[j];
                let vvv = 0;
                vvv++;
            }
            
        }
    }
    
}
