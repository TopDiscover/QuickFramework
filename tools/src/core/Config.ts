import { existsSync, readFileSync, writeFileSync } from "fs";
import { normalize } from "path";
import { Handler } from "./Handler";

export default class Config<T> extends Handler{

    /**@description 配置数据 */
    private _data : T | null = null;
    get data(){
        return this._data;
    }
    set data(v){
        this._data = v;
    }

    /**@description 配置文件路径 */
    readonly path : string = null!;

    constructor(configPath : string){
        super();
        this.path = normalize(configPath);
    } 

   

    /**
     * @description 读取数据
     * @param isReload 是否重新加载数据，默认为 false
     */
    read(isReload = false){
        if ( this.path ){
            if ( !isReload ){
                //不需要重新加载数据
                if ( this._data ){
                    //如果已经有数据，不在进行加载
                    return;
                }
            }
            if ( existsSync(this.path) ){
                let data = readFileSync(this.path,"utf-8");
                let source = JSON.parse(data);
                this._data = source;
                this.logger.log(`读取【${this.path}】配置数据 : ${data}`);
            }else{
                this.logger.error(`${this.path} 不存在`);
            }
        }else{
            this.logger.error(`配置的路径为空`);
        }
    }

    /**
     * @description 保存配置数据
     */
    save(){
        if ( this.path ){
            if ( existsSync(this.path )){
                let data = JSON.stringify(this.data);
                writeFileSync(this.path,data,"utf-8");
                this.logger.log(`保存【${this.path}】配置数据 : ${data}`);
            }else{
                this.logger.error(`${this.path} 不存在`)
            }
        }else{
            this.logger.error(`配置的路径为空`);
        }
    }

}