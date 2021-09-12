import { LobbyService } from "../../../scripts/common/net/LobbyService";
import TankBattleGameView from "./view/TankBattleGameView";
import { TankBettle } from "./data/TankBattleGameData";
import TankBattleNetController from "./controller/TankBattleNetController";
import { TankBattleLanguage } from "./data/TankBattleLanguage";
import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import { Resource } from "../../../scripts/framework/core/asset/Resource";
/**
 * @description 坦克大战入口
 */
class TankBattleEntry extends IEntry {
    static bundle = TankBettle.gameData.bundle;
    protected language = new TankBattleLanguage;

    protected addNetComponent(): void {
        this.node.addComponent(TankBattleNetController);
    }
    protected removeNetComponent(): void {
        this.node.removeComponent(TankBattleNetController);
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
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: TankBattleGameView, bundle: this.bundle });
    }
    protected initData(): void {
        //游戏数据初始化
        Manager.gameData = TankBettle.gameData;
        Manager.gameData.clear();
    }
    protected pauseMessageQueue(): void {
        LobbyService.instance.pauseMessageQueue();
    }
    protected resumeMessageQueue(): void {
        LobbyService.instance.resumeMessageQueue();
    }
}

Manager.entryManager.register(TankBattleEntry);