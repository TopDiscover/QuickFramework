
import { Config } from "../../../../scripts/common/config/Config";
import { Update } from "../../../../scripts/framework/core/update/Update";
import { GameData } from "../../../../scripts/framework/data/GameData";
import { Macro } from "../../../../scripts/framework/defines/Macros";
/**@description 大厅数据 */
export class HallData extends GameData {
    static bundle = Macro.BUNDLE_HALL;

    private _games : {[key:string] : Update.Config} = {};

    mergeConfig(){
        let keys = Object.keys(this.games);
        for( let i = 0 ; i < keys.length ; i++){
            Config.ENTRY_CONFIG[`${this.games[keys[i]].bundle}`] = this.games[keys[i]].clone();
        }
    }

    get games(){
        let keys = Object.keys(this._games);
        if( keys.length <= 0 ){

            let name = "taxi";
            this._games[name] = new Update.Config(Manager.getLanguage(`hall_view_game_name.${this.getLanIndex(name)}`, this.bundle), name);
            
            name = "eliminate";
            this._games[name] = new Update.Config(Manager.getLanguage(`hall_view_game_name.${this.getLanIndex(name)}`, this.bundle), name);

            name = "tankBattle";
            this._games[name] = new Update.Config(Manager.getLanguage(`hall_view_game_name.${this.getLanIndex(name)}`, this.bundle), name);

            name = "loadTest";
            this._games[name] = new Update.Config(Manager.getLanguage(`hall_view_game_name.${this.getLanIndex(name)}`, this.bundle), name);

            name = "netTest";
            this._games[name] = new Update.Config(Manager.getLanguage(`hall_view_game_name.${this.getLanIndex(name)}`, this.bundle), name);

            name = "aimLine";
            this._games[name] = new Update.Config(Manager.getLanguage(`hall_view_game_name.${this.getLanIndex(name)}`, this.bundle), name);

            name = "nodePoolTest";
            this._games[name] = new Update.Config(Manager.getLanguage(`hall_view_game_name.${this.getLanIndex(name)}`, this.bundle), name);
        }
        return this._games;
    }

    getLanIndex( bundle : string ){
        let datas : { [key:string] : number} = {
            tankBattle : 0,
            loadTest : 1,
            netTest : 2,
            aimLine : 4,
            nodePoolTest : 4,
            eliminate : 5,
            taxi : 6,
        }
        return datas[bundle];
    }
}
