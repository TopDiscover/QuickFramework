/**
 * @description bundle管理器
 */

import { Macro } from "../../defines/Macros";
import { Update } from "../update/Update";

export class BundleManager {
   private static _instance: BundleManager = null!;
   public static Instance() { return this._instance || (this._instance = new BundleManager()); }
   private curBundle: Update.Config = null!;
   private isLoading = false;
   protected isEngineBundle(key : any){
      if ( key == cc.AssetManager.BuiltinBundleName.INTERNAL || key == cc.AssetManager.BuiltinBundleName.MAIN ||
         key == cc.AssetManager.BuiltinBundleName.RESOURCES || key == cc.AssetManager.BuiltinBundleName.START_SCENE){
            return true;
         }
      return false;
   }
   /**@description 删除已经加载的bundle */
   public removeLoadedBundle(delegate: EntryDelegate, excludeBundles?: string[]) {
      if (!excludeBundles) {
         excludeBundles = delegate.getPersistBundle();
      }
      let loaded : string[]= [];
      cc.assetManager.bundles.forEach((bundle,key)=>{
         //引擎内置包不能删除
         if ( !this.isEngineBundle(key) ){
            loaded.push(key);
         }
      });
      let i = loaded.length;
      while (i--) {
         let bundle = loaded[i];
         if (excludeBundles.indexOf(bundle) == -1) {
            //在排除bundle中找不到，直接删除
            Manager.entryManager.onUnloadBundle(bundle);
            let result = this.getBundle(bundle);
            if ( result ){
               Manager.cacheManager.removeBundle(bundle);
               cc.assetManager.removeBundle(result);
            }
         }
      }
   }

   /**
    * @description 获取Bundle
    * @param bundle Bundle名|Bundle
    **/
   public getBundle(bundle: BUNDLE_TYPE) {
      if (bundle) {
         if (typeof bundle == "string") {
            return cc.assetManager.getBundle(bundle);
         }
         return bundle;
      }
      return null;
   }

   public getBundleName(bundle: BUNDLE_TYPE): string {
      if (bundle) {
         if (typeof bundle == "string") {
            return bundle;
         } else {
            return bundle.name;
         }
      }
      Log.e(`输入参数错误 : ${bundle}`);
      return Macro.UNKNOWN;
   }

   /**
    * 外部接口 进入Bundle
    * @param config 配置
    */
   public enterBundle(config: Update.Config, delegate: EntryDelegate) {
      if (this.isLoading) {
         if (delegate) delegate.showTips("checkingUpdate");
         Log.d("正在更新游戏，请稍等");
         return;
      }
      //进入主包，检测主包更新
      this.isLoading = true;
      Manager.updateManager.loadVersions(config).then((data) => {
         if (data.isOk) {
            let status = Manager.updateManager.getStatus(config.bundle);
            if (status == Update.Status.UP_TO_DATE) {
               Log.d(`${config.name}(${config.bundle}) 已经是最新,直接加载`);
               this.setCurrentBundle(config);
               this.loadBundle(delegate);
            } else {
               Log.d(`${config.name}(${config.bundle}) 需要下载更新`);
               this._enterBundle(config, delegate);
            }
         } else {
            //网络错误造成，提示玩家重试
            if ( delegate ) delegate.hideLoading();
            Manager.alert.show({
               text: data.err,
               confirmCb: (isOk) => {
                  this._enterBundle(config, delegate);
               }
            });
         }
      });
   }

   private setCurrentBundle(config: Update.Config) {
      this.curBundle = config;
      Manager.updateManager.bundlesConfig[this.curBundle.bundle] = config;
   }

   private _enterBundle(config: Update.Config, delegate: EntryDelegate) {
      this.setCurrentBundle(config);
      this.isLoading = true;
      let versionInfo = Manager.updateManager.bundlesConfig[this.curBundle.bundle];
      this.checkUpdate(versionInfo, delegate);
   }

