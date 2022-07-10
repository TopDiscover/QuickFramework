// Learn TypeScript:
//  - https://docs.cocos.com/creator/manual/en/scripting/typescript.html
// Learn Attribute:
//  - https://docs.cocos.com/creator/manual/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - https://docs.cocos.com/creator/manual/en/scripting/life-cycle-callbacks.html

import TableView, { TableViewDelegate } from "../../../scripts/framework/core/ui/TableView";
import TestTableViewCell, { CellData } from "./TestTableViewCell";

const { ccclass, property } = cc._decorator;

@ccclass
export default class TestTableView extends cc.Component implements TableViewDelegate {

    private _datas: CellData[] = [];

    private _tableViewH: TableView = null;
    private _tableViewV: TableView = null;
    private _count = 0;
    protected horizontal = false;
    protected vertical = true;

    protected getType( index : number ){
        return index % 2 == 0  ? 1 : 2;
    }

    updateCellData(view: TableView, cell: TestTableViewCell): void {
        cell.updateData(this._datas[cell.index]);
    }

    tableCellTypeAtIndex(view: TableView, index: number) {
       return this._datas[index].type;
    }

    numberOfCellsInTableView(view: TableView): number {
        return this._datas.length;
    }

    tableDebug(view: TableView): void {
        Log.d(`------------------ 当前原始数据 ------------------`)
        this._datas.forEach((v,i,arr)=>{
            Log.d(`[${i}] type : ${v.type} , content : ${v.content}`);
        })
    }

    private initData() {
        for (let i = 0; i <5; i++) {
            this._datas.push({ content: `cell${i}`, type : this.getType(i) });
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
        node.active = this.vertical;
        this.vertical && view.reloadData();


        let nodeH = cc.find("TableviewH", this.node);
        let viewH = nodeH.getComponent(TableView);
        this._tableViewH = viewH;

        let eventHandlerH = new cc.Component.EventHandler;
        eventHandlerH.component = "TestTableView";
        eventHandlerH.target = this.node;
        eventHandlerH.handler = "onEvent";
        viewH.scrollEvents.push(eventHandlerH);
        viewH.delegate = this;
        nodeH.active = this.horizontal;
        this.horizontal && viewH.reloadData();

        cc.find("op/front", this.node).on(cc.Node.EventType.TOUCH_END, this.onInsertFront, this, true);
        cc.find("op/dfront", this.node).on(cc.Node.EventType.TOUCH_END, this.onDeleteFront, this, true);
        cc.find("op/end", this.node).on(cc.Node.EventType.TOUCH_END, this.onInsertEnd, this, true);
        cc.find("op/dend", this.node).on(cc.Node.EventType.TOUCH_END, this.onDeleteEnd, this, true);
        cc.find("op/mid", this.node).on(cc.Node.EventType.TOUCH_END, this.onInsertMid, this, true);
        cc.find("op/dmid", this.node).on(cc.Node.EventType.TOUCH_END, this.onDeleteMid, this, true);
        cc.find("op/to", this.node).on(cc.Node.EventType.TOUCH_END, this.onScrollTo, this, true);

    }

    private getNewType( index : number ){
        let type = 1;
        if ( index >=0 && index < this._datas.length && this._datas[index].type == 1 ){
            type = 2;
        }
        return type;
    }

    private get time(){
        return 1;
    }

    private onInsertMid() {
        let index = 2;
        this._datas.splice(index, 0, { content: `Cell新${this._count}`, type : this.getNewType(index) })
        this._count++;
        this.horizontal && this._tableViewH.insertCellAtIndex(index);
        this.vertical && this._tableViewV.insertCellAtIndex(index);
    }
    private onInsertEnd() {
        let index = this._datas.length-1;
        this._datas.push({ content: `Cell新${this._count}`, type : this.getNewType(index) })
        this._count++;
        this.horizontal && this._tableViewH.insertCellAtIndex(index);
        this.vertical && this._tableViewV.insertCellAtIndex(index);
    }
    private onInsertFront() {
        let index = 0;
        this._datas.unshift({ content: `Cell新${this._count}`, type : this.getNewType(index) })
        this._count++;
        this.horizontal && this._tableViewH.insertCellAtIndex(index);
        this.vertical && this._tableViewV.insertCellAtIndex(index);
    }

    private onDeleteMid() {
        let index = 2;
        this._datas.splice(index,1);
        this.horizontal && this._tableViewH.removeCellAtIndex(index,this.time);
        this.vertical && this._tableViewV.removeCellAtIndex(index,this.time);
    }
    private onDeleteEnd() {
        let index = this._datas.length-1;
        this._datas.splice(index,1);
        this.horizontal && this._tableViewH.removeCellAtIndex(index,this.time);
        this.vertical && this._tableViewV.removeCellAtIndex(index,this.time);
    }
    private onDeleteFront() {
        let index = 0;
        this._datas.splice(index,1);
        this.horizontal && this._tableViewH.removeCellAtIndex(index,this.time);
        this.vertical && this._tableViewV.removeCellAtIndex(index,this.time);
    }

    private onScrollTo() {
        let index = 5;
        this.horizontal && this._tableViewH.scrollToIndex(index,this.time);
        this.vertical && this._tableViewV.scrollToIndex(index,this.time)
    }

    private onEvent(target: TableView, event: string) {
        if ( event == TableView.EventType.TOUCH_UP ){
            Log.d(event)
        }
    }

}
