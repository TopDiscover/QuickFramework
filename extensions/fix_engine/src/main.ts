import * as fs from "fs";
import * as path from "path";

interface ConfigData{
    path:string,
    name:string,
    desc:string,
}
export class _Helper {

    /**@description creator 版本号 */
    private get appVersion(){
        return Editor.App.version;
    }

    /**@description creator 安所路径 */
    private _path : string | null = null;
    private get appPath(){
        if( this._path ){
            return this._path;
        }
        this._path = Editor.App.path;
        //D:\Creator\Creator\3.1.0\resources\app.asar
        let parser = path.parse(this._path);
        this._path = parser.dir;
        return this._path;
    }

    private _engineRoot : string | null = null;
    private get engineRoot(){
        if( this._engineRoot ){
            return this._engineRoot;
        }
        let root = this.appPath + "/resources/3d/engine-native";
        root = path.normalize(root);
        this._engineRoot = root;
        return this._engineRoot;
    }

    private _config : any = null;
    private get config(){
        if( this._config ){
            return this._config;
        }
        let source = fs.readFileSync(path.join(__dirname,"../engine/config.json"),"utf-8");
        this._config = JSON.parse(source);
        return this._config;
    }

    private _curPluginVersion : number = -1;
    /**@description 当前目录下的插件版本 */
    private get curPluginVersion(){
        if( this._curPluginVersion == -1 ){
            let versionPath = `${path.join(__dirname,"../engine/version.json")}`;
            versionPath = path.normalize(versionPath);
            let data = fs.readFileSync(versionPath,"utf-8");
            let source = JSON.parse(data);
            this._curPluginVersion = source.version;
        }
        return this._curPluginVersion;
    }

    private _creatorPluginVersion : number = -1;
    /**@description 当前Creator目录下的引擎修正插件版本 */
    private get creatorPluginVersion(){
        if( this._creatorPluginVersion -= -1 ){
            let versionPath = `${this.appPath}/version.json`;
            versionPath = path.normalize(versionPath);
            if( fs.existsSync(versionPath) ){
                let data = fs.readFileSync(versionPath,"utf-8");
                let source = JSON.parse(data);
                this._creatorPluginVersion = source.version;
            }else{
              this._creatorPluginVersion = 0;  
            }
        }       
        return this._creatorPluginVersion; 
    }

    private get isNeedUpdateVersion(){
        if( this.creatorPluginVersion == 0 ){
            //不存在
            return true;
        }
        if( this.creatorPluginVersion < this.curPluginVersion ){
            return true;
        }
        return false;
    }

    run(){
        console.log(`Creator Version : ${this.creatorPluginVersion}`);
        console.log(`Plugin Version : ${this.curPluginVersion}`);

        if( !this.isNeedUpdateVersion ){
            console.log(`您目录Creator 目录下的插件版本已经是最新`);
            return;
        }

        if (this.appVersion == "3.1.0") {
            console.log("Creator 版本 : " + this.appVersion);
        }else{
            console.log(`该插件只能使用在3.1.0版本的Creator`);
            console.log("请自己手动对比extensions/fix_engine/engine目录下对引擎的修改");
            return;
        }
        console.log("Creator 安装路径 : " + this.appPath);
        console.log("Creator 引擎路径 : " + this.engineRoot);
        
        
        let keys = Object.keys(this.config);
        for( let i = 0 ; i < keys.length ; i++ ){
            let data : ConfigData = this.config[keys[i]];
            if( data.name == "version.json"){
                //直接把版本文件写到creator目录下
                let destPath = `${this.appPath}/${data.path}`;
                destPath = path.normalize(destPath);
                let sourcePath = `${path.join(__dirname,`../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let sourceData = fs.readFileSync(sourcePath,"utf-8");
                fs.writeFileSync(destPath,sourceData,{ encoding : "utf-8"});
                console.log(data.desc);
            } else if( data.name == "ccdts"){
                //更新声明文件
                let destPath = `${this.appPath}/${data.path}`;
                destPath = path.normalize(destPath);
                let sourcePath = `${path.join(__dirname,`../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let sourceData = fs.readFileSync(sourcePath,"utf-8");
                let destData = fs.readFileSync(destPath,"utf-8");
                let replace = function(){
                    return arguments[1] + sourceData + arguments[3];
                }
                destData = destData.replace(/(declare\s*module\s*"cc"\s*\{)([\s\n\S]*)(export\s*class\s*MeshBuffer\s*\{)/g,replace);
                fs.writeFileSync(destPath,destData,{encoding:"utf-8"});
                console.log(data.desc);
            } else{
                //查看本地是否有文件
                let sourcePath = `${path.join(__dirname,`../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let destPath = `${this.engineRoot}/${data.path}`;
                destPath = path.normalize(destPath);
                if( fs.existsSync(sourcePath) ){
                    let sourceData = fs.readFileSync(sourcePath,"utf-8");
                    fs.writeFileSync(destPath,sourceData,{encoding:"utf-8"});
                    console.log(data.desc);
                }
            }
        }
    }
}
const Helper = new _Helper();

/**
* @en 
* @zh 为扩展的主进程的注册方法
*/
export const methods = {
    fixEngine() {
        Helper.run();
    }
};

/**
* @en Hooks triggered after extension loading is complete
* @zh 扩展加载完成后触发的钩子
*/
export const load = function () {
    console.log("加载fix_engine");
};

/**
* @en Hooks triggered after extension uninstallation is complete
* @zh 扩展卸载完成后触发的钩子
*/
export const unload = function () {
    console.log("卸载fix_engine");
};