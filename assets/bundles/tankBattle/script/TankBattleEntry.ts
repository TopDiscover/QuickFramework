import TankBattleGameView from "./view/TankBattleGameView";
import { TankBattleGameData } from "./data/TankBattleGameData";
import { TankBattleLanguage } from "./data/TankBattleLanguage";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { Resource } from "../../../scripts/framework/core/asset/Resource";
/**
 * @description 坦克大战入口
 */
class TankBattleEntry extends Entry {
    static bundle = TankBattleGameData.bundle;
    protected language = new TankBattleLanguage;

    private get data(){
        return Manager.dataCenter.getData(TankBattleGameData) as TankBattleGameData
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
    }
    protected resumeMessageQueue(): void {
    }
}

Manager.entryManager.register(TankBattleEntry);