import { existsSync,readdirSync,statSync,readFileSync,unlinkSync,writeFileSync } from "fs";
import path from "path";
import { ApplyJsb } from "./utils/ApplyJsb";
import { ApplyWeb } from "./utils/ApplyWeb";
import { EncriptTool } from "./utils/EncriptTool";
/**构建类型 */
var BuildTypeEnum = {
    web_desktop: 0,
    web_mobile: 1,
    jsb_link: 2,
};

class Helper{

    private _config: EncryptResourcesConfig = null!

    /**@description 生成默认缓存 */
    private get defaultConfig() {
        let config: EncryptResourcesConfig = {
            encriptSign: "QuickFramework",
            encriptKey: "QuickFramework",
            srcLabel:"",
            buildType:2,
        }
        return config;
    }

    get config() {
        this.encriptFinishNum = 0;
        if (!this._config) {
            this._config = this.defaultConfig;
        }
        return this._config;
    }

    set config(v) {
        this._config = v;
    }

    /**加密文件后缀支持目录 */
    root_path_List = ["web-desktop","web-mobile","jsb-link"];

    /**加密后缀名排除列表 */
    encript_ignore_extList = ["mp3","ogg","wav","m4a","jsc","bin"];

    /**加密实现工具类 */
    _encriptTool = new EncriptTool();

    /**计数 */
    encriptFinishNum = 0;

    /**
     * @description 添加日志
     * @param {*} message 
     * @param {*} obj 
     * @returns 
     */
     log(message: any, obj: any = null) {
        if (typeof obj == "function") {
            return;
        }
        if (obj) {
            Editor.log("[资源替换]", message, obj);
        } else {
            Editor.log("[资源替换]", message);
        }
    }

    checkBuildDir(fullPath: string) {
        let is = -1;
        if (existsSync(fullPath)) {
            // 检查目录后缀是否符合
            let path = fullPath.split("\\");
            is = this.root_path_List.indexOf(path[path.length-1]);
        }
        if(is < 0 ){
            this.log(`选择目录错误`);
        }
        return is;
    }

    setBuildType(fullPath: string){
        this._config.buildType = this.checkBuildDir(fullPath);
        if(this._config.buildType==BuildTypeEnum.jsb_link){
            ///jsb
            this.encript_ignore_extList = [
                "mp3","ogg","wav","m4a","jsc","bin"
            ];
        }else if(this._config.buildType == BuildTypeEnum.web_desktop||this._config.buildType==BuildTypeEnum.web_mobile){
            ///web平台，只加密文本、图片
            this.encript_ignore_extList = [
                "js","jsc",
                "mp3","ogg","wav","m4a",
                "font","eot","ttf","woff","svg","ttc",
                "mp4","avi","mov","mpg","mpeg","rm","rmvb",
                "bin",
            ];
        }
    }

    replaceResources() {
        this.log(`开始进行资源加密,加密指定目录：`+ this.config.srcLabel);
        this.setBuildType(this._config.srcLabel);
        this._encriptTool.setKeySign(this._config.encriptKey,this._config.encriptSign);
        let assetsPath = path.join(this._config.srcLabel,"assets");
        this.encriptDir(assetsPath);
        if(this._config.buildType ==BuildTypeEnum.jsb_link){
            new ApplyJsb(this._config.encriptSign,this._config.encriptKey);
            let jsb_adapterPath = path.join(this._config.srcLabel,"jsb-adapter")
            let srcPath = path.join(this._config.srcLabel,"src")
            let mainJsPath = path.join(this._config.srcLabel,"main.js")
            this.encriptDir(jsb_adapterPath)
            this.encriptDir(srcPath)
            this.encodeFile(mainJsPath)
        }else if(this._config.buildType==BuildTypeEnum.web_desktop||this._config.buildType==BuildTypeEnum.web_mobile){
            //web
            new ApplyWeb(this._config.encriptSign,this._config.encriptKey,this._config.srcLabel);
        }
        this.log("加密结束，累计加密："+ this.encriptFinishNum + "个文件");
    }

    /**加密文件夹 */
    encriptDir(dirName: string){
        if (!existsSync(dirName)) {
            this.log(`${dirName} 目录不存在`)
            return
        }
        let files = readdirSync(dirName);
        files.forEach((fileName) => {
            let filePath = path.join(dirName, fileName.toString());
            let stat = statSync(filePath);
            if (stat.isDirectory()) {
                this.encriptDir(filePath);
            } else {
                this.encodeFile(filePath)
            }
        });
    }

    /**加密文件 */
    encodeFile(filePath:string) {
        let ext = path.extname(filePath);
        if(this.encript_ignore_extList.indexOf(ext.slice(1))>=0){
            return;
        }
        let inbuffer = readFileSync(filePath);
        if(this._encriptTool.checkIsEncripted(inbuffer)){
            this.log("已加密过:",filePath)
            return
        }else{
            this.log("加密文件："+filePath);
        }
        let outBuffer = this._encriptTool.encodeArrayBuffer(inbuffer)
        unlinkSync(filePath);
        writeFileSync(filePath,outBuffer);
        this.encriptFinishNum = this.encriptFinishNum + 1;
        this.log("加密文件个数："+this.encriptFinishNum);
    }

}

export const helper = new Helper();