"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Helper_1 = require("../../../Helper");
let vueView = null;
module.exports = Editor.Panel.extend({
    template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {},
    messages: {
        'hotupdate:onConfirmDelBundle'() {
            Helper_1.helper.removeNotInApkBundle();
        },
        "hotupdate:updateDeployProgress"(sender, value) {
            vueView.progress = value;
        },
        "hotupdate:setBuildDir"(sender, dest) {
            vueView.buildDir = dest;
            vueView.buildOutDir = Helper_1.helper.getManifestDir(dest);
        },
        "hotupdate:updateCreateProgress"(sender, value) {
            vueView.createProgress = value;
        },
    },
    ready() {
        Helper_1.helper.readConfig();
        let self = this;
        const vm = new window.Vue({
            data() {
                return {
                    bundles: Helper_1.helper.config.bundles,
                    version: Helper_1.helper.config.version,
                    serverIP: Helper_1.helper.config.serverIP,
                    hotupdateUrls: Helper_1.helper.config.historyIps,
                    buildDir: Helper_1.helper.config.buildDir,
                    buildOutDir: Helper_1.helper.getManifestDir(Helper_1.helper.config.buildDir),
                    remoteVersion: Helper_1.helper.remoteVersion,
                    remoteDir: Helper_1.helper.config.remoteDir,
                    remoteBundles: Helper_1.helper.remoteBundles,
                    includes: Helper_1.helper.config.includes,
                    autoCreate: Helper_1.helper.config.autoCreate,
                    autoDeploy: Helper_1.helper.config.autoDeploy,
                    progress: 0,
                    createProgress: 0,
                };
            },
            methods: {
                onChangeIncludes(value, key) {
                    if (Helper_1.helper.config.includes[key].isLock) {
                        Editor.warn(`${key}已经被锁定，修改无效`);
                        return;
                    }
                    Helper_1.helper.config.includes[key].include = value;
                    Helper_1.helper.saveConfig();
                    Helper_1.helper.updateToConfigTS();
                },
                onChangeAutoCreateManifest(value) {
                    Helper_1.helper.config.autoCreate = value;
                    Helper_1.helper.saveConfig();
                },
                onChangeAutoDeploy(value) {
                    Helper_1.helper.config.autoDeploy = value;
                    Helper_1.helper.saveConfig();
                },
                onRefreshMainVersion() {
                    let view = this;
                    view.remoteVersion = Helper_1.helper.onRefreshVersion();
                },
                onRefreshVersion(dir) {
                    Helper_1.helper.onRefreshVersion(dir);
                    let view = this;
                    view.remoteBundles[dir].md5 = Helper_1.helper.onRefreshVersion(dir);
                },
                onDeployToRemote() {
                    Helper_1.helper.onDeployToRemote();
                },
                onRemoteDirConfirm(dir) {
                    if (Helper_1.helper.isDoCreate)
                        return;
                    let result = Editor.Dialog.openFile({
                        title: "选择本地测试服务器路径",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        let view = this;
                        Helper_1.helper.config.remoteDir = fullPath;
                        view.remoteDir = fullPath;
                        Helper_1.helper.saveConfig();
                    }
                },
                onOpenRemoteDir() {
                    let view = this;
                    Helper_1.helper.openDir(view.remoteDir);
                },
                onChangeBundleVersion(version, dir) {
                    Helper_1.helper.config.bundles[dir].version = version;
                    Helper_1.helper.saveConfig();
                },
                onChangeIncludeApk(value, dir) {
                    Helper_1.helper.config.bundles[dir].includeApk = value;
                    Helper_1.helper.saveConfig();
                },
                onDelBunles() {
                    Helper_1.helper.onDelBundles();
                },
                onCreateManifest() {
                    Helper_1.helper.onCreateManifest();
                },
                onInsertHotupdate() {
                    Helper_1.helper.onInsertHotupdate();
                },
                onBuildDirConfirm(url) {
                    if (Helper_1.helper.isDoCreate)
                        return;
                    let view = this;
                    let result = Editor.Dialog.openFile({
                        title: "选择构建后的根目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        if (Helper_1.helper.checkBuildDir(fullPath)) {
                            Helper_1.helper.config.buildDir = fullPath;
                            view.buildDir = fullPath;
                            view.buildOutDir = Helper_1.helper.getManifestDir(Helper_1.helper.config.buildDir);
                            Helper_1.helper.saveConfig();
                        }
                    }
                },
                onInputVersionOver(version) {
                    if (Helper_1.helper.isDoCreate) {
                        return;
                    }
                    let view = this;
                    view.version = version;
                    Helper_1.helper.config.version = view.version;
                    Helper_1.helper.saveConfig();
                },
                onInputUrlOver(inputUrl) {
                    if (Helper_1.helper.isDoCreate) {
                        return;
                    }
                    let url = inputUrl;
                    if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                        Helper_1.helper.log(url + `不是以http://https://开头，或者不是网址`);
                        return;
                    }
                    Helper_1.helper.config.serverIP = url;
                    let view = this;
                    view.serverIP = url;
                    if (Helper_1.helper.addHotAddress(url)) {
                        view.hotupdateUrls = Helper_1.helper.config.historyIps;
                    }
                    Helper_1.helper.saveConfig();
                    Helper_1.helper.updateToConfigTS();
                },
                onChangeHotupdateUrls(url) {
                    let view = this;
                    view.onInputUrlOver(url);
                },
                onUserLocalIP() {
                    if (Helper_1.helper.isDoCreate)
                        return;
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
                        url = "http://" + url + "/hotupdate";
                    }
                    let view = this;
                    view.onInputUrlOver(url);
                },
                onOpenBulidDir() {
                    let view = this;
                    Helper_1.helper.openDir(view.buildDir);
                },
                onOpenBulidOutDir() {
                    let view = this;
                    Helper_1.helper.openDir(view.buildOutDir);
                }
            },
            created: function () {
                vueView = this;
            },
            mounted: function () {
            },
            el: self.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});
