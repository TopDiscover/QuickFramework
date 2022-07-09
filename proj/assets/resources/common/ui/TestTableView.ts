// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TableView, { TableViewDelegate } from "../../../scripts/framework/core/ui/TableView";
import TestTableViewCell from "./TestTableViewCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestTableView extends cc.Component implements TableViewDelegate {
    updateCellData(view: TableView, cell: TestTableViewCell): void {
        cell.setString(`Cell ${cell.index}`);
    }

    tableCellTypeAtIndex(view: TableView, index: number) {
        if (index % 2 == 0) {
            return 1;
        }
        return 2;
    }

    numberOfCellsInTableView(view: TableView): number {
        return 500;
    }


    protected onLoad(): void {

        // let node = cc.find("Tableview", this.node);

        // let view = node.getComponent(TableView);

        // let eventHandler = new cc.Component.EventHandler;
        // eventHandler.component = "TestTableView";
        // eventHandler.target = this.node;
        // eventHandler.handler = "onEvent";
        // view.scrollEvents.push(eventHandler);
        // view.delegate = this;
        // view.reloadData();


        let nodeH = cc.find("TableviewH", this.node);

        let viewH = nodeH.getComponent(TableView);

        let eventHandlerH = new cc.Component.EventHandler;
        eventHandlerH.component = "TestTableView";
        eventHandlerH.target = this.node;
        eventHandlerH.handler = "onEvent";
        viewH.scrollEvents.push(eventHandlerH);
        viewH.delegate = this;
        viewH.reloadData();

    }

    private onEvent(target: TableView, event: string) {
        // Log.d(event);
    }

}
