import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp } from 'vue';
import { helper } from '../../../Helper';
helper.init();

module.exports = Editor.Panel.define({
    listeners: {

    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app',
        logArea: "#logArea",
    },
    methods: {

    },
    ready() {
        if (this.$.app) {
            const app = createApp({});
            app.component('view-content', {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        bundles: helper.cache.bundles,
                        version: helper.cache.version,
                        serverIP: helper.cache.serverIP,
                        hotupdateUrls: helper.cache.historyIps,
                        buildDir: helper.cache.buildDir,
                        buildOutDir: helper.getManifestDir(helper.cache.buildDir),
                        remoteVersion: helper.cache.remoteVersion,
                        remoteDir: helper.cache.remoteDir,
                        remoteBundles: helper.cache.remoteBundles,
                        progress: 0,
                    };
                },
                methods: {
                    onRefreshMainVersion() {
                        helper.onRefreshVersion();
                        this.remoteVersion = helper.cache.remoteVersion;
                    },
                    onRefreshVersion(dir: string) {
                        helper.onRefreshVersion(dir);
                        this.remoteBundles[dir].md5 = helper.cache.remoteBundles[dir].md5
                    },
                    onDeployToRemote() {
                        helper.onDeployToRemote();
                    },
                    onRemoteDirConfirm(dir: string) {
                        helper.cache.remoteDir = dir;
                        helper.saveUserCache();
                    },
                    onChangeBundleVersion(version: string, dir: string) {
                        helper.cache.bundles[dir].version = version;
                        helper.saveUserCache();
                    },
                    onChangeIncludeApk(value: boolean, dir: string) {
                        helper.cache.bundles[dir].includeApk = value;
                        helper.saveUserCache();
                    },
                    onDelBunles() {
                        helper.onDelBundles();
                    },
                    onCreateManifest() {
                        helper.onCreateManifest();
                    },
                    onInsertHotupdate() {
                        helper.onInsertHotupdate();
                    },
                    onBuildDirConfirm(url: string) {
                        if (helper.isDoCreate) return;
                        helper.cache.buildDir = url;
                        this.buildOutDir = helper.getManifestDir(helper.cache.buildDir);
                        helper.saveUserCache();
                    },
                    onInputVersionOver(version: string) {
                        if (helper.isDoCreate) {
                            return;
                        }
                        this.version = version;
                        helper.cache.version = this.version;
                        helper.saveUserCache();
                    },
                    onInputUrlOver(inputUrl: string) {
                        if (helper.isDoCreate) {
                            return;
                        }
                        let url = inputUrl;

                        if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                            helper.addLog(url + `不是以http://https://开头，或者不是网址`);
                            return;
                        }

                        helper.cache.serverIP = url;
                        this.serverIP = url;
                        if (helper.addHotAddress(url)) {
                            this.hotupdateUrls = helper.cache.historyIps;
                        }
                        helper.saveUserCache();
                    },
                    onChangeHotupdateUrls(event: { target: HTMLSelectElement }) {
                        this.onInputUrlOver(event.target.value);
                    },
                    onUserLocalIP() {
                        if (helper.isDoCreate) return;
                        let network = require("os").networkInterfaces();
                        let url = "";
                        Object.keys(network).forEach((key) => {
                            network[key].forEach((info: any) => {
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
                    helper.progressFuc = (data) => {
                        this.progress = data;
                    }
                    helper.getProgressFunc = () => {
                        return this.progress;
                    }
                },
                mounted: function () {

                }
            });
            app.mount(this.$.app);
        }
        if (this.$.logArea) {
            helper.logArea = this.$.logArea as any;
        }
    },
    beforeClose() { },
    close() { },
});
