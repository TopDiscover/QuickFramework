import { GameData } from "../../../../scripts/framework/data/GameData";
import EliminateGameModel from "../model/EliminateGameModel";

class _EliminateData extends GameData {

    private static _instance: _EliminateData = null!;
    public static Instance() { return this._instance || (this._instance = new _EliminateData()); }
    get bundle() {
        return "eliminate";
    }

    gameModel: EliminateGameModel = null!;

    initGameModel() {
        this.gameModel = new EliminateGameModel();
        this.gameModel.init();
    }

}
export const EliminateData = getSingleton(_EliminateData);
