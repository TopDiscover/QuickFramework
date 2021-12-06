import HallView from "./view/HallView";
import { HallData } from "./data/HallData";
import { HallLanguage } from "./data/HallLanguage";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import HallHandler from "./net/HallHandler";
import { LobbyService } from "../../../scripts/common/net/LobbyService";
import { Macro } from "../../../scripts/framework/defines/Macros";

class HallEntry extends Entry {
    static bundle = Macro.BUNDLE_HALL;
    protected language = new HallLanguage;

    private get data(){
        return Manager.dataCenter.get(HallData) as HallData;
    }

    protected addNetHandler(): void {
        Manager.netHelper.getHandler(HallHandler,true);
    }
    protected removeNetHandler(): void {
        //大厅的到登录界面会自动初清除
        // Manager.netHelper.destoryHandler(HallHandler);
    }
    protected loadResources(completeCb: () => void): void {
        Manager.protoManager.load(this.bundle).then((isSuccess)=>{
            completeCb();
        })
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: HallView, bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(HallView);
    }
    protected initData(): void {
        //初始化网络
        Manager.serviceManager.get(LobbyService,true);
        //向Config.ENTRY_CONFIG合并配置
        this.data.backupConfig();
        this.data.mergeConfig();
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

    /**@description 卸载bundle,即在自己bundle删除之前最后的一条消息 */
    onUnloadBundle(): void {
        super.onUnloadBundle();
        this.data.restoreConfig();
    }
}

Manager.entryManager.register(HallEntry);
