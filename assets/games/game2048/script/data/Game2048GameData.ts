import { GameData } from "../../../../script/common/base/GameData";
import { getSingleton } from "../../../../script/framework/base/Singleton";
import { GAME2048_LAN_ZH } from "./Game2048LanguageZH";
import { i18n } from "../../../../script/common/language/LanguageImpl";
import { Manager } from "../../../../script/common/manager/Manager";
import Game2048GameView from "../view/Game2048GameView";
import Game2048Item from "../model/Game2048Item";

export namespace Game2048{

    export class Game2048GameData extends GameData {
       
        private static _instance: Game2048GameData = null;
        public static Instance() { return this._instance || (this._instance = new Game2048GameData()); }

        get bundle(){
            return "game2048"
        }

        /**@description 游戏GameView */
        get gameView() : Game2048GameView{
            return Manager.gameView as Game2048GameView;
        }

        onLanguageChange(){
            let lan = GAME2048_LAN_ZH;
            i18n[`${this.bundle}`] = {};
            i18n[`${this.bundle}`] = lan.data;
        }

        prefabs : cc.Node = null;

        /**@description 2048项 */
        get itemPrefab(){
            return this.prefabs.getChildByName("item");
        }

        private _socre : number = 0;
        /**@description 游戏分数 */
        public get socre(){
            return this._socre;
        }
        public set socre(value){
            this._socre = value;
            if( this.gameView ){
                this.gameView.updateScore(this._socre);
            }
        }

        /**@description 地图行列对应位置 */
        public positions : cc.Vec3[][] = [];

        /**@description item项缓存 */
        private _itemPool : cc.Node[] = [];
        public getItemCache(){
            if( this._itemPool.length > 0 ){
                return this._itemPool.shift()
            }
            let node = cc.instantiate(this.itemPrefab);
            node.addComponent(Game2048Item);
            return node;
        }
        public addItemCache( item : cc.Node ){
            item.removeFromParent(false);
            this._itemPool.push(item);
        }
        public clearItemCache() {
            for( let i = 0 ; i < this._itemPool.length ; i++ ){
                this._itemPool[i].destroy();
            }
            this._itemPool = [];
        }
    }

    /**@description 地图大小 */
    export const MAP_SIZE = 4

    export const gameData = getSingleton(Game2048GameData);
}

