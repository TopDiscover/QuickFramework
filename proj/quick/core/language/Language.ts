import { Macro } from "../../defines/Macros";
import { isValid, sys } from "cc";
import { LanguageDelegate } from "./LanguageDelegate";
const LANG_KEY: string = "using_language";

export class Language implements ISingleton {
    isResident?: boolean = true;
    static module: string = "【语言包】";
    module: string = null!;
    /**@description 支持多语言切换组件 */
    private _components: Language.LanguageComponent[] = [];
    /**@description 总语言包数据 */
    private _data: Language.Data = { language: Macro.UNKNOWN};
    /**@description 语言包数据代理 */
    private delegates: Map<string, LanguageDelegate> = new Map();

    public addDelegate(delegate: LanguageDelegate | null) {
        if (!delegate) return;
        this.delegates.set(delegate.bundle, delegate);
        this.updateData(this.getLanguage());
    }

    private updateData(language: string) {
        this._data.language = language;
        this.delegates.forEach((delegate, index, source) => {
            this._data = delegate.merge(language, this._data);
        });
    }

    public removeDelegate(delegate: LanguageDelegate | null) {
        if (!delegate) return;
        let result = this.delegates.delete(delegate.bundle);
        if (result) {
            if (delegate.bundle != Macro.BUNDLE_RESOURCES) {
                //主包的语言不释放
                delete this._data[delegate.bundle];
            }
        }
    }

    /**
     * @description 改变语言包
     * @param language 语言包类型
     */
    public change(language: string) {
        if (this.delegates.size <= 0) {
            //请先设置代理
            return;
        }
        if (this._data && this._data.language == language) {
            //当前有语言包数据 相同语言包，不再进行设置
            return;
        }
        this._data.language = language;
        if (Macro.ENABLE_CHANGE_LANGUAGE) {
            //先更新所有数据
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.merge(language, this._data);
            });
            //更新带有语言包类型的所有Label
            this.onChangeLanguage();
        } else {
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.merge(this.getLanguage(), this._data);
            });
        }
        Log.d(this.module, `当前语言:${this._data.language}`);
        App.storage.setItem(LANG_KEY, this._data.language);
    }

    public get(args: (string | number)[]) {
        let result: any = "";
        do {
            if (!!!args) break;
            if (args.length < 1) break;
            let keyString = args[0];
            if (typeof keyString != "string") {
                Log.e("key error");
                break;
            }
            if (keyString.indexOf(Macro.USING_LAN_KEY) > -1) {

                let keys = keyString.split(".");
                if (keys.length < 2) {
                    Log.e("key error");
                    break;
                }
                keys.shift();//删除掉i18n.的头部
                args.shift();
                let data : any = null;
                while(keys.length > 0 ){
                    let key = keys.shift();
                    if ( key ){
                        if ( !data ){
                            data = this._data[key];
                        }else{
                            data = data[key];
                        }
                    }else{
                        Log.e(`语言包不存在 : ${keyString}`);
                        result = "";
                        break;
                    }
                }
                if (typeof (data) == "string") {
                    result = String.format(data, args);
                } else {
                    result = data;
                }

            } else {
                //已经是取出的正确语言包，直接格式化
                let data = args.shift();
                if (typeof (data) == "string") {
                    return String.format(data, args);
                } else {
                    result = data;
                }
            }
        } while (0);
        return result;
    }

    /**@description 获取语言包名 */
    public getLanguage() {
        return App.storage.getItem(LANG_KEY, sys.Language.CHINESE);
    }

    /**
     * @description 添加支持多语言的组件
     * @param component 
     */
    public add(component: Language.LanguageComponent) {
        if (this._components.indexOf(component) == -1) {
            this._components.push(component);
        }
    }

    /**
     * @description 移除支持多语言的组件
     * @param component 
     */
    public remove(component: Language.LanguageComponent) {
        let index = this._components.indexOf(component)
        if (index >= 0) {
            this._components.splice(index, 1);
        }
    }

    /**
     * @description 语言包发生更新，变更语言包Label
     */
    public onChangeLanguage() {
        this._components.forEach(v => {
            if (isValid(v)) {
                v.forceDoLayout();
            }
        })
    }
}