import { Game2048 } from "../data/Game2048GameData";

const { ccclass, property } = cc._decorator;

/**@description 操作地图 */

@ccclass
export default class Game2048Map extends cc.Component {

    initMap() {
        //画地图
        let item = Game2048.gameData.itemPrefab;
        let mapSize = Game2048.MAP_SIZE * Game2048.MAP_SIZE;
        let col = 0;
        let row = 0;
        for (let i = 0; i < mapSize; i++) {
            let itemNode = Game2048.gameData.getItemCache();
            row = Math.floor(i/Game2048.MAP_SIZE)
            col = Math.floor(i%Game2048.MAP_SIZE);
            itemNode.userData = { col: col, row: row };
            itemNode.name = `item_${row}_${col}`;
            this.node.addChild(itemNode);
        }

        let layout = this.node.getComponent(cc.Layout);
        layout.updateLayout();

        //取地图项位置
        for (let i = this.node.children.length -1 ; i >= 0; i--) {
            let userData: { col: number, row: number } = this.node.children[i].userData;
            if (!Game2048.gameData.positions[userData.row]) {
                Game2048.gameData.positions[userData.row] = [];
            }
            Game2048.gameData.positions[userData.row][userData.col] = this.node.children[i].position;
            Game2048.gameData.addItemCache(this.node.children[i]);
        }
        layout.enabled = false;
    }

    onDestroy(){
        Game2048.gameData.clearItemCache();
        super.onDestroy();
    }

    private 
}
