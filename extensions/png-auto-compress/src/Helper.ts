import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { normalize } from "path";


export interface Config {
    enabled: boolean,

    minQuality: number,
    maxQuality: number,
    speed: number,
    colors: number
    excludeFolders: string,
    excludeFiles: string,
}

class Helper {
    /** 默认配置 */
    private defaultConfig : Config= {
        enabled: false,

        minQuality: 40,
        maxQuality: 80,
        colors: 256,
        speed: 3,

        excludeFolders: "",
        excludeFiles: "",
    };

    private _config : Config = null!;
    get config(){
        if ( !this._config ){
            this.readConfig();
        }
        return this._config;
    }

    /**@description 配置存储路径 */
    private get configPath(){
        let savePath =`${path.join(Editor.Project.path,"/local/png-auto-compress.json")}`;
        savePath = normalize(savePath);
        return savePath;
    }

    saveConfig() {
        let savePath = this.configPath;
        console.log("保存配置如下：")
        console.log(this.config);
        writeFileSync(savePath,JSON.stringify(this.config),{encoding:"utf-8"});
    }

    private readConfig(){
        let tempPath = this.configPath;
        if ( existsSync(tempPath) ){
            this._config = JSON.parse(readFileSync(tempPath,{encoding:"utf-8"}));
        }else{
            this._config = this.defaultConfig;
        }
    }
}

export const helper = new Helper();