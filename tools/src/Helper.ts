import archiver from "archiver";
import { createReadStream, createWriteStream, existsSync, readdirSync, statSync } from "fs";
import { join, relative } from "path";
import { Extensions } from "./core/Defines";
import FileUtils from "./core/FileUtils";
import { Handler } from "./core/Handler";
import * as FixEngine from "./fix_engine/Helper";
import * as Gulp from "./gulp-compress/Helper";
import * as Assets from "./core/AssetsHelper";
import * as PngCompress from "./png-compress/Helper";
import { Environment } from "./core/Environment";

/**
 * @description 辅助类
 */
export class Helper extends Handler {

    private static _instance: Helper = null!;
    static get instance() {
        return this._instance || (this._instance = new Helper);
    }

    /**@description Bunldes 地址 */
    private readonly bundlesUrl = "https://gitee.com/top-discover/QuickFrameworkBundles.git";

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

    /**@description 摘取远程bundles */
    async gitBundles() {
        this.log("摘取远程bundles", false);
        let branch = await this.gitCurBranch();

        if (existsSync(this.bundlesPath)) {
            this.logger.log(`已经存在 : ${this.bundlesPath}`);
            this.chdir(this.bundlesPath);
            let result = await this.exec("git pull");
            this.logger.log(`正在更新 : ${this.bundleName}`)
            if (!result.isSuccess) {
                return;
            }
            result = await this.exec(`git checkout ${branch}`);
            if (result.isSuccess) {
                this.logger.log(`切换分支${branch}成功 : ${this.bundleName}`)
            }
        } else {
            this.logger.log(`不存在 : ${this.bundlesPath}`);
            this.chdir(this.projPath);
            this.logger.log(`拉取远程 : ${this.bundleName}`)
            let result = await this.exec(`git clone ${this.bundlesUrl} ${this.bundleName}`);
            if (!result.isSuccess) {
                return;
            }
            this.logger.log(`摘取成功 : ${this.bundleName}`);
            this.chdir(this.bundlesPath);
            result = await this.exec(`git checkout ${branch}`);
            if (result.isSuccess) {
                this.logger.log(`切换分支${branch}成功 : ${this.bundleName}`)
            }
        }
        this.log("摘取远程bundles", true);
    }

    /**@description 链接代码 */
    symlinkSyncCode() {
        this.log("链接代码", false);
        let fromPath = join(this.bundlesPath, this.bundleName);
        FileUtils.instance.symlinkSync(fromPath, this.syncBundlesPath)
        this.log("链接代码", true);
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
            this.logger.log(`链接core`);
            FileUtils.instance.symlinkSync(formPath, toPath);
            //node_modules 依赖
            this.logger.log(`链接node_modules`);
            formPath = this.node_modules;
            toPath = join(this.extensionsPath,`${element}/node_modules`);
            FileUtils.instance.symlinkSync(formPath,toPath);

            //链接实现
            this.logger.log(`链接Impl`);
            formPath = join(__dirname, element);
            toPath = join(this.extensionsPath, `${element}/src/impl`);
            FileUtils.instance.symlinkSync(formPath, toPath);

            if ( element == Extensions.GulpCompress){
                formPath = join(__dirname, `${element}/gulpfile.js`);
                toPath = join(this.extensionsPath, `${element}/dist/impl/gulpfile.js`);
                FileUtils.instance.symlinkSync(formPath, toPath,"file");
            }

            //链接声明部分
            this.logger.log(`链接声明部分`);
            formPath = join(__dirname,`../@types`);
            toPath = join(this.extensionsPath,`${element}/@types`);
            FileUtils.instance.symlinkSync(formPath,toPath);
        }

        this.log(`链接扩展插件代码`, true);
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
        FileUtils.instance.copyFile(join(__dirname,path),join(__dirname,`../dist/${path}`));
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

    private getFilesFromPath(path: string, root: string, outFiles: { name: string, path: string }[]) {
        if (!existsSync(path)) {
            return null;
        }

        let readDir = readdirSync(path);
        for (let i = 0; i < readDir.length; i++) {
            let file = readDir[i];
            let fullPath = join(path, file);
            let stat = statSync(fullPath);
            if (stat.isFile()) {
                outFiles.push({ name: relative(root, fullPath), path: fullPath });
            } else {
                stat.isDirectory() && this.getFilesFromPath(fullPath, root, outFiles);
            }
        }
    }

    async zipArchive() {

        let out: { name: string, path: string }[] = [];
        let root = `D:/workspace/QuickFramework331/proj/build/windows/assets`;
        this.getFilesFromPath(root, root, out);


        let arch = archiver("zip", {
            zlib: { level: 9 }
        });

        let output = createWriteStream(`D:/workspace/QuickFramework331/test.zip`);

        arch.pipe(output);

        for (let i = 0; i < out.length; i++) {
            arch.append(createReadStream(out[i].path), { name: out[i].name })
        }

        arch.once("close", () => {
            this.logger.log("close")
        })

        arch.once("end", () => {
            this.logger.log("end");
        })

        arch.once("error", () => {
            this.logger.log("error")
        })

        arch.finalize();
        this.logger.log("ssssssssssss");

    }

}