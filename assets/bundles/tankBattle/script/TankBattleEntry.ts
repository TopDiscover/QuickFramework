import { LobbyService } from "../../../scripts/common/net/LobbyService";
import TankBattleGameView from "./view/TankBattleGameView";
import { TankBattleLanguage } from "./data/TankBattleLanguage";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { TankBettleGameData } from "./data/TankBattleGameData";
/**
 * @description 坦克大战入口
 */
class TankBattleEntry extends Entry {
    protected language = new TankBattleLanguage;
    static bundle = TankBettleGameData.bundle;
    private get data(){
        return Manager.dataCenter.getData(TankBettleGameData) as TankBettleGameData
    }

    set gameView( gameView : TankBattleGameView ){
        this._gameView = gameView;
    }
    get gameView(){
        return this._gameView as TankBattleGameView;
    }

    protected addNetComponent(): void {
    }
    protected removeNetComponent(): void {
    }
    protected loadResources(completeCb: () => void): void {
        this.loader.getLoadResources = ()=>{
            return [{ preloadView: TankBattleGameView, bundle: this.bundle }];
        };
        this.loader.onLoadProgress = (err : Resource.LoaderError)=>{
            if ( err == Resource.LoaderError.LOADING){
                return;
            }
            completeCb();
        };
        this.loader.loadResources();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: TankBattleGameView, bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(TankBattleGameView);
    }
    protected initData(): void {
        //游戏数据初始化
        this.data.clear();
    }
    protected pauseMessageQueue(): void {
        LobbyService.instance.pauseMessageQueue();
    }
    protected resumeMessageQueue(): void {
        LobbyService.instance.resumeMessageQueue();
    }
}

Manager.entryManager.register(TankBattleEntry);