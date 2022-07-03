// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import { TableViewCell } from "../../../scripts/framework/core/ui/TableViewCell";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestTableViewCell extends TableViewCell {

    private _label : cc.Label = null;

    protected onLoad(): void {
        this._label = cc.find("label",this.node).getComponent(cc.Label);
        super.onLoad();
    }

    setString(v : string){
        this._label.string = v;
    }
}
