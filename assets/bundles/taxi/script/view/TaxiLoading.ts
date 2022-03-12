
import { _decorator, Component, Node } from 'cc';
import UIView from '../../../../scripts/framework/core/ui/UIView';
const { ccclass, property } = _decorator;
 
@ccclass('TaxiLoading')
export class TaxiLoading extends UIView {
    static getPrefabUrl(){
        return "prefabs/ui/TaxiLoading";
    }
}

