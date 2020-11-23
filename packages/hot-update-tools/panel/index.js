"use strict";
window.packageRoot = "packages://hot-update-tools/";
const fs = require("fire-fs");
const path = require("fire-path");
const Electron = require("electron"),
    CfgUtil = Editor.require("packages://hot-update-tools/core/CfgUtil.js"),
    FileUtil = Editor.require("packages://hot-update-tools/core/FileUtil.js"),
    GoogleAnalytics = Editor.require("packages://hot-update-tools/core/GoogleAnalytics.js");


//读取界面
let _template = fs.readFileSync(Editor.url("packages://hot-update-tools/panel/index.html", "utf8")) + "";
//先读取子游戏配置
let _gamesPath = `${Editor.Project.path}/packages/config/bundles.json`;
//_gamesPath = path.normalize(_gamesPath);
let _gamesConfig = fs.readFileSync(_gamesPath);
_gamesConfig = JSON.parse(_gamesConfig);
let _subGameVersion = {};
//生成子游戏版本控制界面
//生成子游戏测环境版本号
let _subGameServerVersionView = ``;
let _subGameVersionView = ``;
let _subGameServerVersion = {};
let _hallVersion = `1`;
//子游戏是否包含
let _subGameInclude = {};
for (let i = 0; i < _gamesConfig.bundles.length; i++) {
    let gameInfo = _gamesConfig.bundles[i];
    if (gameInfo.dir && gameInfo.dir.length > 0) {
        _subGameVersionView += `
        <ui-prop name="${gameInfo.name}(${gameInfo.dir})">
            <div class="flex-1 layout horizontal center">
                <ui-checkbox v-value = "subGameInclude.${gameInfo.dir}"> 是否包含在原始包内 </ui-checkbox>
                <ui-input class="flex-1" v-on:blur="onInputSubVersionOver(null,'${gameInfo.dir}')" v-value="subGameVersion.${gameInfo.dir}"></ui-input>
            </div>
        </ui-prop>
        `;
        _subGameVersion[`${gameInfo.dir}`] = gameInfo.version;
        _subGameInclude[`${gameInfo.dir}`] = gameInfo.includeApk;
        _subGameServerVersion[`${gameInfo.dir}`] = '-';
        _subGameServerVersionView += `
        <ui-prop name="${gameInfo.name}(${gameInfo.dir})">
            <div class="flex-1 layout horizontal center">
                <h4 class="flex-2">{{subgameServerVersion.${gameInfo.dir}}}</h4>
                <ui-button class="end-justified" v-on:confirm="refreshLocalServerSubGameVersion(null,'${gameInfo.dir}')"><i
                    class="icon-arrows-cw"></i></ui-button>
            </div>
        </ui-prop>
        `;
    }
    if ( gameInfo.id == "0" ){
        _hallVersion = gameInfo.version;
    }
}

let templateReplaceManifest = function templateReplace() {
    return arguments[1] + _subGameVersionView + arguments[3];
}
//添加子游戏版本配置
_template = _template.replace(/(<!--subgame start-->)([\s\w\S]*)(<!--subgame end-->)/g, templateReplaceManifest);

let templateReplaceTestManifest = function templateReplace() {
    return arguments[1] + _subGameServerVersionView + arguments[3];
}
//添加子游戏测试环境版本号
_template = _template.replace(/(<!--subgame test start-->)([\s\w\S]*)(<!--subgame test end-->)/g, templateReplaceTestManifest);


