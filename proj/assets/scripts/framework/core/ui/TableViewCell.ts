import { Component, _decorator } from "cc";

const { ccclass, property, menu } = _decorator;

const INVALID_INDEX = -1;
const DEFAULT_TYPE = 0;
export type CellType = number | string;
/**
 * @description TableView 的列表项
 */
@ccclass
@menu("QuickUI组件/TableViewCell")
export class TableViewCell extends Component {
    static INVALID_INDEX = INVALID_INDEX;
    view: TableView = null!;
    index: number = INVALID_INDEX;
    @property({ displayName: "Type", tooltip: "列表项类型" })
    type: CellType = DEFAULT_TYPE;
    reset() {
        this.index = INVALID_INDEX;
    }

    /**@description Cell初始化，在onLoad之前 */
    init() {

    }
}
