import { TextAsset } from "cc";
import { DEBUG } from "cc/env";
import { Resource } from "../../asset/Resource";
import { Net } from "../Net";

export class ProtoManager {
    private static _instance: ProtoManager = null!;
    public static Instance() { return this._instance || (this._instance = new ProtoManager()); }
    private tag = "[ProtoManager] : "
    /**@description 记录已经加载过的目录，加载过的proto将不会重新加载 */
    private _loadDir : {[key : string] : boolean} = {};

    private _root: protobuf.Root = null!;
    constructor() {
        this._root = new protobuf.Root();
    }

    /**
     * @description 加载所有bundle.path下的所有proto描述文件
     * @param bundle 所在 bundle
     * @param path 相对 bundle 的 path proto资源文件目录,默认为bundle/proto目录
     * @returns 
     */
    load(bundle: string, path: string = "proto") {
        return new Promise<boolean>((resolove, reject) => {
            if( this._loadDir[`${bundle}/${path}`] ){
                if ( DEBUG ){
                    Log.w(this.tag,`${bundle}/${path}目录下所有proto文件已经存在，无需加载`);
                }
                resolove(true);
                return;
            }
            this._loadDir[`${bundle}/${path}`] = false;
            Manager.assetManager.loadDir(bundle, path, TextAsset, (finish, total, item) => { }, (cacheData) => {
                if (cacheData && cacheData.data && Array.isArray(cacheData.data)) {

                    //解析proto文件
                    for (let i = 0; i < cacheData.data.length; i++) {
                        let asset = cacheData.data[i] as TextAsset;
                        protobuf.parse(asset.text, this._root)
                    }

                    //释放proto资源文件
                    let info = new Resource.Info;
                    info.url = path;
                    info.type = TextAsset;
                    info.data = cacheData.data;
                    info.bundle = bundle;
                    Manager.assetManager.releaseAsset(info);
                    this._loadDir[`${bundle}/${path}`] = true;
                    resolove(true);
                } else {
                    resolove(false);
                }
            });
        });
    }

    /**@description 当进入登录界面，不需要网络配置时，卸载proto的类型，以防止后面有更新，原有的proto类型还保存在内存中 */
    unload(){
        this._loadDir = {};
        this._root = new protobuf.Root();
    }

    /**
     * @description 查找 proto类型
     * @param className 类型名
     */
    lookup(className: string) : (protobuf.ReflectionObject | null) {
        if (this._root) {
            return this._root.lookup(className);
        }
        return null;
    }

    decode<ProtoType>(config: Net.Proto.decodeConfig): ProtoType | null {
        let protoType = this.lookup(config.className) as protobuf.Type;
        if (protoType) {
            return protoType.decode(config.buffer) as any;
        }
        return null;
    }
}
