
import { Config } from "../../../../scripts/common/config/Config";
import { HotUpdate } from "../../../../scripts/framework/core/hotupdate/Hotupdate";
import { GameData } from "../../../../scripts/framework/data/GameData";
/**@description 大厅数据 */
class _HallData extends GameData {
    private static _instance: _HallData = null;
    public static Instance() { return this._instance || (this._instance = new _HallData()); }

    get bundle() {
        return Config.BUNDLE_HALL;
    }

    private _games : HotUpdate.BundleConfig[]= [];

    private _backup : HotUpdate.BundleConfig[] = [];
    backupConfig(){
        let keys = Object.keys(Config.ENTRY_CONFIG);
        this._backup = [];
        for( let i = 0 ; i < keys.length ; i++){
            let config : HotUpdate.BundleConfig = Config.ENTRY_CONFIG[keys[i]];
            if( config ){
                this._backup.push(config.clone());
            }
        }
    }

    restoreConfig(){
        (Config.ENTRY_CONFIG as any) = {};
        for( let i = 0 ; i < this._backup.length ; i++){
            Config.ENTRY_CONFIG[`${this._backup[i].bundle}`] = this._backup[i].clone();
        }
    }

    mergeConfig(){
        for( let i = 0 ; i < this.games.length ; i++){
            Config.ENTRY_CONFIG[`${this.games[i].bundle}`] = this.games[i].clone();
        }
    }

    get games(){
        if( this._games.length <= 0 ){
            this._games = [
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.0", this.bundle), "gameOne"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.1", this.bundle), "gameTwo"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.2", this.bundle), "tankBattle"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.3", this.bundle), "loadTest"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.4", this.bundle), "netTest"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.5", this.bundle), "aimLine"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.6", this.bundle), "nodePoolTest"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.7", this.bundle), "shaders"),
                new HotUpdate.BundleConfig(Manager.getLanguage("hall_view_game_name.8", this.bundle), "eliminate"),
            ];
        }
        return this._games;
    }
}
export const HallData = getSingleton(_HallData)
