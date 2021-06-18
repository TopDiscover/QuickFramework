"use strict";
const fs = require("fs");
const path = require("path");
const Electron = require("electron");
//样式文本
exports.style = fs.readFileSync(path.join(__dirname, "./index.css"), "utf8");

const elements = {
    version: "#version",//版本号
    serverIP: "#serverIP",//服务器地址
    useLocalIP: "#useLocalIP",//使用本地地址
    historyServerIPSelect: "#historyServerIPSelect",//服务器历史地址
    buildDir: "#buildDir",//构建目录
    manifestDir: "#manifestDir",//Manifest输出目录
    outManifestDir: "#outManifestDir",//Manifest输出目录
    delBunles: "#delBunles",//删除bundle
    createManifest: "#createManifest",//生成Manifest
    openManifestDir: "#openManifestDir",//打开Manifest目录
    bundlesProp: "#bundlesProp",//bundles Manifest配置
    logView: "#logView",//日志
    platform: "#platform",//平台
    remoteUrl: "#remoteUrl",//主包远程服务器地址
    remoteDir: "#remoteDir",//主包本地测试服务器目录
}

const gamesConfigPath = path.join(__dirname, "../../config/bundles.json");
const gamesConfig = JSON.parse(fs.readFileSync(gamesConfigPath));
let bundles = {};
//html文本
function GenerateTemplate() {
    //读取界面
    let _template = fs.readFileSync(path.join(__dirname, "./index.html"), "utf8");
    //先读取子游戏配置
    let _gamesConfig = gamesConfig;
    let _subGameVersion = {};
    //生成子游戏版本控制界面
    //生成子游戏测环境版本号
    let _subGameServerVersionView = ``;
    let _subGameVersionView = ``;
    let _subGameServerVersion = {};
    //子游戏是否包含
    let _subGameInclude = {};
    for (let i = 0; i < _gamesConfig.bundles.length; i++) {
        let gameInfo = _gamesConfig.bundles[i];
        if (gameInfo.dir && gameInfo.dir.length > 0) {
            _subGameVersionView += `
        <ui-prop>
            <ui-label slot="label" class="titleColor" tooltip="${gameInfo.name}版本配置">${gameInfo.name}(${gameInfo.dir})</ui-label>
            <ui-checkbox id = "is${gameInfo.dir}includeApp" slot="content" class="titleColor" value="${gameInfo.includeApk}">是否包含在原始包内</ui-checkbox>
            <ui-input id = "${gameInfo.dir}Version" slot="content" class="contentColor"></ui-input>
        </ui-prop>`;
            _subGameVersion[`${gameInfo.dir}`] = gameInfo.version;
            _subGameInclude[`${gameInfo.dir}`] = gameInfo.includeApk;
            _subGameServerVersion[`${gameInfo.dir}`] = '-';
            //是否在包内
            elements[`is${gameInfo.dir}includeApp`] = `#is${gameInfo.dir}includeApp`;
            //版本号
            elements[`${gameInfo.dir}Version`] = `#${gameInfo.dir}Version`;
            _subGameServerVersionView += `
        <ui-prop>
            <ui-label slot="label" class="titleColor" tooltip="${gameInfo.name}(${gameInfo.dir})测试环境地址">${gameInfo.name}(${gameInfo.dir})</ui-label>
            <ui-label id = "${gameInfo.dir}remoteUrl" slot="content" class="titleColor">${_gamesConfig.packageUrl}</ui-label>
            <ui-button slot="content">刷新</ui-button>
        </ui-prop>
        `;
            //子包的远程本机测试地址
            elements[`${gameInfo.dir}remoteUrl`] = `#${gameInfo.dir}remoteUrl`;
            bundles[gameInfo.dir] = JSON.parse(JSON.stringify(gameInfo));
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

//平台生成的路径
let PlatformBuildPaths = [`${Editor.Project.path}/build/android/assets`, `${Editor.Project.path}build/windows/assets`];

/**@description 本地缓存 */
let userCache = {
    /**@description 默认为安装平台 */
    platform: 0,
    /**@description 主包版本号 */
    version: "",
    /**@description 当前服务器地址 */
    serverIP: "",
    /**@description 服务器历史地址 */
    historyIps: [],
    historySelectedUrl: "",
    /**@description 构建项目目录 */
    buildDir: "",
    /**@description 输出Manifest目录 */
    manifestDir: "",


    /**@description 各bundle的版本配置 */
    bundles: {},


    /**@description 远程服务器地址 */
    remoteUrl: "",
    /**@description 远程各bundle的版本配置 */
    remoteBundleUrls: {},
    /**@description 远程服务器所在目录 */
    remoteDir: "",
}

const userCachePath = path.normalize(`${Editor.Project.path}/local/userCache.json`);

exports.template = GenerateTemplate();
//渲染html选择器
exports.$ = elements;
//本来想使用vue,但似乎在methods中调用this的函数，居然都未定义，所以就不用vue了
//面板上的方法,似乎不响应，郁闷
exports.methods = {
    /**@description 保存当前用户设置 */
    saveUserCache() {
        let cacheString = JSON.stringify(userCache);
        fs.writeFileSync(userCachePath, cacheString);
        this.addLog(`写入缓存 :`, userCache);
    },
    /**@description 检证数据 */
    checkUserCache() {
        //把不存在的bundle信息删除

        let notExist = [];
        Object.keys(userCache.bundles).forEach((value) => {
            if (bundles[value] == undefined || bundles[value] == null) {
                notExist.push(value);
            }
        });
        let isRemoved = false;
        for (let i = 0; i < notExist.length; i++) {
            delete userCache.bundles[notExist[i]];
            isRemoved = true;
        }

        notExist = [];
        Object.keys(userCache.remoteBundleUrls).forEach((value) => {
            if (bundles[value] == undefined || bundles[value] == null) {
                notExist.push(value);
            }
        });

        for (let i = 0; i < notExist.length; i++) {
            delete userCache.remoteBundleUrls[notExist[i]];
            isRemoved = true;
        }

        return isRemoved;
    },
    /**@description 生成默认缓存 */
    generateDefaultUseCache() {
        userCache.platform = 0;
        userCache.version = gamesConfig.version;
        userCache.serverIP = gamesConfig.packageUrl;
        userCache.historyIps = [userCache.serverIP];
        userCache.buildDir = path.normalize(PlatformBuildPaths[userCache.platform]);
        userCache.buildDir = userCache.buildDir.replace(/\\/g, "/");
        userCache.manifestDir = userCache.buildDir + "/manifest";
        userCache.bundles = bundles;
        userCache.remoteUrl = "-";
        Object.keys(bundles).forEach((key) => {
            userCache.remoteBundleUrls[key] = "-";
        });
        userCache.remoteDir = "-";
    },
    /**@description 读取本地缓存 */
    readCache() {
        if (fs.existsSync(userCachePath)) {
            let data = fs.readFileSync(userCachePath, "utf-8")
            userCache = JSON.parse(data);
            if (this.checkUserCache()) {
                this.saveUserCache();
            }
            this.addLog(`存在缓存 : ${userCachePath}`, userCache);
        } else {
            this.addLog(`不存在缓存 : ${userCachePath}`);
            this.generateDefaultUseCache();
            this.addLog(`生存默认缓存 : `, userCache);
            this.saveUserCache();
        }
    },
    /**@description 初始化UI数据 */
    initUIDatas() {
        this.$.platform.value = userCache.platform;
        this.$.version.value = userCache.version;
        this.$.serverIP.value = userCache.serverIP;
        setTimeout(() => {
            this.updateHistoryUrl();
            if (userCache.historySelectedUrl = "") {
                userCache.historySelectedUrl = userCache.historyIps[0];
            }

            let isFind = false;
            let options = this.$.historyServerIPSelect.$select.options;
            for (let i = 0; i < options.length; i++) {
                if (options.text == userCache.historySelectedUrl) {
                    this.$.historyServerIPSelect.$select.value = i;
                    isFind = true;
                    break;
                }
            }
            if (!isFind) {
                userCache.historySelectedUrl = userCache.historyIps[0];
                this.$.historyServerIPSelect.$select.value = 0;
            }
        }, 10);
        this.$.buildDir.value = userCache.buildDir;
        this.$.manifestDir.value = userCache.manifestDir;

        //bundles 配置
        //`is${gameInfo.dir}includeApp`
        Object.keys(userCache.bundles).forEach((key) => {
            //是否在包内
            this.$[`is${key}includeApp`].value = userCache.bundles[key].includeApk;
            //版本号
            this.$[`${key}Version`].value = userCache.bundles[key].version;
        });

        //测试环境
        this.$.remoteUrl.value = userCache.remoteUrl;
        Object.keys(userCache.remoteBundleUrls).forEach((key) => {
            this.$[`${key}remoteUrl`].value = userCache.remoteBundleUrls[key];
        });
        this.$.remoteDir.value = userCache.remoteDir;
    },
    /**@description 初始化数据 */
    initDatas() {
        this.readCache();
        this.initUIDatas()
    },
    /**@description 绑定界面事件 */
    bindingEvents() {
        this.$.useLocalIP.addEventListener("confirm", this.onUseLocalIP.bind(this));
        this.$.serverIP.addEventListener("blur", this.onInputServerUrlOver.bind(this, this.$.serverIP));
        this.$.historyServerIPSelect.addEventListener("change", this.onHistoryServerIPChange.bind(this, this.$.historyServerIPSelect));
        this.$.version.addEventListener("blur", this.onVersionChange.bind(this, this.$.version));
    },
    //初始化
    init() {
        this.initDatas();
        this.bindingEvents();
    },
    /**
     * @description 版本比较 curVersion > prevVersion 返回ture 
     * @example (1.0.1 > 1.0)  (1.0.1 <= 1.0.1) (1.0.1 < 1.0.2) (1.0.1 > 1.0.0) 
     * @param curVersion 当前构建版本
     * @param prevVersion 之前构建的版本
     */
    isVersionPass(curVersion, prevVersion) {
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
    /** @description 主版本号输入*/
    onVersionChange(element) {
        let version = element.value;
        if (this.isVersionPass(version, userCache.version)) {
            //有效版本
            return;
        }
        this.addLog(`无效版本号,${version} 应大于 ${userCache.version}`);
    },
    /** 
     * @description 切换历史地址 
     * @param element 控件自身 
     */
    onHistoryServerIPChange(element) {
        //先拿到选中项
        let options = this.$.historyServerIPSelect.$select.options;
        for (let i = 0; i < options.length; i++) {
            if (options[i].value == element.value) {
                userCache.serverIP = options[i].text;
                break;
            }
        }
        this.onInputServerUrlOver();
    },
    /** @description 点击了使用本机*/
    onUseLocalIP() {
        let network = require("os").networkInterfaces();
        let url = "";
        Object.keys(network).forEach((key) => {
            network[key].forEach((info) => {
                if (info.family == "IPv4" && !info.internal) {
                    url = info.address;
                }
            });
        });
        if (url.length > 0) {
            userCache.serverIP = "http://" + url;
        }
        this.onInputServerUrlOver();
    },
    /**
     * @description 输入服务器地址结束
     * @param {*} element 
     * @returns 
     */
    onInputServerUrlOver(element) {
        let url = userCache.serverIP;
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

        this.$.serverIP.value = url;
        if (this.addHotAddress(url)) {
            this.updateHistoryUrl();
        }
        this.saveUserCache();
    },
    /**@description 更新历史地址 */
    updateHistoryUrl() {
        this.$.historyServerIPSelect.$select.options.length = 0;
        for (let i = 0; i < userCache.historyIps.length; i++) {
            let option = document.createElement("option");
            option.value = i;
            option.text = userCache.historyIps[i];
            this.$.historyServerIPSelect.$select.options.add(option);
        }
    },
    /**
     * @description 添加历史地址 
     * @param url
     * */
    addHotAddress(url) {
        if (userCache.historyIps.indexOf(url) == -1) {
            userCache.historyIps.push(url);
            this.addLog(`添加历史记录 :${url} 成功`);
            return true;
        }
        return false;
    },
    /**
     * @description 添加日志
     * @param {*} message 
     * @param {*} obj 
     * @returns 
     */
    addLog(message, obj = null) {
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
        let temp = this.$.logView.value;
        if (temp.length > 0) {
            this.$.logView.value = temp + "\n" + text;
        } else {
            this.$.logView.value = text;
        }
        setTimeout(() => {
            this.$.logView.$textarea.scrollTop = this.$.logView.$textarea.scrollHeight;
        }, 10)
    },
}
//面板上的解发事件
exports.listeners = {

};

// 当面板渲染成功后触发
exports.ready = async function () {
    this.init();
};
// 尝试关闭面板的时候触发
exports.beforeClose = async function () {
    console.log("beforeClose");
};
// 当面板实际关闭后触发
exports.close = async function () {
    console.log("close");
};
