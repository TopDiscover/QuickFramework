import { SpriteFrame } from "cc";
import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { setClassName } from "../../../scripts/framework/decorator/Decorators";
import LoadTestView from "./view/LoadTestView";

@setClassName()
class LoadTestEntry extends Entry {
    static bundle = "loadTest"
    protected addNetComponent(): void {
    }
    protected removeNetComponent(): void {
    }
    protected loadResources(completeCb: () => void): void {
        this.loader.getLoadResources = ()=>{
            return [{ dir: "texture/sheep", bundle: this.bundle, type: SpriteFrame }];
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