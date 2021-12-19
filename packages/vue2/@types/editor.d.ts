/**
 * Cocos Creator 编辑器命名空间
 * @author 陈皮皮（ifaswind）
 * @version 20200803
 * @see https://gitee.com/ifaswind/eazax-ccc/blob/master/declarations/editor.d.ts
 */
declare namespace Editor {

    /**
     * Log the normal message and show on the console. The method will send ipc message editor:console-log to all windows.
     * @param args Whatever arguments the message needs
     */
    export function log(...args: any): void;

    /**
     * Log the normal message and show on the console. The method will send ipc message editor:console-log to all windows.
     * @param args Whatever arguments the message needs
     */
    export function info(...args: any): void;

    /**
     * Log the warnning message and show on the console, it also shows the call stack start from the function call it. The method will send ipc message editor:console-warn to all windows.
     * @param args Whatever arguments the message needs
     */
    export function warn(...args: any): void;

    /**
     * Log the error message and show on the console, it also shows the call stack start from the function call it. The method will sends ipc message editor:console-error to all windows.
     * @param args Whatever arguments the message needs
     */
    export function error(...args: any): void;

    /**
     * Log the success message and show on the console The method will send ipc message editor:console-success to all windows.
     * @param args Whatever arguments the message needs
     */
    export function success(...args: any): void;

    /**
     * Require the module by Editor.url. This is good for module exists in package, since the absolute path of package may be variant in different machine.
     * @param url 
     */
    export function require(url: string): any;

    /**
     * Returns the file path (if it is registered in custom protocol) or url (if it is a known public protocol).
     * @param url 
     * @param encode 
     */
    export function url(url: string, encode?: string): string;

}

declare namespace Editor {

    export const versions: { CocosCreator: string, 'editor-framework': string, 'asset-db': string, cocos2d: string };

}

declare namespace Editor {

    namespace RendererProcess {

        /**
        * AssetDB singleton class in renderer process, you can access the instance with `Editor.assetdb`.
        */
        class AssetDB {

            /**
             * The remote AssetDB instance of main process, same as `Editor.remote.assetdb`.
             */
            readonly remote: Remote;

            /**
             * The library path.
             */
            readonly library: string;

            /**
             * Reveal given url in native file system.
             * @param url 
             */
            explore(url: string): string;

            /**
             * Reveal given url's library file in native file system.
             * @param url 
             */
            exploreLib(url: string): string;

            /**
             * Get native file path by url.
             * @param url 
             * @param cb The callback function.
             */
            queryPathByUrl(url: string, cb?: (err: any, path: any) => void): void;

            /**
             * Get uuid by url.
             * @param url 
             * @param cb The callback function.
             */
            queryUuidByUrl(url: string, cb?: (err: any, uuid: any) => void): void;

            /**
             * Get native file path by uuid.
             * @param uuid 
             * @param cb The callback function.
             */
            queryPathByUuid(uuid: string, cb?: (err: any, path: any) => void): void;

            /**
             * Get asset url by uuid.
             * @param uuid 
             * @param cb The callback function.
             */
            queryUrlByUuid(uuid: string, cb?: (err: any, url: any) => void): void;

            /**
             * Get asset info by uuid.
             * @param uuid 
             * @param cb The callback function.
             */
            queryInfoByUuid(uuid: string, cb?: (err: any, info: any) => void): void;

            /**
             * Get meta info by uuid.
             * @param uuid 
             * @param cb The callback function.
             */
            queryMetaInfoByUuid(uuid: string, cb?: (err: any, info: any) => void): void;

            /**
             * Query all assets from asset-db.
             * @param cb The callback function.
             */
            deepQuery(cb?: (err: any, results: any[]) => void): void;

            /**
             * Query assets by url pattern and asset-type.
             * @param pattern The url pattern.
             * @param assetTypes The asset type(s).
             * @param cb The callback function.
             */
            queryAssets(pattern: string, assetTypes: string | string[], cb?: (err: any, results: any[]) => void): void;

