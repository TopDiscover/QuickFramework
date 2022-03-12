import { _decorator, Component, Node } from "cc";
import { TaxiConfig } from "./TaxiConfig";
import { TaxiConstants } from "./TaxiConstants";
const { ccclass, property } = _decorator;

@ccclass("RunTimeData")
export class RunTimeData {
    public playerData: PlayerData = null!;
    static _instance: RunTimeData = null!;
    public static instance() {
        if (!this._instance) {
            this._instance = new RunTimeData();
        }

        return this._instance;
    }

    constructor() {
        this.playerData = PlayerData.instance();
    }

    public currProgress = 0;
    public maxProgress = 0;
    public isTakeOver = true;
    public money = 0;
    get currLevel() {
        return this.playerData.playerInfo.level;
    }

    get totalMoney() {
        return this.playerData.playerInfo.money;
    }
}

interface IPlayerInfo {
    money: number,
    level: number,
}

@ccclass("PlayerData")
export class PlayerData {
    public playerInfo: IPlayerInfo = { money: 0, level: 1 };

    static _instance: PlayerData = null!;
    public static instance() {
        if (!this._instance) {
            this._instance = new PlayerData();
        }

        return this._instance;
    }

    public loadFromCache(){
        const info = TaxiConfig.instance().getConfigData(TaxiConstants.PlayerConfigID);
        if(info){
            this.playerInfo = JSON.parse(info);
        }
    }

    public passLevel(rewardMoney: number){
        this.playerInfo.level ++;
        this.playerInfo.money += rewardMoney;
        this.savePlayerInfoToCache();
    }

    public savePlayerInfoToCache(){
        const data = JSON.stringify(this.playerInfo);
        TaxiConfig.instance().setConfigData(TaxiConstants.PlayerConfigID, data);
    }
}
