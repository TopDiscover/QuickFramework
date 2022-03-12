import { EventTouch, instantiate, Prefab, tween, UITransform } from "cc";
import { Logic } from "../../../../scripts/framework/core/logic/Logic";
import { TaxiConstants } from "../data/TaxiConstants";
import { TaxiData } from "../data/TaxiData";
import { TaxiCarMgr } from "./TaxiCarMgr";
import { TaxiMapMgr } from "./TaxiMapMgr";

export class TaxiLogic extends Logic{


    private mapMgr : TaxiMapMgr = null!;
    private carMgr : TaxiCarMgr = null!;

    get data(){
        return Manager.dataCenter.get(TaxiData) as TaxiData;
    }

    get view(){
        return this.gameView as TaxiGameView
    }
    
    onLoad(gameview:GameView){
        super.onLoad(gameview);
        Manager.dispatcher.add(TaxiConstants.EventName.MAIN_CAR_INI_SUCCUSS,this.onMainCarInitSuccess,this);
        this.data.init();
        this.view.init();
        this.mapMgr = this.view.addComponent(TaxiMapMgr) as TaxiMapMgr;
        this.carMgr = this.view.addComponent(TaxiCarMgr) as TaxiCarMgr;
        this._loadMap(this.data.level);

        
    }

    onDestroy(){
        Manager.dispatcher.remove(TaxiConstants.EventName.MAIN_CAR_INI_SUCCUSS,this);
        super.onDestroy();
    }

    private onMainCarInitSuccess(){
        this.start();
    }

    playSound( name : string ){
        const path = `resources/audio/sound/${name}`;
        this.view.audioHelper.playEffect(path,this.bundle)
    }

    private start(){
       this.view.showMain();
        // CustomEventListener.on(Constants.EventName.GAME_START, this._gameStart, this);
        // CustomEventListener.on(Constants.EventName.GAME_OVER, this._gameOver, this);
        // CustomEventListener.on(Constants.EventName.NEW_LEVEL, this._newLevel, this);
    }

    onTouchStart() {
        this.carMgr.controlMoving();
    }

    onTouchEnd() {
        this.carMgr.controlMoving(false);
    }

    private _gameStart(){
        // UIManager.hideDialog(Constants.UIPage.mainUI);
        // UIManager.showDialog(Constants.UIPage.gameUI);
    }

    private _gameOver(){
        // UIManager.hideDialog(Constants.UIPage.gameUI);
        // UIManager.showDialog(Constants.UIPage.resultUI);
    }

    private _newLevel(){
        // UIManager.hideDialog(Constants.UIPage.resultUI);
        // UIManager.showDialog(Constants.UIPage.mainUI);
        // if (this._lastMapID === this._runtimeData.currLevel) {
        //     this._reset();
        //     return;
        // }

        // this.mapManager.recycle();
        // this.loadingUI.show();
        // this._lastMapID = this._runtimeData.currLevel;
        // this._loadMap(this._lastMapID);
    }

    private _reset(){
        this.data.reset(this.mapMgr.maxProgress);
        this.carMgr.reset(this.mapMgr.currPath);
    }

    private _loadMap(level: number){

        if ( level <  1 || level > 18 ){
            level = 1;
        }

        let mapID = 100 + level;     
        this.mapMgr.loadMap(mapID,(data)=>{
            if ( data ){
                this._reset();
            }
        },(finish,total)=>{
            this.view.updateLoadingProgress(finish,total);
        });
    }
}