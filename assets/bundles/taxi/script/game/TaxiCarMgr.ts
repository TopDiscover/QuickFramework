import { _decorator, Component, Node, loader, Prefab, Vec3, macro, instantiate } from "cc";
import { TaxiCar } from "./TaxiCar";
import { TaxiRoadPoint } from "./TaxiRoadPoint";
import { TaxiConstants } from "../data/TaxiConstants";
import EventComponent from "../../../../scripts/framework/componects/EventComponent";
import { NodePool } from "../../../../scripts/framework/core/nodePool/NodePoolManager";
import { TaxiData } from "../data/TaxiData";
const { ccclass, property } = _decorator;

const MAIN_CAR = "car101";

@ccclass("TaxiCarMgr")
export class TaxiCarMgr extends EventComponent {
    public mainCar: TaxiCar = null!;
    private _camera : Node = null!;
    public get camera(){
        if ( !this._camera ){
            let origin = Manager.uiManager.camera3d.node;
            origin.active = false;
            this._camera = instantiate(Manager.uiManager.camera3d.node);
            this._camera.active = true;
        }
        return this._camera;
    };
    
    private cameraPos = new Vec3(0, 8, 8);
    
    private cameraRotation = -45;

    private _currPath: Node[] = [];
    private _aiCars: TaxiCar[] = [];
    
    private pools : Map<string,NodePool> = new Map();

    protected addEvents(){
        super.addEvents();
        this.addEvent(TaxiConstants.EventName.GAME_START,this._gameStart);
        this.addEvent(TaxiConstants.EventName.GAME_OVER,this._gameOver);
    }

    public reset(points: Node[]) {
        if (points.length <= 0) {
            console.warn('There is no points in this map');
            return;
        }

        this._recycleAllAICar();
        this._currPath = points;
        this._createMainCar(points[0]);
    }

    public clear(){
        this.pools.forEach(v=>{
            v.clear();
        })
    }

    public controlMoving(isRunning = true) {
        if (isRunning) {
            dispatch(TaxiConstants.EventName.SHOW_GUIDE, false);
            this.mainCar.startRunning();
        } else {
            this.mainCar.stopRunning();
        }
    }

    private _createMainCar(point: Node) {
        let name = MAIN_CAR;
        if ( !this.pools.has(name) ){
            let pool = Manager.nodePoolManager.createPool(name) as NodePool;
            let data = Manager.cacheManager.get(TaxiData.bundle,`prefabs/car/${name}`)?.data;
            if ( data instanceof Prefab ){
                let node = instantiate(data);
                pool.cloneNode = node;
            }
            this.pools.set(name,pool)
        }

        let node = this.pools.get(name)?.get();
        if ( !node ) return
        Manager.uiManager.root3D.addChild(node)
        let car = node.getComponent(TaxiCar);
        if (car) {
            this.mainCar = car;
            this.mainCar.setEntry(point, true);
            this.mainCar.setCamera(this.camera, this.cameraPos, this.cameraRotation);
            dispatch(TaxiConstants.EventName.MAIN_CAR_INI_SUCCUSS)
        }
    }

    private _gameStart() {
        this.mainCar.startWithMinSpeed();
        this.schedule(this._checkCarIsCloser, 0.2, macro.REPEAT_FOREVER);
        this._startSchedule();
    }

    private _gameOver() {
        this._stopSchedule();
        this.camera.setParent(this.node.parent, true);
        for (let i = 0; i < this._aiCars.length; i++) {
            const car = this._aiCars[i];
            car.stopImmediately();
        }

        this.unschedule(this._checkCarIsCloser);
    }

    private _checkCarIsCloser() {
        const mainCarPos = this.mainCar.node.worldPosition;
        for (let i = 0; i < this._aiCars.length; i++) {
            const aiCar = this._aiCars[i];
            const pos = aiCar.node.worldPosition;
            if (Math.abs(pos.x - mainCarPos.x) <= 2 && Math.abs(pos.z - mainCarPos.z) <= 2) {
                this.mainCar.tooting();
                break;
            }
        }
    }

    private _startSchedule() {
        for (let i = 1; i < this._currPath.length; i++) {
            const node = this._currPath[i];
            const roadPoint = node.getComponent(TaxiRoadPoint)!;
            roadPoint.startSchedule(this._createEnemy.bind(this));
        }
    }

    private _stopSchedule() {
        for (let i = 1; i < this._currPath.length; i++) {
            const node = this._currPath[i];
            const roadPoint = node.getComponent(TaxiRoadPoint)!;
            roadPoint.stopSchedule();
        }
    }

    private _createEnemy(road: TaxiRoadPoint, carID: string) {
        let name = `car${carID}`;
        if ( !this.pools.has(name) ){
            let pool = Manager.nodePoolManager.createPool(name) as NodePool;
            let data = Manager.cacheManager.get(TaxiData.bundle,`prefabs/car/${name}`)?.data;
            if ( data instanceof Prefab ){
                let node = instantiate(data);
                pool.cloneNode = node;
            }
            this.pools.set(name,pool)
        }

        let node = this.pools.get(name)?.get();
        if ( !node ) return
        Manager.uiManager.root3D.addChild(node)
        let car = node.getComponent(TaxiCar);
        if (car) {
            this._aiCars.push(car);
            car.setEntry(road.node);
            car.maxSpeed = road.speed;
            car.startRunning();
            car.moveAfterFinished(this._recycleAICar.bind(this));
        }
    }

    private _recycleAICar(car: TaxiCar) {
        const index = this._aiCars.indexOf(car);
        if (index >= 0) {
            if ( this.pools.has(car.node.name) ){
                this.pools.get(car.node.name)?.put(car.node);
            }
            this._aiCars.splice(index, 1);
        }
    }

    private _recycleAllAICar() {
        for (let i = 0; i < this._aiCars.length; i++) {
            const car = this._aiCars[i];
            if ( this.pools.has(car.node.name) ){
                this.pools.get(car.node.name)?.put(car.node);
            }
        }
        this._aiCars = [];
        
        if ( this.mainCar && this.pools.has(MAIN_CAR) ){
            this.pools.get(MAIN_CAR)?.put(this.mainCar.node);
            this.mainCar = null as any;
        }
    }
}
