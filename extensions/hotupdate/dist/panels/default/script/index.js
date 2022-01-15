"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const Helper_1 = require("../../../Helper");
let view;
module.exports = Editor.Panel.define({
    listeners: {},
    template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
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
        }
    },
    ready() {
        Helper_1.helper.readConfig();
        if (this.$.app) {
            const app = vue_1.createApp({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-");
            app.component('view-content', {
                template: fs_extra_1.readFileSync(path_1.join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
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
                            console.warn(`${key}已经被锁定，修改无效`);
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
                        this.remoteVersion = Helper_1.helper.onRefreshVersion();
                    },
                    onRefreshVersion(dir) {
                        this.remoteBundles[dir].md5 = Helper_1.helper.onRefreshVersion(dir);
                    },
                    onDeployToRemote() {
                        Helper_1.helper.onDeployToRemote();
                    },
                    onRemoteDirConfirm(dir) {
                        Helper_1.helper.config.remoteDir = dir;
                        Helper_1.helper.saveConfig();
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
                    onBuildDirConfirm(url) {
                        if (Helper_1.helper.isDoCreate)
                            return;
                        Helper_1.helper.config.buildDir = url;
                        this.buildOutDir = Helper_1.helper.getManifestDir(Helper_1.helper.config.buildDir);
                        Helper_1.helper.saveConfig();
                    },
                    onInputVersionOver(version) {
                        if (Helper_1.helper.isDoCreate) {
                            return;
                        }
                        this.version = version;
                        Helper_1.helper.config.version = this.version;
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
                        this.serverIP = url;
                        if (Helper_1.helper.addHotAddress(url)) {
                            this.hotupdateUrls = Helper_1.helper.config.historyIps;
                        }
                        Helper_1.helper.saveConfig();
                        Helper_1.helper.updateToConfigTS();
                    },
                    onChangeHotupdateUrls(event) {
                        this.onInputUrlOver(event.target.value);
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
                        this.onInputUrlOver(url);
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
