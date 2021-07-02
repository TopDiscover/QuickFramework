import { js } from "cc";
import { ILogicManager } from "../interface/ILogicManager";
import { INetManager } from "../interface/INetManager";


class RegisterTypeManager {
    logicTypes: any[] = [];
    logicMgr : ILogicManager | null = null;
    /**@description 注册逻辑处理器类型 */
    registerLogicType(logicType: any) {
        if( this.logicMgr ){
            this.logicMgr.push(logicType);
            return;
        }
        if (this.logicTypes.indexOf(logicType) != -1) {
            error(`重复添加${js.getClassName(logicType)}`);
            return;
        }
        this.logicTypes.push(logicType);
    }

    netManager : INetManager | null = null;
    netTypes : any[] = []
    /**@description 注册全局网络类型 全局常驻网络组件管理器,注册到该管理器的网络组件会跟游戏的生命周期一致 */
    registerNetType(type: any) {
        if( this.netManager ){
            this.netManager.register(type);
            return;
        }
        if (this.netTypes.indexOf(type) != -1) {
            error(`重复添加${js.getClassName(type)}`);
            return;
        }
        this.netTypes.push(type);
    }

    hallNetManager : INetManager | null = null;
    hallNetTypes : any []= [];
    /**@description 注册大厅网络类型 大厅的网络控制器组件管理器，注册到该管理器的网络组件，除登录界面外，都会被移除掉*/
    registerHallNetType(type: any) {
        if( this.hallNetManager ){
            this.hallNetManager.register(type);
            return;
        }
        if (this.hallNetTypes.indexOf(type) != -1) {
            error(`重复添加${js.getClassName(type)}`);
            return;
        }
        this.hallNetTypes.push(type);
    }

}

export const registerTypeManager = new RegisterTypeManager();