            /**
             * Import files outside asset-db to specific url folder. 
             * @param rawfiles Rawfile path list.
             * @param destUrl The url of dest folder.
             * @param showProgress Show progress or not.
             * @param cb The callbak function.
             */
            import(rawfiles: string[], destUrl: string, showProgress?: boolean, cb?: (err: any, result: any) => void): void;

            /**
             * Create asset in specific url by sending string data to it.
             * @param uuid 
             * @param metaJson 
             * @param cb the callback function.
             */
            create(url: string, data: string, cb?: (err: any, result: any) => void): void;

            /**
             * Move asset from src to dest.
             * @param srcUrl 
             * @param destUrl 
             * @param showMessageBox 
             */
            move(srcUrl: string, destUrl: string, showMessageBox?: boolean): void;

            /**
             * Delete assets by url list.
             * @param urls 
             */
            delete(urls: string[]): void;

            /**
             * Save specific asset by sending string data.
             * @param url 
             * @param data 
             * @param cb the callback function.
             */
            saveExists(url: string, data: string, cb?: (err: any, result: any) => void): void;

            /**
             * Create or save assets by sending string data. If the url is already existed, it will be changed with new data. The behavior is same with method saveExists. Otherwise, a new asset will be created. The behavior is same with method create.
             * @param url 
             * @param data 
             * @param cb the callback function.
             */
            createOrSave(url: string, data: string, cb?: (err: any, result: any) => void): void;

            /**
             * Save specific meta by sending meta's json string.
             * @param uuid 
             * @param metaJson 
             * @param cb the callback function.
             */
            saveMeta(uuid: string, metaJson: string, cb?: (err: any, result: any) => void): void;

            /**
             * Refresh the assets in url, and return the results.
             * @param url 
             * @param cb 
             */
            refresh(url: string, cb?: (err: any, results: any[]) => void): void;

        }

    }

    namespace MainProcess {

        /**
         * AssetDB singleton class in main process, you can access the instance with `Editor.assetdb`.
         */
        class AssetDB {

            /**
             * Return uuid by url. If uuid not found, it will return null.
             * @param url 
             */
            urlToUuid(url: string): string;

            /**
             * Return uuid by file path. If uuid not found, it will return null.
             * @param fspath 
             */
            fspathToUuid(fspath: string): string;

            /**
             * Return file path by uuid. If file path not found, it will return null.
             * @param url 
             */
            uuidToFspath(url: string): string;

            /**
             * Return url by uuid. If url not found, it will return null.
             * @param uuid 
             */
            uuidToUrl(uuid: string): string;

            /**
             * Return url by file path. If file path not found, it will return null.
             * @param fspath 
             */
            fspathToUrl(fspath: string): string;

            /**
             * Return file path by url. If url not found, it will return null.
             * @param url 
             */
            urlToFspath(url: string): string;

            /**
             * Check existance by url.
             * @param url 
             */
            exists(url: string): string;

            /**
             * Check existance by uuid.
             * @param uuid 
             */
            existsByUuid(uuid: string): string;

            /**
             * Check existance by path.
             * @param fspath 
             */
            existsByPath(fspath: string): string;

            /**
             * Check whether asset for a given url is a sub asset.
             * @param url 
             */
            isSubAsset(url: string): boolean;

            /**
             * Check whether asset for a given uuid is a sub asset.
             * @param uuid 
             */
            isSubAssetByUuid(uuid: string): boolean;

            /**
             * Check whether asset for a given path is a sub asset.
             * @param fspath 
             */
            isSubAssetByPath(fspath: string): boolean;

            /**
             * Check whether asset contains sub assets for a given url.
             * @param url
             */
            containsSubAssets(url: string): boolean;

            /**
             * Check whether asset contains sub assets for a given uuid.
             * @param uuid
             */
            containsSubAssetsByUuid(uuid: string): boolean;

            /**
             * Check whether asset contains sub assets for a given path.
             * @param fspath 
             */
            containsSubAssetsByPath(fspath: string): boolean;

