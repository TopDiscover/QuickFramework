import { existsSync } from "fs";
import { join, parse } from "path";
import FileUtils from "./core/FileUtils";
import { Handler } from "./core/Handler";
import * as FixEngine from "./fix_engine/Helper";
import * as Gulp from "./gulp-compress/Helper";
import * as Assets from "./core/AssetsHelper";
import * as PngCompress from "./png-compress/Helper";
import * as Hotupdate from "./hotupdate/Helper";
import { Environment } from "./core/Environment";
import { SyncType } from "./core/Defines";

/**
 * @description 辅助类
 */
export class Helper extends Handler {

    private static _instance: Helper = null!;
    static get instance() {
        return this._instance || (this._instance = new Helper);
    }

    /**@description Bunldes 地址 */
    private readonly bundlesUrl = Environment.publicBundlesUrl;

    /**@description 私有 Bunldes 地址 */
    private readonly privateBundlesUrl = Environment.privateBundlesUrl;

    /**@description 引擎修正 */
    private _fixEngine = new FixEngine.default;

    /**@description Gulp 压缩 */
    private _gulp = new Gulp.default()

    /**@description 资源辅助类 */
    private _assets = new Assets.default();

    /**
     * @description 图片压缩
     */
    private _pngCompress = new PngCompress.default();

    /**
     * @description 热更新
     */
    private _hotupdate = new Hotupdate.default();

    /**@description 获取当前分支信息 */
    private async gitCurBranch() {
        this.chdir(this.projPath);
        let result = await this.exec("git branch");
        if (result.isSuccess) {
            let data: string = result.data;
            let arr = data.split("\n");
            for (let index = 0; index < arr.length; index++) {
                const element = arr[index];
                if (element.startsWith("*")) {
                    let branch = element.match(/\d+\.\d+\.\d+/g);
                    if (branch) {
                        return branch[0];
                    }
                }
            }
        }
        return null;
    }

    /**
     * @description 拉取Bundles代码
     * @param savePath 保存目录名
     * @param url 项目地址
     * @returns 
     */
    private async _gitBundles(savePath : string , url : string) {
        let name = parse(savePath).name;
        this.log(`拉取远程${name}`, false);
        let branch = await this.gitCurBranch();
        
        if (existsSync(savePath)) {
            this.logger.log(`已经存在 : ${savePath}`);
            this.chdir(savePath);
            let result = await this.exec("git pull");
            this.logger.log(`正在更新 : ${name}`)
            if (!result.isSuccess) {
                return;
            }
            result = await this.exec(`git checkout ${branch}`);
            if (result.isSuccess) {
                this.logger.log(`切换分支${branch}成功 : ${name}`)
            }
        } else {
            this.logger.log(`不存在 : ${savePath}`);
            this.chdir(this.projPath);
            this.logger.log(`拉取远程 : ${name}`)
            let result = await this.exec(`git clone ${url} ${name}`);
            if (!result.isSuccess) {
                return;
            }
            this.logger.log(`拉取成功 : ${name}`);
            this.chdir(savePath);
            result = await this.exec(`git checkout ${branch}`);
            if (result.isSuccess) {
                this.logger.log(`切换分支${branch}成功 : ${name}`)
            }
        }
        this.log(`拉取远程${name}`, true);
    }

    /**@description 摘取远程bundles */
    async gitBundles() {
        await this._gitBundles(this.bundlesPath,this.bundlesUrl)
        if ( Environment.isPrivate ) {
            await this._gitBundles(this.privateProjPath,this.privateBundlesUrl);
        }
    }

