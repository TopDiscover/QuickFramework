import { GameData } from "../../../../script/common/base/GameData";
import { getSingleton } from "../../../../script/framework/base/Singleton";
import { GAME2048_LAN_ZH } from "./Game2048LanguageZH";
import { i18n } from "../../../../script/common/language/LanguageImpl";

export namespace Game2048{

    export class Game2048GameData extends GameData {
        private static _instance: Game2048GameData = null;
        public static Instance() { return this._instance || (this._instance = new Game2048GameData()); }

        get bundle(){
            return "game2048"
        }

        onLanguageChange(){
            let lan = GAME2048_LAN_ZH;
            i18n[`${this.bundle}`] = {};
            i18n[`${this.bundle}`] = lan.data;
        }
    }


    export const gameData = getSingleton(Game2048GameData);
}

