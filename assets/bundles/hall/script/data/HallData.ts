
import { Config } from "../../../../scripts/common/config/Config";
import { Update } from "../../../../scripts/framework/core/update/Update";
import { GameData } from "../../../../scripts/framework/data/GameData";
import { Macro } from "../../../../scripts/framework/defines/Macros";
/**@description 大厅数据 */
export class HallData extends GameData {
    static bundle = Macro.BUNDLE_HALL;

    private _games : {[key:string] : Update.Config} = {};

    private _backup : {[key:string] : Update.Config} = {};
    backupConfig(){
        let keys = Object.keys(Config.ENTRY_CONFIG);
        this._backup = {};
        for( let i = 0 ; i < keys.length ; i++){
            let config : Update.Config = Config.ENTRY_CONFIG[keys[i]];
            if( config ){
                this._backup[keys[i]] = config;
            }
        }
    }

    restoreConfig(){
        (Config.ENTRY_CONFIG as any) = {};
        let keys = Object.keys(this._backup);
        for( let i = 0 ; i < keys.length ; i++){
            Config.ENTRY_CONFIG[`${this._backup[keys[i]].bundle}`] = this._backup[keys[i]].clone();
        }
    }

    mergeConfig(){
        let keys = Object.keys(this.games);
        for( let i = 0 ; i < keys.length ; i++){
            Config.ENTRY_CONFIG[`${this.games[keys[i]].bundle}`] = this.games[keys[i]].clone();
        }
    }

    get games(){
        let keys = Object.keys(this._games);
        if( keys.length <= 0 ){
            this._games["tankBattle"] = new Update.Config(Manager.getLanguage("hall_view_game_name.0", this.bundle), "tankBattle");
            this._games["loadTest"] = new Update.Config(Manager.getLanguage("hall_view_game_name.1", this.bundle), "loadTest");
            this._games["netTest"] = new Update.Config(Manager.getLanguage("hall_view_game_name.2", this.bundle), "netTest");
            this._games["aimLine"] = new Update.Config(Manager.getLanguage("hall_view_game_name.3", this.bundle), "aimLine");
            this._games["nodePoolTest"] = new Update.Config(Manager.getLanguage("hall_view_game_name.4", this.bundle), "nodePoolTest");
            this._games["shaders"] = new Update.Config(Manager.getLanguage("hall_view_game_name.5", this.bundle), "shaders");
            this._games["eliminate"] = new Update.Config(Manager.getLanguage("hall_view_game_name.6", this.bundle), "eliminate");
        }
        return this._games;
    }
}
