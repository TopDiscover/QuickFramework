
import { Resource } from "../../../scripts/framework/core/asset/Resource";
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { TaxiGameView } from "./view/TaxiGameView";

class TaxiEntry extends Entry {
    static bundle = "taxi";
    protected addNetHandler(): void {

    }
    protected removeNetHandler(): void {

    }
    protected loadResources(completeCb: () => void): void {
        this.loader.getLoadResources = () => {
            let res: Resource.Data[] = [{ preloadView: TaxiGameView, bundle: this.bundle }];
            return res;
        };
        this.loader.onLoadComplete = (err) => {
            if (err = Resource.LoaderError.SUCCESS) {
                completeCb();
            }
        };
        this.loader.loadResources();
    }
    protected openGameView(): void {
        Manager.uiManager.open({
            type: TaxiGameView,
            bundle: this.bundle
        })
    }
    protected closeGameView(): void {
        Manager.uiManager.close(TaxiGameView);
    }
    protected initData(): void {

    }
    protected pauseMessageQueue(): void {

    }
    protected resumeMessageQueue(): void {

    }

    call(eventName: string, args: any[]) {

    }

}

Manager.entryManager.register(TaxiEntry);