   /**@description 检测子游戏更新 */
   private checkUpdate(versionInfo: Update.Config, delegate: EntryDelegate) {
      Log.d(`检测更新信息:${versionInfo.name}(${versionInfo.bundle})`);
      Manager.dispatcher.remove(Update.Event.HOTUPDATE_DOWNLOAD, this);
      let bundle: string | undefined = this.curBundle.bundle;
      if (this.curBundle.bundle == Macro.BUNDLE_RESOURCES) {
         bundle = undefined;
      }
      Manager.updateManager.checkUpdate((code, state) => {
         if (code == Update.Code.NEW_VERSION_FOUND) {
            //有新版本
            Manager.dispatcher.add(Update.Event.HOTUPDATE_DOWNLOAD, this.onDownload.bind(this, delegate), this);
            Log.d(`检测到${versionInfo.name}(${versionInfo.bundle})有新的版本`);
            if (delegate) delegate.onNewVersionFund(versionInfo, code, state);
         } else if (state == Update.State.TRY_DOWNLOAD_FAILED_ASSETS) {
            //尝试重新下载之前下载失败的文件
            Manager.dispatcher.add(Update.Event.HOTUPDATE_DOWNLOAD, this.onDownload.bind(this, delegate), this);
            Log.d(`正在尝试重新下载之前下载失败的资源`);
            if (delegate) delegate.onDownloadFailed(versionInfo, code, state);
         } else if (code == Update.Code.ALREADY_UP_TO_DATE) {
            //已经是最新版本
            this.isLoading = false;
            if (delegate) delegate.onAreadyUpToData(versionInfo, code, state);
         } else if (code == Update.Code.ERROR_DOWNLOAD_MANIFEST ||
            code == Update.Code.ERROR_NO_LOCAL_MANIFEST ||
            code == Update.Code.ERROR_PARSE_MANIFEST) {
            //下载manifest文件失败
            this.isLoading = false;
            if (delegate) delegate.onDownloadManifestFailed(versionInfo, code, state);
         } else if (code == Update.Code.CHECKING) {
            //当前正在检测更新
            Log.d(`正在检测更新!!`);
            if (delegate) delegate.onCheckingVersion(versionInfo, code, state);
         } else if (code == Update.Code.MAIN_PACK_NEED_UPDATE || code == Update.Code.PRE_VERSIONS_NOT_FOUND) {
            //需要重新更新主包
            Log.d(`需要重新更新主包`);
            this.isLoading = false;
            if (delegate) delegate.onRecheckMainUpdate(code, this.curBundle);
         } else {
            this.isLoading = false;
            Log.d(`检测更新当前状态 code : ${code} state : ${state}`);
            if (delegate) delegate.onOtherReason(versionInfo, code, state);
         }
      }, bundle);
   }

   public loadBundle(delegate: EntryDelegate) {
      let bundle = this.getBundle(this.curBundle.bundle);
      let versionInfo = Manager.updateManager.bundlesConfig[this.curBundle.bundle];
      if (bundle) {
         Log.d(`${this.curBundle.bundle}已经加载在缓存中，直接使用`);
         this.isLoading = false;
         if (delegate) delegate.onLoadBundleComplete(versionInfo, bundle);
         return;
      }
      this.isLoading = true;
      if (delegate) delegate.showLoading("loading");
      Log.d(`loadBundle : ${this.curBundle.bundle}`);
      cc.assetManager.loadBundle(versionInfo.bundle, (err, bundle) => {
         this.isLoading = false;
         if (err) {
            Log.e(`load bundle : ${versionInfo.bundle} fail !!!`);
            if (delegate) delegate.onLoadBundleError(versionInfo, err);
         } else {
            Log.d(`load bundle : ${versionInfo.bundle} success !!!`);
            if (delegate) delegate.onLoadBundleComplete(versionInfo, bundle);
         }
      });
   }
   private onDownload(delegate: EntryDelegate, info: Update.DownLoadInfo) {
      if (CC_DEBUG) Log.d(JSON.stringify(info));
      let config = Manager.updateManager.getBundleName(this.curBundle.bundle);
      if (info.code == Update.Code.UPDATE_FINISHED) {
         Log.d(`更新${config.name}成功`);
         this.isLoading = false;
      } else if (info.code == Update.Code.UPDATE_FAILED ||
         info.code == Update.Code.ERROR_NO_LOCAL_MANIFEST ||
         info.code == Update.Code.ERROR_DOWNLOAD_MANIFEST ||
         info.code == Update.Code.ERROR_PARSE_MANIFEST ||
         info.code == Update.Code.ERROR_DECOMPRESS) {
         this.isLoading = false;
         Log.e(`更新${config.name}失败`);
      }
      if (delegate) delegate.onDownloading(this.curBundle, info);
   }

   /**
    * @description 打印bundle管理器状态信息
    * @param delegate 
    */
   print(delegate: ManagerPrintDelegate<{
      loaded: cc.AssetManager.Bundle[], //已在加载的bundle
      curBundle: Update.Config, //当前运行的bundle
      areadyLoaded: { [key: string]: Update.Config } //已经加载过的bundle配置信息
      isLoading: boolean //是否存在加载bundle过程中
   }>) {
      if (delegate) {
         let loaded :cc.AssetManager.Bundle[] = [];
         cc.assetManager.bundles.forEach((bundle,key)=>{
            loaded.push(bundle);
         });
         delegate.print({
            loaded: loaded,
            curBundle: this.curBundle,
            areadyLoaded: Manager.updateManager.bundlesConfig,
            isLoading: this.isLoading
         })
      }
   }
}
