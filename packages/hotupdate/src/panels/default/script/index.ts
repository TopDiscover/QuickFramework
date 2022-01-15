import { existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import Vue from 'vue/dist/vue';
import { helper } from '../../../Helper';

interface MyView {
    $logArea: HTMLTextAreaElement;
    shadowRoot: any;
}

interface MyVue {
    /**@description 各bundle的版本配置 */
    bundles: { [key: string]: BundleInfo },
    /**@description 主包版本号 */
    version: string,
    /**@description 当前服务器地址 */
    serverIP: string,
    /**@description 服务器历史地址 */
    hotupdateUrls: string[],
    /**@description 构建项目目录 */
    buildDir: string,
    /**@description 构建项目输出目录 */
    buildOutDir: string,
    /**@description 远程服务器地址 */
    remoteVersion: string,
    /**@description 远程服务器所在目录 */
    remoteDir: string,
    /**@description 远程各bundle的版本配置 */
    remoteBundles: { [key: string]: BundleInfo },
    /**@description 进度 */
    progress: number;
    /**@description 创建进度 */
    createProgress : number;
    onInputUrlOver(event: { target: HTMLInputElement } | string): void;
}
let vueView : MyVue = null!;
module.exports = Editor.Panel.extend({
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        
    },
    messages: {
        'hotupdate:onConfirmDelBundle'() {
            helper.removeNotInApkBundle();
        },
        "hotupdate:updateDeployProgress"(sender:any,value:number){
            vueView.progress = value;
        },
        "hotupdate:setBuildDir"(sender:any,dest:string){
            vueView.buildDir = dest;
            vueView.buildOutDir = helper.getManifestDir(dest)
        },
        "hotupdate:updateCreateProgress"(sender:any,value:number){
            vueView.createProgress = value;
        },
    },
    ready() {
        helper.readConfig();
        let self: MyView = this as any;
        const vm = new window.Vue({
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
                    includes : helper.config.includes,
                    autoCreate : helper.config.autoCreate,
                    autoDeploy : helper.config.autoDeploy,
                    progress: 0,
                    createProgress : 0,
                };
            },
            methods: {
                onChangeIncludes(value:boolean,key:string){
                    if ( helper.config.includes[key].isLock ){
                        Editor.warn(`${key}已经被锁定，修改无效`);
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
                    let view: MyVue = this as any;
                    view.remoteVersion = helper.onRefreshVersion();
                },
                onRefreshVersion(dir: string) {
                    helper.onRefreshVersion(dir);
                    let view: MyVue = this as any;
                    view.remoteBundles[dir].md5 = helper.onRefreshVersion(dir);
                },
                onDeployToRemote() {
                    helper.onDeployToRemote();
                },
                onRemoteDirConfirm(dir: string) {
                    if (helper.isDoCreate) return;
                    let result = Editor.Dialog.openFile({
                        title: "选择本地测试服务器路径",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                      });
                      if (-1 !== result) {
                        let fullPath = result[0];
                        let view: MyVue = this as any;
                        helper.config.remoteDir = fullPath;
                        view.remoteDir = fullPath;
                        helper.saveConfig();
                      }
                },
                onOpenRemoteDir(){
                    let view: MyVue = this as any;
                    helper.openDir(view.remoteDir);
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
                onInsertHotupdate() {
                    helper.onInsertHotupdate();
                },
                onBuildDirConfirm(url: string) {
                    if (helper.isDoCreate) return;
                    let view: MyVue = this as any;
                    let result = Editor.Dialog.openFile({
                        title: "选择构建后的根目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        if (helper.checkBuildDir(fullPath)) {
                            helper.config.buildDir = fullPath;
                            view.buildDir = fullPath;
                            view.buildOutDir = helper.getManifestDir(helper.config.buildDir);
                            helper.saveConfig();
                        }
                    }
                },
                onInputVersionOver(version:string) {
                    if (helper.isDoCreate) {
                        return;
                    }
                    let view: MyVue = this as any;
                    view.version = version;
                    helper.config.version = view.version;
                    helper.saveConfig();
                },
                onInputUrlOver(inputUrl:string) {
                    if (helper.isDoCreate) {
                        return;
                    }
                    let url = inputUrl;
                    if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                        helper.log(url + `不是以http://https://开头，或者不是网址`);
                        return;
                    }

                    helper.config.serverIP = url;
                    let view: MyVue = this as any;
                    view.serverIP = url;
                    if (helper.addHotAddress(url)) {
                        view.hotupdateUrls = helper.config.historyIps;
                    }
                    helper.saveConfig();
                    helper.updateToConfigTS();
                },
                onChangeHotupdateUrls(url:string) {
                    let view: MyVue = this as any;
                    view.onInputUrlOver(url);
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
                    let view: MyVue = this as any;
                    view.onInputUrlOver(url);
                },
                onOpenBulidDir() {
                    let view: MyVue = this as any;
                    helper.openDir(view.buildDir);
                },
                onOpenBulidOutDir() {
                    let view: MyVue = this as any;
                    helper.openDir(view.buildOutDir);
                }
            },
            created: function () {
                vueView = this as any;
            },
            mounted: function () {

            },
            el: self.shadowRoot
        });
    },
    beforeClose() { },
    close() { },
});
