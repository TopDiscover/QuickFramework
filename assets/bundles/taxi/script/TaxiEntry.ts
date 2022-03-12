
import { Entry } from "../../../scripts/framework/core/entry/Entry";
import { TaxiGameView } from "./view/TaxiGameView";

class TaxiEntry extends Entry{
    static bundle = "taxi";
    protected addNetHandler(): void {
        
    }
    protected removeNetHandler(): void {
        
    }
    protected loadResources(completeCb: () => void): void {
        completeCb();
    }
    protected openGameView(): void {
        Manager.uiManager.open({
            type : TaxiGameView,
            bundle : this.bundle
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

    call(eventName:string,args:any[]){

    }
    
}

Manager.entryManager.register(TaxiEntry);