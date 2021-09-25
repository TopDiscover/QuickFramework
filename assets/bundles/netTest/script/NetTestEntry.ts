import { ChatService } from "../../../scripts/common/net/ChatService";
import { GameService } from "../../../scripts/common/net/GameService";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import ChatHandler from "./net/ChatHandler";
import GameHandler from "./net/GameHandler";
import NetTestView from "./view/NetTestView";

class NetTestEntry extends Entry {
    static bundle = "netTest";
    protected addNetHandler(): void {
        Manager.netHelper.getHandler(ChatHandler,true);
        Manager.netHelper.getHandler(GameHandler,true);
    }
    protected removeNetHandler(): void {
        Manager.netHelper.destoryHandler(ChatHandler);
        Manager.netHelper.destoryHandler(GameHandler);
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: NetTestView, bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(NetTestView);
    }
    protected initData(): void {
        Manager.serviceManager.get(GameService,true);
        Manager.serviceManager.get(ChatService,true);
    }
    protected pauseMessageQueue(): void {
        
    }
    protected resumeMessageQueue(): void {
        
    }

    onUnloadBundle(){
        super.onUnloadBundle();
        Manager.serviceManager.destory(GameService);
        Manager.serviceManager.destory(ChatService);
    }

}

Manager.entryManager.register(NetTestEntry);