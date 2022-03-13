import { instantiate, physics, PhysicsSystem, Prefab } from "cc";
import { Logic } from "../../../../scripts/framework/core/logic/Logic";
import { TaxiConstants } from "../data/TaxiConstants";
import { TaxiData } from "../data/TaxiData";
import { TaxiCarMgr } from "./TaxiCarMgr";
import { TaxiCustomerMgr } from "./TaxiCustomerMgr";
import { TaxiMapMgr } from "./TaxiMapMgr";

export class TaxiLogic extends Logic {


    private mapMgr: TaxiMapMgr = null!;
    private carMgr: TaxiCarMgr = null!;
    private customerMgr : TaxiCustomerMgr = null!;

    get data() {
        return Manager.dataCenter.get(TaxiData) as TaxiData;
    }

    get view() {
        return this.gameView as TaxiGameView
    }

    protected addEvents() {
        super.addEvents();
        this.addEvent(TaxiConstants.EventName.MAIN_CAR_INI_SUCCUSS, this.onMainCarInitSuccess);
        this.addEvent(TaxiConstants.EventName.GAME_START, this.onGameStart);
        this.addEvent(TaxiConstants.EventName.PLAY_SOUND,this.onPlaySound);
        this.addEvent(TaxiConstants.EventName.GAME_OVER,this.onGameOver);
        this.addEvent(TaxiConstants.EventName.NEW_LEVEL,this.onNewLevel);
    }

    onLoad(gameview: GameView) {
        super.onLoad(gameview);
        PhysicsSystem.instance.enable = true;
        this.data.init();
        this.view.init();
        this.createGround();
        this.mapMgr = this.view.addComponent(TaxiMapMgr) as TaxiMapMgr;
        this.carMgr = this.view.addComponent(TaxiCarMgr) as TaxiCarMgr;
        this.customerMgr = this.view.addComponent(TaxiCustomerMgr) as TaxiCustomerMgr;
        this.loadMap(this.data.level);
    }

    private createGround(){
        let data = Manager.cacheManager.get(this.bundle,"prefabs/map/ground");
        if ( data && data.data instanceof Prefab ){
            let node = instantiate(data.data);
            Manager.uiManager.root3D.addChild(node);
        }
    }

    onDestroy() {
        //删除动画加载的3d节点
        Manager.uiManager.root3D.removeAllChildren();
        super.onDestroy();
    }

    private onMainCarInitSuccess() {
        this.view.showMain();
    }

    private onPlaySound(name: string) {
        const path = `audio/sound/${name}`;
        this.view.audioHelper.playEffect(path, this.bundle)
    }

    onTouchStart() {
        this.carMgr.controlMoving();
    }

    onTouchEnd() {
        this.carMgr.controlMoving(false);
    }

    private onGameStart() {
        this.view.showGameUI();
    }

    private onGameOver() {
        this.view.showResult();
    }

    private onNewLevel() {
        this.view.hideResult();
        if ( this.data.level == this.data.curLevel ){
            this.reset();
            return;
        }
        this.mapMgr.recycle();
        this.view.showLoading();
        this.data.curLevel = this.data.level;
        this.loadMap(this.data.curLevel);
    }

    reset() {
        this.data.reset(this.mapMgr.maxProgress);
        this.carMgr.reset(this.mapMgr.currPath);
        this.view.updateData();
    }

    private loadMap(level: number) {

        if (level < 1 || level > 18) {
            level = 1;
        }

        let mapID = 100 + level;
        this.mapMgr.loadMap(mapID, (data) => {
            if (data) {
                this.reset();
            }
        }, (finish, total) => {
            this.view.updateLoadingProgress(finish, total);
        });
    }
}