            /**
             * Return asset info by a given url.
             * @param url 
             */
            assetInfo(url: string): AssetInfo;

            /**
             * Return asset info by a given uuid.
             * @param uuid 
             */
            assetInfoByUuid(uuid: string): AssetInfo;

            /**
             * Return asset info by a given file path.
             * @param fspath 
             */
            assetInfoByPath(fspath: string): AssetInfo;

            /**
             * Return all sub assets info by url if the url contains sub assets.
             * @param url 
             */
            subAssetInfos(url: string): AssetInfo[];

            /**
             * Return all sub assets info by uuid if the uuid contains sub assets.
             * @param uuid 
             */
            subAssetInfosByUuid(uuid: string): AssetInfo[];

            /**
             * Return all sub assets info by path if the path contains sub assets.
             * @param fspath 
             */
            subAssetInfosByPath(fspath: string): AssetInfo[];

            /**
             * Return meta instance by a given url.
             * @param url 
             */
            loadMeta(url: string): MetaBase;

            /**
             * Return meta instance by a given uuid.
             * @param uuid 
             */
            loadMetaByUuid(uuid: string): MetaBase;

            /**
             * Return meta instance by a given path.
             * @param fspath 
             */
            loadMetaByPath(fspath: string): MetaBase;

            /**
             * Return whether a given url is reference to a mount.
             * @param url 
             */
            isMount(url: string): boolean;

            /**
             * Return whether a given path is reference to a mount.
             * @param fspath 
             */
            isMountByPath(fspath: string): boolean;

            /**
             * Return whether a given uuid is reference to a mount.
             * @param uuid 
             */
            isMountByUuid(uuid: string): boolean;

            /**
             * Return mount info by url.
             * @param url 
             */
            mountInfo(url: string): MountInfo;

            /**
             * Return mount info by uuid.
             * @param uuid 
             */
            mountInfoByUuid(uuid: string): MountInfo;

            /**
             * Return mount info by path.
             * @param fspath 
             */
            mountInfoByPath(fspath: string): MountInfo;

            /**
             * Mount a directory to assetdb, and give it a name. If you don't provide a name, it will mount to root.
             * @param path file system path.
             * @param mountPath the mount path (relative path).
             * @param opts options.
             * @param opts.hide if the mount hide in assets browser.
             * @param opts.virtual if this is a virtual mount point.
             * @param opts.icon icon for the mount.
             * @param cb a callback function.
             * @example Editor.assetdb.mount('path/to/mount', 'assets', function (err) {
                            // mounted, do something ...
                        });
             */
            mount(path: string, mountPath: string, opts: { hide: object, vitural: object, icon: object }, cb?: (err: any) => void): void;

            /**
             * Attach the specified mount path.
             * @param mountPath the mount path (relative path).
             * @param cb a callback function.
             * @example Editor.assetdb.attachMountPath('assets', function (err, results) {
                            // mount path attached, do something ...
                            // results are the assets created
                        });
             */
            attachMountPath(mountPath: string, cb?: (err: any, results: any[]) => void): void;

            /**
             * Unattach the specified mount path.
             * @param mountPath the mount path (relative path).
             * @param cb a callback function.
             * @example Editor.assetdb.unattachMountPath('assets', function (err, results) {
                            // mount path unattached, do something ...
                            // results are the assets deleted
                        });
             */
            unattachMountPath(mountPath: string, cb?: (err: any, results: any[]) => void): void;

            /**
             * Unmount by name.
             * @param mountPath the mount path.
             * @param cb a callback function.
             * @example Editor.assetdb.unmount('assets', function (err) {
                            // unmounted, do something ...
                        });
             */
            unmount(mountPath: string, cb?: (err: any) => void): void;

            /**
             * Init assetdb, it will scan the mounted directories, and import unimported assets.
             * @param cb a callback function.
             * @example Editor.assetdb.init(function (err, results) {
                            // assets that imported during init
                            results.forEach(function (result) {
                                // result.uuid
                                // result.parentUuid
                                // result.url
                                // result.path
                                // result.type
                            });
                        });
             */
            init(cb?: (err: any, results: any[]) => void): void;

