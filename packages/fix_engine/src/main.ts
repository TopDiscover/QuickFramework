

import * as fs from "fs";
import * as path from "path";

interface ConfigData{
    path:string,
    name:string,
    desc:string,
}
export class _Helper {

    /**@description 是否是Mac平台 */
    private get isMac(){
        let pos = Editor.argv.$0.indexOf("MacOS");
        return pos != -1;
    }

    /**@description creator 版本号 */
    private get appVersion(){
        return Editor.versions.CocosCreator;
    }

    /**@description creator 安所路径 */
    private _path : string | null = null;
    private get appPath(){
        if( this._path ){
            return this._path;
        }
        this._path = Editor.argv.$0;
        //window : D:\CocosCreator\2.1.2\CocosCreator.exe --path
        //mac : Applications/CocosCreator.app/Contents/MacOS/CocosCreator --path
        let parser = path.parse(this._path);
        this._path = parser.dir;
        return this._path;
    }

    private _engineRoot : string | null = null;
    private get engineRoot(){
        if( this._engineRoot ){
            return this._engineRoot;
        }
        let root = this.appPath + (this.isMac ? "/Resources" : "/resources");
        root = path.normalize(root);
        this._engineRoot = root;
        return this._engineRoot;
    }

    private _config : any = null;
    private get config(){
        if( this._config ){
            return this._config;
        }
        let source = fs.readFileSync(path.join(__dirname,"../../engine/config.json"),"utf-8");
        this._config = JSON.parse(source);
        return this._config;
    }

    private _curPluginVersion : number = -1;
    /**@description 当前目录下的插件版本 */
    private get curPluginVersion(){
        if( this._curPluginVersion == -1 ){
            let versionPath = `${path.join(__dirname,"../../engine/version.json")}`;
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

    /**@description 对哪些creator版本有效 */
    private get validVersions(){
        return ["2.4.0","2.4.1","2.4.2","2.4.3","2.4.4","2.4.5"];
    }

    run(){
        Editor.log(`Creator Version : ${this.creatorPluginVersion}`);
        Editor.log(`Plugin Version : ${this.curPluginVersion}`);

        if( !this.isNeedUpdateVersion ){
            Editor.log(`您目录Creator 目录下的插件版本已经是最新`);
            return;
        }

        if ( this.validVersions.indexOf(this.appVersion) ) {
            Editor.log("Creator 版本 : " + this.appVersion);
        }else{
            Editor.log(`该插件只能使用在${this.validVersions.toString()}版本的Creator`);
            Editor.log("请自己手动对比packages/engine目录下对引擎的修改");
            return;
        }
        Editor.log("Creator 安装路径 : " + this.appPath);
        Editor.log("Creator 引擎路径 : " + this.engineRoot);
        

        let keys = Object.keys(this.config);
        for( let i = 0 ; i < keys.length ; i++ ){
            let data : ConfigData = this.config[keys[i]];
            if( data.name == "version.json"){
                //直接把版本文件写到creator目录下
                let destPath = `${this.appPath}/${data.path}`;
                destPath = path.normalize(destPath);
                let sourcePath = `${path.join(__dirname,`../../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let sourceData = fs.readFileSync(sourcePath,"utf-8");
                fs.writeFileSync(destPath,sourceData,{ encoding : "utf-8"});
                Editor.log(data.desc);
            }else{
                //查看本地是否有文件
                let sourcePath = `${path.join(__dirname,`../../engine/${data.name}`)}`;
                sourcePath = path.normalize(sourcePath);
                let destPath = `${this.engineRoot}/${data.path}`;
                destPath = path.normalize(destPath);
                if( fs.existsSync(sourcePath) ){
                    let sourceData = fs.readFileSync(sourcePath,"utf-8");
                    fs.writeFileSync(destPath,sourceData,{encoding:"utf-8"});
                    Editor.log(data.desc);
                }
            }
        }
    }
    /**@description 生成Cocos Creator 安装目录环境变量*/
    generateEnv(){
        Editor.log("Creator 安装路径 : " + this.appPath);
        Editor.log("项目路径 : ",Editor.Project.path);
        
        //windows 处理
        let setupEnvPath =  `${Editor.Project.path}/tools/builder/env/setup_win.bat`;
        setupEnvPath = path.normalize(setupEnvPath);
        let content = fs.readFileSync(setupEnvPath,"utf8");
        let appPath = this.appPath;
        appPath = appPath.replace(/\\/g,"/");
        if( !this.isMac ){
            content = content.replace(/(COCOS_CREATOR_ROOT=)(%~dp0|"\w:([\/\w.]{0,}){1,}")/g,(substring,param1 ,param2,param3,param4)=>{
                Editor.log(`请执行${setupEnvPath}设置环境变量`);
                return `${param1}"${appPath}"`;
            });
            fs.writeFileSync(setupEnvPath,content,{encoding:"utf8"});
        }
        

        //Mac处理
        if( this.isMac ){
            setupEnvPath = `${Editor.Project.path}/tools/builder/env/setup_mac.sh`;
            setupEnvPath = path.normalize(setupEnvPath);
            content = fs.readFileSync(setupEnvPath,"utf8");
        
            content = content.replace(/(COCOS_CREATOR_ROOT=)("\$DIR"|"Applications[\/\w.]{1,}")/g,(substring,param1,param2,param3,param4)=>{
                Editor.log(`请执行${setupEnvPath}设置环境变量`);
                return `${param1}"${appPath}"`;
            });
            fs.writeFileSync(setupEnvPath,content,{encoding:"utf8"});
        }
    }
}
const Helper = new _Helper();

export function load(){
    Helper.generateEnv();
}

export function unload(){

}

export const messages = {
    fix_engine:()=>{
        Helper.run();
    }
}