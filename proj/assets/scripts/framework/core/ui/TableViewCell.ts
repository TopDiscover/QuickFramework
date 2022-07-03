const { ccclass, property } = cc._decorator;

const INVALID_INDEX = -1;
/**
 * @description TableView 的列表项
 */
 @ccclass
 export class TableViewCell extends cc.Component{
    static INVALID_INDEX = INVALID_INDEX;
    index : number = INVALID_INDEX;
    @property({displayName : "Type" , tooltip : "列表项类型"})
    type ?: number | string = 0;
    reset(){
        this.index = INVALID_INDEX;
    }
}
