import { readFileSync } from 'fs';
import { join } from 'path';
import { createApp } from 'vue';
import { helper } from '../../../Helper';

let view : {
    progress : number;
    createProgress : number;
    buildDir : string;
    buildOutDir : string;
    isProcessing : boolean;
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
        },
        onSetProcess(isProcess:boolean){
            view.isProcessing = isProcess;
        }
    },
    ready() {
        helper.read(true);
        if (this.$.app) {
            const app = createApp({});
            //指定Vue3 自己定义控件跳过解析
            app.config.compilerOptions.isCustomElement = tag => tag.startsWith("ui-")
            app.component('view-content', {
                template: readFileSync(join(__dirname, '../../../../static/template/vue/view.html'), 'utf-8'),
                data() {
                    return {
                        bundles: helper.data!.bundles,
                        version: helper.data!.version,
                        serverIP: helper.data!.serverIP,
                        hotupdateUrls: helper.data!.historyIps,
                        buildDir: helper.data!.buildDir,
                        buildOutDir: helper.getManifestDir(helper.data!.buildDir),
                        remoteVersion: helper.remoteVersion,
                        remoteDir: helper.data!.remoteDir,
                        remoteBundles: helper.remoteBundles,
                        includes: helper.data!.includes,
                        autoCreate: helper.data!.autoCreate,
                        autoDeploy: helper.data!.autoDeploy,
                        progress: 0,
                        createProgress: 0,
                        isProcessing : false,
                    };
                },
                methods: {
                    onChangeIncludes(value:boolean,key:string){
                        if ( helper.data!.includes[key].isLock ){
                            console.warn(`${key}已经被锁定，修改无效`);
                            return;
                        }
                        helper.data!.includes[key].include = value;
                        helper.save();
                        helper.updateToConfigTS();
                    },
                    onChangeAutoCreateManifest(value:boolean){
                        helper.data!.autoCreate = value;
                        helper.save();
                    },
                    onChangeAutoDeploy(value:boolean){
                        helper.data!.autoDeploy = value;
                        helper.save();
                    },
                    onRefreshMainVersion() {
                        this.remoteVersion = helper.getVersion();
                    },
                    onRefreshVersion(dir: string) {
                        this.remoteBundles[dir].md5 = helper.getVersion(dir);
                    },
                    onDeployToRemote() {
                        helper.deployToRemote();
                    },
                    onRemoteDirConfirm(dir: string) {
                        helper.data!.remoteDir = dir;
                        helper.save();
                    },
                    onChangeBundleVersion(version: string, dir: string) {
                        helper.data!.bundles[dir].version = version;
                        helper.save();
                    },
                    onChangeIncludeApk(value: boolean, dir: string) {
                        helper.data!.bundles[dir].includeApk = value;
                        helper.save();
                    },
                    onDelBunles() {
                        helper.onDelBundles();
                    },
                    onCreateManifest() {
                        helper.createManifest();
                    },
                    onBuildDirConfirm(url: string) {
                        helper.data!.buildDir = url;
                        this.buildOutDir = helper.getManifestDir(helper.data!.buildDir);
                        helper.save();
                    },
                    onInputVersionOver(version: string) {
                        this.version = version;
                        helper.data!.version = this.version;
                        helper.save();
                    },
                    onInputUrlOver(inputUrl: string) {
                        let url = inputUrl;
                        if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                            helper.logger.log(`${helper.module}${url}不是以http://https://开头，或者不是网址`);
                            return;
                        }
                        helper.data!.serverIP = url;
                        this.serverIP = url;
                        if (helper.addHotAddress(url)) {
                            this.hotupdateUrls = helper.data!.historyIps;
                        }
                        helper.save();
                        helper.updateToConfigTS();
                    },
                    onChangeHotupdateUrls(event: { target: HTMLSelectElement }) {
                        this.onInputUrlOver(event.target.value);
                    },
                    onUserLocalIP() {
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
