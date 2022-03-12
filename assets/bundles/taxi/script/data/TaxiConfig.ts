import { _decorator, Component, Node } from "cc";
import { TaxiConstants } from "./TaxiConstants";
const { ccclass, property } = _decorator;

@ccclass("TaxiConfig")
export class TaxiConfig {
    private _jsonData : {[key : string] : any} = {};
    private _markSave = false;

    static _instance: TaxiConfig = null!;
    public static instance() {
        if (!this._instance) {
            this._instance = new TaxiConfig();
        }

        return this._instance;
    }

    public init(){
        const localStorage = Manager.localStorage.getItem(TaxiConstants.GameConfigID);
        if(localStorage){
            this._jsonData = JSON.parse(localStorage);
        }

        setInterval(this._scheduleSave.bind(this), 500);
    }

    public getConfigData(key: string){
        const data = this._jsonData[key];
        return data || '';
    }

    public setConfigData(key: string, value: string){
        this._jsonData[key] = value;
        this._markSave = true;
    }

    private _scheduleSave(){
        if(!this._markSave){
            return;
        }

        const data = JSON.stringify(this._jsonData);
        Manager.localStorage.setItem(TaxiConstants.GameConfigID, data);
        this._markSave = false;
    }
}