            /**
             * Refresh the assets in url, and return the results.
             * @param url 
             * @param cb 
             */
            refresh(url: string, cb?: Function): void;

            /**
             * deepQuery
             * @param cb 
             * @example Editor.assetdb.deepQuery(function (err, results) {
                          results.forEach(function (result) {
                            // result.name
                            // result.extname
                            // result.uuid
                            // result.type
                            // result.isSubAsset
                            // result.children - the array of children result
                          });
                        });
             */
            deepQuery(cb?: Function): void;

            /**
             * queryAssets
             * @param pattern The url pattern.
             * @param assetTypes The asset type(s).
             * @param cb The callback function.
             */
            queryAssets(pattern: string, assetTypes: string[], cb?: (err: Error, results: any[]) => void): void;

            /**
             * queryMetas
             * @param pattern The url pattern.
             * @param type The asset type.
             * @param cb The callback function.
             */
            queryMetas(pattern: string, type: string, cb?: (err: Error, results: any[]) => void): void;

            /**
             * move
             * @param srcUrl The url pattern.
             * @param destUrl The asset type.
             * @param cb The callback function.
             */
            move(srcUrl: string, destUrl: string, cb?: (err: Error, results: any[]) => void): void;

            /**
             * delete
             * @param urls 
             * @param cb 
             */
            delete(urls: string[], cb?: (err: Error, results: any[]) => void): void;

            /**
             * Create asset at url with data.
             * @param url 
             * @param data 
             * @param cb 
             */
            create(url: string, data: string, cb?: (err: Error, results: any[]) => void): void;

            /**
             * Save data to the exists asset at url.
             * @param url 
             * @param data 
             * @param cb 
             */
            saveExists(url: string, data: string, cb?: (err: Error, meta: any) => void): void;

            /**
             * Import raw files to url
             * @param rawfiles 
             * @param url 
             * @param cb 
             */
            import(rawfiles: string[], url: string, cb?: (err: Error, results: any[]) => void): void;

            /**
             * Overwrite the meta by loading it through uuid.
             * @param uuid 
             * @param jsonString 
             * @param cb 
             */
            saveMeta(uuid: string, jsonString: string, cb?: (err: Error, meta: any) => void): void;

            /**
             * Exchange uuid for two assets.
             * @param urlA 
             * @param urlB 
             * @param cb 
             */
            exchangeUuid(urlA: string, urlB: string, cb?: (err: Error, results: any[]) => void): void;

            /**
             * Clear imports.
             * @param url 
             * @param cb 
             */
            clearImports(url: string, cb?: (err: Error, results: any[]) => void): void;

            /**
             * Register meta type.
             * @param extname 
             * @param folder Whether it's a folder type.
             * @param metaCtor 
             */
            register(extname: string, folder: boolean, metaCtor: object): void;

            /**
             * Unregister meta type.
             * @param metaCtor 
             */
            unregister(metaCtor: object): void;

            /**
             * Get the relative path from mount path to the asset by fspath.
             * @param fspath  
             */
            getRelativePath(fspath: string): string;

            /**
             * Get the backup file path of asset file.
             * @param filePath 
             */
            getAssetBackupPath(filePath: string): string;

        }

    }

    // interface AssetInfo {
    //     uuid: string;
    //     path: string;
    //     url: string;
    //     type: string;
    //     isSubAsset: boolean;
    // }

    // interface AssetInfo {
    //     assetType: string;
    //     id: string;
    //     isSubAsset?: boolean;
    //     name: string;
    //     subAssetTypes: string;
    // }

    interface MetaBase {
        ver: string;
        uuid: string;
    }

    interface MountInfo {
        path: string;
        name: string;
        type: string;
    }

    interface Metas {
        asset: string[];
        folder: string[];
        mount: string[];
        'custom-asset': string[];
        'native-asset': string[];
        'animation-clip': string[];
        'audio-clip': string[];
        'bitmap-font': string[];
    }

