import { GameData } from "../../../../scripts/common/base/GameData";
import EliminateGameModel from "../model/EliminateGameModel";
import { CELL_PREFAB_URL, CELL_TYPE } from "./EliminateDefines";

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
