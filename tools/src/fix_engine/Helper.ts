import { existsSync, readFileSync, writeFileSync } from "fs";
import { join, normalize } from "path";
import { Environment } from "../core/Environment";
import { Extensions, FixEngineConfig, FixEngineData } from "../core/Defines";
import { Handler } from "../core/Handler";

export default class Helper extends Handler {

    module = "【引擎修正】";

    /**@description cocos creator 版本号 */
    protected get creatorVerion() {
        return Environment.creatorVerion;
    }

    /**
     * @description cocos creator 安装路径
     */
    protected get creatorPath() {
        return Environment.creatorPath;
    }

    /**@description 添加热更新接口导出声明 */
    protected HotUpdateDTS = {
        assetsManager: `
    
            /**@description 热更新地址 */
            setPackageUrl(url:string):void;
            /**@description 设置主包包含哪些bunlde,如果 main,resources */
            setMainBundles(bundles:string[]):void;
            /**
             * @description 设置 下载总数占比(即【将要下载资源文件总数】/【总下载资源文件总数】) 
             * 如 ：当为1时，删除本地缓存直接下载整个zip包进行解压
             *      当为0时，不会下载zip ,都以散列文件方式更新
             *      当 percent > 0 && percent < 1，假设为0.5,【下载总数占比】50%会删除掉本地缓存，重新下载zip包进行解压
             * 注意：在将要下载的总数 == 总下载总数 这个值无效，会直接下载zip包
             * @param percent 取值范围0~1
             */
            setDownloadAgainZip(percent:number):void;
            /**@description 重置检测状态 */
            reset():void;
            /**
             * @en Create function for creating a new AssetsManagerEx
             *
             * warning   The cached manifest in your storage path have higher priority and will be searched first,
             * only if it doesn't exist, AssetsManagerEx will use the given manifestUrl.
             *
             * @zh 创建 AssetManager
             *
             * @param manifestUrl  @en The url for the local manifest file @zh manifest 文件路径
             * @param storagePath  @en The storage path for downloaded assets @zh 存储路径
             */
        `,
        manifest: `

            constructor (content: string, manifestRoot: string,packageUrl:string);
            getMd5():string;
            /**
             * @en Check whether the version informations have been fully loaded
             * @zh 检查是否已加载版本信息
             */
        `
    }

    private _curExtensionPath: string = null!;
    get curExtensionPath() {
        if (!this._curExtensionPath) {
            this._curExtensionPath = join(this.extensionsPath, Extensions.FixEngine);
        }
        return this._curExtensionPath;
    }

    /**@description 当前插件版本 */
    private get pluginVersion() {
        let versionPath = join(this.curExtensionPath, "engine/version.json");
        versionPath = normalize(versionPath);
        if (existsSync(versionPath)) {
            let data = readFileSync(versionPath, "utf-8");
            let source = JSON.parse(data);
            return source.version;
        } else {
            return 0;
        }
    }

    /**@description cocos creator 目录下的插件版本 */
    private get creatorPluginVersion() {
        let versionPath = join(this.creatorPath, "version.json");
        versionPath = normalize(versionPath);
        if (existsSync(versionPath)) {
            let data = readFileSync(versionPath, "utf-8");
            let source = JSON.parse(data);
            return source.version;
        }
        return 0;
    }

    protected _config: FixEngineConfig = null!;
    /**
     * @description 修正引擎配置
     */
    protected get config() {
        if (!this._config) {
            let data = readFileSync(join(this.curExtensionPath, "engine/config.json"), "utf-8");
            this._config = JSON.parse(data);
        }
        return this._config;
    }

    /**
     * @description 是否需要更新插件
     */
    get isUpdate() {
        if (this.creatorPluginVersion == 0) {
            //不存在
            return true;
        }
        if (this.creatorPluginVersion < this.pluginVersion) {
            return true;
        }
        return false;
    }

