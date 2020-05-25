import { Logic } from "../base/Logic";
import { LogicEvent, LogicEventData, LogicType } from "../event/LogicEvent";
import { getSingleton } from "../../framework/base/Singleton";
import { eventDispatcher } from "../../framework/event/EventDispatcher";
import { uiManager } from "../../framework/base/UIManager";

export function logicManager(){
    return getSingleton(LogicManager);
}

class LogicManager{
    
    private _logTag = `[LogicManager]`;
    private static _instance: LogicManager = null;
    public static Instance() { return this._instance || (this._instance = new LogicManager()); }

    private _logics : Logic[] = [];
    private _logicTypes = [];
    private node : cc.Node = null;

    public push( logicType : any ){
        for ( let i = 0 ; i < this._logicTypes.length ; i++ ){
            if ( this._logicTypes[i] == logicType ){
                cc.error(this._logTag, `重复添加${cc.js.getClassName(logicType)}`);
                return;
            }
        }
        if ( this.node ){
            //已经进入过onLoad,这里需要单独的进行初始化
            let logic : Logic = new logicType;
            logic.init(this.node);
            this._logics.push(logic);
            logic.onLoad();
        }else{
            this._logicTypes.push(logicType);
        }
    }

    public onLoad( node : cc.Node ){
        this.node = node;
        eventDispatcher().addEventListener(LogicEvent.ENTER_COMPLETE,this.onEnterComplete,this);
        if ( this._logics.length == 0 ){
            for ( let i = 0 ; i < this._logicTypes.length ; i++ ){
                let type = this._logicTypes[i];
                cc.log(this._logTag,`添加Logic : ${cc.js.getClassName(type)}`);
                let logic : Logic = new type;
                logic.init(node);
                this._logics.push( logic );
            }
        }

        this._logics.forEach((data : Logic)=>{
            data.onLoad();
        });
        
    }

    public onDestroy( node : cc.Node ){
        eventDispatcher().removeEventListener(LogicEvent.ENTER_COMPLETE,this);
        this._logics.forEach((data : Logic)=>{
            data.onDestroy();
        });
    }

    protected onEnterComplete(data: LogicEventData) {

        //房间列表会直接加在大厅上，不对界面进行关闭操作
        if ( data.type != LogicType.ROOM_LIST ){
            if (data && data.views && data.views.length > 0) {
                //关闭掉除排除项之外的所有界面
                uiManager().closeExcept(data.views);
            }
            for ( let i = 0 ; i < this._logics.length ; i++ ){
                let logic = this._logics[i];
                if ( logic ){
                    logic.onEnterComplete(data);
                }
            }
        }
    }
}
