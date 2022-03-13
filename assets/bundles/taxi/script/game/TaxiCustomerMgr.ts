import { _decorator, Component, Node, Vec3, Animation, Prefab, instantiate } from "cc";
import EventComponent from "../../../../scripts/framework/componects/EventComponent";
import { TaxiConstants } from "../data/TaxiConstants";
import { TaxiData } from "../data/TaxiData";
const { ccclass, property } = _decorator;

const EventName = TaxiConstants.EventName;
const _tempVec = new Vec3();

@ccclass("TaxiCustomerMgr")
export class TaxiCustomerMgr extends EventComponent {
    
    private customers: Node[] = [];
    
    private walkTime = 0.5;

    private get data(){
        return Manager.dataCenter.get(TaxiData) as TaxiData;
    }

    init(){
        let root = Manager.uiManager.root3D;
        for ( let i = 1 ; i <=2 ; i++ ){
            let url = `prefabs/customer/customer0${i}`;
            let data = Manager.cacheManager.get(this.data.bundle,url);
            if ( data && data.data instanceof Prefab ){
                let node = instantiate(data.data);
                root.addChild(node);
                this.customers.push(node);
                node.active = false;
            }
        }
    }

    private _currCustomer: Node | null = null;
    private _startPos = new Vec3();
    private _endPos = new Vec3();
    private _inTheOrder = false;
    private _deltaTime = 0;
    private _state = TaxiConstants.CustomerState.NONE;
    private _customerID = -1;

    protected addEvents(){
        super.addEvents();
        this.addEvent(EventName.GREETING, this._greetingCustomer);
        this.addEvent(EventName.GOODBYE, this._takingCustomer);
    }

    public update(dt: number){
        if(this._inTheOrder){
            this._deltaTime += dt;
            if (this._deltaTime > this.walkTime) {
                this._deltaTime = 0;
                this._inTheOrder = false;
                this._currCustomer!.active = false;
                if (this._state === TaxiConstants.CustomerState.GOODBYE) {
                    this._currCustomer = null;
                }

                dispatch(EventName.FINISHED_WALK);
                if (this._state === TaxiConstants.CustomerState.GREETING) {
                    dispatch(EventName.PLAY_SOUND,TaxiConstants.AudioSource.INCAR);
                }

                dispatch(TaxiConstants.EventName.SHOW_GUIDE, true);
            } else {
                Vec3.lerp(_tempVec, this._startPos, this._endPos, this._deltaTime / this.walkTime);
                this._currCustomer!.setWorldPosition(_tempVec);
            }
        }
    }

    private _greetingCustomer(...args: any[]){
        this._customerID = Math.floor(Math.random() * this.customers.length);
        this._currCustomer = this.customers[this._customerID];
        this._state = TaxiConstants.CustomerState.GREETING;
        this._inTheOrder = true;
        if (!this._currCustomer) {
            return;
        }

        const carPos = args[0];
        const direction = args[1];
        Vec3.multiplyScalar(this._startPos, direction, 1.4);
        this._startPos.add(carPos);
        Vec3.multiplyScalar(this._endPos, direction, 0.5);
        this._endPos.add(carPos);

        this._currCustomer.setWorldPosition(this._startPos);
        this._currCustomer.active = true;

        if (direction.x !== 0) {
            if (direction.x > 0) {
                this._currCustomer.eulerAngles = new Vec3(0, -90, 0);
            } else {
                this._currCustomer.eulerAngles = new Vec3(0, 90, 0);
            }
        } else {
            if (direction.z > 0) {
                this._currCustomer.eulerAngles = new Vec3(0, 180, 0);
            } else {
                this._currCustomer.eulerAngles = new Vec3();
            }
        }

        const animComp = this._currCustomer.getComponent(Animation)!;
        animComp.play('walk');

        dispatch(EventName.SHOW_TALK, this._customerID);
        dispatch(EventName.PLAY_SOUND,TaxiConstants.AudioSource.NEWORDER);
    }

    private _takingCustomer(...args: any[]) {
        this._state = TaxiConstants.CustomerState.GOODBYE;
        this._inTheOrder = true;

        const carPos = args[0];
        const direction = args[1];
        Vec3.multiplyScalar(this._startPos, direction, 0.5);
        this._startPos.add(carPos);
        Vec3.multiplyScalar(this._endPos, direction, 1.4);
        this._endPos.add(carPos);

        this._currCustomer!.setWorldPosition(this._startPos);
        this._currCustomer!.active = true;
        const money = Math.floor(30 + (this.data.level / 2) + (Math.random() * 10));
        this.data.money += money;

        if (direction.x !== 0) {
            if (direction.x > 0) {
                this._currCustomer!.eulerAngles = new Vec3(0, 90, 0);
            } else {
                this._currCustomer!.eulerAngles = new Vec3(0, -90, 0);
            }
        } else {
            if (direction.z > 0) {
                this._currCustomer!.eulerAngles = new Vec3();
            } else {
                this._currCustomer!.eulerAngles = new Vec3(0, 180, 0);
            }
        }

        const animComp = this._currCustomer!.getComponent(Animation)!;
        animComp.play('walk');
        dispatch(EventName.PLAY_SOUND,TaxiConstants.AudioSource.GETMONEY);

        dispatch(EventName.SHOW_TALK, this._customerID);
        this._customerID = -1;
    }
}