Editor.Panel.extend({
    style: fs.readFileSync(Editor.url("packages://hot-update-tools/panel/index.css", "utf8")) + "",
    template: _template,
    $: {
        logTextArea: "#logTextArea",
        hotAddressSelect: "#hotAddressSelect"
    },
    ready() {
        GoogleAnalytics.init(), GoogleAnalytics.eventOpen();
        let e = this.$logTextArea,
            t = this.$hotAddressSelect;
        window.hotAddressSelectCtrl = t;
        window.plugin = new window.Vue({
            el: this.shadowRoot,
            created: function () {
                this._initPluginCfg()
            },
            init: function () {},
            data: {
                srcDirPath: "",
                resDirPath: "",
                version: _hallVersion,
                remoteServerVersion: "",
                isShowRemoteServerVersion: !1,
                genManifestDir: "",
                serverRootDir: "",
                resourceRootDir: "",
                localServerPath: "",
                logView: "",
                copyProgress: 0,
                totalNum: 0,
                curNum: 0,
                serverVersion: "-",
                subgameServerVersion:_subGameServerVersion,
                serverPackageUrl: "",
                localGameVersion: "-",
                localGamePackageUrl: "",
                localGameProjectManifest: "",
                localGameVersionManifest: "",
                localGameProjectManifestUrl: "",
                localGameVersionManifestUrl: "",
                isShowUseAddrBtn: !1,
                isShowDelAddrBtn: !1,
                hotAddressArray: [],
                subGameVersion: _subGameVersion,
                originSubGameVersion : JSON.parse(JSON.stringify(_subGameVersion)),
                subGameInclude : JSON.parse(JSON.stringify(_subGameInclude))
            },
            computed: {},
            methods: {
                _packageDir(e, t) {
                    let i = fs.readdirSync(e);
                    for (let s = 0; s < i.length; s++) {
                        let r = i[s],
                            o = path.join(e, r),
                            n = fs.statSync(o);
                        n.isFile() ? t.file(r, fs.readFileSync(o)) : n.isDirectory() && this._packageDir(o, t.folder(r))
                    }
                },
                _packageVersion() {
                    this._addLog("[Pack] 开始打包版本 ...");
                    let jszip = new(Editor.require("packages://hot-update-tools/node_modules/jszip")),
                        versionManifest = path.join(this.genManifestDir, "version.manifest");
                    //把包src目录的代码资源
                    let src = path.join(this.resourceRootDir, "src");
                    this._packageDir(src, jszip.folder("src"));
                    //批包assets目录的代码资源
                    let assets = path.join(this.resourceRootDir, "assets");
                    this._packageDir(assets, jszip.folder("assets"));

                    //打包manifest的版本文件
                    let manifest = path.join(this.resourceRootDir, "manifest");
                    this._packageDir(manifest, jszip.folder("manifest"));

                    let mainVersionManifest = fs.readFileSync(versionManifest, "utf-8"),
                        mainVersion = JSON.parse(mainVersionManifest).version;
                    if (this._addLog("[Pack] 打包版本:" + mainVersion), mainVersion !== this.version) return void this._addLog("[Pack] 打包版本和当前填写的版本不一致,出现异常,停止打包!");
                    let packZipName = "ver_" + (mainVersion = mainVersion.replace(".", "_")) + ".zip",
                        packZipRootPath = CfgUtil.getPackZipDir();
                    fs.existsSync(packZipRootPath) || fs.mkdirSync(packZipRootPath);
                    let packVersionZipPath = path.join(packZipRootPath, packZipName);
                    fs.existsSync(packVersionZipPath) && (fs.unlinkSync(packVersionZipPath), this._addLog("[Pack] 发现该版本的zip, 已经删除!")), jszip.generateNodeStream({
                        type: "nodebuffer",
                        streamFiles: !0
                    }).pipe(fs.createWriteStream(packVersionZipPath)).on("finish", function () {
                        this._addLog("[Pack] 打包成功: " + packVersionZipPath)
                    }.bind(this)).on("error", function (e) {
                        this._addLog("[Pack] 打包失败:" + e.message)
                    }.bind(this))
                },
                onBuildFinished(e) {
                    CfgUtil.updateBuildTime(e)
                },
                onChangeSelectHotAddress(e) {
                    GoogleAnalytics.eventCustom("ChangeSelectHotAddress"), this.isShowUseAddrBtn = !0, this.isShowDelAddrBtn = !0, this._updateShowUseAddrBtn()
                },
                _updateShowUseAddrBtn() {
                    let e = window.hotAddressSelectCtrl.value;
                    this.serverRootDir === e && (this.isShowUseAddrBtn = !1)
                },
                _addHotAddress(e) {
                    let t = !0;
                    for (let i = 0; i < this.hotAddressArray.length; i++) {
                        if (this.hotAddressArray[i] === e) {
                            t = !1;
                            break
                        }
                    }
                    t && (this.hotAddressArray.push(e), this._addLog("[HotAddress]历史记录添加成功:" + e))
                },
                onBtnClickDelSelectedHotAddress() {
                    let e = window.hotAddressSelectCtrl.value;
                    if (this.hotAddressArray.length > 0) {
                        let t = !1;
                        for (let i = 0; i < this.hotAddressArray.length;) {
                            let s = this.hotAddressArray[i];
                            s === e ? (this.hotAddressArray.splice(i, 1), t = !0, this._addLog("删除历史地址成功: " + s)) : i++
                        }
                        t && (this.isShowDelAddrBtn = !1, this.isShowUseAddrBtn = !1, this._saveConfig())
                    } else this._addLog("历史地址已经为空")
                },
                onBtnClickUseSelectedHotAddress() {
                    let e = window.hotAddressSelectCtrl.value;
                    this.serverRootDir = e, this.onInPutUrlOver(), this._updateShowUseAddrBtn()
                },
                _addLog(t) {
                    let i = new Date;
                    this.logView += "[" + i.toLocaleString() + "]: " + t + "\n", setTimeout(function () {
                        e.scrollTop = e.scrollHeight
                    }, 10)
                },
                _getFileIsExist(e) {
                    try {
                        fs.accessSync(e, fs.F_OK)
                    } catch (e) {
                        return !1
                    }
                    return !0
                },
                _saveConfig() {
                    let e = {
                        serverRootDir: this.serverRootDir,
                        resourceRootDir: this.resourceRootDir,
                        genManifestDir: CfgUtil.getMainFestDir(),
                        localServerPath: this.localServerPath,
                        hotAddressArray: this.hotAddressArray
                    };
                    CfgUtil.saveConfig(e)
                },
                _initPluginCfg() {
                    this.genManifestDir = CfgUtil.getMainFestDir();
                    if (!1 === FileUtil.isFileExit(this.genManifestDir)) {
                        FileUtil.mkDir(this.genManifestDir);
                    }
                    CfgUtil.initCfg(function (e) {
                        if (e) {
                            this.serverRootDir = e.serverRootDir;
                            this.resourceRootDir = e.resourceRootDir;
                            this.localServerPath = e.localServerPath;
                            this.hotAddressArray = e.hotAddressArray || [];
                            this._updateServerVersion();

                            let keys = Object.keys(this.subGameVersion);
                            for ( let i = 0 ; i < keys.length ; i++ ){
                                this._updateSubGameServerVersion(keys[i]);
                            }

                            this._getRemoteServerVersion()
                        } else {
                            this._saveConfig();
                            this._initResourceBuild();
                            this.initLocalGameVersion();
                            this._initLocalServerDir();
                        }
                    }.bind(this))
                },
                _initLocalServerDir() {
                    if (this.localServerPath && this.localServerPath.length > 0);
                    else {
                        let e = CfgUtil.getPackZipDir();
                        fs.existsSync(e) || fs.mkdirSync(e);
                        let t = path.join(e, "server");
                        fs.existsSync(t) || fs.mkdirSync(t), this.localServerPath = t
                    }
                },
                selectProjectManifestDir() {
                    let e = Editor.Dialog.openFile({
                        title: "选择导入manifest的目录",
                        defaultPath: path.join(Editor.Project.path, "assets"),
                        properties: ["openDirectory"],
                        callback: function (e) {}
                    });
                    if (-1 !== e) {
                        let t = e[0],
                            i = Editor.assetdb.remote.fspathToUrl(t);
                        this.localGameProjectManifestUrl = i, this.localGameVersionManifestUrl = i, this.importManifestToGame(), this._addLog("导入完成,请检查项目目录:" + i)
                    }
                },
                importManifestToGame() {
                    let e = path.join(this.genManifestDir, "project.manifest"),
                        t = path.join(this.genManifestDir, "version.manifest");
                    if (!fs.existsSync(e)) return void this._addLog("文件不存在: " + e);
                    if (!fs.existsSync(t)) return void this._addLog("文件不存在: " + t);
                    let i = this.localGameProjectManifestUrl.split("project.manifest")[0];
                    Editor.assetdb.import([e, t], i, function (e, t) {
                        t.forEach(function (e) {})
                    }.bind(this)), this.initLocalGameVersion()
                },
                initLocalGameVersion() {
                    Editor.assetdb.queryAssets("db://assets/**/*", null, function (e, t) {
                        let i = "",
                            s = "";
                        if (t.forEach(function (e) {
                                "version.manifest" === path.basename(e.path) ? (i = e.path, this.localGameVersionManifestUrl = e.url) : "project.manifest" === path.basename(e.path) && (s = e.path, this.localGameProjectManifestUrl = e.url)
                            }.bind(this)), 0 === i.length) return void this._addLog("项目中没有配置文件: version.manifest");
                        if (0 === s.length) return void this._addLog("项目中没有配置文件: project.manifest");
                        this.localGameVersionManifest = i, this.localGameProjectManifest = s;
                        let r = "",
                            o = "";
                        fs.readFile(i, "utf-8", function (e, t) {
                            if (e) this._addLog("读取项目中的配置文件失败: " + i);
                            else {
                                let e = JSON.parse(t);
                                r = e.version, fs.readFile(s, "utf-8", function (e, t) {
                                    if (e) this._addLog("读取项目中的配置文件失败: " + s);
                                    else {
                                        let e = JSON.parse(t);
                                        (o = e.version) === r ? (this.localGameVersion = o, this.localGamePackageUrl = e.packageUrl) : this._addLog("游戏中的 project.manifest 和 version.manifest 中的version字段值不一致,请检查配置文件")
                                    }
                                }.bind(this))
                            }
                        }.bind(this))
                    }.bind(this))
                },
                _initResourceBuild() {
                    if (0 === this.resourceRootDir.length) {
                        let e = path.join(Editor.assetdb.library, "../"),
                            t = path.join(e, "local/builder.json");
                        FileUtil.isFileExit(t) ? fs.readFile(t, "utf-8", function (t, i) {
                            if (!t) {
                                let t = JSON.parse(i).buildPath,
                                    s = path.join(e, t),
                                    r = path.join(s, "jsb-default");
                                this._checkResourceRootDir(r)
                            }
                        }.bind(this)) : this._addLog("发现没有构建项目, 使用前请先构建项目!")
                    }
                },
                _checkResourceRootDir(e) {
                    if (FileUtil.isFileExit(e)) {
                        let t = path.join(e, "src"),
                            i = path.join(e, "assets");
                        return !1 === FileUtil.isFileExit(t) ? (this._addLog("没有发现 " + t + ", 请先构建项目."), !1) : !1 === FileUtil.isFileExit(i) ? (this._addLog("没有发现 " + i + ", 请先构建项目."), !1) : (this.resourceRootDir = e, !0)
                    }
                    return this._addLog("没有发现 " + e + ", 请先构建项目."), !1
                },
                onClickGenCfg(e) {
                    GoogleAnalytics.eventCustom("GenManifest");
                    this._genVersion(this.version, this.serverRootDir, this.resourceRootDir, this.genManifestDir);
                },
                onClickDelSubGames(){
                    //弹出提示确定是否需要删除当前的子游戏
                    Editor.Panel.open('confirm_del_subgames');
                },
                _readDir(dir, obj, source) {
                    var stat = fs.statSync(dir);
                    if (!stat.isDirectory()) {
                        return;
                    }
                    var subpaths = fs.readdirSync(dir),
                        subpath, size, md5, compressed, relative;
                    for (var i = 0; i < subpaths.length; ++i) {
                        if (subpaths[i][0] === '.') {
                            continue;
                        }
                        subpath = path.join(dir, subpaths[i]);
                        stat = fs.statSync(subpath);
                        if (stat.isDirectory()) {
                            this._readDir(subpath, obj, source);
                        } else if (stat.isFile()) {
                            // Size in Bytes
                            size = stat['size'];
                            md5 = require("crypto").createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
                            compressed = path.extname(subpath).toLowerCase() === '.zip';

                            //Editor.log(source);
                            relative = path.relative(source, subpath);
                            relative = relative.replace(/\\/g, '/');
                            relative = encodeURI(relative);

                            obj[relative] = {
                                'size': size,
                                'md5': md5
                            };
                            if (compressed) {
                                obj[relative].compressed = true;
                            }
                        }
                    }
                },
                _mkdirSync(dir) {
                    try {
                        fs.mkdirSync(dir)
                    } catch (e) {
                        if ("EEXIST" !== e.code) throw e
                    }
                },
                _genVersion(version, serverRootDir, resourceRootDir, genManifestDir) {
                    //Editor.log(version, serverRootDir, resourceRootDir, genManifestDir);
                    this._addLog("[Build] 开始生成manifest配置文件....");
                    let bundles = Object.keys(this.subGameVersion);

                    let manifest = {
                        version: version,
                        packageUrl: serverRootDir,
                        remoteManifestUrl: "",
                        remoteVersionUrl: "",
                        assets: {},
                        searchPaths: [],
                        //bundles: bundles //此字段不需要了
                    };
                    if ("/" === serverRootDir[serverRootDir.length - 1]) {
                        manifest.remoteManifestUrl = serverRootDir + "manifest/project.manifest";
                        manifest.remoteVersionUrl = serverRootDir + "manifest/version.manifest";
                    } else {
                        manifest.remoteManifestUrl = serverRootDir + "/manifest/project.manifest";
                        manifest.remoteVersionUrl = serverRootDir + "/manifest/version.manifest";
                    }
                    let dest = genManifestDir;
                    let source = resourceRootDir;
                    this._readDir(path.join(source, "src"), manifest.assets, source);
                    this._readDir(path.join(source, "assets/internal"), manifest.assets, source);
                    this._readDir(path.join(source, "assets/main"), manifest.assets, source);
                    this._readDir(path.join(source, "assets/resources"), manifest.assets, source);
                    let projectManifest = path.join(dest, "project.manifest");
                    let versionManifest = path.join(dest, "version.manifest");
                    this._mkdirSync(dest);

                    //生成构建目录下的manifest文件
                    let bulidPathManifestDir = `${resourceRootDir}/manifest`;
                    if ( fs.existsSync(bulidPathManifestDir) ){
                        this._delDir(bulidPathManifestDir);
                    }
                    this._mkdirSync(bulidPathManifestDir);

                    fs.writeFileSync(projectManifest, JSON.stringify(manifest));
                    projectManifest = path.join(bulidPathManifestDir,"project.manifest");
                    fs.writeFileSync(projectManifest, JSON.stringify(manifest));

                    this._addLog("[Build] 生成 project.manifest成功");
                    delete manifest.assets;
                    delete manifest.searchPaths;
                    fs.writeFileSync(versionManifest, JSON.stringify(manifest));
                    versionManifest = path.join(bulidPathManifestDir,"version.manifest");
                    fs.writeFileSync(versionManifest,JSON.stringify(manifest));
                    this._addLog("[Build] 生成 version.manifest成功");

                    //子游戏manifest生成
                    // Editor.log("source",source);
                    for (let i = 0; i < bundles.length; i++) {

                        let key = bundles[i];
                        let submanifest = {
                            version: this.subGameVersion[key],
                            packageUrl: serverRootDir,
                            remoteManifestUrl: "",
                            remoteVersionUrl: "",
                            assets: {},
                            searchPaths: []
                        };
                        if ("/" === serverRootDir[serverRootDir.length - 1]) {
                            submanifest.remoteManifestUrl = `${serverRootDir}manifest/${key}_project.manifest`;
                            submanifest.remoteVersionUrl = `${serverRootDir}manifest/${key}_version.manifest`;
                        } else {
                            submanifest.remoteManifestUrl = `${serverRootDir}/manifest/${key}_project.manifest`;
                            submanifest.remoteVersionUrl = `${serverRootDir}/manifest/${key}_version.manifest`;
                        }

                        this._readDir(path.join(source, `assets/${key}`), submanifest.assets, source);

                        let subgameManifest = path.join(dest, `${key}_project.manifest`);
                        fs.writeFileSync(subgameManifest, JSON.stringify(submanifest));
                        fs.writeFileSync(path.join(bulidPathManifestDir,`${key}_project.manifest`),JSON.stringify(submanifest));

                        this._addLog(`[Build] 生成 ${key}_project.manifest成功`);
                        delete submanifest.assets;
                        delete submanifest.searchPaths;
                        let subgameVersionManifest = path.join(dest, `${key}_version.manifest`);
                        fs.writeFileSync(subgameVersionManifest, JSON.stringify(submanifest));
                        fs.writeFileSync(path.join(bulidPathManifestDir,`${key}_version.manifest`),JSON.stringify(submanifest));
                        this._addLog(`[Build] 生成 ${key}_version.manifest成功`);
                    }

                    this._packageVersion()
                },
                onSelectLocalServerPath(e) {
                    let t = Editor.Project.path;
                    this.localServerPath && this.localServerPath.length > 0 && fs.existsSync(this.localServerPath) && (t = this.localServerPath);
                    let i = Editor.Dialog.openFile({
                        title: "选择本地测试服务器目录",
                        defaultPath: t,
                        properties: ["openDirectory"]
                    }); - 1 !== i && (this.localServerPath = i[0], this._saveConfig(), this._updateServerVersion())
                },
                onCopyFileToLocalServer() {
                    GoogleAnalytics.eventCustom("copyFileToLocalServer");
                    if (!fs.existsSync(this.localServerPath)) {
                        this._addLog("本地测试服务器目录不存在:" + this.localServerPath);
                        return;
                    }

                    let src = path.join(this.resourceRootDir, "src");
                    let res = path.join(this.resourceRootDir, "assets");
                    if (!fs.existsSync(this.resourceRootDir)) {
                        this._addLog("资源目录不存在: " + this.resourceRootDir + ", 请先构建项目");
                        return;
                    }
                    if (!fs.existsSync(src)) {
                        this._addLog(this.resourceRootDir + "不存在src目录, 无法拷贝文件");
                        return;
                    }
                    if (!fs.existsSync(res)) {
                        this._addLog(this.resourceRootDir + "不存在res目录, 无法拷贝文件");
                        return;
                    }
                    let projectManifestPath = path.join(this.genManifestDir, "project.manifest"),
                        versionManifestPath = path.join(this.genManifestDir, "version.manifest");
                    if (!this.genManifestDir || this.genManifestDir.length <= 0) {
                        this._addLog("manifest文件生成地址未填写");
                        return;
                    }
                    if (!this._getFileIsExist(projectManifestPath)) {
                        this._addLog(projectManifestPath + "不存在, 请点击生成配置");
                        return;
                    }
                    if (!this._getFileIsExist(versionManifestPath)) {
                        this._addLog(versionManifestPath + "不存在, 请点击生成配置");
                        return;
                    }
                    this._addLog("[部署] 开始拷贝文件到:" + this.localServerPath);
                    this.curNum = 0;
                    this.copyProgress = 0;
                    this._addLog("[部署] 删除目录路径: " + this.localServerPath);
                    let filecount = this._getFileNum(this.localServerPath);
                    this._addLog("[部署] 删除文件个数:" + filecount);
                    this._delDir(this.localServerPath);
                    this.totalNum = this._getTotalCopyFileNum();
                    this._addLog("[部署] 复制文件个数:" + this.totalNum);
                    //复制src目录
                    this._copySourceDirToDesDir(src, path.join(this.localServerPath, "src"));
                    //复制res目录
                    this._copySourceDirToDesDir(res, path.join(this.localServerPath, "assets"));
                    //复制manifest文件
                    this._copySourceDirToDesDir(path.join(this.resourceRootDir,"manifest"),path.join(this.localServerPath,"manifest"));
                },
                _getTotalCopyFileNum() {
                    let count = this._getFileNum(path.join(this.resourceRootDir, "src")) + this._getFileNum(path.join(this.resourceRootDir, "assets")) + 2;
                    //这里需要加上子游戏版本文件个数
                    let subgames = Object.keys(this.subGameVersion);
                    if (subgames.length > 0) {
                        count += subgames.length * 2;
                    }
                    return count;
                },
                addProgress() {
                    this.curNum++;
                    let e = this.curNum / this.totalNum;
                    e = e || 0, this.copyProgress = 100 * e, e >= 1 && (this._addLog("[部署] 部署到指定目录成功:" + this.localServerPath), this._updateServerVersion())
                },
                refreshLocalServerVersion() {
                    this._updateServerVersion()
                },
                refreshLocalServerSubGameVersion(e,gamedirName) {
                    this._updateSubGameServerVersion(gamedirName)
                },
                _updateServerVersion() {
                    if (this.localServerPath.length > 0) {
                        let e = require("fire-path"),
                            t = require("fire-fs"),
                            i = e.join(this.localServerPath, "manifest/version.manifest");
                        t.readFile(i, "utf-8", function (i, s) {
                            if (i) {
                                let i = e.join(this.localServerPath, "manifest/project.manifest");
                                t.readFile(i, "utf-8", function (e, t) {
                                    if (e) this._addLog("无法获取到本地测试服务器版本号");
                                    else {
                                        let e = JSON.parse(t);
                                        this.serverVersion = e.version, this.serverPackageUrl = e.packageUrl
                                    }
                                }.bind(this))
                            } else {
                                let e = JSON.parse(s);
                                this.serverVersion = e.version, this.serverPackageUrl = e.packageUrl
                            }
                        }.bind(this))
                    } else this._addLog("请选择本机server物理路径")
                },
                _updateSubGameServerVersion( gamedirName ) {
                    if (this.localServerPath.length > 0) {
                        let path = require("fire-path"),
                            fs = require("fire-fs"),
                            filename = path.join(this.localServerPath, `manifest/${gamedirName}_version.manifest`);
                        fs.readFile(filename, "utf-8", function (err, data) {
                            if (err) {
                                let projectManifest = path.join(this.localServerPath, `manifest/${gamedirName}_project.manifest`);
                                fs.readFile(projectManifest, "utf-8", function (err, data) {
                                    if (err) this._addLog("无法获取到本地测试服务器版本号");
                                    else {
                                        let e = JSON.parse(data);
                                        this.subgameServerVersion[`${gamedirName}`] = e.version;
                                    }
                                }.bind(this))
                            } else {
                                let e = JSON.parse(data);
                                this.subgameServerVersion[`${gamedirName}`] = e.version;
                            }
                        }.bind(this))
                    } else this._addLog("请选择本机server物理路径")
                },
                _getFileNum(e) {
                    let t = 0,
                        i = function (e) {
                            let s = fs.readdirSync(e);
                            for (let r in s) {
                                t++;
                                let o = path.join(e, s[r]);
                                fs.statSync(o).isDirectory() && i(o)
                            }
                        };
                    return i(e), t
                },
                _delDir(e) {
                    let t = function (e) {
                            let i = fs.readdirSync(e);
                            for (let s in i) {
                                let r = path.join(e, i[s]);
                                fs.statSync(r).isDirectory() ? t(r) : fs.unlinkSync(r)
                            }
                        },
                        i = function (t) {
                            let s = fs.readdirSync(t);
                            if (s.length > 0) {
                                for (let e in s) {
                                    let r = path.join(t, s[e]);
                                    i(r)
                                }
                                t !== e && fs.rmdirSync(t)
                            } else t !== e && fs.rmdirSync(t)
                        };
                    t(e), i(e)
                },
                _copyFileToDesDir(e, t) {
                    if (this._getFileIsExist(e)) {
                        let i = fs.createReadStream(e),
                            s = path.basename(e),
                            r = path.join(t, s),
                            o = fs.createWriteStream(r);
                        i.pipe(o), this.addProgress()
                    }
                },
                _copySourceDirToDesDir(e, t) {
                    let i = this,
                        s = function (e, t, s) {
                            fs.exists(t, function (r) {
                                r ? s(e, t) : fs.mkdir(t, function () {
                                    i.addProgress(), s(e, t)
                                })
                            })
                        },
                        r = function (e, t) {
                            fs.readdir(e, function (o, n) {
                                if (o) throw o;
                                n.forEach(function (o) {
                                    let n, a, l = e + "/" + o,
                                        h = t + "/" + o;
                                    fs.stat(l, function (e, t) {
                                        if (e) throw e;
                                        t.isFile() ? (n = fs.createReadStream(l), a = fs.createWriteStream(h), n.pipe(a), i.addProgress()) : t.isDirectory() && s(l, h, r)
                                    })
                                })
                            })
                        };
                    s(e, t, r)
                },
                /**
                 * @description 版本比较 curVersion > prevVersion 返回ture 
                 * @example (1.0.1 > 1.0)  (1.0.1 <= 1.0.1) (1.0.1 < 1.0.2) (1.0.1 > 1.0.0) 
                 * @param {*} curVersion 当前构建版本
                 * @param {*} prevVersion 之前构建的版本
                 */
                _isVersionPass(curVersion, prevVersion) {
                    if (undefined === curVersion || null === curVersion || undefined === prevVersion || null === prevVersion) return false;
                    let curVersionArr = curVersion.split(".");
                    let prevVersionArr = prevVersion.split(".");
                    let len = curVersionArr.length > prevVersionArr.length ? curVersionArr.length : prevVersionArr.length;
                    for (let i = 0; i < len; i++) {
                        let curValue = curVersionArr[i],
                            genValue = prevVersionArr[i];
                        if (undefined === curValue && undefined !== genValue) return false;
                        if (undefined !== curValue && undefined === genValue) return true;
                        if (curValue && genValue && parseInt(curValue) > parseInt(genValue)) return true;
                    }
                    return false;
                },
                onInputVersionOver() {
                    let genVersion = CfgUtil.cfgData.genVersion;
                    let remoteServerVersion = this.remoteServerVersion;
                    if (null !== remoteServerVersion && void 0 !== remoteServerVersion) {
                        if (this._isVersionPass(this.version, remoteServerVersion)) {
                            this._addLog("上次构建时版本号: " + genVersion)
                            if (this._isVersionPass(this.version, genVersion)) {
                                this._addLog("版本通过验证!")
                            } else {
                                this._addLog("[Warning] 要构建的版本低于上次构建版本: " + this.version + "<=" + genVersion)
                            }
                        } else {
                            this._addLog("[Warning] version 填写的版本低于远程版本")
                        }
                    }
                    this._saveConfig();
                },
                /**----------------subgames start------------------- */
                onInputSubVersionOver(e, gamedirName) {
                    if (this.version == null || this.version == undefined || this.version.length <= 0) {
                        this._addLog("请先设置主版本号");
                        return;
                    }
                    let subVersion = this.subGameVersion[`${gamedirName}`];
                    this._addLog(`${gamedirName} : ${subVersion}`);
                    let genVersion = this.originSubGameVersion[`${gamedirName}`];
                    if (this._isVersionPass(subVersion, genVersion)) {
                        this._addLog("版本通过验证");
                    } else {
                        this._addLog("[Warning] 要构建的版本低于上次构建版本: " + subVersion + "<=" + genVersion);
                    }
                    this._saveConfig();
                },
                /**----------------subgames end------------------- */
                onInPutUrlOver(e) {
                    let t = this.serverRootDir;
                    if ("http://" === t || "https://" === t || "http" === t || "https" === t || "http:" === t || "https:" === t) return;
                    let i = t.indexOf("http://"),
                        s = t.indexOf("https://");
                    if (-1 === i && -1 === s) {
                        /^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test(t) || (this._addLog(t + " 不是以http://https://开头，或者不是网址, 已经自动修改"), this.serverRootDir = "http://" + this.serverRootDir, this._getRemoteServerVersion())
                    } else this._getRemoteServerVersion();
                    this._addHotAddress(this.serverRootDir), this._updateShowUseAddrBtn(), this._saveConfig()
                },
                _getRemoteServerVersion() {
                    if (this.serverRootDir.length <= 0) return;
                    this.isShowRemoteServerVersion = !1, this.remoteServerVersion = null;
                    let e = this.serverRootDir + "/version.manifest",
                        t = new XMLHttpRequest;
                    t.onreadystatechange = function () {
                        if (4 === t.readyState && t.status >= 200 && t.status < 400) {
                            let e = t.responseText,
                                i = null;
                            try {
                                i = JSON.parse(e)
                            } catch (e) {
                                return void this._addLog("获取远程版本号失败!")
                            }
                            this.isShowRemoteServerVersion = !0, this.remoteServerVersion = i.version
                        } else t.status
                    }.bind(this), t.open("get", e, !0), t.setRequestHeader("If-Modified-Since", "0"), t.send()
                },
                onTestUrl() {
                    let e = this.serverRootDir;
                    e.length > 0 ? this._isUrlAvilable(e, function (t) {
                        this._addLog(e + " 响应: " + t)
                    }.bind(this)) : this._addLog("请填写 [资源服务器url] ")
                },
                _isUrlAvilable(e, t) {
                    let i = require("http");
                    try {
                        i.get(e, function (e) {
                            t && t(e.statusCode)
                        }.bind(this))
                    } catch (e) {
                        t(-1)
                    }
                },
                onOpenUrl(e) {
                    let t = this.serverRootDir;
                    t.length > 0 ? Electron.shell.openExternal(t) : this._addLog("未填写参数")
                },
                userLocalIP() {
                    GoogleAnalytics.eventCustom("useLocalIP");
                    let e = "",
                        t = require("os").networkInterfaces();
                    Object.keys(t).forEach(function (i) {
                        t[i].forEach(function (t) {
                            "IPv4" === t.family && !1 === t.internal && (e = t.address)
                        })
                    }), e.length > 0 && (this.serverRootDir = "http://" + e, this.onInPutUrlOver(null))
                },
                onClickOpenVersionDir() {
                    let e = CfgUtil.getPackZipDir();
                    fs.existsSync(e) ? (Electron.shell.showItemInFolder(e), Electron.shell.beep()) : this._addLog("目录不存在：" + e)
                },
                onSelectSrcDir(e) {
                    let t = Editor.Dialog.openFile({
                        title: "选择Src目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"],
                        callback: function (e) {}
                    }); - 1 !== t && (this.srcDirPath = t[0], this._saveConfig())
                },
                onSelectResDir() {
                    let e = Editor.Dialog.openFile({
                        title: "选择Res目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    }); - 1 !== e && (this.resDirPath = e[0], this._saveConfig())
                },
                onOpenResourceDir() {
                    fs.existsSync(this.resourceRootDir) ? (Electron.shell.showItemInFolder(this.resourceRootDir), Electron.shell.beep()) : this._addLog("目录不存在：" + this.resourceRootDir)
                },
                onOpenManifestDir() {
                    fs.existsSync(this.genManifestDir) ? (Electron.shell.showItemInFolder(this.genManifestDir), Electron.shell.beep()) : this._addLog("目录不存在：" + this.genManifestDir)
                },
                onOpenLocalServer() {
                    fs.existsSync(this.genManifestDir) ? (Electron.shell.showItemInFolder(this.localServerPath), Electron.shell.beep()) : this._addLog("目录不存在：" + this.localServerPath)
                },
                onSelectGenManifestDir() {
                    let e = Editor.Dialog.openFile({
                        title: "选择生成Manifest目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    }); - 1 !== e && (this.genManifestDir = e[0], this._saveConfig())
                },
                onSelectGenServerRootDir() {
                    let e = Editor.Dialog.openFile({
                        title: "选择部署的服务器根目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    }); - 1 !== e && (this.serverRootDir = e[0], this._saveConfig())
                },
                onSelectResourceRootDir() {
                    let e = Editor.Dialog.openFile({
                        title: "选择构建后的根目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== e) {
                        let t = e[0];
                        this._checkResourceRootDir(t) && (this.resourceRootDir = t, this._saveConfig())
                    }
                },
                onOpenLocalGameManifestDir() {
                    let e = this.localGameProjectManifest.split("project.manifest")[0];
                    fs.existsSync(e) ? (Electron.shell.showItemInFolder(e), Electron.shell.beep()) : this._addLog("目录不存在：" + e)
                },
                onConfirmDelBundle(){
                    let bundles = Object.keys(this.subGameVersion);
                    let isFind = false;
                    for( let i = 0 ; i < bundles.length ; i++ ){
                        let game = bundles[i];
                        if ( !this.subGameInclude[game] ){
                            isFind = true;
                            
                            let gamePath = path.join(this.resourceRootDir,"assets");
                            gamePath = path.join(gamePath,game);
                            if (fs.existsSync(gamePath)) {
                                //删除子游戏代码及资源
                                this._delDir(gamePath)
                                fs.rmdirSync(gamePath)
                                this._addLog(`删除子游戏${game} : ${gamePath}`);
                                //删除子游戏 版本控制文件
                                let versionManifestPath = path.join(this.resourceRootDir,`manifest/${game}_version.manifest`);
                                if ( fs.existsSync(versionManifestPath) ){
                                    fs.unlinkSync(versionManifestPath)
                                    this._addLog(`删除子游戏${game} : ${versionManifestPath}`);
                                }
                                
                                let projectManifestPath = path.join(this.resourceRootDir,`manifest/${game}_project.manifest`);
                                if ( fs.existsSync(projectManifestPath) ){
                                    fs.unlinkSync(projectManifestPath)
                                    this._addLog(`删除子游戏${game} : ${projectManifestPath}`);
                                }
                            }else{
                                this._addLog(`子游戏${game}已经删除`);
                            }
                            
                        }
                    }
                    if( !isFind ){
                        Editor.log("没有子游戏需要剔除")
                    }
                }
            }
        });
    },
    messages: {
        "hot-update-tools:onBuildFinished"(e, t) {
            window.plugin.onBuildFinished(t)
        },
        'hot-update-tools:onConfirmDelBundle'(e,t){
            window.plugin.onConfirmDelBundle();
        }
    }
});
