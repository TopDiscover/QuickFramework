import * as fs from "fs"
import * as path from "path"
import * as os from "os"
const Electron = require("electron")
import * as JSZIP from "jszip";
import JSZip = require("jszip");

interface BundleInfo {
  id: string;
  name: string;
  dir: string;
  version: string;
  includeApk: boolean;
}

interface Config {
  packageUrl: string;
  forceIncludeAllGameToApk: boolean;
  version: string;
  description: string;
  bundles: BundleInfo[];
}

interface UserCache {
  /**@description 主包版本号 */
  version: string,
  /**@description 当前服务器地址 */
  serverIP: string,
  /**@description 服务器历史地址 */
  historyIps: string[],
  historySelectedUrl: string,
  /**@description 构建项目目录 */
  buildDir: string,

  /**@description 各bundle的版本配置 */
  bundles: any,


  /**@description 远程服务器地址 */
  remoteUrl: string,
  /**@description 远程各bundle的版本配置 */
  remoteBundleUrls: any,
  /**@description 远程服务器所在目录 */
  remoteDir: string,
}

interface IHtmlElements {
  /**@description 主包版本号 */
  version: any,
  /**@description 主包服务器地址 */
  serverIP: any,
  /**@description 使用本机按钮 */
  userLocalIP: any,
  /**@description 服务器选择历史地址 */
  historyServerIPSelect: any,
  /**@description 构建目录 */
  buildDir: any,
  /**@description 选择构建目录 */
  selectBulidDir: any,
  /**@description 打开构建目录 */
  openSelectBulidDir: any,
  /**@description Manifest输出目录 */
  manifestDir: any,
  /**@description 打开Manifest输出目录 */
  openManifestDir: any,
  /**@description 删除bundle */
  delBunles: any,
  /**@description 生成Manifest */
  createManifest: any,
  /**@description 远程主包地址 */
  remoteUrl: any,
  /**@description 刷新远程主包地址 */
  refreshMainVersion: any,
  /**@description 远程物理路径 */
  remoteDir: any,
  /**@description 选择远程物理路径 */
  selectRemoteDir: any,
  /**@description 打开远程物理路径 */
  openSelectRemoteDir: any,
  /**@description 部署 */
  deployToRemote: any,
  /**@description 部署进度 */
  deployProgress: any,
  /**@description 日志 */
  logView: any,
}

class _Helper {

  elements = {
    /**@description 主包版本号 */
    version: "#version",
    /**@description 主包服务器地址 */
    serverIP: "#serverIP",
    /**@description 使用本机按钮 */
    userLocalIP: "#userLocalIP",
    /**@description 服务器选择历史地址 */
    historyServerIPSelect: "#historyServerIPSelect",
    /**@description 构建目录 */
    buildDir: "#buildDir",
    /**@description 选择构建目录 */
    selectBulidDir: "#selectBulidDir",
    /**@description 打开构建目录 */
    openSelectBulidDir: "#openSelectBulidDir",
    /**@description Manifest输出目录 */
    manifestDir: "#manifestDir",
    /**@description 打开Manifest输出目录 */
    openManifestDir: "#openManifestDir",
    /**@description 删除bundle */
    delBunles: "#delBunles",
    /**@description 生成Manifest */
    createManifest: "#createManifest",
    /**@description 远程主包地址 */
    remoteUrl: "#remoteUrl",
    /**@description 刷新远程主包地址 */
    refreshMainVersion: "#refreshMainVersion",
    /**@description 远程物理路径 */
    remoteDir: "#remoteDir",
    /**@description 选择远程物理路径 */
    selectRemoteDir: "#selectRemoteDir",
    /**@description 打开远程物理路径 */
    openSelectRemoteDir: "#openSelectRemoteDir",
    /**@description 部署 */
    deployToRemote: "#deployToRemote",
    /**@description 部署进度 */
    deployProgress: "#deployProgress",
    /**@description 日志 */
    logView: "#logView",
  };

  /**@description 保存读取成功的Html */

  private view: IHtmlElements = null!;

  private userCache: UserCache = {
    /**@description 主包版本号 */
    version: "",
    /**@description 当前服务器地址 */
    serverIP: "",
    /**@description 服务器历史地址 */
    historyIps: [],
    historySelectedUrl: "",
    /**@description 构建项目目录 */
    buildDir: "",


    /**@description 各bundle的版本配置 */
    bundles: {},


    /**@description 远程服务器地址 */
    remoteUrl: "",
    /**@description 远程各bundle的版本配置 */
    remoteBundleUrls: {},
    /**@description 远程服务器所在目录 */
    remoteDir: "",
  }

  private bundles: any = {};

  private _isDoCreate = false;

  private get userCachePath() {
    return path.join(Editor.Project.path + "/packages/config/userCache.json");
  }

