import { Macro } from "../../defines/Macros";

const LANG_KEY: string = "using_language";

export class Language implements ISingleton{
    isResident?: boolean = true;
    static module: string = "【语言包】";
    module: string = null!;
    
    private _labels : cc.Label[] = [];
    private _data: Language.Data = { language: Macro.UNKNOWN };
    private delegates: Language.DataSourceDelegate[] = [];

    public addSourceDelegate(delegate: Language.DataSourceDelegate) {
        if (this.delegates.indexOf(delegate) == -1) {
            this.delegates.push(delegate);
            this.updateSource(this.getLanguage());
        }
    }

    private updateSource(language: string) {
        this._data.language = language;
        this.delegates.forEach((delegate, index, source) => {
            this._data = delegate.data(language,this._data);
        });
    }

    public removeSourceDelegate(delegate: Language.DataSourceDelegate) {
        let index = this.delegates.indexOf(delegate);
        if (index != -1) {
            this.delegates.splice(index, 1);
            let data: any = this._data;
            if (delegate.bundle != Macro.BUNDLE_RESOURCES && data[delegate.bundle]) {
                data[delegate.bundle] = {};
            }
        }
    }

    /**
     * @description 改变语言包
     * @param language 语言包类型
     */
    public change(language: string) {
        if (this.delegates.length <= 0) {
            //请先设置代理
            return;
        }
        if (this._data && this._data.language == language) {
            //当前有语言包数据 相同语言包，不再进行设置
            return;
        }
        this._data.language = language;
        if ( Macro.ENABLE_CHANGE_LANGUAGE ){
            //先更新所有数据
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.data(language,this._data);
            });
            //更新带有语言包类型的所有Label
            this.onChangeLanguage();
        } else {
            this.delegates.forEach((delegate, index, source) => {
                this._data = delegate.data(this.getLanguage(),this._data);
            });
        }
        Log.d(this.module,`当前语言:${this._data.language}`);
        Manager.storage.setItem(LANG_KEY, this._data.language);
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
                let data = (<any>this._data)[keys[0]];
                if (!data) {
                    Log.e(`语言包不存在 : ${keyString}`);
                    break;
                }
                let i = 1;
                for (; i < keys.length; i++) {
                    if (data[keys[i]] == undefined) {
                        break;
                    }
                    data = data[keys[i]];
                }
                if (i != keys.length) {
                    Log.e(`语言包不存在 : ${keyString}`);
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
        return Manager.storage.getItem(LANG_KEY, cc.sys.LANGUAGE_CHINESE);
    }

    /**
     * @description 添加支持多语言的Label
     * @param label 
     */
    public addLabel( label : cc.Label ){
        if( this._labels.indexOf(label) == -1 ){
            this._labels.push(label);
        }
    }

    /**
     * @description 移除支持多语言的Label
     * @param label 
     */
    public removeLabel( label : cc.Label ){
        let index = this._labels.indexOf(label)
        if ( index >= 0 ){
            this._labels.splice(index,1);
        }
    }

    /**
     * @description 语言包发生更新，变更语言包Label
     */
    public onChangeLanguage( ){
        this._labels.forEach(v=>{
            if ( cc.isValid(v) ){
                v.language = v.language;
            }
        })
    }
}
