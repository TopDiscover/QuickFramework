import { GameData } from "../../../../scripts/framework/data/GameData";
import EliminateGameModel from "../model/EliminateGameModel";

export class EliminateData extends GameData {
    static bundle = "eliminate";
    gameModel: EliminateGameModel = null;
    initGameModel() {
        this.gameModel = new EliminateGameModel();
        this.gameModel.init();
    }
}
