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

    private _datas: { content: string, index: number }[] = [];

    private _tableViewH: TableView = null;
    private _tableViewV: TableView = null;
    private _count = 0;

    updateCellData(view: TableView, cell: TestTableViewCell): void {
        cell.updateData(this._datas[cell.index]);
    }

    tableCellTypeAtIndex(view: TableView, index: number) {
        if (index % 2 == 0) {
            return 1;
        }
        return 2;
    }

    numberOfCellsInTableView(view: TableView): number {
        return this._datas.length;
    }

    private initData() {
        for (let i = 0; i <50; i++) {
            this._datas.push({ content: `cell${i}`, index: i });
        }
    }

    protected onLoad(): void {
        this.initData();
        let node = cc.find("Tableview", this.node);
        let view = node.getComponent(TableView);
        this._tableViewV = view;

        let eventHandler = new cc.Component.EventHandler;
        eventHandler.component = "TestTableView";
        eventHandler.target = this.node;
        eventHandler.handler = "onEvent";
        view.scrollEvents.push(eventHandler);
        view.delegate = this;
        view.reloadData();


        let nodeH = cc.find("TableviewH", this.node);
        let viewH = nodeH.getComponent(TableView);
        this._tableViewH = viewH;

        let eventHandlerH = new cc.Component.EventHandler;
        eventHandlerH.component = "TestTableView";
        eventHandlerH.target = this.node;
        eventHandlerH.handler = "onEvent";
        viewH.scrollEvents.push(eventHandlerH);
        viewH.delegate = this;
        viewH.reloadData();

        cc.find("op/front", this.node).on(cc.Node.EventType.TOUCH_END, this.onInsertFront, this, true);
        cc.find("op/end", this.node).on(cc.Node.EventType.TOUCH_END, this.onInsertEnd, this, true);
        cc.find("op/mid", this.node).on(cc.Node.EventType.TOUCH_END, this.onInsertMid, this, true);
        cc.find("op/to", this.node).on(cc.Node.EventType.TOUCH_END, this.onScrollTo, this, true);

    }

    private onInsertMid() {
        this._datas.splice(2, 0, { content: `Cell新${this._count}`, index: this._count })
        this._count++;
        this._tableViewH.insertCellAtIndex(2);
    }
    private onInsertEnd() {
        this._datas.push({ content: `Cell新${this._count}`, index: this._count })
        this._count++;
        this._tableViewH.insertCellAtIndex();
    }
    private onInsertFront() {
        this._datas.unshift({ content: `Cell新${this._count}`, index: this._count })
        this._count++;
        this._tableViewH.insertCellAtIndex(0);
    }

    private onScrollTo() {
        let index = 34;
        this._tableViewH.scrollToIndex(index);
        this._tableViewV.scrollToIndex(index)
    }

    private onEvent(target: TableView, event: string) {
        // Log.d(event);
    }

}
