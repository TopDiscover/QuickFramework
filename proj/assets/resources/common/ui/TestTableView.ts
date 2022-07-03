// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TableView, { TableViewDelegate } from "../../../scripts/framework/core/ui/TableView";
import { TableViewCell } from "../../../scripts/framework/core/ui/TableViewCell";

const {ccclass, property} = cc._decorator;

@ccclass
export default class TestTableView extends cc.Component implements TableViewDelegate{
    updateCellData(view: TableView, cell: TableViewCell): void {
        
    }
    tableCellSizeForIndex(view: TableView, index: number): string | number {
        if ( index % 2 == 0 ){
            return 1;
        }
        return 2;
    }
    tableCellAtIndex(view: TableView, index: number): string | number {
        if ( index % 2 == 0 ){
            return 1;
        }
        return 2;
    }
   
    numberOfCellsInTableView(view: TableView): number {
        return 50;
    }

   
    protected onLoad(): void {
        let view = this.node.getComponent(TableView);

        let eventHandler = new cc.Component.EventHandler;
        eventHandler.component = "TestTableView";
        eventHandler.target = this.node;
        eventHandler.handler = "onEvent";
        view.scrollEvents.push(eventHandler);

    }

    private onEvent( target : TableView , event : string ){
        // Log.d(event);
    }

}
