
import { _decorator, Component, Node } from 'cc';
import GameView from '../../../../scripts/framework/core/ui/GameView';
import { TaxiLogic } from '../game/TaxiLogic';
const { ccclass, property } = _decorator;
 
@ccclass('TaxiGameView')
export class TaxiGameView extends GameView {

    static logicType = TaxiLogic;
    static getPrefabUrl(){
        return "prefabs/ui/TaxiGameView";
    }
}
