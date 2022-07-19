import { existsSync, readFileSync, writeFileSync } from "fs";
import { Handler } from "./Handler";

export default class Config<T> extends Handler{

    /**@description 配置数据 */
    protected _data : T | null = null;
    get data(){
        return this._data;
    }
    set data(v){
        this._data = v;
    }

    /**@description 配置文件路径 */
    get path(){
        return "";
    }

    /**@description 默认配置 */
    readonly defaultData : T | null = null;

    constructor(){
        super();
    } 

   

    /**
     * @description 读取数据
     * @param isReload 是否重新加载数据，默认为 false
     */
    read(isReload = false){
        if ( this.path ){
            if ( !isReload && this._data){
                return;
            }
            if ( existsSync(this.path) ){
                let data = readFileSync(this.path,"utf-8");
                let source = JSON.parse(data);
                this._data = source;
            }else{
                if ( this.defaultData ){
                    this._data = this.defaultData;
                    this.save();
                }
            }
        }
    }

    /**
     * @description 保存配置数据
     */
    save(){
        if ( this.path && this.data ){
            let data = JSON.stringify(this.data);
            writeFileSync(this.path,data,"utf-8");
            this.logger.log(`${this.module}保存【${this.path}】配置数据 : ${data}`);
        }else{
            this.logger.error(`${this.module}配置的路径为空`);
        }
    }

}