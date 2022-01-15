import { readFileSync } from 'fs-extra';
import { join } from 'path';
import { createApp } from 'vue';
import { helper } from '../../../Helper';

let view : {
    progress : number;
    createProgress : number;
    buildDir : string;
    buildOutDir : string;
};

module.exports = Editor.Panel.define({
    listeners: {

    },
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        app: '#app'
    },
    methods: {
        updateCreateProgress(progress:number){
            view.createProgress = progress;
        },
        updateDeployProgress(progress:number){
            view.progress = progress;
        },
        onSetBuildDir(dest:string){
            view.buildDir = dest;
            view.buildOutDir = helper.getManifestDir(dest)
        }
    },
    ready() {
        helper.readConfig();
        if (this.$.app) {
            const app = createApp({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-")
            app.component('view-content', {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        bundles: helper.config.bundles,
                        version: helper.config.version,
                        serverIP: helper.config.serverIP,
                        hotupdateUrls: helper.config.historyIps,
                        buildDir: helper.config.buildDir,
                        buildOutDir: helper.getManifestDir(helper.config.buildDir),
                        remoteVersion: helper.remoteVersion,
                        remoteDir: helper.config.remoteDir,
                        remoteBundles: helper.remoteBundles,
                        includes: helper.config.includes,
                        autoCreate: helper.config.autoCreate,
                        autoDeploy: helper.config.autoDeploy,
                        progress: 0,
                        createProgress: 0,
                    };
                },
                methods: {
                    onChangeIncludes(value:boolean,key:string){
                        if ( helper.config.includes[key].isLock ){
                            console.warn(`${key}已经被锁定，修改无效`);
                            return;
                        }
                        helper.config.includes[key].include = value;
                        helper.saveConfig();
                        helper.updateToConfigTS();
                    },
                    onChangeAutoCreateManifest(value:boolean){
                        helper.config.autoCreate = value;
                        helper.saveConfig();
                    },
                    onChangeAutoDeploy(value:boolean){
                        helper.config.autoDeploy = value;
                        helper.saveConfig();
                    },
                    onRefreshMainVersion() {
                        this.remoteVersion = helper.onRefreshVersion();
                    },
                    onRefreshVersion(dir: string) {
                        this.remoteBundles[dir].md5 = helper.onRefreshVersion(dir);
                    },
                    onDeployToRemote() {
                        helper.onDeployToRemote();
                    },
                    onRemoteDirConfirm(dir: string) {
                        helper.config.remoteDir = dir;
                        helper.saveConfig();
                    },
                    onChangeBundleVersion(version: string, dir: string) {
                        helper.config.bundles[dir].version = version;
                        helper.saveConfig();
                    },
                    onChangeIncludeApk(value: boolean, dir: string) {
                        helper.config.bundles[dir].includeApk = value;
                        helper.saveConfig();
                    },
                    onDelBunles() {
                        helper.onDelBundles();
                    },
                    onCreateManifest() {
                        helper.onCreateManifest();
                    },
                    onBuildDirConfirm(url: string) {
                        if (helper.isDoCreate) return;
                        helper.config.buildDir = url;
                        this.buildOutDir = helper.getManifestDir(helper.config.buildDir);
                        helper.saveConfig();
                    },
                    onInputVersionOver(version: string) {
                        if (helper.isDoCreate) {
                            return;
                        }
                        this.version = version;
                        helper.config.version = this.version;
                        helper.saveConfig();
                    },
                    onInputUrlOver(inputUrl: string) {
                        if (helper.isDoCreate) {
                            return;
                        }
                        let url = inputUrl;

                        if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                            helper.log(url + `不是以http://https://开头，或者不是网址`);
                            return;
                        }

                        helper.config.serverIP = url;
                        this.serverIP = url;
                        if (helper.addHotAddress(url)) {
                            this.hotupdateUrls = helper.config.historyIps;
                        }
                        helper.saveConfig();
                        helper.updateToConfigTS();
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
