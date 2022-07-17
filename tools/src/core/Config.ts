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

    constructor(){
        super();
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
                
                // this.logger.log(`读取【${this.path}】配置数据 : ${data}`);
            }else{
                this.logger.error(`${this.path} 不存在`);
            }
        }else{
            this.logger.error(`配置的路径为空`);
        }
        // this.logger.log("配置数据 : " ,this._data,this.path);
    }

    /**
     * @description 保存配置数据
     */
    save(){
        if ( this.path && this.data ){
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