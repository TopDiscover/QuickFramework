import { LobbyService } from "../../../scripts/common/net/LobbyService";
import TankBattleGameView from "./view/TankBattleGameView";
import { TankBettle } from "./data/TankBattleGameData";
import { TankBattleLanguage } from "./data/TankBattleLanguage";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { Resource } from "../../../scripts/framework/core/asset/Resource";
import TankBattleChangeStageView from "./view/TankBattleChangeStageView";
import TankBattleStartView from "./view/TankBattleStartView";
import TankBattleGameOver from "./view/TankBattleGameOver";
/**
 * @description 坦克大战入口
 */
class TankBattleEntry extends Entry {
    static bundle = TankBettle.gameData.bundle;
    protected language = new TankBattleLanguage;

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
        Manager.gameData = TankBettle.gameData;
        Manager.gameData.clear();
        TankBettle.gameData.TankBattleChangeStageView = TankBattleChangeStageView;
        TankBettle.gameData.TankBattleStartView = TankBattleStartView;
        TankBettle.gameData.TankBattleGameOver = TankBattleGameOver;
    }
    protected pauseMessageQueue(): void {
        LobbyService.instance.pauseMessageQueue();
    }
    protected resumeMessageQueue(): void {
        LobbyService.instance.resumeMessageQueue();
    }
}

Manager.entryManager.register(TankBattleEntry);