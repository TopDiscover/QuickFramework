import { existsSync, readFileSync, statSync, writeFileSync } from "fs";
import { join, normalize, parse } from "path";
import Config from "../core/Config";
import { ApkJson, BundleInfo, Extensions, FileResult, HotupdateConfig, Manifest, VersionDatas, VersionJson } from "../core/Defines";
import { Environment } from "../core/Environment";
import FileUtils from "../core/FileUtils";

/**
 * @description 界面代理
 */
export interface UIDelegate {
    /**
     * @description 设置当前处理状态
     * @param isProcessing 
     */
    onSetProcess(isProcessing: boolean): void;
    /**
     * @description 更新版本文件创建进度
     * @param percent 
     */
    onUpdateCreateProgress(percent: number): void;
    /**
     * @description 设置版本号
     */
    onSetVersion(version: string): void;
}

/**
 * @description 注意，热更新会直接使用插件生成的，命令行运行时，请手动修改热更新相关配置
 */
export default class Helper extends Config<HotupdateConfig> implements UIDelegate {
    onUpdateCreateProgress(percent: number): void {
        this.logger.log(`${this.module}当前进度 : (${this.cur}/${this.total}) ${percent}`);
        // Editor.Message.send(PACKAGE_NAME, "updateCreateProgress", value);
    }

    onSetProcess(isProcessing: boolean): void {
        // Editor.Message.send(PACKAGE_NAME, "onSetProcess", true);
    }

    onSetVersion(version: string): void {
        this.logger.log(`${this.module}设置版本号 : ${version}`);
        if (this.data) {
            this.data.version = version;
            let bundles = Object.keys(this.data.bundles);
            bundles.forEach(v => {
                this.data!.bundles[v].version = version;
            })
            this.save();
        }
    }

    module = "【热更新】";

    get path() {
        let out = join(this.configPath, `${Extensions.Hotupdate}.json`);
        return out;
    }

    get data() {
        if (!this._data) {
            this.read(true);
            this.toCommand();
        }
        return this._data;
    }

    readonly defaultData: HotupdateConfig = {
        version: "1.0",
        appVersion: "1.0",
        serverIP: "",
        historyIps: [],
        buildDir: "",
        bundles: {},
        remoteDir: "",
        autoCreate: true,
        autoDeploy: false,
        isAutoVersion: true,
    }

    readonly mainJS = "main.js";

    private _mainBundleIncludes: string[] = null!;
    /**
     * @description 主包包含目录
     */
    /**@description 返回需要添加到主包版本的文件目录 */
    private get mainBundleIncludes() {
        if (!this._mainBundleIncludes) {
            this._mainBundleIncludes = ["src", "jsb-adapter", "assets/resources", "assets/main", this.mainJS , "assets/internal"];
        }
        return this._mainBundleIncludes;
    }

    private _cur = 0;
    /**@description 当前进度 */
    private get cur() {
        return this._cur;
    }
    private set cur(v) {
        this._cur = v;
        this.onUpdateCreateProgress(this.percent);
    }
    /**@description 文件总数 */
    private total = 0;

    /**
     * @description 是否是部署
     */
    protected isDeploy = false;

    private get percent() {
        if (this.total <= 0) {
            return 100;
        }
        let value = (this.cur / this.total) * 100;
        return value;
    }

    private _curExtensionPath: string = null!;
    get curExtensionPath() {
        if (!this._curExtensionPath) {
            this._curExtensionPath = join(this.extensionsPath, Extensions.Hotupdate);
        }
        return this._curExtensionPath;
    }

    private _remoteBundles: { [key: string]: BundleInfo } = null!;
    get remoteBundles() {
        if (this._remoteBundles) {
            return this._remoteBundles;
        }
        this.reloadRemoteBundles();
        return this._remoteBundles;
    }

    /**
     * @description 命令行数据转换
     */
    private toCommand() {
        if (Environment.isCommand && this._data) {
            if (Environment.isVersion3X) {
                this._data.buildDir = join(Environment.build.dest, "data");
            } else {
                this._data.buildDir = Environment.build.dest;
            }
        }
    }

