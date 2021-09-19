/**
 * @description bundle管理器
 */

import { Macro } from "../../defines/Macros";
import { HotUpdate } from "../hotupdate/Hotupdate";

export class BundleManager {
   private static _instance: BundleManager = null!;
   public static Instance() { return this._instance || (this._instance = new BundleManager()); }
   private curBundle: HotUpdate.BundleConfig = null!;
   private isLoading = false;
   /**@description 大厅Bundle名 */
   public bundleHall = "hall";
   /**@description 已经加载的bundle */
   private loadedBundle: string[] = []
   /**@description 删除已经加载的bundle */
   public removeLoadedBundle( delegate : EntryDelegate, excludeBundles ?: string[]) {
      if ( !excludeBundles ){
         excludeBundles = delegate.getPersistBundle();
      }
      let i = this.loadedBundle.length;
      while(i--){
         let bundle = this.loadedBundle[i];
         if( excludeBundles.indexOf(bundle) == -1){
            //在排除bundle中找不到，直接删除
            Manager.entryManager.onUnloadBundle(bundle);
            Manager.assetManager.removeBundle(bundle);
         }
      }
   }

   /**
    * 外部接口 进入Bundle
    * @param config 配置
    */
   public enterBundle(config: HotUpdate.BundleConfig, delegate: EntryDelegate) {
      if (this.isLoading) {
         if (delegate) delegate.onBundleLoading(config);
         Log.d("正在更新游戏，请稍等");
         return;
      }
      this.curBundle = config;
      this.isLoading = true;

      if (!Manager.hotupdate.bundlesConfig[this.curBundle.bundle]) {
         Manager.hotupdate.bundlesConfig[this.curBundle.bundle] = config;
      }

      let versionInfo = Manager.hotupdate.bundlesConfig[this.curBundle.bundle];
      this.checkUpdate(versionInfo, delegate);
   }

   /**@description 检测子游戏更新 */
   private checkUpdate(versionInfo: HotUpdate.BundleConfig, delegate: EntryDelegate) {
      let self = this;
      Log.d(`检测更新信息:${versionInfo.name}(${versionInfo.bundle})`);
      Manager.eventDispatcher.removeEventListener(HotUpdate.Event.HOTUPDATE_DOWNLOAD, this);
      let bundle : string | undefined = this.curBundle.bundle;
      if ( this.curBundle.bundle == Macro.BUNDLE_RESOURCES ){
         bundle  = undefined;
      }
      Manager.hotupdate.checkUpdate((code, state) => {
         if (code == HotUpdate.Code.NEW_VERSION_FOUND) {
            //有新版本
            Manager.eventDispatcher.addEventListener(HotUpdate.Event.HOTUPDATE_DOWNLOAD, this.onDownload.bind(this, delegate), this);
            Log.d(`检测到${versionInfo.name}(${versionInfo.bundle})有新的版本`);
            if (delegate) delegate.onNewVersionFund(versionInfo, code, state);
         } else if (state == HotUpdate.State.TRY_DOWNLOAD_FAILED_ASSETS) {
            //尝试重新下载之前下载失败的文件
            Manager.eventDispatcher.addEventListener(HotUpdate.Event.HOTUPDATE_DOWNLOAD, this.onDownload.bind(this, delegate), this);
            Log.d(`正在尝试重新下载之前下载失败的资源`);
            if (delegate) delegate.onDownloadFailed(versionInfo, code, state);
         } else if (code == HotUpdate.Code.ALREADY_UP_TO_DATE) {
            //已经是最新版本
            this.isLoading = false;
            if (delegate) delegate.onAreadyUpToData(versionInfo, code, state);
         } else if (code == HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST ||
            code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST ||
            code == HotUpdate.Code.ERROR_PARSE_MANIFEST) {
            //下载manifest文件失败
            this.isLoading = false;
            if (delegate) delegate.onDownloadManifestFailed(versionInfo, code, state);
         } else if (code == HotUpdate.Code.CHECKING) {
            //当前正在检测更新
            Log.d(`正在检测更新!!`);
            if (delegate) delegate.onCheckingVersion(versionInfo, code, state);
         } else {
            this.isLoading = false;
            Log.d(`检测更新当前状态 code : ${code} state : ${state}`);
            if (delegate) delegate.onOtherReason(versionInfo, code, state);
         }
      },bundle);
   }

   public loadBundle(delegate: EntryDelegate) {
      Log.d(`loadBundle : ${this.curBundle.bundle}`);
      let me = this;
      this.isLoading = true;
      //加载子包
      let versionInfo = Manager.hotupdate.bundlesConfig[this.curBundle.bundle];
      Manager.assetManager.loadBundle(versionInfo.bundle, (err, bundle) => {
         me.isLoading = false;
         if (err) {
            Log.e(`load bundle : ${versionInfo.bundle} fail !!!`);
            if( delegate ) delegate.onLoadBundleError(versionInfo,err);
         } else {
            Log.d(`load bundle : ${versionInfo.bundle} success !!!`);
            this.loadedBundle.push(versionInfo.bundle);
            if ( delegate ) delegate.onLoadBundleComplete(versionInfo,bundle);
         }
      });
   }
   private onDownload(delegate: EntryDelegate, info: HotUpdate.DownLoadInfo) {
      if (CC_DEBUG) Log.d(JSON.stringify(info));
      let config = Manager.hotupdate.getBundleName(this.curBundle.bundle);
      if (info.code == HotUpdate.Code.UPDATE_FINISHED) {
         Log.d(`更新${config.name}成功`);
      } else if (info.code == HotUpdate.Code.UPDATE_FAILED ||
         info.code == HotUpdate.Code.ERROR_NO_LOCAL_MANIFEST ||
         info.code == HotUpdate.Code.ERROR_DOWNLOAD_MANIFEST ||
         info.code == HotUpdate.Code.ERROR_PARSE_MANIFEST ||
         info.code == HotUpdate.Code.ERROR_DECOMPRESS) {
         this.isLoading = false;
         Log.e(`更新${config.name}失败`);
      }
      if (delegate) delegate.onDownloading(this.curBundle, info);
   }
}
