"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const Helper_1 = require("../../../Helper");
let vueView = null;
let ui = null;
const el = {
    uiAutoVersion: "#uiAutoVersion",
    uiVersion: "#uiVersion",
    uiUrlConfirm: "#uiUrlConfirm",
    uiHistoryUrl: "#uiHistoryUrl",
    uiBuildDir: "#uiBuildDir",
    uiAutoCreate: "#uiAutoCreate",
    uiAutoDeploy: "#uiAutoDeploy",
    uiDelBundles: "#uiDelBundles",
    uiCreateVersion: "#uiCreateVersion",
    uiUrl: "#uiUrl",
    uiBuildDirSelect: "#uiBuildDirSelect",
    uiRemoteSelect: "#uiRemoteSelect",
    uiDeploy: "#uiDeploy",
    uiBundles: "#uiBundles",
};
function setProcessing(isProcessing) {
    let els = Object.keys(el);
    els.forEach(v => {
        if (v == "uiBundles") {
            let elBundles = ui.$uiBundles;
            let versions = elBundles.childNodes;
            versions.forEach(v => {
                if (v.nodeName == "UI-PROP") {
                    let props = v.childNodes;
                    props.forEach(prop => {
                        if (prop.nodeName == "DIV") {
                            prop.childNodes.forEach(div => {
                                if (div.nodeName == "UI-CHECKBOX" || div.nodeName == "UI-INPUT") {
                                    div.disabled = isProcessing;
                                }
                            });
                        }
                    });
                }
            });
        }
        else {
            ui[`$${v}`].disabled = isProcessing;
        }
    });
}
module.exports = Editor.Panel.extend({
    template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: el,
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
        "hotupdate:onSetVersion"(sender, version) {
            vueView.version = version;
            vueView.bundles = Helper_1.helper.data.bundles;
        },
        "hotupdate:onSetProcess"(sender, isProcessing) {
            setProcessing(isProcessing);
        },
        onPngCompressComplete(sender, info) {
            let dest = info.dest;
            let platform = info.platform;
            Helper_1.helper.logger.log(`${Helper_1.helper.module}png图片压缩完成,构建平台:`, dest, platform);
            if (Helper_1.helper.isSupportUpdate(platform)) {
                Helper_1.helper.onPngCompressComplete();
            }
        }
    },
    ready() {
        Helper_1.helper.read(true);
        let self = this;
        ui = this;
        const vm = new window.Vue({
            data() {
                return {
                    bundles: Helper_1.helper.data.bundles,
                    version: Helper_1.helper.data.version,
                    serverIP: Helper_1.helper.data.serverIP,
                    hotupdateUrls: Helper_1.helper.data.historyIps,
                    buildDir: Helper_1.helper.data.buildDir,
                    buildOutDir: Helper_1.helper.getManifestDir(Helper_1.helper.data.buildDir),
                    remoteVersion: Helper_1.helper.remoteVersion,
                    remoteDir: Helper_1.helper.data.remoteDir,
                    remoteBundles: Helper_1.helper.remoteBundles,
                    autoCreate: Helper_1.helper.data.autoCreate,
                    autoDeploy: Helper_1.helper.data.autoDeploy,
                    progress: 0,
                    createProgress: 0,
                    isAutoVersion: Helper_1.helper.data.isAutoVersion,
                    appVersion: Helper_1.helper.data.appVersion
                };
            },
            methods: {
                onChangeAutoCreateManifest(value) {
                    Helper_1.helper.data.autoCreate = value;
                    Helper_1.helper.save();
                },
                onChangeAutoDeploy(value) {
                    Helper_1.helper.data.autoDeploy = value;
                    Helper_1.helper.save();
                },
                onRefreshMainVersion() {
                    let view = this;
                    view.remoteVersion = Helper_1.helper.getVersion();
                },
                onRefreshVersion(dir) {
                    let view = this;
                    view.remoteBundles[dir].md5 = Helper_1.helper.getVersion(dir);
                },
                onDeployToRemote() {
                    Helper_1.helper.deployToRemote();
                },
                onRemoteDirConfirm(dir) {
                    if (Helper_1.helper.isDoing)
                        return;
                    let result = Editor.Dialog.openFile({
                        title: "选择本地测试服务器路径",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        let view = this;
                        Helper_1.helper.data.remoteDir = fullPath;
                        view.remoteDir = fullPath;
                        Helper_1.helper.save();
                    }
                },
                onOpenRemoteDir() {
                    let view = this;
                    Helper_1.helper.openDir(view.remoteDir);
                },
                onChangeBundleVersion(version, dir) {
                    Helper_1.helper.data.bundles[dir].version = version;
                    Helper_1.helper.save();
                },
                onChangeIncludeApk(value, dir) {
                    Helper_1.helper.data.bundles[dir].includeApk = value;
                    Helper_1.helper.save();
                },
                onDelBunles() {
                    Helper_1.helper.onDelBundles();
                },
                onCreateManifest() {
                    Helper_1.helper.createManifest();
                },
                onInsertHotupdate() {
                    Helper_1.helper.insertHotupdate(Helper_1.helper.data.buildDir);
                },
                onBuildDirConfirm(url) {
                    if (Helper_1.helper.isDoing)
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
                            Helper_1.helper.data.buildDir = fullPath;
                            view.buildDir = fullPath;
                            view.buildOutDir = Helper_1.helper.getManifestDir(Helper_1.helper.data.buildDir);
                            Helper_1.helper.save();
                        }
                    }
                },
                onInputVersionOver(version) {
                    if (Helper_1.helper.isDoing) {
                        return;
                    }
                    let view = this;
                    view.version = version;
                    Helper_1.helper.data.version = view.version;
                    Helper_1.helper.save();
                },
                onInputAppVersionOver(version) {
                    let view = this;
                    view.appVersion = version;
                    Helper_1.helper.data.appVersion = version;
                    Helper_1.helper.save();
                },
                onInputUrlOver(inputUrl) {
                    if (Helper_1.helper.isDoing) {
                        return;
                    }
                    let url = inputUrl;
                    if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                        Helper_1.helper.logger.log(Helper_1.helper.module + url + `不是以http://https://开头，或者不是网址`);
                        return;
                    }
                    Helper_1.helper.data.serverIP = url;
                    let view = this;
                    view.serverIP = url;
                    if (Helper_1.helper.addHotAddress(url)) {
                        view.hotupdateUrls = Helper_1.helper.data.historyIps;
                    }
                    Helper_1.helper.save();
                    Helper_1.helper.updateToConfigTS();
                },
                onChangeHotupdateUrls(url) {
                    let view = this;
                    view.onInputUrlOver(url);
                },
                onUserLocalIP() {
                    if (Helper_1.helper.isDoing)
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
                },
                onChangeAutoVersion(value) {
                    let view = this;
                    view.isAutoVersion = value;
                    Helper_1.helper.data.isAutoVersion = value;
                    Helper_1.helper.save();
                    Helper_1.helper.updateToConfigTS();
                },
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
