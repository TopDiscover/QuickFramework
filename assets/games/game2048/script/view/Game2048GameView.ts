import GameView from "../../../../script/common/base/GameView";
import { dispatchEnterComplete, LogicType } from "../../../../script/common/event/LogicEvent";
import { Game2048 } from "../data/Game2048GameData";
import Game2048Map from "../model/Game2048Map";

const {ccclass, property} = cc._decorator;

@ccclass
export default class Game2048GameView extends GameView {

    public static getPrefabUrl(){
        return "prefabs/Game2048GameView"
    }

    /**@description 分数 */
    private score : cc.Label = null;

    onLoad(){
        super.onLoad();

        Game2048.gameData.prefabs = cc.find("prefabs",this.node);

        let gameMapNode = cc.find("gameMap",this.node);
        let gameMap = gameMapNode.addComponent(Game2048Map);
        gameMap.initMap();

        this.score = cc.find("score",this.node).getComponent(cc.Label);

        Game2048.gameData.socre = 100;

        dispatchEnterComplete( {type : LogicType.GAME,views:[this] });
    }

    public updateScore( score : number ){
        this.score.string = score.toString();
    }
}
