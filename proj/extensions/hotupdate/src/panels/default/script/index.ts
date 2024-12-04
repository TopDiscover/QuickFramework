import { readFileSync } from 'fs';
import { join } from 'path';
import { createApp } from 'vue';
import { BunldesConfig } from '../../../core/Defines';
import { helper } from '../../../Helper';

let view : {
    progress : number;
    createProgress : number;
    buildDir : string;
    buildOutDir : string;
    isProcessing : boolean;
    version : string;
    bundles : BunldesConfig;
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
        },
        onSetVersion(version:string){
            view.version = version;
            view.bundles = helper.data!.bundles;
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
                        autoCreate: helper.data!.autoCreate,
                        autoDeploy: helper.data!.autoDeploy,
                        progress: 0,
                        createProgress: 0,
                        isProcessing : false,
                        isAutoVersion : helper.data!.isAutoVersion,
                        appVersion : helper.data!.appVersion
                    };
                },
                methods: {
                    onChangeAutoCreateManifest(value:boolean){
                        helper.data!.autoCreate = value;
                        helper.save();
                    },
                    onChangeAutoDeploy(value:boolean){
                        helper.data!.autoDeploy = value;
                        helper.save();
                    },
                    onRefreshMainVersion() {
                        (this as any).remoteVersion = helper.getVersion();
                    },
                    onRefreshVersion(dir: string) {
                        (this as any).remoteBundles[dir].md5 = helper.getVersion(dir);
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
                        (this as any).buildOutDir = helper.getManifestDir(helper.data!.buildDir);
                        helper.save();
                    },
                    onInputVersionOver(version: string) {
                        (this as any).version = version;
                        helper.data!.version = (this as any).version;
                        helper.save();
                    },
                    onInputAppVersionOver(version:string){
                        (this as any).appVersion = version;
                        helper.data!.appVersion = (this as any).appVersion;
                        helper.save();
                    },
                    onInputUrlOver(inputUrl: string) {
                        let url = inputUrl;
                        if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                            helper.logger.log(`${helper.module}${url}不是以http://https://开头，或者不是网址`);
                            return;
                        }
                        helper.data!.serverIP = url;
                        (this as any).serverIP = url;
                        if (helper.addHotAddress(url)) {
                            (this as any).hotupdateUrls = helper.data!.historyIps;
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
                    onChangeAutoVersion(value : boolean){
                        (this as any).isAutoVersion = value;
                        helper.data!.isAutoVersion = value;
                        helper.save();
                        helper.updateToConfigTS();
                    },
                },
                created: function () {
                    view = this as any;
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