    /**@description 链接代码 */
    symlinkSyncCode() {
        //链接公用bundles代码
        let name = parse(this.bundlesPath).name;
        this.log(`链接${name}目录`, false);
        let fromPath = join(this.bundlesPath, this.bundleName);
        FileUtils.instance.symlinkSync(fromPath, this.assetsBundlesPath)
        this.log(`链接${name}目录`, true);
        //链接私有bundles代码
        if ( Environment.isPrivate ){
            Environment.privateCode.forEach(v=>{
                if ( v.type == SyncType.Bunldes ){
                    fromPath = join(this.privateProjPath,v.from);
                    //目录
                    let result = FileUtils.instance.getDirs(fromPath);
                    result.forEach(info=>{
                        fromPath = info.path;
                        FileUtils.instance.symlinkSync(fromPath,join(this.projPath,`${v.to}/${info.name}`));
                    })
                    //.meta文件
                    fromPath = join(this.privateProjPath,v.from);
                    let files = FileUtils.instance.getCurFiles(fromPath);
                    files.forEach(info=>{
                        fromPath = info.path;
                        FileUtils.instance.symlinkSync(fromPath,join(this.projPath,`${v.to}/${info.name}`))
                    })
                }else if( v.type == SyncType.CUR_ALL_FILES ){
                    fromPath = join(this.privateProjPath,v.from)
                    let files = FileUtils.instance.getCurFiles(fromPath);
                    files.forEach(info=>{
                        fromPath = info.path;
                        FileUtils.instance.symlinkSync(fromPath,join(this.projPath,`${v.to}/${info.name}`));
                    })
                }else if ( v.type == SyncType.CUR_DIR_AND_META ){
                    fromPath = join(this.privateProjPath,v.from);
                    let result = FileUtils.instance.getDirs(fromPath);
                    result.forEach(info=>{
                        fromPath = info.path;
                        FileUtils.instance.symlinkSync(fromPath,join(this.projPath,`${v.to}/${info.name}`));
                    })

                    fromPath = join(this.privateProjPath,v.from);
                    let files = FileUtils.instance.getCurFiles(fromPath);
                    files.forEach(info=>{
                        fromPath = info.path;
                        FileUtils.instance.symlinkSync(fromPath,join(this.projPath,`${v.to}/${info.name}`));
                    }) 
                }
            })
        }
    }

    /**
     * @description 链接扩展插件代码
     */
    symlinkSyncExtensions() {
        this.log(`链接扩展插件代码`, false);

        for (let i = 0; i < this.extensions.length; i++) {
            const element = this.extensions[i];
            let toPath = join(this.extensionsPath, `${element}/src/core`);
            let formPath = join(__dirname, `core`);
            //core 部分代码
            if ( Environment.isLinkCore(element)){
                this.logger.log(`链接core`);
                FileUtils.instance.symlinkSync(formPath, toPath);
            }
            
            //node_modules 依赖
            if ( Environment.isLinkNodeModules(element) ){
                this.logger.log(`链接node_modules`);
                formPath = this.node_modules;
                toPath = join(this.extensionsPath,`${element}/node_modules`);
                FileUtils.instance.symlinkSync(formPath,toPath);
            }
           

            //链接实现
            if ( Environment.isLinkImpl(element) ){
                this.logger.log(`链接Impl`);
                formPath = join(__dirname, element);
                toPath = join(this.extensionsPath, `${element}/src/impl`);
                FileUtils.instance.symlinkSync(formPath, toPath);
            }

            //链接声明部分
            this.logger.log(`链接声明部分`);
            formPath = join(__dirname,`../@types`);
            toPath = join(this.extensionsPath,`${element}/@types`);
            FileUtils.instance.symlinkSync(formPath,toPath);
        }

        this.log(`链接扩展插件代码`, true);
    }

    async installProtobufJS(){
        this.log("安装 protobufjs",false);
        this.chdir(join(this.projPath,"proj"));
        await this.exec("npm install");
        this.log("安装 protobufjs",true);
    }

    /**@description 引擎修改 */
    async fixEngine() {
        this.log(`引擎修正`,false);
        this._fixEngine.run();
        this.log(`引擎修正`,true);
    }

    async gulp(){
        this.log(`Gulp`,false);
        await this._gulp.run();
        this.log(`Gulp`,true);
    }

    async linkGulp(){
        this.log(`链接 gulpfile.js`,false);
        let path = "gulp-compress/gulpfile.js";
        await FileUtils.instance.copyFile(join(__dirname,path),join(__dirname,`../dist/${path}`));
        this.log(`链接 gulpfile.js`,true);
    }

    async getAssets() {
        await this._assets.getAssets();
    }

    /**
     * @description 图集压缩
     */
    async pngCompress(){
        this.log(`图片压缩`,false);
        await this._pngCompress.onAfterBuild(Environment.build);
        this.log(`图片压缩`,true);
    }

    async hotupdate(){
        this.log(`打包热更新`,false);
        await this._hotupdate.run();
        this.log(`打包热更新`,true);
    }

}