    private reloadRemoteBundles() {
        this._remoteBundles = JSON.parse(JSON.stringify(this.data!.bundles));
        Object.keys(this._remoteBundles).forEach((key) => {
            this._remoteBundles[key].md5 = this.getBundleVersion(key);
        });
    }

    /**
     * @description 刷新测试环境子包信息
     * @param {*} key 
     */
    protected getBundleVersion(key: string) {
        if (this.data && this.data.remoteDir.length > 0) {
            let versionManifestPath = join(this.data.remoteDir, `manifest/${key}_version.json`);
            if (existsSync(versionManifestPath)) {
                let data = readFileSync(versionManifestPath, { encoding: "utf-8" });
                let config = JSON.parse(data);
                return this.getShowRemoteString(config);
            } else {
                this.logger.log(`${this.module}${versionManifestPath}不存在`)
            }
        }
        return "-";
    }

    /**@description 返回远程版本号+md5 */
    private getShowRemoteString(config: { md5: string, version: string }) {
        return `[${config.version}] : ${config.md5}`;
    }
    /**@description 远程版本号 */
    get remoteVersion() {
        return this.getBundleVersion("main");
    }

    /**@description 获取bundle版本 */
    getVersion(dir?: string) {
        if (dir) {
            return this.getBundleVersion(dir);
        } else {
            return this.remoteVersion;
        }
    }

    private checkData() {
        //当前所有bundle
        let bundles = this.projBundles;
        let isChange = false;
        //删除处理
        Object.keys(this._data!.bundles).forEach((value) => {
            if (!bundles.includes(value)) {
                delete this._data!.bundles[value];
                this.logger.log(`${this.module}删除不存在Bundle:${value}`);
                isChange = true;
            }
        });

        //新增处理
        let curBundles = Object.keys(this._data!.bundles);
        for (let i = 0; i < bundles.length; i++) {
            if (!curBundles.includes(bundles[i])) {
                let bundleInfo: BundleInfo = {
                    version: "1.0",
                    dir: bundles[i],
                    name: bundles[i],
                    includeApk: true,
                    md5: "-",
                }
                this._data!.bundles[bundleInfo.dir] = bundleInfo;
                this.logger.log(`${this.module}添加Bundle:${bundles[i]}`);
                isChange = true;
            }
        }
        return isChange;
    }

    read(isReload = false) {
        if (this.path) {
            if (!isReload && this._data) {
                return;
            }
            if (existsSync(this.path)) {
                let data = readFileSync(this.path, "utf-8");
                let source = JSON.parse(data);
                this._data = source;
                this.checkData() && this.save();
            } else {
                if (this.defaultData) {
                    this._data = this.defaultData;
                    this._data.autoCreate = true;
                    this._data.autoDeploy = false;
                    this._data.remoteDir = "";
                    let bundles = this.projBundles;
                    for (let i = 0; i < bundles.length; i++) {
                        let bundleInfo: BundleInfo = {
                            version: "1.0",
                            dir: bundles[i],
                            name: bundles[i],
                            includeApk: true,
                            md5: "-",
                        }
                        this._data.bundles[bundleInfo.dir] = bundleInfo;
                    }
                    this.save();
                }
            }
        }
    }

    private _zipPath: string = null!;
    /**
     * @description 生成的zip保存路径
     */
    private get zipPath() {
        if (!this._zipPath) {
            this._zipPath = join(this.projPath, "proj/zips");
        }
        return this._zipPath;
    }

    /**
     * @description 获取当前项目所有的bundle
     */
    private get projBundles() {
        let result = FileUtils.instance.getDirs(this.assetsBundlesPath);
        let bundles: string[] = [];
        result.forEach(v => {
            bundles.push(v.name);
        });
        return bundles;
    }

    /**
     * @description 获取保存的zip路径
     * @param bundle 
     * @param md5 
     * @returns 
     */
    private getZip(bundle: string, md5?: string) {
        return join(this.zipPath, `${bundle}_${md5}.zip`);
    }

