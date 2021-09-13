
import { Config } from "../../../../scripts/common/config/Config";
import { HotUpdate } from "../../../../scripts/framework/core/hotupdate/Hotupdate";
import { GameData } from "../../../../scripts/framework/data/GameData";
/**@description 大厅数据 */
class _HallData extends GameData {
    private static _instance: _HallData = null!;
    public static Instance() { return this._instance || (this._instance = new _HallData()); }

    get bundle() {
        return Config.BUNDLE_HALL;
    }

    private _games : {[key:string] : HotUpdate.BundleConfig} = {};

    private _backup : {[key:string] : HotUpdate.BundleConfig} = {};
    backupConfig(){
        let keys = Object.keys(Config.ENTRY_CONFIG);
        this._backup = {};
        for( let i = 0 ; i < keys.length ; i++){
            let config : HotUpdate.BundleConfig = Config.ENTRY_CONFIG[keys[i]];
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
            this._games["tankBattle"] = new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.0", this.bundle), "tankBattle");
            this._games["loadTest"] = new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.1", this.bundle), "loadTest");
            this._games["netTest"] = new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.2", this.bundle), "netTest");
            this._games["aimLine"] = new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.3", this.bundle), "aimLine");
            this._games["nodePoolTest"] = new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.4", this.bundle), "nodePoolTest");
            this._games["shaders"] = new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.5", this.bundle), "shaders");
            this._games["eliminate"] = new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.6", this.bundle), "eliminate");
        }
        return this._games;
    }
}
export const HallData = getSingleton(_HallData)
