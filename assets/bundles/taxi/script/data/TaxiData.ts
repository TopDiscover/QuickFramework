import { GameData } from "../../../../scripts/framework/data/GameData";
import { TaxiConstants } from "./TaxiConstants";

interface IPlayerInfo {
    money: number,
    level: number,
}

/**@description 大厅数据 */
export class TaxiData extends GameData {
    
    static bundle = "taxi";

    /**@description 玩家信息 */
    private playerInfo: IPlayerInfo = { money: 0, level: 1 };

    curProgress = 0;
    maxProgress = 0;
    isTakeOver = true;
    /**@description 当前所有等级 */
    curLevel = 0;
    /**@description 当前赚得金币 */
    curMoney = 0;
    
    get level(){
        return this.playerInfo.level;
    }
    set level(v){
        this.playerInfo.level = v;
    }
    get money(){
        return this.playerInfo.money;
    }
    set money(v){
        this.playerInfo.money = v;
    }

    init() {
        const info = Manager.storage.getItem(TaxiConstants.PlayerConfigID);
        if ( info ){
            this.playerInfo = JSON.parse(info);
        }
        this.curLevel = this.level;
    }

    reset(maxProgress: number) {
        this.curProgress = 0;
        this.maxProgress = maxProgress;
        this.curMoney = 0;
    }

    public passLevel(rewardMoney: number){
        this.playerInfo.level ++;
        this.playerInfo.money += rewardMoney;
        this.savePlayerInfoToCache();
    }

    public savePlayerInfoToCache(){
        const data = JSON.stringify(this.playerInfo);
       Manager.storage.setItem(TaxiConstants.PlayerConfigID, data);
    }
}
