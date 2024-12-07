import { js } from "cc";
import { EventProcessor } from "../event/EventProcessor";
import { Macro } from "../../defines/Macros";

export class Logic extends EventProcessor {
    /**@description 所属模块,管理器设置 */
    static module = Macro.UNKNOWN;
    /**@description 所属模块,管理器设置 */
    module = Macro.UNKNOWN;

    protected _view: UIView = null!;

    get view(){
        return this._view;
    }

    /**@description 重置游戏逻辑 */
    reset(view: UIView) {

    }

    onLoad(view: UIView): void {
        this._view = view;
        super.onLoad(view);
    }
    update(dt: number): void { }

    destory(...args: any[]): void {
        this.onDestroy();
    }

    debug(){
        Log.d(`${this.module} : ${js.getClassName(this)}`);
    }

    /**
     * @description 进入指定Bundle
     * @param bundle Bundle名
     * @param userData 用户自定义数据
     */
    enterBundle( bundle : BUNDLE_TYPE , userData ?: EntryUserData){
        App.entryManager.enterBundle(bundle , userData);
    }

    /**
     * @description 返回上一场景
     * @param userData 用户自定义数据
     */
    backBundle(userData?:any){
        App.entryManager.backBundle(userData);
    }
}