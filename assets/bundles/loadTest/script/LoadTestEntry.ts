import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import LoadTestView from "./view/LoadTestView";

class LoadTestEntry extends Entry {
    static bundle = "loadTest"
    protected addNetComponent(): void {
    }
    protected removeNetComponent(): void {
    }
    protected loadResources(completeCb: () => void): void {
        this.loader.getLoadResources = ()=>{
            return [{ dir: "texture/sheep", bundle: this.bundle, type: cc.SpriteFrame }];
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
        Manager.uiManager.open({ type: LoadTestView, bundle: this.bundle });
    }
    protected closeGameView(): void {
        Manager.uiManager.close(LoadTestView);
    }
    protected initData(): void {
    }
    protected pauseMessageQueue(): void {
    }
    protected resumeMessageQueue(): void {
    }
}

Manager.entryManager.register(LoadTestEntry);