    /**
     * @description 打包完成后，调用
     */
    async run() {
        // await this.createManifest();
        // await this.deployToRemote();
        // return;
        let data = this.data!;
        // 插入热更新代码 此步骤不再需要
        // if (Environment.isVersion3X) {
        //     await this.insertHotupdate(join(data.buildDir, "../"));
        // } else {
        //     await this.insertHotupdate(data.buildDir);
        // }

        if (data.autoCreate) {
            //如果开启了自动创建 版本文件
            await this.createManifest();
            if (data.autoDeploy && data.remoteDir.length > 0) {
                //如果开启了自动部署
                await this.deployToRemote();
            }
            //删除未包含在包内的bundle
            await this.removeNotInApkBundle();
        }
    }

    getManifestDir(buildDir: string) {
        if (buildDir && buildDir.length > 0) {
            return join(buildDir, "manifest");
        } else {
            return "";
        }
    }

    private insertVersionData(
        source: VersionDatas,
        bundle: string | undefined,
        project: Manifest,
        version: Manifest,
        projectPath: string,
        versionPath: string,
        md5: string) {
        if (bundle) {
            source[bundle] = {
                project: project,
                version: version,
                projectPath: projectPath,
                versionPath: versionPath,
                md5: md5
            }
        }
    }


    private async zipVersions(versions: { [key: string]: { md5: string, version: string } }) {
        let data = this.data!;
        let mainIncludes = this.mainBundleIncludes;
        let paths: string[] = [];
        let append: FileResult[] = [];
        for (let i = 0; i < mainIncludes.length; i++) {
            const element = mainIncludes[i];
            let fullPath = join(data.buildDir, element);
            fullPath = normalize(fullPath);
            if (element == this.mainJS) {
                append = FileUtils.instance.getFiles(data.buildDir, undefined, data.buildDir, true);
            } else {
                paths.push(fullPath);
            }
        }
        //先做一分备份，把当前zip目录备份出来，如果打包的内容md5没有变化，不再进行打包
        let tempZipPath = `${this.zipPath}_temp`;
        await FileUtils.instance.copyDir(this.zipPath, tempZipPath)
        //删除之前的版本包
        await FileUtils.instance.delDir(this.zipPath);
        FileUtils.instance.createDir(this.zipPath);
        this.logger.log(`${this.module}打包路径 : ${this.zipPath}`);
        let zipPath = this.getZip("main", versions["main"].md5)
        let result = parse(zipPath);
        let tempMainPath = join(tempZipPath, `${result.name}${result.ext}`);
        if (existsSync(tempMainPath)) {
            this.logger.log(`${this.module}打包内容未发生改变，不再重新生成${result.name}${result.ext}`);
            await FileUtils.instance.copyFile(tempMainPath, zipPath);
            this.cur = this.cur + 1;
        } else {
            this.logger.log(`${this.module}正在打包 : ${parse(zipPath).name}`);
            await FileUtils.instance.archive(paths, zipPath, data.buildDir, append);
            this.cur = this.cur + 1;
            this.logger.log(`${this.module}打包完成 : ${parse(zipPath).name}`);
        }

        let bundles = Object.keys(data.bundles)

        //打包子版本
        for (let i = 0; i < bundles.length; i++) {
            let bundle = bundles[i];
            zipPath = this.getZip(bundle, versions[bundle].md5);
            result = parse(zipPath);
            tempMainPath = join(tempZipPath, `${result.name}${result.ext}`);
            if (existsSync(tempMainPath)) {
                this.logger.log(`${this.module}打包内容未发生改变，不再重新生成${result.name}${result.ext}`);
                await FileUtils.instance.copyFile(tempMainPath, zipPath);
                this.cur = this.cur + 1;
            } else {
                this.logger.log(`${this.module}正在打包 : ${parse(zipPath).name}`);
                let fullPath = join(data.buildDir, `assets/${bundle}`);
                await FileUtils.instance.archive(fullPath, zipPath, data.buildDir);
                this.cur = this.cur + 1;
                this.logger.log(`${this.module}打包完成 : ${parse(zipPath).name}`);
            }
        }

        //删除 temp 目录
        await FileUtils.instance.delDir(tempZipPath);

        // let assets = {};
        // FileUtils.instance.md5Dir(this.zipPath,assets,this.zipPath);
        // console.log(assets);
    }

