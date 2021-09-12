import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { IEntry } from "../../../scripts/framework/core/entry/IEntry";
import LoadTestView from "./view/LoadTestView";

class LoadTestLogic extends IEntry {
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
    }
    protected openGameView(): void {
        Manager.uiManager.open({ type: LoadTestView, bundle: this.bundle });
    }
    protected initData(): void {
    }
    protected pauseMessageQueue(): void {
    }
    protected resumeMessageQueue(): void {
    }
}

Manager.entryManager.register(LoadTestLogic);