    run() {
        this.logger.log(`${this.module}Creator 插件版本 : ${this.creatorPluginVersion}`);
        this.logger.log(`${this.module}当前插件版本 : ${this.pluginVersion}`);
        this.logger.log(`${this.module}Creator 版本 : ${this.creatorVerion}`);
        this.logger.log(`${this.module}Creator 安装目录 : ${this.creatorPath}`);

        if (!this.isUpdate) {
            this.logger.log(`${this.module}您目录Creator 目录下的插件版本已经是最新`);
            return;
        }

        if (!this.isSupport(this.creatorVerion)) {
            this.logger.log(`${this.module}该插件只能使用在${this.supportVersions.toString()} 版本的Creator`);
            this.logger.log(`${this.module}请自己手动对比fix_engine/engine目录下对引擎的修改`);
            return;
        }


        let keys = Object.keys(this.config);
        for (let i = 0; i < keys.length; i++) {
            let data: FixEngineData = this.config[keys[i]];
            if (data.from == "version.json") {
                //直接把版本文件写到creator目录下
                let destPath = join(this.creatorPath, data.to);
                destPath = normalize(destPath);
                let sourcePath = join(this.curExtensionPath, `engine/${data.from}`);
                sourcePath = normalize(sourcePath);
                let sourceData = readFileSync(sourcePath, "utf-8");
                writeFileSync(destPath, sourceData, { encoding: "utf-8" });
                this.logger.log(`${this.module}${sourcePath} -> ${destPath}`);
                this.logger.log(`${this.module}${data.desc}`);
            } else if (data.from == "ccdts") {
                //更新声明文件
                let destPath = join(this.creatorPath, data.to);
                destPath = normalize(destPath);
                let sourcePath = join(this.curExtensionPath, `engine/${data.from}`);
                sourcePath = normalize(sourcePath);
                let sourceData = readFileSync(sourcePath, "utf-8");
                if (existsSync(destPath)) {
                    let destData = readFileSync(destPath, "utf-8");
                    let replace = function () {
                        return arguments[1] + sourceData + arguments[3];
                    }
                    if (this.creatorVerion >= "3.6.0") {
                        //3.x 版本Creator 处理
                        destData = destData.replace(/(declare\s*module\s*"cc"\s*\{)([\s\n\S]*)(export\s*const\s*macro\s*:\s*Macro\s*;)/g, replace);

                        let self = this;
                        let replaceManifest = function () {
                            return arguments[1] + self.HotUpdateDTS.manifest + arguments[3];
                        }
                        destData = destData.replace(/(export\s*class\s*Manifest\s*\{)([\s\n\S]*)(isVersionLoaded\s*\(\s*\):\s*\w+;)/g, replaceManifest);
                        
                        let replaceAssetsManager = function () {
                            return arguments[1] + self.HotUpdateDTS.assetsManager + arguments[3];
                        }
                        destData = destData.replace(/(export\s*class\s*AssetsManager\s*\{)([\s\n\S]*)(static\s*create\(\s*manifestUrl)/g, replaceAssetsManager);

                        // writeFileSync(join(__dirname,"cc.d.ts"),destData,"utf-8");

                    } else {
                        //2.x 版本Creator 处理
                        destData = destData.replace(/(\*\/)([\s\S\n]*)(declare\s*namespace\s*cc\s*\{)/g, replace);
                        //(decRef\s*\()([autoRelease\?:boolean]*)(\)\s*:\s*cc.Asset)
                        let replaceDecRef = function () {
                            return arguments[1] + "autoRelease?:boolean" + arguments[3];
                        }
                        destData = destData.replace(/(decRef\s*\()([autoRelease\?:boolean]*)(\)\s*:\s*cc.Asset)/g, replaceDecRef);
                    }
                    writeFileSync(destPath, destData, { encoding: "utf-8" });
                    this.logger.log(`${this.module}${data.desc}`);
                } else {
                    this.logger.error(`${this.module}找不到引擎目录下文件:${destPath}`);
                }

            } else {

                let copyTo = ()=>{
                    let sourcePath = join(this.curExtensionPath, `engine/${data.from}`);
                    sourcePath = normalize(sourcePath);
                    let destPath = join(this.creatorPath, data.to);
                    destPath = normalize(destPath);
                    if (existsSync(destPath)) {
                        if (existsSync(sourcePath)) {
                            let sourceData = readFileSync(sourcePath, "utf-8");
                            writeFileSync(destPath, sourceData, { encoding: "utf-8" });
                            this.logger.log(`${this.module}${data.desc}`);
                        } else {
                            this.logger.error(`${this.module}找不到源文件:${sourcePath}`);
                        }
                    } else {
                        this.logger.error(`${this.module}找不到引擎目录下文件:${destPath}`);
                    }
                }

                //查看本地是否有文件
                if ( data.versions ){
                    let versions = data.versions.split("|");
                    this.logger.log(`${this.module} 支持版本 : ${versions.toString()}`);
                    if ( versions.indexOf(this.creatorVerion) >=0 ){
                        copyTo();
                    }
                }else{
                    copyTo();
                }
            }
        }
    }
}