    class Remote {
        readonly isClosing: boolean;
        readonly lang: string;
        readonly isNode: boolean;
        readonly isElectron: boolean;
        readonly isNative: boolean;
        readonly isPureWeb: boolean;
        readonly isRendererProcess: boolean;
        readonly isMainProcess: boolean;
        readonly isDarwin: boolean;
        readonly isWin32: boolean;
        readonly isRetina: boolean;
        readonly frameworkPath: string;
        readonly dev: boolean;
        readonly logfile: string;
        readonly themePaths: string[];
        readonly theme: string;
        readonly showInternalMount: boolean;
        readonly metas: Metas;
        readonly metaBackupPath: string;
        readonly assetBackupPath: string;
        readonly libraryPath: string;
        readonly importPath: string;
        readonly externalMounts: any;
        readonly mountsWritable: string;
        readonly assetdb: MainProcess.AssetDB;
        readonly assetdbInited: boolean;
        readonly sceneList: string[];
    }

    /**
     * Remote 实例
     */
    export const remote: Remote;

    /**
     * AssetDB 实例
     */
    export const assetdb: MainProcess.AssetDB;

}

interface AssetInfo {
    uuid?: string;
    path?: string;
    url?: string;
    type?: string;
    isSubAsset?: boolean;
    assetType?: string;
    id?: string;
    name?: string;
    subAssetTypes?: string;
}

declare module Editor.App {

    export const version: string;

}

declare module Editor.Project {

    /**
     * Absolute path for current open project.
     */
    export const path: string;

    export const name: string;

    export const id: string;

}

declare module Editor.Builder {

    /**
     * 
     * @param eventName The name of the event
     * @param callback The event callback
     */
    export function on(eventName: string, callback: (options: BuildOptions, cb: Function) => void): void;

    /**
     * 
     * @param eventName The name of the event
     * @param callback The event callback
     */
    export function once(eventName: string, callback: (options: BuildOptions, cb: Function) => void): void;

    /**
     * 
     * @param eventName The name of the event
     * @param callback The event callback
     */
    export function removeListener(eventName: string, callback: Function): void;

}

declare module Editor.Scene {

    /**
     * 
     * @param packageName 
     * @param method 
     * @param cb 
     */
    export function callSceneScript(packageName: string, method: string, cb: (err: Error, msg: any) => void): void;

}

declare module Editor.Panel {

    /**
     * Open a panel via panelID.
     * @param panelID The panel ID
     * @param argv 
     */
    export function open(panelID: string, argv?: object): void;

    /**
     * Close a panel via panelID.
     * @param panelID The panel ID
     */
    export function close(panelID: string): void;

    /**
     * Find panel frame via panelID.
     * @param panelID The panel ID
     */
    export function find(panelID: string): void;

    /**
     * Extends a panel.
     * @param proto 
     */
    export function extend(proto: object): void;

}

declare module Editor.Selection {

    /**
     * Select item with its id.
     * @param type 
     * @param id 
     * @param unselectOthers 
     * @param confirm 
     */
    export function select(type: string, id: string, unselectOthers?: boolean, confirm?: boolean): void;

    /**
     * Unselect item with its id.
     * @param type 
     * @param id 
     * @param confirm 
     */
    export function unselect(type: string, id: string, confirm?: boolean): void;

    /**
     * Hover item with its id. If id is null, it means hover out.
     * @param type 
     * @param id 
     */
    export function hover(type: string, id: string): string;

    /**
     * 
     * @param type 
     */
    export function clear(type: string): void;

    /**
     * 
     * @param type 
     */
    export function curActivate(type: string): string[];

    /**
     * 
     * @param type 
     */
    export function curGlobalActivate(type: string): string[];

    /**
     * 
     * @param type 
     */
    export function curSelection(type: string): string[];

    /**
     * 
     * @param items 
     * @param mode 'top-level', 'deep' and 'name'
     * @param func 
     */
    export function filter(items: string[], mode: string, func: Function): string[];

}