    /**@description 生成版本文件 */
    private createVersionFile(source: VersionDatas) {
        this.logger.log(`${this.module}准备生成版本控制文件`);
        //更新版本控制文件中zip大小
        let isAutoVersion = this.data!.isAutoVersion;
        let version = this.date;
        let keys = Object.keys(source);
        if (isAutoVersion) {
            this.onSetVersion(version);
        }
        keys.forEach(bundle => {
            let data = source[bundle];
            let zipPath = this.getZip(bundle, data.md5);
            data.project.size = statSync(zipPath).size

            if (isAutoVersion) {
                data.project.version = version;
            }
            writeFileSync(data.projectPath, JSON.stringify(data.project));
            let temp = parse(data.projectPath);
            this.logger.log(`${this.module}生成${temp.name}${temp.ext}成功`);
            this.cur = this.cur + 1;

            if (isAutoVersion) {
                data.version.version = version;
            }
            writeFileSync(data.versionPath, JSON.stringify(data.version));
            temp = parse(data.versionPath);
            this.logger.log(`${this.module}生成${temp.name}${temp.ext}成功`);
            this.cur = this.cur + 1;
        })
        this.onSetProcess(false);
        this.logger.log(`${this.module}生成完成`);
    }

    /**
     * @description 创建Manifest版本文件
     */
    createManifest() {
        return new Promise<boolean>(async (resolve) => {
            this.isDeploy = false;
            this.onSetProcess(true);
            this.save();
            this.logger.log(`${this.module}当前用户配置 : `, this.data);
            this.logger.log(`${this.module}开始生成版本控制文件`);
            let data = this.data!;
            let version = data.version;
            let appVersion = data.appVersion;
            this.logger.log(`${this.module}App版本号:${appVersion}`)
            this.logger.log(`${this.module}主包版本号:${version}`);
            let buildDir = data.buildDir;
            buildDir = normalize(buildDir);
            this.logger.log("构建目录:", buildDir);
            let manifestDir = this.getManifestDir(buildDir);
            manifestDir = normalize(manifestDir);
            this.logger.log("构建目录下的Manifest目录:", manifestDir);
            let serverUrl = data.serverIP;
            this.logger.log("热更新地址:", serverUrl);
            let subBundles = Object.keys(data.bundles);
            this.logger.log("所有子包:", subBundles);
            let manifest: Manifest = {
                assets: {},
                bundle: "main"
            };

            this._cur = 0;
            //文件数量
            this.total = (subBundles.length + 1) * 2;
            //压缩包数量
            this.total += (subBundles.length + 1);
            //所有版本文件
            this.total++;
            //生成主包内置版本号，该文件不会更新
            this.total++;

            //删除旧的版本控件文件
            this.logger.log("删除旧的Manifest目录", manifestDir);
            if (existsSync(manifestDir)) {
                this.logger.log("存在旧的，删除掉");
                await FileUtils.instance.delDir(manifestDir);
            }
            FileUtils.instance.createDir(manifestDir);

            //读出主包资源，生成主包版本
            let mainIncludes = this.mainBundleIncludes;
            for (let i = 0; i < mainIncludes.length; i++) {
                let v = mainIncludes[i];
                if (v == this.mainJS) {
                    FileUtils.instance.md5Dir(buildDir, manifest.assets!, buildDir, true);
                } else {
                    FileUtils.instance.md5Dir(join(buildDir, mainIncludes[i]), manifest.assets!, buildDir);
                }
            }

            let versionDatas: VersionDatas = {};

            //生成project.manifest
            let projectManifestPath = join(manifestDir, "main_project.json");
            let versionManifestPath = join(manifestDir, "main_version.json");
            let content = JSON.stringify(manifest);
            let md5 = FileUtils.instance.md5(content);
            manifest.md5 = md5;
            manifest.version = version;

            let projectData = JSON.parse(JSON.stringify(manifest));
            delete manifest.assets;
            let versionData = JSON.parse(JSON.stringify(manifest))
            this.insertVersionData(
                versionDatas,
                manifest.bundle,
                projectData,
                versionData,
                projectManifestPath,
                versionManifestPath,
                md5
            );


            //生成所有版本控制文件，用来判断当玩家停止在版本1，此时发版本2时，不让进入游戏，返回到登录，重新走完整个更新流程
            let versions: VersionJson = {
                main: { md5: md5, version: version },
            }

            //生成各bundles版本文件
            for (let i = 0; i < subBundles.length; i++) {
                let key = subBundles[i];
                let manifest: Manifest = {
                    assets: {},
                    bundle: key
                };
                FileUtils.instance.md5Dir(join(buildDir, `assets/${key}`), manifest.assets!, buildDir);
                projectManifestPath = join(manifestDir, `${key}_project.json`);
                versionManifestPath = join(manifestDir, `${key}_version.json`);

                let content = JSON.stringify(manifest);
                let md5 = FileUtils.instance.md5(content);
                manifest.md5 = md5;
                manifest.version = data.bundles[key].version

                projectData = JSON.parse(JSON.stringify(manifest));
                delete manifest.assets;
                versionData = JSON.parse(JSON.stringify(manifest));

                versions[`${key}`] = {} as any;
                versions[`${key}`].md5 = md5;
                versions[`${key}`].version = manifest.version;
                this.insertVersionData(
                    versionDatas,
                    manifest.bundle,
                    projectData,
                    versionData,
                    projectManifestPath,
                    versionManifestPath,
                    md5
                );
            }

            //写入所有版本
            let versionsPath = join(manifestDir, `versions.json`);
            writeFileSync(versionsPath, JSON.stringify(versions));
            this.logger.log(`${this.module}生成versions.json成功`);
            this.cur = this.cur + 1;

            //定入主包内置版本号，即apk版本号
            let apkVersionPath = join(manifestDir, `apk.json`);
            let apkJson: ApkJson = { version: appVersion }
            writeFileSync(apkVersionPath, JSON.stringify(apkJson));
            this.cur = this.cur + 1;

            await this.zipVersions(versions);
            this.createVersionFile(versionDatas);
            resolve(true);
        })
    }

