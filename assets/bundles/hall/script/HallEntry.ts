import HallView from "./view/HallView";
import { HallData } from "./data/HallData";
import { HallLanguage } from "./data/HallLanguage";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { Config } from "../../../scripts/common/config/Config";

class HallEntry extends Entry {
    static bundle = Config.BUNDLE_HALL;
    protected language = new HallLanguage;
    protected addNetComponent(): void {
        Manager.hallNetManager.addNetControllers();
    }
    protected removeNetComponent(): void {
        Manager.hallNetManager.removeNetControllers();
    }
    protected loadResources(completeCb: () => void): void {
        Manager.protoManager.load(this.bundle).then((isSuccess)=>{
            completeCb();
        })
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: HallView, bundle: this.bundle });
    }
    protected initData(): void {
        //向Config.ENTRY_CONFIG合并配置
        HallData.backupConfig();
        HallData.mergeConfig();
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle(): void {
        super.onUnloadBundle();
        HallData.restoreConfig();
    }
}

Manager.entryManager.register(HallEntry);