declare module Editor.Ipc {

    /**
     * Send message with ...args to main process asynchronously. It is possible to add a callback as the last or the 2nd last argument to receive replies from the IPC receiver.
     * @param message Ipc message.
     * @param args Whatever arguments the message needs.
     * @param callback You can specify a callback function to receive IPC reply at the last or the 2nd last argument.
     * @param timeout You can specify a timeout for the callback at the last argument. If no timeout specified, it will be 5000ms.
     */
    export function sendToMain(message: string, ...args?: any, callback?: Function, timeout?: number): void;

    /**
     * Send message with ...args to panel defined in renderer process asynchronously. It is possible to add a callback as the last or the 2nd last argument to receive replies from the IPC receiver.
     * @param panelID Panel ID.
     * @param message Ipc message.
     * @param args Whatever arguments the message needs.
     * @param callback You can specify a callback function to receive IPC reply at the last or the 2nd last argument.
     * @param timeout You can specify a timeout for the callback at the last argument. If no timeout specified, it will be 5000ms.
     */
    export function sendToPanel(panelID: string, message: string, ...args?: any, callback?: Function, timeout?: number): void;

    /**
     * Send message with ...args to all opened window and to main process asynchronously.
     * @param message Ipc message.
     * @param args Whatever arguments the message needs.
     * @param option You can indicate the last argument as an IPC option by Editor.Ipc.option({...}).
     */
    export function sendToAll(message: string, ...args?: any, option?: object): void;

    /**
     * Send message with ...args to main process synchronized and return a result which is responded from main process.
     * @param message Ipc message.
     * @param args Whatever arguments the message needs.
     */
    export function sendToMainSync(message: string, ...args?: any): void;

    /**
     * Send message with ...args to main process by package name and the short name of the message.
     * @param pkgName Package name.
     * @param message Ipc message.
     * @param args Whatever arguments the message needs.
     */
    export function sendToPackage(pkgName: string, message: string, ...args?: any): void;

}

declare module Editor.UI {

    export module Setting {

        /**
         * Control the default step for float point input element. Default is 0.1.
         * @param value 
         */
        export function stepFloat(value: number): void;

        /**
         * Control the default step for integer input element. Default is 1.
         * @param value 
         */
        export function stepInt(value: number): void;

        /**
         * Control the step when shift key press down. Default is 10.
         * @param value 
         */
        export function shiftStep(value: number): void;

    }

    export module DragDrop {

        export function start(e: any, t: any): void;

        export function end(): void;

        export function updateDropEffect(e: any, t: any);

        export function type(e: any);

        export function filterFiles(e: any);

        export function items(dataTransfer: DataTransfer): AssetInfo[];

        export function getDragIcon(e: any);

        export function options(e: any);

        export function getLength(e: any): number;

        export const dragging: boolean;

    }

}

declare interface BuildOptions {
    actualPlatform: string;
    android: { packageName: string };
    'android-instant': {
        REMOTE_SERVER_ROOT: string;
        host: string;
        packageName: string;
        pathPattern: string;
        recordPath: string;
        scheme: string;
        skipRecord: boolean;
    }
    apiLevel: string;
    appABIs: string[];
    appBundle: boolean;
    buildPath: string;
    buildScriptsOnly: boolean;
    debug: string;
    dest: string;
    embedWebDebugger: boolean;
    encryptJs: boolean;
    excludeScenes: string[];
    excludedModules: string[];
    'fb-instant-games': object;
    inlineSpriteFrames: boolean;
    inlineSpriteFrames_native: boolean;
    ios: { packageName: string };
    mac: { packageName: string };
    md5Cache: boolean;
    mergeStartScene: boolean;
    optimizeHotUpdate: boolean;
    orientation: {
        landscapeLeft: boolean;
        landscapeRight: boolean;
        portrait: boolean;
        upsideDown: boolean;
    };
    packageName: string;
    platform: string;
    previewHeight: number;
    previewWidth: number;
    scenes: string[];
    sourceMaps: boolean;
    startScene: string;
    template: string;
    title: string;
    useDebugKeystore: boolean;
    vsVersion: string;
    webOrientation: boolean;
    win32: object;
    xxteaKey: string;
    zipCompressJs: string;
    project: string;
    projectName: string;
    debugBuildWorker: boolean;

