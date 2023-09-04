import { existsSync, symlink } from "fs";
import { join, parse } from "path";
import FileUtils from "./core/FileUtils";
import { Handler } from "./core/Handler";
import * as FixEngine from "./fix_engine/Helper";
import * as Gulp from "./gulp-compress/Helper";
import * as Assets from "./core/AssetsHelper";
import * as PngCompress from "./png-compress/Helper";
import * as Hotupdate from "./hotupdate/Helper";
import { Environment } from "./core/Environment";
import { SyncData, SyncType } from "./core/Defines";

const META = ".meta";

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
    private async gitUrl(savePath: string, url: string) {
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
        await this.gitUrl(this.bundlesPath, this.bundlesUrl);
    }

    /**@description 摘取远程 私有项目 */
    async gitPrivate() {
        await this.gitUrl(this.privateProjPath, this.privateBundlesUrl);
    }

    /**@description 摘取远程 Resources */
    async gitResources() {
        await this.gitUrl(this.resourcesPath, Environment.publicResourcesUrl);
    }

    /**@description 链接 Bundles 示例 */
    async symlinkSyncBundles() {
        let data: SyncData[] = [
            { from: `${this.bundleName}`, to: `proj/assets/`, type: SyncType.CUR_DIR_AND_META }
        ]
        await this.symlinkSync(data, this.bundleName);
    }

    /**@description 链接 私有 项目 */
    async symlinkSyncPrivate() {
        //链接私有bundles代码
        let data: SyncData[] = [
            { from: `${this.privateProj}/${this.bundleName}`, to: `proj/assets/${this.bundleName}`, type: SyncType.CUR_DIR_AND_META },
            { from: `${this.privateProj}/@types`, to: `proj/@types`, type: SyncType.CUR_ALL_FILES },
            { from: `${this.privateProj}/framework`, to: `proj/assets/quick`, type: SyncType.CUR_DIR_AND_META },
        ]
        await this.symlinkSync(data, "私有");
    }

    /**@description 链接 resources */
    async symlinkSyncResources() {
        let data: SyncData[] = [
            { from: `${this.resources}/${this.resources}`, to: `proj/assets/${this.resources}`, type: SyncType.SINGLE },
            { from: `${this.resources}/${this.resources}${META}`, to: `proj/assets/${this.resources}${META}`, type: SyncType.SINGLE },
            { from: `${this.resources}/scripts`, to: `proj/assets/scripts`, type: SyncType.CUR_DIR_AND_META },
            { from: `${this.resources}/Application.ts`, to: `proj/assets/Application.ts`, type: SyncType.CUR_FILE_AND_META },
            { from: `${this.resources}/@types`, to: `proj/@types`, type: SyncType.CUR_ALL_FILES },
            { from: `${this.resources}/@types/proto`, to: `proj/@types/proto`, type: SyncType.SINGLE },
            { from: `${this.resources}/project.json`, to: `proj/project.json`, type: SyncType.SINGLE },
        ]
        await this.symlinkSync(data, this.resources);
    }

    /**@description 链接 */
    async symlinkSync(data: SyncData[], tag: string, fromRoot: string = null!, toRoot: string = null!) {
        this.log(`链接${tag}`, false);
        if (!fromRoot) {
            fromRoot = this.projPath;
        }
        if (!toRoot) {
            toRoot = this.projPath;
        }
        let fromPath = "";
        let toPath = "";
        for (let i = 0; i < data.length; i++) {
            let v = data[i];
            if (v.type == SyncType.CUR_ALL_FILES) {
                fromPath = join(fromRoot, v.from)
                let files = FileUtils.instance.getCurFiles(fromPath);
                for (let j = 0; j < files.length; j++) {
                    let info = files[j];
                    fromPath = info.path;
                    await FileUtils.instance.symlinkSync(fromPath, join(toRoot, `${v.to}/${info.name}`));
                }
            } else if (v.type == SyncType.CUR_DIR_AND_META) {
                fromPath = join(fromRoot, v.from);
                let result = FileUtils.instance.getDirs(fromPath);
                for (let j = 0; j < result.length; j++) {
                    let info = result[j];
                    if (!info.name.startsWith(".")) {
                        fromPath = info.path;
                        toPath = join(toRoot, `${v.to}/${info.name}`);
                        await FileUtils.instance.symlinkSync(fromPath, toPath);
                        await FileUtils.instance.symlinkSync(`${fromPath}${META}`, `${toPath}${META}`)
                    }
                }
            } else if (v.type == SyncType.SINGLE) {
                fromPath = join(fromRoot, v.from)
                await FileUtils.instance.symlinkSync(fromPath, join(toRoot, `${v.to}`));
            } else if (v.type == SyncType.CUR_FILE_AND_META) {
                fromPath = join(fromRoot, v.from)
                await FileUtils.instance.symlinkSync(fromPath, join(toRoot, `${v.to}`));
                await FileUtils.instance.symlinkSync(`${fromPath}${META}`, join(toRoot, `${v.to}${META}`));
            }
        }
        this.log(`链接${tag}`, true);
    }

    /**
     * @description 链接扩展插件代码
     */
    async symlinkSyncExtensions() {
        this.log(`链接扩展插件代码`, false);

        for (let i = 0; i < this.extensions.length; i++) {
            const element = this.extensions[i];
            let toPath = join(this.extensionsPath, `${element}/src/core`);
            let formPath = join(__dirname, `core`);
            //core 部分代码
            if (Environment.isLinkCore(element)) {
                this.logger.log(`链接core`);
                await FileUtils.instance.symlinkSync(formPath, toPath);
            }

            //node_modules 依赖
            if (Environment.isLinkNodeModules(element)) {
                this.logger.log(`链接node_modules`);
                formPath = this.node_modules;
                toPath = join(this.extensionsPath, `${element}/node_modules`);
                await FileUtils.instance.symlinkSync(formPath, toPath);
            }


            //链接实现
            if (Environment.isLinkImpl(element)) {
                this.logger.log(`链接Impl`);
                formPath = join(__dirname, element);
                toPath = join(this.extensionsPath, `${element}/src/impl`);
                await FileUtils.instance.symlinkSync(formPath, toPath);
            }

            //链接声明部分
            this.logger.log(`链接声明部分`);
            formPath = join(__dirname, `../@types`);
            toPath = join(this.extensionsPath, `${element}/@types`);
            await FileUtils.instance.symlinkSync(formPath, toPath);
        }

        this.log(`链接扩展插件代码`, true);
    }

    async installProtobufJS() {
        this.log("安装 protobufjs", false);
        this.chdir(join(this.projPath, "proj"));
        await this.exec("npm install");
        this.log("安装 protobufjs", true);
    }

    /**@description 引擎修改 */
    async fixEngine() {
        this.log(`引擎修正`, false);
        this._fixEngine.run();
        this.log(`引擎修正`, true);
    }

    async gulp() {
        this.log(`Gulp`, false);
        await this._gulp.run();
        this.log(`Gulp`, true);
    }

    async linkGulp() {
        this.log(`链接 gulpfile.js`, false);
        let path = "gulp-compress/gulpfile.js";
        await FileUtils.instance.copyFile(join(__dirname, path), join(__dirname, `../dist/${path}`));
        this.log(`链接 gulpfile.js`, true);
    }

    async getAssets() {
        await this._assets.getAssets();
    }

    /**
     * @description 图集压缩
     */
    async pngCompress() {
        this.log(`图片压缩`, false);
        await this._pngCompress.onAfterBuild(Environment.build);
        this.log(`图片压缩`, true);
    }

    async hotupdate() {
        this.log(`打包热更新`, false);
        await this._hotupdate.run();
        this.log(`打包热更新`, true);
    }

    async updateQuick() {
        this.log(`更新框架`, false);
        this.chdir(this.projPath)
        this.exec("git pull")
        this.log(`更新框架`, true);
    }

}