let fs = require("fire-fs"),
    path = require("fire-path"),
    electron = require("electron"),
    FileUtil = Editor.require("packages://hot-update-tools/core/FileUtil"),
    self = module.exports = {
        cfgData: {
            serverRootDir: "",
            resourceRootDir: "",
            genManifestDir: "",
            localServerPath: "",
            hotAddressArray: [],
            buildTime: null,
            genTime: null,
            genVersion: null
        },
        updateBuildTimeByMain(e) {
            let t = this._getAppCfgPath();
            if (fs.existsSync(t)) {
                let i = fs.readFileSync(t, "utf-8"),
                    r = JSON.parse(i);
                r.buildTime = e, r.genTime = e, fs.writeFileSync(t, JSON.stringify(r))
            } else Editor.log("热更新配置文件不存在: " + t)
        },
        updateBuildTime(e) {
            this.cfgData.buildTime = e, this.cfgData.genTime = e, this._save()
        },
        updateGenTime(e, t) {
            this.cfgData.genTime = e, this.cfgData.genVersion = t, this._save()
        },
        getBuildTimeGenTime() {
            let e = {
                    buildTime: null,
                    genTime: null
                },
                t = this._getAppCfgPath();
            if (fs.existsSync(t)) {
                let i = fs.readFileSync(t, "utf-8"),
                    r = JSON.parse(i);
                e.buildTime = r.buildTime, e.genTime = r.genTime, this.cfgData.buildTime = r.buildTime, this.cfgData.genTime = r.genTime
            }
            return e
        },
        saveConfig(e) {
            this.cfgData.serverRootDir = e.serverRootDir;
            this.cfgData.resourceRootDir = e.resourceRootDir;
            this.cfgData.localServerPath = e.localServerPath; 
            this.cfgData.hotAddressArray = e.hotAddressArray;
            this._save()
        },
        _save() {
            let e = self._getAppCfgPath();
            fs.writeFileSync(e, JSON.stringify(this.cfgData))
        },
        cleanConfig() {
            fs.unlink(this._getAppCfgPath())
        },
        getMainFestDir() {
            let e = electron.remote.app.getPath("userData");
            return path.join(e, "hot-update-tools-manifestOutPut")
        },
        getPackZipDir() {
            electron.remote.app.getPath("userData");
            return path.join(this._getAppRootPath(), "packVersion")
        },
        _getAppRootPath() {
            let e = Editor.libraryPath;
            return e.substring(0, e.length - 7)
        },
        _getAppCfgPath() {
            let e = null;
            e = electron.remote ? electron.remote.app.getPath("userData") : electron.app.getPath("userData");
            let t = Editor.libraryPath;
            //Editor.log("sssssss" ,t);
            return t = (t = (t = t.replace(/\\/g, "-")).replace(/:/g, "-")).replace(/\//g, "-"), path.join(e, "hot-update-tools-cfg-" + t + ".json")
        },
        initCfg(e) {
            let t = this._getAppCfgPath();
            Editor.log("执更新插件配置保存路径:",t);
            FileUtil.isFileExit(t) ? fs.readFile(t, "utf-8", function (t, i) {
                if (!t) {
                    let t = JSON.parse(i.toString());
                    self.cfgData = t, e && e(t)
                }
            }.bind(self)) : e && e(null)
        }
    };