  getManifestDir(buildDir: string) {
    if (buildDir && buildDir.length > 0) {
      return buildDir + "\\manifest";
    } else {
      return "";
    }
  }
  /**@description 保存当前用户设置 */
  saveUserCache() {
    let cacheString = JSON.stringify(this.userCache);
    fs.writeFileSync(this.userCachePath, cacheString);
    // this.addLog(`写入缓存 :`, userCache);
  }
  /**@description 检证数据 */
  checkUserCache() {
    //把不存在的bundle信息删除

    let notExist: string[] = [];
    Object.keys(this.userCache.bundles).forEach((value) => {
      if (this.bundles[value] == undefined || this.bundles[value] == null) {
        notExist.push(value);
      }
    });
    let isRemoved = false;
    for (let i = 0; i < notExist.length; i++) {
      delete this.userCache.bundles[notExist[i]];
      isRemoved = true;
    }

    notExist = [];
    Object.keys(this.userCache.remoteBundleUrls).forEach((value) => {
      if (this.bundles[value] == undefined || this.bundles[value] == null) {
        notExist.push(value);
      }
    });

    for (let i = 0; i < notExist.length; i++) {
      delete this.userCache.remoteBundleUrls[notExist[i]];
      isRemoved = true;
    }

    return isRemoved;
  }
  /**@description 生成默认缓存 */
  generateDefaultUseCache() {
    this.userCache.version = this.config.version;
    this.userCache.serverIP = this.config.packageUrl;
    this.userCache.historyIps = [this.userCache.serverIP];
    this.userCache.buildDir = "";
    this.userCache.bundles = this.bundles;
    this.userCache.remoteUrl = "-";
    this.userCache.remoteBundleUrls = {},
      Object.keys(this.bundles).forEach((key) => {
        this.userCache.remoteBundleUrls[key] = "-";
      });
    this.userCache.remoteDir = "";
  }
  /**@description 读取本地缓存 */
  readCache() {
    if (fs.existsSync(this.userCachePath)) {
      let data = fs.readFileSync(this.userCachePath, "utf-8")
      this.userCache = JSON.parse(data);
      if (this.checkUserCache()) {
        this.saveUserCache();
      }
      //this.addLog(`存在缓存 : ${userCachePath}`, userCache);
    } else {
      //this.addLog(`不存在缓存 : ${userCachePath}`);
      this.generateDefaultUseCache();
      this.addLog(`生存默认缓存 : `, this.userCache);
      this.saveUserCache();
    }
  }
  /**@description 初始化UI数据 */
  initUIDatas() {
    this.view.version.value = this.userCache.version;
    this.view.serverIP.value = this.userCache.serverIP;
    setTimeout(() => {
      this.updateHistoryUrl();
      if (this.userCache.historySelectedUrl = "") {
        this.userCache.historySelectedUrl = this.userCache.historyIps[0];
      }

      let isFind = false;
      let options = this.view.historyServerIPSelect.$select.options;
      for (let i = 0; i < options.length; i++) {
        if (options.text == this.userCache.historySelectedUrl) {
          this.view.historyServerIPSelect.$select.value = i;
          isFind = true;
          break;
        }
      }
      if (!isFind) {
        this.userCache.historySelectedUrl = this.userCache.historyIps[0];
        this.view.historyServerIPSelect.$select.value = 0;
      }
    }, 10);
    this.view.buildDir.value = this.userCache.buildDir;
    this.view.manifestDir.value = this.getManifestDir(this.userCache.buildDir);

    //bundles 配置
    //`is${gameInfo.dir}includeApp`
    Object.keys(this.userCache.bundles).forEach((key) => {
      //是否在包内
      (<any>this.view)[`is${key}includeApp`].value = this.userCache.bundles[key].includeApk;
      //版本号
      (<any>this.view)[`${key}Version`].value = this.userCache.bundles[key].version;
    });

    //测试环境
    this.view.remoteUrl.value = this.getShowRemoteString();
    Object.keys(this.userCache.remoteBundleUrls).forEach((key) => {
      (<any>this.view)[`${key}remoteUrl`].value = this.getShowRemoteString(key);
    });
    this.view.remoteDir.value = this.userCache.remoteDir;
  }
  /**@description 返回远程显示地址+版本号 */
  getShowRemoteString(bundleName?: string) {
    if (bundleName) {
      return `[${this.userCache.bundles[bundleName].version}] : ${this.userCache.remoteBundleUrls[bundleName]}`;
    } else {
      return `[${this.userCache.version}] : ${this.userCache.remoteUrl}`;
    }
  }
  /**@description 初始化数据 */
  initDatas() {
    this._isDoCreate = false;
    this.readCache();
    this.initUIDatas()
  }
  /**@description 绑定界面事件 */
  bindingEvents() {
    let view: any = this.view;
    this.view.userLocalIP.addEventListener("confirm", this.onUseLocalIP.bind(this));
    this.view.serverIP.addEventListener("blur", this.onInputServerUrlOver.bind(this, this.view.serverIP));
    this.view.historyServerIPSelect.addEventListener("change", this.onHistoryServerIPChange.bind(this, this.view.historyServerIPSelect));
    this.view.version.addEventListener("blur", this.onVersionChange.bind(this, this.view.version));
    //bundles 版本设置
    let keys = Object.keys(this.userCache.bundles);
    keys.forEach((key) => {
      //是否在包内
      //this.$[`is${key}includeApp`].value = userCache.bundles[key].includeApk;
      //版本号
      view[`${key}Version`].addEventListener('blur', this.onBundleVersionChange.bind(this, view[`${key}Version`], key));
    });
    //选择构建目录
    this.view.selectBulidDir.addEventListener("confirm", this.onBuildDirConfirm.bind(this, this.view.selectBulidDir));
    //打开构建目录
    this.view.openSelectBulidDir.addEventListener("confirm", this.onOpenSelectBulidDir.bind(this));
    //打开Manifest目录
    this.view.openManifestDir.addEventListener("confirm", this.onOpenManifestDir.bind(this));
    //本地测试目录
    //打开本地测试服务器路径
    this.view.selectRemoteDir.addEventListener("confirm", this.onRemoteDirConfirm.bind(this));
    this.view.openSelectRemoteDir.addEventListener("confirm", this.onOpenRemoteDir.bind(this));
    //生成
    this.view.createManifest.addEventListener("confirm", this.onCreateManifest.bind(this, this.view.createManifest));
    //部署
    this.view.deployToRemote.addEventListener("confirm", this.onDeployToRemote.bind(this));
    //主包地址刷新 
    this.view.refreshMainVersion.addEventListener("confirm", this.onRefreshMainVersion.bind(this));
    //refresh${gameInfo.dir}Version 子包地址刷新
    keys.forEach((key) => {
      view[`is${key}includeApp`].addEventListener("confirm", this.onIncludeAppChange.bind(this, view[`is${key}includeApp`], key));
      view[`refresh${key}Version`].addEventListener("confirm", this.onRefreshBundleLocalServerVersion.bind(this, key))
    });
    //删除不包含在包内的bundles
    this.view.delBunles.addEventListener("confirm", this.onDelBundles.bind(this));
  }
  //初始化
  init(view: any) {
    this.view = view;
    this.initDatas();
    this.bindingEvents();
  }
  onIncludeAppChange(element: any, key: string) {
    // console.log("element",element);
    // console.log("key",key);
    // console.log("value",element.value);
    this.userCache.bundles[key].includeApk = element.value;
    this.saveUserCache();
  }
  /**@description 删除不包含在包内的bundles */
  async onDelBundles() {
    if (this.isDoCreate()) return;
    //弹出提示确定是否需要删除当前的子游戏
    Editor.Panel.open('confirm_del_subgames');
  }
  onConfirmDelBundle() {
    this.removeNotInApkBundle();
  }
  /**@description 删除不包含在包内的所有bundles */
  removeNotInApkBundle() {
    let keys = Object.keys(this.userCache.bundles);
    let removeBundles: string[] = [];
    keys.forEach((key) => {
      if (!this.userCache.bundles[key].includeApk) {
        removeBundles.push(key);
      }
    });
    let manifests = [];
    let removeDirs = [];
    for (let i = 0; i < removeBundles.length; i++) {
      let key = removeBundles[i];
      removeDirs.push(path.join(this.userCache.buildDir, `assets/${key}`));
      manifests.push(path.join(this.userCache.buildDir, `manifest/${key}_project.manifest`));
      manifests.push(path.join(this.userCache.buildDir, `manifest/${key}_version.manifest`));
    }

    for (let i = 0; i < removeDirs.length; i++) {
      this.addLog(`删除目录 : ${removeDirs[i]}`);
      this.delDir(removeDirs[i], true);
    }

    for (let i = 0; i < manifests.length; i++) {
      this.addLog(`删除版本文件 : ${manifests[i]}`);
      this.delFile(manifests[i]);
    }

  }
  /**
   * @description 刷新测试环境主包信息
   */
  onRefreshMainVersion() {
    if (this.isDoCreate()) return;
    if (this.userCache.remoteDir.length > 0) {
      let versionManifestPath = path.join(this.userCache.remoteDir, "manifest/version.manifest");
      fs.readFile(versionManifestPath, "utf-8", (err, data) => {
        if (err) {
          this.addLog(`找不到 : ${versionManifestPath}`);
        } else {
          let versionConfig = JSON.parse(data);
          this.userCache.remoteUrl = versionConfig.packageUrl;
          this.view.remoteUrl.value = this.getShowRemoteString();
          this.saveUserCache();
        }
      });
    } else {
      this.addLog(`只能刷新部署在本地的版本`);
    }
  }
  /**
   * @description 刷新测试环境子包信息
   * @param {*} key 
   */
  onRefreshBundleLocalServerVersion(key: string) {
    if (this.isDoCreate()) return;
    if (this.userCache.remoteDir.length > 0) {
      let versionManifestPath = path.join(this.userCache.remoteDir, `manifest/${key}_version.manifest`);
      fs.readFile(versionManifestPath, "utf-8", (err, data) => {
        if (err) {
          this.addLog(`找不到 : ${versionManifestPath}`);
        } else {
          let versionConfig = JSON.parse(data);
          this.userCache.remoteBundleUrls[key] = versionConfig.packageUrl;
          (<any>this.view)[`${key}remoteUrl`].value = this.getShowRemoteString(key);
          this.saveUserCache();
        }
      });
    } else {
      this.addLog(`只能刷新部署在本地的版本`);
    }
  }
  /**
   * @description 部署
   */
  onDeployToRemote() {
    if (this.isDoCreate()) return;
    if (this.userCache.remoteDir.length <= 0) {
      this.addLog("[部署]请先选择本地服务器目录");
      return;
    }
    if (!fs.existsSync(this.userCache.remoteDir)) {
      this.addLog(`[部署]本地测试服务器目录不存在 : ${this.userCache.remoteDir}`);
      return;
    }
    if (!fs.existsSync(this.userCache.buildDir)) {
      this.addLog(`[部署]构建目录不存在 : ${this.userCache.buildDir} , 请先构建`);
      return;
    }

    let includes = this.getMainBundleIncludes();

    let temps = [];
    for (let i = 0; i < includes.length; i++) {
      //只保留根目录
      let dir = includes[i];
      let index = dir.search(/\\|\//);
      if (index == -1) {
        if (temps.indexOf(dir) == -1) {
          temps.push(dir);
        }
      } else {
        dir = dir.substr(0, index);
        if (temps.indexOf(dir) == -1) {
          temps.push(dir);
        }
      }
    }

    let copyDirs = ["manifest"].concat(temps);
    for (let i = 0; i < copyDirs.length; i++) {
      let dir = path.join(this.userCache.buildDir, copyDirs[i]);
      if (!fs.existsSync(dir)) {
        this.addLog(`${this.userCache.buildDir} [部署]不存在${copyDirs[i]}目录,无法拷贝文件`);
        return;
      }
    }

    this.addLog(`[部署]开始拷贝文件到 : ${this.userCache.remoteDir}`);
    this.view.deployProgress.value = 0;
    this.addLog(`[部署]删除旧目录 : ${this.userCache.remoteDir}`);
    let count = this.getFileCount(this.userCache.remoteDir);
    this.addLog(`[部署]删除文件个数:${count}`);
    this.delDir(this.userCache.remoteDir);

    count = 0;
    for (let i = 0; i < copyDirs.length; i++) {
      let dir = path.join(this.userCache.buildDir, copyDirs[i]);
      count += this.getFileCount(dir);
    }

    this.addLog(`[部署]复制文件个数 : ${count}`);

    for (let i = 0; i < copyDirs.length; i++) {
      this.copySourceDirToDesDir(path.join(this.userCache.buildDir, copyDirs[i]), path.join(this.userCache.remoteDir, copyDirs[i]));
    }

  }
  addProgress() {
    let value = this.view.deployProgress.value;
    value = value + 1;
    if (value > 100) {
      value = 100;
    }
    this.view.deployProgress.value = value;
  }
  copySourceDirToDesDir(source: string, dest: string) {
    this.addLog(`[部署]复制${source} => ${dest}`);
    let self = this;
    let makeDir = (_source: string, _dest: string, _copyFileCb: (source: string, dest: string) => void) => {
      fs.exists(_dest, function (isExist) {
        isExist ? _copyFileCb(_source, _dest) : fs.mkdir(_dest, function () {
          self.addProgress(), _copyFileCb(_source, _dest)
        })
      })
    };
    let copyFile = (_source: string, _dest: string) => {
      fs.readdir(_source, function (err, files) {
        if (err) throw err;
        files.forEach(function (filename) {
          let readStream;
          let writeStram;
          let sourcePath = _source + "/" + filename;
          let destPath = _dest + "/" + filename;
          fs.stat(sourcePath, function (err, stats) {
            if (err) throw err;
            if (stats.isFile()) {
              readStream = fs.createReadStream(sourcePath);
              writeStram = fs.createWriteStream(destPath);
              readStream.pipe(writeStram);
              self.addProgress();
            } else {
              stats.isDirectory() && makeDir(sourcePath, destPath, copyFile)
            }
          })
        })
      })
    };
    makeDir(source, dest, copyFile)
  }
  getFileCount(dir: string) {
    let count = 0;
    let counter = (dir: string) => {
      let readdir = fs.readdirSync(dir);
      for (let i in readdir) {
        count++;
        let fullPath = path.join(dir, readdir[i]);
        fs.statSync(fullPath).isDirectory() && counter(fullPath)
      }
    };
    return counter(dir), count
  }
  /**@description 返回需要添加到主包版本的文件目录 */
  getMainBundleIncludes() {
    return [
      "src",
      "assets/internal",
      "assets/main",
      "assets/resources",
    ];
  }
  /**@description 生成manifest版本文件 */
  onCreateManifest() {
    if (this.isDoCreate()) return;
    this._isDoCreate = true;
    this.saveUserCache();
    this.addLog(`当前用户配置为 : `, this.userCache);
    this.addLog("开始生成Manifest配置文件...");
    let version = this.userCache.version;
    this.addLog("主包版本号:", version);
    let buildDir = this.userCache.buildDir;
    buildDir = buildDir.replace(/\\/g, "/");
    this.addLog("构建目录:", buildDir);
    let manifestDir = this.getManifestDir(buildDir);
    manifestDir = manifestDir.replace(/\\/g, "/");
    this.addLog("构建目录下的Manifest目录:", manifestDir);
    let serverUrl = this.userCache.serverIP;
    this.addLog("热更新地址:", serverUrl);
    let subBundles = Object.keys(this.userCache.bundles);
    this.addLog("所有子包:", subBundles);
    let manifest = {
      version: version,
      packageUrl: serverUrl,
      remoteManifestUrl: "",
      remoteVersionUrl: "",
      assets: {},
      searchPaths: [],
    };
    if ("/" == serverUrl[serverUrl.length - 1]) {
      manifest.remoteManifestUrl = serverUrl + "manifest/project.manifest";
      manifest.remoteVersionUrl = serverUrl + "manifest/version.manifest";
    } else {
      manifest.remoteManifestUrl = serverUrl + "/manifest/project.manifest";
      manifest.remoteVersionUrl = serverUrl + "/manifest/version.manifest";
    }

    //删除旧的版本控件文件
    this.addLog("删除旧的Manifest目录", manifestDir);
    if (fs.existsSync(manifestDir)) {
      this.addLog("存在旧的，删除掉");
      this.delDir(manifestDir);
    }
    this.mkdirSync(manifestDir);

    //读出主包资源，生成主包版本
    let mainIncludes = this.getMainBundleIncludes();
    for (let i = 0; i < mainIncludes.length; i++) {
      this.readDir(path.join(buildDir, mainIncludes[i]), manifest.assets, buildDir);
    }

    //生成project.manifest
    let projectManifestPath = path.join(manifestDir, "project.manifest");
    let versionManifestPath = path.join(manifestDir, "version.manifest");

    fs.writeFileSync(projectManifestPath, JSON.stringify(manifest));
    this.addLog(`生成${projectManifestPath}成功`);
    delete (<any>manifest).assets;
    delete (<any>manifest).searchPaths;
    fs.writeFileSync(versionManifestPath, JSON.stringify(manifest));
    this.addLog(`生成${versionManifestPath}成功`);

    //生成各bundles版本文件
    for (let i = 0; i < subBundles.length; i++) {
      let key = subBundles[i];
      this.addLog(`正在生成:${key}`);
      manifest.version = this.userCache.bundles[key].version;
      manifest.remoteVersionUrl = "";
      manifest.remoteManifestUrl = "";
      manifest.assets = {};
      manifest.searchPaths = [];

      if ("/" == serverUrl[serverUrl.length - 1]) {
        manifest.remoteManifestUrl = serverUrl + `manifest/${key}_project.manifest`;
        manifest.remoteVersionUrl = serverUrl + `manifest/${key}_version.manifest`;
      } else {
        manifest.remoteManifestUrl = serverUrl + `/manifest/${key}_project.manifest`;
        manifest.remoteVersionUrl = serverUrl + `/manifest/${key}_version.manifest`;
      }

      this.readDir(path.join(buildDir, `assets/${key}`), manifest.assets, buildDir);
      projectManifestPath = path.join(manifestDir, `${key}_project.manifest`);
      versionManifestPath = path.join(manifestDir, `${key}_version.manifest`);

      fs.writeFileSync(projectManifestPath, JSON.stringify(manifest));
      this.addLog(`生成${projectManifestPath}成功`);
      delete (<any>manifest).assets;
      delete (<any>manifest).searchPaths;
      fs.writeFileSync(versionManifestPath, JSON.stringify(manifest));
      this.addLog(`生成${versionManifestPath}成功`);
    }
    // this._isDoCreate = false;
    this.packageZip(mainIncludes);
  }
  packageDir(dir: string, jszip: JSZIP) {
    if (!fs.existsSync(dir)) {
      return
    }
    let readDirs = fs.readdirSync(dir);
    for (let i = 0; i < readDirs.length; i++) {
      let file = readDirs[i];
      let fullPath = path.join(dir, file);
      let stat = fs.statSync(fullPath);
      if (stat.isFile()) {
        jszip.file(file, fs.readFileSync(fullPath))
      } else {
        stat.isDirectory() && this.packageDir(fullPath, jszip.folder(file) as JSZIP)
      }
    }
  }
  packageZip(mainIncludes: string[]) {
    this.addLog(`[打包] 开始打包版本...`);
    let versionManifest = path.join(this.getManifestDir(this.userCache.buildDir), "version.manifest");
    let jszip = new JSZIP();
    for (let index = 0; index < mainIncludes.length; index++) {
      const element = mainIncludes[index];
      let fullPath = path.join(this.userCache.buildDir, element);
      this.packageDir(fullPath, jszip.folder(element) as JSZIP);

    }

    //打包manifest的版本文件
    let manifest = path.join(this.userCache.buildDir, "manifest");
    this.packageDir(manifest, jszip.folder("manifest") as JSZIP);

    let mainVersionManifest = fs.readFileSync(versionManifest, "utf-8");
    let mainVersion = JSON.parse(mainVersionManifest).version;
    if (this.addLog("[打包] 打包版本:" + mainVersion), mainVersion !== this.userCache.version) {
      this.addLog("[打包] 打包版本和当前填写的版本不一致,出现异常,停止打包!");
      return;
    }
    let packZipName = "ver_main_" + (mainVersion = mainVersion.replace(".", "_")) + ".zip";
    let packZipRootPath = Editor.Project.path + "/PackageVersion";
    fs.existsSync(packZipRootPath) || fs.mkdirSync(packZipRootPath);
    let packVersionZipPath = path.join(packZipRootPath, packZipName);
    if (fs.existsSync(packVersionZipPath)) {
      fs.unlinkSync(packVersionZipPath);
      this.addLog("[打包] 发现该版本的zip, 已经删除!")
    }
    jszip.generateNodeStream({
      type: "nodebuffer",
      streamFiles: !0
    }).pipe(fs.createWriteStream(packVersionZipPath)).on("finish", () => {
      this.addLog("[打包] 打包成功: " + packVersionZipPath)
    }).on("error", (e: Error) => {
      this.addLog("[打包] 打包失败:" + e.message)
    })

    //打包子版本
    let bundles = this.config.bundles
    for (let index = 0; index < bundles.length; index++) {
      const element = bundles[index];
      let versionManifest = path.join(this.getManifestDir(this.userCache.buildDir), `${element.dir}_version.manifest`);
      let mainVersionManifest = fs.readFileSync(versionManifest, "utf-8");
      let mainVersion = JSON.parse(mainVersionManifest).version;
      let packZipName = `ver_${element.dir}_${(mainVersion = mainVersion.replace(".", "_"))}.zip`;
      let packVersionZipPath = path.join(packZipRootPath, packZipName);
      let jszip = new JSZIP();
     
      let fullPath = path.join(this.userCache.buildDir, `assets/${element.dir}`);
      this.packageDir(fullPath, jszip.folder(`assets/${element.dir}`) as JSZIP);

      if (fs.existsSync(packVersionZipPath)) {
        fs.unlinkSync(packVersionZipPath);
        this.addLog("[打包] 发现该版本的zip, 已经删除!")
      }
      this.addLog(`[打包] ${element.name} ${element.dir} ...`);
      jszip.generateNodeStream({
        type: "nodebuffer",
        streamFiles: !0
      }).pipe(fs.createWriteStream(packVersionZipPath)).on("finish", () => {
        this.addLog("[打包] 打包成功: " + packVersionZipPath)
      }).on("error", (e: Error) => {
        this.addLog("[打包] 打包失败:" + e.message)
      })
    }

    this._isDoCreate = false;
  }
  delDir(sourceDir: string, isRemoveSourceDir = false) {
    let delFile = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      let readDir = fs.readdirSync(dir);
      for (let i in readDir) {
        let fullPath = path.join(dir, readDir[i]);
        fs.statSync(fullPath).isDirectory() ? delFile(fullPath) : fs.unlinkSync(fullPath)
      }
    };
    let delDir = (dir: string) => {
      if (!fs.existsSync(dir)) return;
      let readDir = fs.readdirSync(dir);
      if (readDir.length > 0) {
        for (let i in readDir) {
          let fullPath = path.join(dir, readDir[i]);
          delDir(fullPath)
        }
        (dir !== sourceDir || isRemoveSourceDir) && fs.rmdirSync(dir)
      } else {
        (dir !== sourceDir || isRemoveSourceDir) && fs.rmdirSync(dir)
      }
    };
    delFile(sourceDir);
    delDir(sourceDir)
  }
  delFile(filePath: string) {
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
      return true;
    }
    return false;
  }
  mkdirSync(dir: string) {
    try {
      fs.mkdirSync(dir)
    } catch (e) {
      if ("EEXIST" !== e.code) throw e
    }
  }
  readDir(dir: string, obj: any, source: string) {
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
        this.readDir(subpath, obj, source);
      } else if (stat.isFile()) {
        // Size in Bytes
        size = stat['size'];
        md5 = require("crypto").createHash('md5').update(fs.readFileSync(subpath)).digest('hex');
        compressed = path.extname(subpath).toLowerCase() === '.zip';
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
  }
  /**
   * @description 本地测试服务器选择确定
   * @param {*} element 
   */
  onRemoteDirConfirm(element: any) {
    if (this.isDoCreate()) return;
    let result = Editor.Dialog.openFile({
      title: "选择本地测试服务器路径",
      defaultPath: Editor.Project.path,
      properties: ["openDirectory"]
    });
    if (-1 !== result) {
      let fullPath = result[0];
      this.userCache.remoteDir = fullPath;
      this.view.remoteDir.value = fullPath;
      this.saveUserCache();
    }
  }
  onOpenRemoteDir() {
    this.openDir(this.userCache.remoteDir);
  }
  onOpenSelectBulidDir() {
    this.openDir(this.userCache.buildDir);
  }
  onOpenManifestDir() {
    this.openDir(this.getManifestDir(this.userCache.buildDir));
  }
  openDir(dir: string) {
    if (fs.existsSync(dir)) {
      Electron.shell.showItemInFolder(dir);
      Electron.shell.beep();
    } else {
      this.addLog("目录不存在：" + dir)
    }
  }
  /**
   * @description 构建目录选择
   * @param {*} element 
   */
  onBuildDirConfirm(element: any) {
    if (this.isDoCreate()) return;
    let result = Editor.Dialog.openFile({
      title: "选择构建后的根目录",
      defaultPath: Editor.Project.path,
      properties: ["openDirectory"]
    });
    if (-1 !== result) {
      let fullPath = result[0];
      if (this.checkBuildDir(fullPath)) {
        this.userCache.buildDir = fullPath;
        this.view.buildDir.value = fullPath;
        this.view.manifestDir.value = this.getManifestDir(this.userCache.buildDir);
        this.saveUserCache();
      }
    }
  }
  checkBuildDir(fullPath: string) {
    if (fs.existsSync(fullPath)) {
      //检测是否存在src / assets目录
      let srcPath = path.join(fullPath, "src");
      let assetsPath = path.join(fullPath, "assets");
      if (fs.existsSync(srcPath) && fs.existsSync(assetsPath)) {
        return true;
      }
    }
    this.addLog(`请先构建项目`);
    return false;
  }
  /**
   * @description 版本比较 curVersion >= prevVersion 返回ture 
   * @example (1.0.1 > 1.0)  (1.0.1 <= 1.0.1) (1.0.1 < 1.0.2) (1.0.1 > 1.0.0) 
   * @param curVersion 当前构建版本
   * @param prevVersion 之前构建的版本
   */
  isVersionPass(curVersion: string, prevVersion: string) {
    if (undefined === curVersion || null === curVersion || undefined === prevVersion || null === prevVersion) return false;
    let curVersionArr = curVersion.split(".");
    let prevVersionArr = prevVersion.split(".");
    let len = curVersionArr.length > prevVersionArr.length ? curVersionArr.length : prevVersionArr.length;
    for (let i = 0; i < len; i++) {
      let curValue = curVersionArr[i],
        genValue = prevVersionArr[i];
      if (undefined === curValue && undefined !== genValue) return false;
      if (undefined !== curValue && undefined === genValue) return true;
      if (curValue && genValue && parseInt(curValue) >= parseInt(genValue)) return true;
    }
    return false;
  }
  /** @description 主版本号输入*/
  onVersionChange(element: any) {
    if (this.isDoCreate()) return;
    let version = element.value;
    if (this.isVersionPass(version, this.userCache.version)) {
      //有效版本
      this.userCache.version = version;
      this.saveUserCache();
      return;
    }
    this.addLog(`无效版本号,${version} 应大于 ${this.userCache.version}`);
  }
  /**
   * @description bundle输入版本号变化
   * @param {*} element 
   * @param {*} key 
   * @returns 
   */
  onBundleVersionChange(element: any, key: string) {
    if (this.isDoCreate()) return;
    let version = element.value;
    if (this.isVersionPass(version, this.userCache.bundles[key].version)) {
      this.userCache.bundles[key].version = version;
      this.saveUserCache();
      return;
    }
    this.addLog(`${this.userCache.bundles[key].name}设置版本号无效,${version} 应大于 ${this.userCache.bundles[key].version}`);
  }
  /** 
   * @description 切换历史地址 
   * @param element 控件自身 
   */
  onHistoryServerIPChange(element: any) {
    if (this.isDoCreate()) return;
    //先拿到选中项
    let options = this.view.historyServerIPSelect.$select.options;
    for (let i = 0; i < options.length; i++) {
      if (options[i].value == element.value) {
        this.userCache.serverIP = options[i].text;
        break;
      }
    }
    this.onInputServerUrlOver();
  }
  /** @description 点击了使用本机*/
  onUseLocalIP() {
    if (this.isDoCreate()) return;
    let network: any = os.networkInterfaces();
    let url = "";
    Object.keys(network).forEach((key) => {
      network[key].forEach((info: any) => {
        if (info.family == "IPv4" && !info.internal) {
          url = info.address;
        }
      });
    });
    if (url.length > 0) {
      this.userCache.serverIP = "http://" + url;
    }
    this.onInputServerUrlOver();
  }
  /**
   * @description 输入服务器地址结束
   * @param {*} element 
   * @returns 
   */
  onInputServerUrlOver(element?: any) {
    if (this.isDoCreate()) return;
    let url = this.userCache.serverIP;
    if (element) {
      //从输入框过来的
      url = element.value;
      if (url.length <= 0) {
        return;
      }
    }

    if (/^([hH][tT]{2}[pP]:\/\/|[hH][tT]{2}[pP][sS]:\/\/)(([A-Za-z0-9-~]+)\.)+([A-Za-z0-9-~\/])+$/.test(url) == false) {
      this.addLog(url + `不是以http://https://开头，或者不是网址`);
      return;
    }

    this.view.serverIP.value = url;
    this.userCache.serverIP = url;
    if (this.addHotAddress(url)) {
      this.updateHistoryUrl();
    }
    this.saveUserCache();
  }
  /**@description 更新历史地址 */
  updateHistoryUrl() {
    this.view.historyServerIPSelect.$select.options.length = 0;
    for (let i = 0; i < this.userCache.historyIps.length; i++) {
      let option: any = document.createElement("option");
      option.value = i;
      option.text = this.userCache.historyIps[i];
      this.view.historyServerIPSelect.$select.options.add(option);
    }
  }
  /**
   * @description 添加历史地址 
   * @param url
   * */
  addHotAddress(url: string) {
    if (this.userCache.historyIps.indexOf(url) == -1) {
      this.userCache.historyIps.push(url);
      this.addLog(`添加历史记录 :${url} 成功`);
      return true;
    }
    return false;
  }
  /**
   * @description 是否正在创建
   * @returns 
   */
  isDoCreate() {
    if (this._isDoCreate) {
      this.addLog(`正在执行生成操作，请勿操作`);
    }
    return this._isDoCreate;
  }
  /**
   * @description 添加日志
   * @param {*} message 
   * @param {*} obj 
   * @returns 
   */
  addLog(message: string, obj?: any) {
    if (typeof obj == "function") {
      return;
    }
    if (obj) {
      console.log(message, obj);
    } else {
      console.log(message);
    }

    let text = "";
    if (obj == null) {
      text = message;
    } else if (typeof obj == "object") {
      text = message + JSON.stringify(obj);
    } else {
      text = message + obj.toString();
    }
    let temp = this.view.logView.value;
    if (temp.length > 0) {
      this.view.logView.value = temp + "\n" + text;
    } else {
      this.view.logView.value = text;
    }
    setTimeout(() => {
      this.view.logView.scrollTop = this.view.logView.scrollHeight;
    }, 10)
  }

  /**@description 获取index.html的内容 */
  private get indexHtmlContent() {
    let content = fs.readFileSync(path.join(Editor.Project.path, "/packages/hot-update-tools/dist/panel/index.html"), "utf-8");
    return content;
  }

  private _config: Config | null = null;
  get config() {
    if (this._config) {
      return this._config;
    }
    let content = fs.readFileSync(path.join(Editor.Project.path, "/packages/config/bundles.json"), "utf-8");
    this._config = JSON.parse(content) as Config;
    return this._config;
  }

  get style() {
    let content = fs.readFileSync(path.join(Editor.Project.path, "/packages/hot-update-tools/dist/panel/index.html"), "utf-8");
    return content;
  }

  private generateTemplate() {
    let _template = this.indexHtmlContent;
    //生成子游戏版本控制界面
    //生成子游戏测环境版本号
    let _subGameServerVersionView = ``;
    let _subGameVersionView = ``;
    for (let i = 0; i < this.config.bundles.length; i++) {
      let gameInfo = this.config.bundles[i];
      if (gameInfo.dir && gameInfo.dir.length > 0) {
        _subGameVersionView += `
        <ui-prop name="${gameInfo.name}(${gameInfo.dir})">
            <div class="flex-1 layout horizontal center">
                <ui-checkbox id = "is${gameInfo.dir}includeApp"> 是否包含在原始包内 </ui-checkbox>
                <ui-input class="flex-1" id = "${gameInfo.dir}Version"></ui-input>
            </div>
        </ui-prop>
        `;
        (<any>this.elements)[`is${gameInfo.dir}includeApp`] = `#is${gameInfo.dir}includeApp`;
        (<any>this.elements)[`${gameInfo.dir}Version`] = `#${gameInfo.dir}Version`;

        _subGameServerVersionView += `
        <ui-prop name="${gameInfo.name}(${gameInfo.dir})">
            <div class="flex-1 layout horizontal center">
                <ui-input disabled="disabled" id = "${gameInfo.dir}remoteUrl" class="flex-2"></ui-input>
                <ui-button class="end-justified" id = "refresh${gameInfo.dir}Version"><i
                    class="icon-arrows-cw"></i></ui-button>
            </div>
        </ui-prop>
        `;
        (<any>this.elements)[`${gameInfo.dir}remoteUrl`] = `#${gameInfo.dir}remoteUrl`;
        (<any>this.elements)[`refresh${gameInfo.dir}Version`] = `#refresh${gameInfo.dir}Version`;
        this.bundles[gameInfo.dir] = JSON.parse(JSON.stringify(gameInfo));
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
    return _template;
  }

  private _template: string | null = null;
  get template() {
    if (this._template) {
      return this._template;
    }
    this._template = this.generateTemplate();
    return this._template;
  }
}
const Helper = new _Helper();

Editor.Panel.extend({
  style: Helper.style,
  template: Helper.template,
  $: Helper.elements,
  ready() {

    //先存储下所有读取到的html控件
    let view: any = {};
    Object.keys(Helper.elements).forEach((key) => {
      view[key] = (<any>this)[`$${key}`];
    });

    Helper.init(view);
  },
  messages: {
    'hot-update-tools:onConfirmDelBundle'() {
      Helper.onConfirmDelBundle();
    }
  }
});