const { ccclass, property } = cc._decorator;

const INVALID_INDEX = -1;
const DEFAULT_TYPE = 0;
export type CellType = number | string;
/**
 * @description TableView 的列表项
 */
 @ccclass
 export class TableViewCell extends cc.Component{
    static INVALID_INDEX = INVALID_INDEX;
    view : TableView = null!;
    index : number = INVALID_INDEX;
    @property({displayName : "Type" , tooltip : "列表项类型"})
    type : CellType = DEFAULT_TYPE;
    /**@description 是否需要刷新数据 */
    isDoUpdate = true;
    reset(){
        this.index = INVALID_INDEX;
    }

    protected onLoad(): void {
        if ( this.view && this.isDoUpdate ){
            this.view.updateCellData(this);
            this.isDoUpdate = false;
        }
    }

    protected onDisable(): void {
        if ( this.view && this.isDoUpdate ){
            this.view.updateCellData(this);
            this.isDoUpdate = false;
        }
    }
}
