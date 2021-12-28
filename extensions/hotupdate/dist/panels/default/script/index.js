"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const fs_extra_1 = require("fs-extra");
const path_1 = require("path");
const vue_1 = require("vue");
const Helper_1 = require("../../../Helper");
Helper_1.helper.init();
module.exports = Editor.Panel.define({
    listeners: {},
    template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        logArea: "#logArea",
    },
    methods: {},
    ready() {
        if (this.$.app) {
            const app = (0, vue_1.createApp)({});
            app.component('view-content', {
                template: (0, fs_extra_1.readFileSync)((0, path_1.join)(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
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
                        this.remoteVersion = Helper_1.helper.cache.remoteVersion;
                    },
                    onRefreshVersion(dir) {
                        Helper_1.helper.onRefreshVersion(dir);
                        this.remoteBundles[dir].md5 = Helper_1.helper.cache.remoteBundles[dir].md5;
                    },
                    onDeployToRemote() {
                        Helper_1.helper.onDeployToRemote();
                    },
                    onRemoteDirConfirm(dir) {
                        Helper_1.helper.cache.remoteDir = dir;
                        Helper_1.helper.saveUserCache();
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
                    onBuildDirConfirm(url) {
                        if (Helper_1.helper.isDoCreate)
                            return;
                        Helper_1.helper.cache.buildDir = url;
                        this.buildOutDir = Helper_1.helper.getManifestDir(Helper_1.helper.cache.buildDir);
                        Helper_1.helper.saveUserCache();
                    },
                    onInputVersionOver(version) {
                        if (Helper_1.helper.isDoCreate) {
                            return;
                        }
                        this.version = version;
                        Helper_1.helper.cache.version = this.version;
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
                        this.serverIP = url;
                        if (Helper_1.helper.addHotAddress(url)) {
                            this.hotupdateUrls = Helper_1.helper.cache.historyIps;
                        }
                        Helper_1.helper.saveUserCache();
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
                    Helper_1.helper.progressFuc = (data) => {
                        this.progress = data;
                    };
                    Helper_1.helper.getProgressFunc = () => {
                        return this.progress;
                    };
                },
                mounted: function () {
                }
            });
            app.mount(this.$.app);
        }
        if (this.$.logArea) {
            Helper_1.helper.logArea = this.$.logArea;
        }
    },
    beforeClose() { },
    close() { },
});