    /**@description 删除不包含在包内的所有bundles */
    async removeNotInApkBundle() {
        this.onSetProcess(true)
        this.read(true);
        let data = this.data!;
        let keys = Object.keys(data.bundles);
        let removeBundles: string[] = [];
        keys.forEach((key) => {
            if (!data.bundles[key].includeApk) {
                removeBundles.push(key);
            }
        });
        let manifests = [];
        let removeDirs = [];
        for (let i = 0; i < removeBundles.length; i++) {
            let key = removeBundles[i];
            removeDirs.push(join(data.buildDir, `assets/${key}`));
            manifests.push(join(data.buildDir, `manifest/${key}_project.json`));
            manifests.push(join(data.buildDir, `manifest/${key}_version.json`));
        }

        for (let i = 0; i < removeDirs.length; i++) {
            this.logger.log(`${this.module}删除目录 : ${removeDirs[i]}`);
            await FileUtils.instance.delDir(removeDirs[i]);
        }

        for (let i = 0; i < manifests.length; i++) {
            this.logger.log(`${this.module}删除版本文件 : ${manifests[i]}`);
            FileUtils.instance.delFile(manifests[i]);
        }
        this.onSetProcess(false);
    }

    /**
     * @description 部署到本地测试服务器，后面可以考虑支持上传到远程
     */
    async deployToRemote() {
        this.isDeploy = true;
        let data = this.data!;
        if (data.remoteDir.length <= 0) {
            this.logger.log(`${this.module}请先选择本地服务器目录`);
            return;
        }
        // if (!existsSync(data.remoteDir)) {
        //     this.logger.log(`${this.module}本地测试服务器目录不存在 : ${data.remoteDir}`);
        //     return;
        // }
        if (!existsSync(data.buildDir)) {
            this.logger.log(`${this.module}构建目录不存在 : ${data.buildDir} , 请先构建`);
            return;
        }
        this.onSetProcess(true);
        let includes = this.mainBundleIncludes

        let temps = [];
        for (let i = 0; i < includes.length; i++) {
            //只保留根目录
            let dir = includes[i];
            if (dir == this.mainJS) {
                temps.push(dir);
                continue;
            }
            let index = dir.search(/\\|\//);
            if (index == -1) {
                if (temps.indexOf(dir) == -1) {
                    temps.push(dir);
                }
            } else {
                dir = dir.substring(0, index);
                if (temps.indexOf(dir) == -1) {
                    temps.push(dir);
                }
            }
        }

        let copyDirs = ["manifest"].concat(temps);
        for (let i = 0; i < copyDirs.length; i++) {
            let dir = join(data.buildDir, copyDirs[i]);
            dir = normalize(dir);
            if (!existsSync(dir)) {
                this.logger.log(`${this.module}${data.buildDir}不存在${copyDirs[i]}目录,无法拷贝文件`);
                return;
            }
        }

        this.logger.log(`${this.module}开始拷贝文件到 : ${data.remoteDir}`);
        this._cur = 0;
        this.total = 1 + copyDirs.length;
        this.logger.log(`${this.module}删除旧目录 : ${data.remoteDir}`);
        await FileUtils.instance.delDir(data.remoteDir);
        FileUtils.instance.createDir(data.remoteDir);
        this.cur = 0;
        for (let i = 0; i < copyDirs.length; i++) {
            let source = join(data.buildDir, copyDirs[i]);
            let dest = join(data.remoteDir, copyDirs[i]);
            if (copyDirs[i] == this.mainJS) {
                await FileUtils.instance.copyFile(source, dest);
            } else {
                // this.logger.log(`${this.module}准备复制${source} => ${dest}`);
                await FileUtils.instance.copyDir(source, dest);
                // this.logger.log(`${this.module}复制完成${source} => ${dest}`);
            }
            this.cur = this.cur + 1;
        }


        let source = this.zipPath
        let dest = join(data.remoteDir, "zips");
        // this.logger.log(`${this.module}准备复制${source} => ${dest}`);
        await FileUtils.instance.copyDir(source, dest);
        // this.logger.log(`${this.module}复制完成${source} => ${dest}`);
        this.cur = this.cur + 1;
        this.logger.log(`${this.module}全部完成`);
        this.onSetProcess(false);
    }

    /**@description 插入热更新代码*/
    async insertHotupdate(dest: string) {
        if (Environment.isVersion3X) {
            let codePath = join(this.curExtensionPath, "code/hotupdate.js");
            let code = readFileSync(codePath, "utf8");
            // console.log(code);
            let sourcePath = join(dest, `assets/${this.mainJS}`);
            sourcePath = normalize(sourcePath);
            let sourceCode = readFileSync(sourcePath, "utf8");
            let templateReplace = function templateReplace() {
                return arguments[1] + code + arguments[3];
            }
            //添加子游戏测试环境版本号
            sourceCode = sourceCode.replace(/(\);)([\s\w\S]*)(const[ ]*importMapJson)/g, templateReplace);
            this.logger.log(`${this.module}向${sourcePath}中插入热更新代码`);
            writeFileSync(sourcePath, sourceCode, { "encoding": "utf8" });
        } else {
            let mainJSPath = join(dest, this.mainJS);
            let content = readFileSync(mainJSPath, "utf-8");
            content = content.replace(/if\s*\(\s*window.jsb\)\s*\{/g,
                `if (window.jsb) {
        var hotUpdateSearchPaths = localStorage.getItem('HotUpdateSearchPaths');
        if (hotUpdateSearchPaths) {
            jsb.fileUtils.setSearchPaths(JSON.parse(hotUpdateSearchPaths));
        }`);
            writeFileSync(mainJSPath, content, "utf-8");
            this.logger.log(`${this.module}热更新代码：${mainJSPath}`);
        }
    }
}