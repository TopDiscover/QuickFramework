import { SingletonT } from "../../utils/SingletonT";
import { Logic } from "./Logic";
import UIView from "../ui/UIView";

export class LogicManager extends SingletonT<Logic> implements ISingleton {
    static module: string = "【逻辑管理器】";
    module: string = null!;
    isResident?: boolean = true;

    /**
     * @description 返回Logic
     * @param param UIView 实例 | logic类型 | logic 的module名,如果传入bundle,isCreate 无效
     * @param isCreate 找不到数据时，是否创建，默认为不创建
     */
    get<T extends Logic>(param: ModuleClass<T> | string | UIView, isCreate ?: boolean):T | null {
        if ( isCreate == undefined ){
            isCreate = false;
        }
        if ( typeof param == "string"){
            return super.get(param as any,isCreate);
        } else if ( param instanceof UIView ){
            let view = param as any;
            let viewType = App.uiManager.getViewType(view)
            if( viewType ){
                if( viewType.logicType ){
                    viewType.logicType.module = view.bundle as string;
                    let logic =  super.get(viewType.logicType,isCreate);
                    return logic as any;
                }else{
                    CC_DEBUG && Log.w(`${cc.js.getClassName(viewType)}未指定logictype`);
                }
            }else{
                CC_DEBUG && Log.w(`无法找到UIView的类型!`);
            }
            return null;
        } else{
            return super.get(param as any,isCreate);
        }
    }
}