    /**
     * 从 v2.4 开始，options 中不再提供 buildResults，而是提供了一个 bundles 数组。
     */
    buildResults: BuildResults;

    bundles: bundle[];
}

declare class BuildResults {

    /**
     * Returns true if the asset contains in the build.
     * 指定的 uuid 资源是否包含在构建资源中
     * @param uuid 需要检测的资源 uuid
     * @param assertContains 不包含时是否打印报错信息
     */
    containsAsset(uuid: string, assertContains: boolean): boolean;

    /**
     * Returns the uuids of all assets included in the build.
     * 返回构建资源中包含的所有资源的 uuid
     */
    getAssetUuids(): string[];

    /**
     * Return the uuids of assets which are dependencies of the input, also include all indirect dependencies.
     * The list returned will not include the input uuid itself.
     * 获取指定 uuid 资源中的所有依赖资源，返回的列表中不包含自身
     * @param uuid 指定的 uuid 资源
     */
    getDependencies(uuid: string): string[];

    /**
     * Get type of asset defined in the engine.
     * You can get the constructor of an asset by using `cc.js.getClassByName(type)`.
     * 获取指定 uuid 的资源在引擎中定义的资源类型
     * 同时可以使用 cc.js.getClassByName(type) 进行获取资源的构造函数
     * @param uuid 指定的 uuid 资源
     */
    getAssetType(uuid: string): string;

    /**
     * Get the path of the specified native asset such as texture. Returns empty string if not found.
     * 获取指定 uuid 资源（例如纹理）的存放路径（如果找不到，则返回空字符串）
     * @param uuid 指定的 uuid 资源
     */
    getNativeAssetPath(uuid: string): string;

    /**
     * 获取指定 uuid 资源（例如纹理）的所有存放路径（如果找不到，则返回空数组）
     * 例如：需要获取纹理多种压缩格式的存放资源路径时，即可使用该函数
     * @param uuid - 指定的 uuid 资源
     */
    getNativeAssetPaths(uuid: string): string[];

}

interface bundle {

    /**
     * bundle 的根目录
     */
    root: string;

    /**
     * bundle 的输出目录
     */
    dest: string;

    /**
     * 脚本的输出目录
     */
    scriptDest: string;

    /**
     * bundle 的名称
     */
    name: string;

    /**
     * bundle 的优先级
     */
    priority: number;

    /**
     * bundle 中包含的场景
     */
    scenes: string[];

    /**
     * bundle 的压缩类型
     */
    compressionType: 'subpackage' | 'normal' | 'none' | 'merge_all_json' | 'zip';

    /**
     * bundle 所构建出来的所有资源
     */
    buildResults: BuildResults;

    /**
     * bundle 的版本信息，由 config 生成
     */
    version: string;

    /**
     * bundle 的 config.json 文件
     */
    config: any;

    /**
     * bundle 是否是远程包
     */
    isRemote: boolean;

}

declare module Editor.Utils {

    module UuidUtils {

        /**
         * 压缩后的 uuid 可以减小保存时的尺寸，但不能做为文件名（因为无法区分大小写并且包含非法字符）。
         * 默认将 uuid 的后面 27 位压缩成 18 位，前 5 位保留下来，方便调试。
         * 如果启用 min 则将 uuid 的后面 30 位压缩成 20 位，前 2 位保留不变。
         * @param uuid 
         * @param min 
         */
        export function compressUuid(uuid: string, min?: boolean): string;

        export function compressHex(hexString: string, reservedHeadLength?: number): string;

        export function decompressUuid(str: string): string;

        export function isUuid(str: string): boolean;

        export function uuid(): string;

    }

}
