import { EventTouch, instantiate, Prefab, UITransform } from "cc";
import { ViewZOrder } from "../../../../scripts/common/config/Config";
import { Logic } from "../../../../scripts/framework/core/logic/Logic";
import { TaxiConfig } from "../data/TaxiConfig";
import { PlayerData, RunTimeData } from "../data/TaxiData";
import { TaxiLoading } from "../view/TaxiLoading";
import { TaxiCarMgr } from "./TaxiCarMgr";
import { TaxiMapMgr } from "./TaxiMapMgr";

export class TaxiLogic extends Logic{


    private mapMgr : TaxiMapMgr = null!;
    private carMgr : TaxiCarMgr = null!;

    private _runtimeData: RunTimeData = null!;
    private _lastMapID = 0;
    private _init = false;
    
    onLoad(gameview:GameView){
        super.onLoad(gameview);

        this.mapMgr = this.gameView.addComponent(TaxiMapMgr) as TaxiMapMgr;
        this.carMgr = this.gameView.addComponent(TaxiCarMgr) as TaxiCarMgr;
        this._runtimeData = RunTimeData.instance();
        TaxiConfig.instance().init();
        PlayerData.instance().loadFromCache();
        // Manager.uiManager.open({
        //     type : TaxiLoading,
        //     bundle : this.bundle,
        //     zIndex : ViewZOrder.UI
        // })

        this._lastMapID = this._runtimeData.currLevel;
        this._loadMap(this._lastMapID);

    }

    playSound( name : string ){
        const path = `resources/audio/sound/${name}`;
        this.gameView.audioHelper.playEffect(path,this.bundle)
    }

    playMusic( ){
        this.gameView.audioHelper.playMusic(`resources/audio/music/background`,this.bundle)
    }

    public start(){
        // UIManager.showDialog(Constants.UIPage.mainUI);
        // this.node.on(Node.EventType.TOUCH_START, this._touchStart, this);
        // this.node.on(Node.EventType.TOUCH_END, this._touchEnd, this);
        // CustomEventListener.on(Constants.EventName.GAME_START, this._gameStart, this);
        // CustomEventListener.on(Constants.EventName.GAME_OVER, this._gameOver, this);
        // CustomEventListener.on(Constants.EventName.NEW_LEVEL, this._newLevel, this);

        // AudioManager.playMusic(Constants.AudioSource.BACKGROUND);
    }

    private _touchStart(touch: Touch, event: EventTouch) {
        // this.carManager.controlMoving();
    }

    private _touchEnd(touch: Touch, event: EventTouch) {
        // this.carManager.controlMoving(false);
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
        this.mapMgr.resetMap();
        this.carMgr.reset(this.mapMgr.currPath);
        // const runtimeData = this._runtimeData;
        // runtimeData.currProgress = 0;
        // runtimeData.maxProgress = this.mapManager.maxProgress;
        // runtimeData.money = 0;
    }

    private _loadMap(level: number){

        if ( level <  1 || level > 18 ){
            level = 1;
        }

        let mapID = 100 + level;        
        loadRes({
            bundle : this.bundle,
            url : `prefabs/map/map${mapID}`,
            type : Prefab,
            view : this.gameView,
            onComplete : (data)=>{
                if ( data.data && data.data instanceof Prefab ){
                    // this.mapMgr.buildMap(data.data,()=>{

                    // })
                    let node = instantiate(data.data);
                    Manager.uiManager.root3D.addChild(node)
                    this._reset();
                }
            },
            onProgress : (finish,total,item)=>{

            }
        })

        // ResUtil.getMap(level, (err: any, asset: JsonAsset)=>{
        //     if(err){
        //         console.warn(err);
        //         return;
        //     }

        //     CustomEventListener.dispatchEvent(Constants.EventName.UPDATE_PROGRESS, 30, 'Start building a city...');
        //     this.mapMgr.buildMap(asset, () => {
        //         CustomEventListener.dispatchEvent(Constants.EventName.UPDATE_PROGRESS, 20, 'End building a city...');
        //         this._reset();
        //         this.loadingUI.finishLoading();
        //     });
        // });
    }
}