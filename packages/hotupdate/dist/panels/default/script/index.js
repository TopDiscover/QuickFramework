"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const Helper_1 = require("../../../Helper");
module.exports = Editor.Panel.extend({
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        logArea: '#logArea',
    },
    messages: {
        'hotupdate:onConfirmDelBundle'() {
            Helper_1.helper.removeNotInApkBundle();
        }
    },
    ready() {
        Helper_1.helper.init();
        let self = this;
        const vm = new window.Vue({
            data() {
                return {
                    bundles: Helper_1.helper.cache.bundles,
                    version: Helper_1.helper.cache.version,
                    serverIP: Helper_1.helper.cache.serverIP,
                    hotupdateUrls: Helper_1.helper.cache.historyIps,
                    buildDir: Helper_1.helper.cache.buildDir,
                    buildOutDir: Helper_1.helper.getManifestDir(Helper_1.helper.cache.buildDir),
                    remoteVersion: Helper_1.helper.cache.remoteVersion,
                    remoteDir: Helper_1.helper.cache.remoteDir,
                    remoteBundles: Helper_1.helper.cache.remoteBundles,
                    progress: 0,
                };
            },
            methods: {
                onRefreshMainVersion() {
                    Helper_1.helper.onRefreshVersion();
                    let view = this;
                    view.remoteVersion = Helper_1.helper.cache.remoteVersion;
                },
                onRefreshVersion(dir) {
                    Helper_1.helper.onRefreshVersion(dir);
                    let view = this;
                    Editor.log(Helper_1.helper.cache.remoteBundles[dir].md5);
                    view.remoteBundles[dir].md5 = Helper_1.helper.cache.remoteBundles[dir].md5;
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
                        Helper_1.helper.cache.remoteDir = fullPath;
                        view.remoteDir = fullPath;
                        Helper_1.helper.saveUserCache();
                    }
                },
                onOpenRemoteDir() {
                    let view = this;
                    Helper_1.helper.openDir(view.remoteDir);
                },
                onChangeBundleVersion(version, dir) {
                    Helper_1.helper.cache.bundles[dir].version = version;
                    Helper_1.helper.saveUserCache();
                },
                onChangeIncludeApk(value, dir) {
                    Helper_1.helper.cache.bundles[dir].includeApk = value;
                    Helper_1.helper.saveUserCache();
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
                            Helper_1.helper.cache.buildDir = fullPath;
                            view.buildDir = fullPath;
                            view.buildOutDir = Helper_1.helper.getManifestDir(Helper_1.helper.cache.buildDir);
                            Helper_1.helper.saveUserCache();
                        }
                    }
                },
                onInputVersionOver(version) {
                    if (Helper_1.helper.isDoCreate) {
                        return;
                    }
                    Editor.log(version);
                    let view = this;
                    view.version = version;
                    Helper_1.helper.cache.version = view.version;
                    Helper_1.helper.saveUserCache();
                },
                onInputUrlOver(inputUrl) {
                    if (Helper_1.helper.isDoCreate) {
                        return;
                    }
                    let url = inputUrl;
                    if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                        Helper_1.helper.addLog(url + `不是以http://https://开头，或者不是网址`);
                        return;
                    }
                    Helper_1.helper.cache.serverIP = url;
                    let view = this;
                    view.serverIP = url;
                    if (Helper_1.helper.addHotAddress(url)) {
                        view.hotupdateUrls = Helper_1.helper.cache.historyIps;
                    }
                    Helper_1.helper.saveUserCache();
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
                Helper_1.helper.progressFuc = (data) => {
                    let view = this;
                    view.progress = data;
                };
                Helper_1.helper.getProgressFunc = () => {
                    let view = this;
                    return view.progress;
                };
            },
            mounted: function () {
            },
            el: self.shadowRoot
        });
        if (self.$logArea) {
            Helper_1.helper.logArea = self.$logArea;
        }
    },
    beforeClose() { },
    close() { },
});
