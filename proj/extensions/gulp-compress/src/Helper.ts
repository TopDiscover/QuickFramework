import { existsSync, readFileSync, writeFileSync } from "fs";
import path, { join, normalize } from "path";
import { Platform } from "../@types/packages/builder/@types";

const LOG_NAME = "[Gulp压缩]:";

interface Config{
    platform : string;
    dest : string;
}

class Helper {


    private _config : Config = {platform:"",dest:""}

    /**@description 配置存储路径 */
    private get configPath() {
        let savePath = `${path.join(__dirname, "../../../local/gulp-compress.json")}`;
        savePath = normalize(savePath);
        return savePath;
    }

    private readConfig() {
        let tempPath = this.configPath;
        if (existsSync(tempPath)) {
            this._config = JSON.parse(readFileSync(tempPath, { encoding: "utf-8" }));
        }else{
            this._config = {platform:"",dest:""};
        }
    }

    private saveConfig(dest:string,platform: string) {
        let savePath = this.configPath;
        this._config.dest = dest;
        this._config.platform = platform;
        console.log(`保存构建信息:`,this._config);
        writeFileSync(savePath, JSON.stringify(this._config), { encoding: "utf-8" });
    }

    onBeforeBuild(platform: string) {
        console.log(LOG_NAME, `开始构建,构建平台:${platform}`);
    }

    onAfterBuild(dest: string, platform: string) {
        console.log(LOG_NAME, `构建完成,构建目录:${dest},构建平台:${platform}`);
        this.saveConfig(dest,platform);
        let tempPath = join(__dirname,"../");
        tempPath = normalize(tempPath);
        console.warn(LOG_NAME,`如果需要对构建的JS脚本进行资源压缩，请到${tempPath}目录下`);
        console.warn(LOG_NAME,`执行 gulp 命令 提示：gulp --compex true 可执行代码混淆，默认不开启`);
    }

    get dest(){
        this.readConfig();
        if ( !!!this._config.dest || !!!this._config.platform ){
            console.error(`构建信息有误`);
            return "";
        }
        let platform : Platform = this._config.platform as any;
        let dest = this._config.dest;
        if ( platform == "android" || platform == "windows" || platform == "ios" || platform == "mac"){
            dest = join(dest,"assets");
        }
        console.log(`构建资源目录为:${dest}`)
        return dest;
    }

    /**@description 判断是否是web */
    get isWeb(){
        this.readConfig();
        if ( !!!this._config.dest || !!!this._config.platform ){
            console.error(`构建信息有误`);
            return true;
        }
        let platform : Platform = this._config.platform as any;
        if ( platform == "android" || platform == "windows" || platform == "ios" || platform == "mac"){
            return false;
        }
        console.log(`构建平台:${platform}`)
        return true;
    }

    get platform(){
        this.readConfig();
        if ( !!!this._config.dest || !!!this._config.platform ){
            console.error(`构建信息有误`);
            return "";
        }
        return this._config.platform;
    }
}

export const helper = new Helper();