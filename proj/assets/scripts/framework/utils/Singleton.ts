/**
 * @description 单列管理
 */
export class Singleton implements ISingleton{
    module: string = "【单列管理器】";

    private _datas: Map<string, ISingleton> = new Map();
    protected static _instance?: Singleton;
    public static get instance() {
        if (!this._instance) {
            this._instance = new Singleton();
            this._instance.init();
        }
        return this._instance;
    }

    init(): void {
        Log.d(`${this.module}初始化`);
    }

    clear(): void {
        this._datas.forEach((value) => {
            if (value) {
                Log.d(`${value.module}清理`)
                if (value.clear) {
                    value.clear();
                }
            }
        })
    }

    /**
     * @description 获取单列
     * @param typeOrModule 单列类型
     * @param isCreate 在找不到时，自动创建
     */
    get<T extends ISingleton>(typeOrModule: SingletonClass<T> | string, isCreate: boolean = true): T | null {
        let module = this.getModule(typeOrModule);
        if (this._datas.has(module)) {
            return <T>this._datas.get(module);
        }
        if (typeof typeOrModule != "string" && isCreate) {
            let data : ISingleton = null!;
            if ( typeOrModule.instance ){
                data = typeOrModule.instance;
            }else{
                data = new typeOrModule();
            }
            Log.d(`${module}初始化`);
            data.module = module;
            if (data.init) {
                data.init();
            }
            this._datas.set(module, data);
            return <T>data;
        }
        return null;
    }

    /**
     * @description 销毁指定单列
     * @param typeOrModule 如果无参数，则表示销毁所有不常驻的单列
     */
    destory<T extends ISingleton>(typeOrModule?: SingletonClass<T> | string): void {
        if (typeOrModule) {
            let module = this.getModule(typeOrModule);
            if (this._datas.has(module)) {
                let data = this._datas.get(module);
                Log.d(`${data?.module}销毁`)
                if (data && data.destory) {
                    data.destory();
                }
                this._datas.delete(module);
            } else {
                Log.d(`${module}已经销毁`)
            }
        } else {
            //先销毁掉所有单列
            this._datas.forEach((value) => {
                if (value) {
                    if (value.isResident) {
                        Log.d(`${value.module}为常驻单列，不做销毁处理`)
                    } else {
                        Log.d(`${value.module}销毁`)
                        if (value.destory) {
                            value.destory();
                        }
                        this._datas.delete(value.module);
                    }
                }
            })
        }
    }

    protected getModule<T extends ISingleton>(typeOrModule: SingletonClass<T> | string) {
        if (typeof typeOrModule == "string") {
            return typeOrModule;
        } else {
            return typeOrModule.module;
        }
    }

    debug(){
        Log.d(`--------------- ${this.module}当前所有单列 ---------------`)
        this._datas.forEach(v=>{
            let isResident = v.isResident;
            if ( isResident == undefined ){
                isResident = false;
            }
            Log.d(`${v.module} , 是否为常驻 : ${isResident}`)
        })
    }
}