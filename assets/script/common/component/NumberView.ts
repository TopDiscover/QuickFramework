/*
 * @Author: henry
 * @Date: 2020-11-26 20:59:30
 * @LastEditors: henry
 * @LastEditTime: 2020-11-26 21:39:04
 * @Descripttion: 
 */
import { BUNDLE_RESOURCES } from "../../framework/base/Defines";
import UIView from "../../framework/ui/UIView";

const {ccclass, property} = cc._decorator;

@ccclass
export default class NumberView extends UIView {

    numj: cc.Node = null;

    static getPrefabUrl(){
        return "common/prefabs/NumberView"
    }

    onLoad(){
        super.onLoad();
        
        this.numj = cc.find("numj", this.node);
        let j = this.numj.getComponent(cc.Sprite);
        j.loadImage({url: 'common/texture/peek_card_view_card_number_J_red', view: this, bundle:BUNDLE_RESOURCES});
        this.numj.on(cc.Node.EventType.TOUCH_END, (t) => {
            this.close();
        });
    }
}