"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_1 = require("fs");
const path_1 = require("path");
const vue_1 = require("vue");
const Helper_1 = require("../../../Helper");
let view;
module.exports = Editor.Panel.define({
    listeners: {},
    template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app'
    },
    methods: {
        updateCreateProgress(progress) {
            view.createProgress = progress;
        },
        updateDeployProgress(progress) {
            view.progress = progress;
        },
        onSetBuildDir(dest) {
            view.buildDir = dest;
            view.buildOutDir = Helper_1.helper.getManifestDir(dest);
        },
        onSetProcess(isProcess) {
            view.isProcessing = isProcess;
        },
        onSetVersion(version) {
            view.version = version;
            view.bundles = Helper_1.helper.data.bundles;
        }
    },
    ready() {
        Helper_1.helper.read(true);
        if (this.$.app) {
            const app = (0, vue_1.createApp)({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-");
            app.component('view-content', {
                template: (0, fs_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
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
                        isProcessing: false,
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
                        this.remoteVersion = Helper_1.helper.getVersion();
                    },
                    onRefreshVersion(dir) {
                        this.remoteBundles[dir].md5 = Helper_1.helper.getVersion(dir);
                    },
                    onDeployToRemote() {
                        Helper_1.helper.deployToRemote();
                    },
                    onRemoteDirConfirm(dir) {
                        Helper_1.helper.data.remoteDir = dir;
                        Helper_1.helper.save();
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
                    onBuildDirConfirm(url) {
                        Helper_1.helper.data.buildDir = url;
                        this.buildOutDir = Helper_1.helper.getManifestDir(Helper_1.helper.data.buildDir);
                        Helper_1.helper.save();
                    },
                    onInputVersionOver(version) {
                        this.version = version;
                        Helper_1.helper.data.version = this.version;
                        Helper_1.helper.save();
                    },
                    onInputAppVersionOver(version) {
                        this.appVersion = version;
                        Helper_1.helper.data.appVersion = this.appVersion;
                        Helper_1.helper.save();
                    },
                    onInputUrlOver(inputUrl) {
                        let url = inputUrl;
                        if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                            Helper_1.helper.logger.log(`${Helper_1.helper.module}${url}不是以http://https://开头，或者不是网址`);
                            return;
                        }
                        Helper_1.helper.data.serverIP = url;
                        this.serverIP = url;
                        if (Helper_1.helper.addHotAddress(url)) {
                            this.hotupdateUrls = Helper_1.helper.data.historyIps;
                        }
                        Helper_1.helper.save();
                        Helper_1.helper.updateToConfigTS();
                    },
                    onChangeHotupdateUrls(event) {
                        this.onInputUrlOver(event.target.value);
                    },
                    onUserLocalIP() {
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
                        this.onInputUrlOver(url);
                    },
                    onChangeAutoVersion(value) {
                        this.isAutoVersion = value;
                        Helper_1.helper.data.isAutoVersion = value;
                        Helper_1.helper.save();
                        Helper_1.helper.updateToConfigTS();
                    },
                },
                created: function () {
                    view = this;
                },
                mounted: function () {
                }
            });
            app.mount(this.$.app);
        }
    },
    beforeClose() { },
    close() { },
});
