import { existsSync, readFileSync, writeFileSync } from 'fs-extra';
import { join } from 'path';
import Vue from 'vue/dist/vue';
import { helper } from '../../../Helper';
import { BundleInfo } from '../../../Tools';

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
    onInputUrlOver(event: { target: HTMLInputElement } | string): void;
}

module.exports = Editor.Panel.extend({
    template: readFileSync(join(__dirname, '../../../../static/template/default/index.html'), 'utf-8'),
    style: readFileSync(join(__dirname, '../../../../static/style/default/index.css'), 'utf-8'),
    $: {
        logArea: '#logArea',
    },
    messages: {
        'hotupdate:onConfirmDelBundle'() {
            helper.removeNotInApkBundle();
        }
    },
    ready() {
        helper.init();
        let self: MyView = this as any;
        const vm = new window.Vue({
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
                    let view: MyVue = this as any;
                    view.remoteVersion = helper.cache.remoteVersion;
                },
                onRefreshVersion(dir: string) {
                    helper.onRefreshVersion(dir);
                    let view: MyVue = this as any;
                    Editor.log(helper.cache.remoteBundles[dir].md5);
                    view.remoteBundles[dir].md5 = helper.cache.remoteBundles[dir].md5
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
                        helper.cache.remoteDir = fullPath;
                        view.remoteDir = fullPath;
                        helper.saveUserCache();
                      }
                },
                onOpenRemoteDir(){
                    let view: MyVue = this as any;
                    helper.openDir(view.remoteDir);
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
                    let view: MyVue = this as any;
                    let result = Editor.Dialog.openFile({
                        title: "选择构建后的根目录",
                        defaultPath: Editor.Project.path,
                        properties: ["openDirectory"]
                    });
                    if (-1 !== result) {
                        let fullPath = result[0];
                        if (helper.checkBuildDir(fullPath)) {
                            helper.cache.buildDir = fullPath;
                            view.buildDir = fullPath;
                            view.buildOutDir = helper.getManifestDir(helper.cache.buildDir);
                            helper.saveUserCache();
                        }
                    }
                },
                onInputVersionOver(version:string) {
                    if (helper.isDoCreate) {
                        return;
                    }
                    Editor.log(version)
                    let view: MyVue = this as any;
                    view.version = version;
                    helper.cache.version = view.version;
                    helper.saveUserCache();
                },
                onInputUrlOver(inputUrl:string) {
                    if (helper.isDoCreate) {
                        return;
                    }
                    let url = inputUrl;
                    if (/^(https?:\/\/)?([\da-z\.-]+)\.([\da-z\.]{2,6})([\/\w \.-:]*)*\/?$/.test(url) == false) {
                        helper.addLog(url + `不是以http://https://开头，或者不是网址`);
                        return;
                    }

                    helper.cache.serverIP = url;
                    let view: MyVue = this as any;
                    view.serverIP = url;
                    if (helper.addHotAddress(url)) {
                        view.hotupdateUrls = helper.cache.historyIps;
                    }
                    helper.saveUserCache();
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
                helper.progressFuc = (data)=>{
                    let view: MyVue = this as any;
                    view.progress = data;
                }
                helper.getProgressFunc = ()=>{
                    let view: MyVue = this as any;
                    return view.progress;
                }
            },
            mounted: function () {

            },
            el: self.shadowRoot
        });
        if (self.$logArea) {
            helper.logArea = self.$logArea;
        }
    },
    beforeClose() { },
    close() { },
});
