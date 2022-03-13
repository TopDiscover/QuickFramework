import { instantiate, physics, PhysicsSystem, Prefab } from "cc";
import { Resource } from "../../../../scripts/framework/core/asset/Resource";
import ResourceLoader from "../../../../scripts/framework/core/asset/ResourceLoader";
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

    private loader = new ResourceLoader;

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
        this.loadResources(this.data.level);
    }

    private loadResources(mapId : number ){
        this.loader.getLoadResources = () => {
            let res: Resource.Data[] = [
                { url : "prefabs/customer/customer01" , bundle : this.bundle , type : Prefab},
                { url : "prefabs/customer/customer02" , bundle : this.bundle , type : Prefab},
                { url : "prefabs/car/car101" , bundle : this.bundle , type : Prefab},
                { url : "prefabs/car/car201" , bundle : this.bundle , type : Prefab},
                { url : "prefabs/car/car202" , bundle : this.bundle , type : Prefab},
                { url : "prefabs/car/car203" , bundle : this.bundle , type : Prefab},
                { url : "prefabs/car/car204" , bundle : this.bundle , type : Prefab},
            ];
            return res;
        };
        this.loader.onLoadComplete = (err) => {
            if (err = Resource.LoaderError.SUCCESS) {
                this.customerMgr.init();
                this.loadMap(mapId);
            }
        };
        this.loader.onLoadProgress = ( loaded , total )=>{
            this.view.updateLoadingProgress(loaded,total);
        }
        this.view.updateLoadingText(Manager.getLanguage("loadingRes",this.bundle));
        this.loader.loadResources();
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
        //卸载资源
        this.loader.unLoadResources();
        //清除缓存
        this.carMgr.clear();
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
        this.view.updateLoadingText(Manager.getLanguage("loadingMap",this.bundle))
        this.mapMgr.loadMap(mapID, (data) => {
            if (data) {
                this.reset();
            }
        }, (finish, total) => {
            this.view.updateLoadingProgress(finish, total);
        });
    }
}