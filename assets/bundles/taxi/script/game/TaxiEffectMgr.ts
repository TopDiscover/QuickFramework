import { _decorator, Component, Node, Prefab, ParticleUtils, ParticleSystem, instantiate } from "cc";
import EventComponent from "../../../../scripts/framework/componects/EventComponent";
import { TaxiConstants } from "../data/TaxiConstants";
import { TaxiData } from "../data/TaxiData";
import { NodePool } from "../../../../scripts/framework/core/nodePool/NodePoolManager";
const { ccclass, property } = _decorator;

const EventName = TaxiConstants.EventName;
@ccclass("TaxiEffectMgr")
export class TaxiEffectMgr extends EventComponent {
    
    private brakeTrail: Prefab = null!;
    private coin: Prefab = null!;

    private _followTarget: Node | null = null;
    private _currBraking: Node | null = null;
    private _coin: ParticleSystem | null = null;

    private _trailPool : NodePool = null!;

    protected addEvents(){
        super.addEvents();
        this.addEvent(EventName.START_BRAKING, this._startBraking);
        this.addEvent(EventName.END_BRAKING, this._endBraking);
        this.addEvent(EventName.SHOW_COIN, this._showCoin);
    }

    init(){
        this.brakeTrail = Manager.cache.get(TaxiData.bundle,"prefabs/effect/brakeTrail")?.data as Prefab;
        this.coin = Manager.cache.get(TaxiData.bundle,"prefabs/effect/coin")?.data as Prefab;
        this._trailPool = Manager.pool.createPool("TaxiEffectMgr_trailPool") as NodePool;
        this._trailPool.cloneNode = instantiate(this.brakeTrail);
    }

    clear(){
        Manager.pool.deletePool(this._trailPool);
    }

    public update() {
        if (this._currBraking && this._followTarget) {
            this._currBraking.setWorldPosition(this._followTarget.worldPosition);
        }
    }

    private _startBraking(...args:any[]) {
        const follow = this._followTarget = args[0] as Node;
        this._currBraking = this._trailPool.get() as Node;
        this._currBraking.setWorldPosition(follow.worldPosition);
        Manager.uiManager.root3D.addChild(this._currBraking);
        ParticleUtils.play(this._currBraking);
    }

    private _endBraking() {
        const currBraking = this._currBraking!;
        ParticleUtils.stop(currBraking);
        this.scheduleOnce(() => {
            this._trailPool.put(currBraking);
        }, 2);

        this._currBraking = null;
        this._followTarget = null;
    }

    private _showCoin(...args: any[]) {
        const pos = args[0];
        if(!this._coin){
            const coin = instantiate(this.coin) as Node;
            coin.setParent(this.node);
            this._coin = coin.getComponent(ParticleSystem);
        }

        this._coin!.node.setWorldPosition(pos);
        this._coin!.play();
    }
}
