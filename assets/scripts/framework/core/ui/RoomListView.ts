import { _decorator } from "cc";
import UIView from "./UIView";

const {ccclass, property} = _decorator;

@ccclass
export default class RoomListView extends UIView {

    onLoad(){
        //调用进入后台重连的时间
        super.onLoad();

        //通用公共网络重连组件添加

        //进入场景完成，即onLoad最后一行  必须发进入完成事件
        // dispatchEnterComplete( {type : Logic.Type.GAME,views:[this],data : GameName.likuiby });
    }
}
