/**
 * @description 资源辅助类
 */
import { existsSync, readFileSync, writeFileSync } from "fs";
import { extname, join, parse } from "path";
import { AssetInfo, FileResult, LibraryMaps } from "./Defines";
import { Environment } from "./Environment";
import FileUtils from "./FileUtils";
import { Handler } from "./Handler";

export default class AssetsHelper extends Handler{

    module = "【AssetsHelper】";

    protected get libraryPath(){
        return join(this.projPath,"proj/library");
    }

    protected get internalInfoPath(){
        if ( Environment.isVersion3X ){
            return join(this.projPath,"proj/library/.internal-info.json");
        }else{
            return join(Environment.creatorPath,"static/default-assets/image");
        }
    }

    protected _internalInfo : Map<string,AssetInfo> = null!;
    /**@description 引擎内部资源 */
    protected get internalInfo(){
        if ( this._internalInfo ){
            return this._internalInfo;
        }
        if ( Environment.isVersion3X ){
            let dataStr = readFileSync(this.internalInfoPath,"utf-8");
            let data = JSON.parse(dataStr);
            let keys = Object.keys(data);
            this._internalInfo = new Map();
            keys.forEach(v=>{
                let info : AssetInfo = {
                    uuid : data[v].uuid,
                    type : "internal",
                    file : v,
                }
                this._internalInfo.set(info.uuid,info);
            })
        }else{
            //2.x 直接去安装目录找资源吧
            let info : AssetInfo = {
                uuid : "",
                type : "internal",
                file : "",
            }
            this._internalInfo = new Map();
            FileUtils.instance.getFiles(this.internalInfoPath,(v)=>{
                if( extname(v.name) == ".meta" ){
                    let dataStr = readFileSync(v.path,"utf-8");
                    let data = JSON.parse(dataStr);
                    info.uuid = data.uuid;
                    let temp = parse(v.path);
                    info.path = join(temp.dir,`${temp.name}`); 
                    this._internalInfo.set(info.uuid,info);
                }
                return false;
            });
        }
       
        return this._internalInfo;
    }

    /**@description 查询到的资源 */
    protected queryAssets : {[key:string]:AssetInfo} = {};


    protected isPngAsset( type : string ){
        if ( Environment.isVersion3X ){
            if ( type == "cc.ImageAsset" || type == "cc.SpriteAtlas"){
                return true;
            }
        }else{
            if ( type == "cc.Texture2D"){
                return true;
            }
        }
        
        return false;
    }

    protected get isMd5(){
        return Environment.build.md5Cache;
    }

    /**
     * @description 返回uuid
     * @param name 
     * @returns 
     */
    protected getUUID(name : string){
        let ret = parse(name);
        if ( this.isMd5 ){
            ret = parse(ret.name);
        }
        return ret.name;
    }

    /**
     * @description library Json 处理
     * @param info 
     */
    private handleLibraryJson( info : FileResult ){
        let ext = extname(info.name);
        if ( ext == ".json"){
            let dataStr = readFileSync(info.path,"utf-8");
            let data = JSON.parse(dataStr);
            let type = data.__type__;
            let result = this.isPngAsset(type);
            if ( result ){
                let lib : LibraryMaps = {
                    ".json" : info.path,
                    ".png" : "",
                };

                if ( !Environment.isVersion3X ){
                    let temp = parse(info.path);
                    let pngPath = join(temp.dir,`${temp.name}.png`);
                    if ( existsSync(pngPath) ){
                        lib[".png"] = pngPath;
                    }
                }

                let uuid = this.getUUID(info.name);

                let _info : AssetInfo = {
                    uuid : uuid,
                    type : type,
                    library : lib,
                }
                this.queryAssets[_info.uuid] = _info;
            }
        }
    }

    /**
     * @description library Png 处理
     * @param info 
     */
    private handleLibraryPng(info:FileResult){
        let ext = extname(info.name);
        if ( ext == ".png"){
            let uuid = this.getUUID(info.name);
            if ( !this.internalInfo.has(uuid) ){
                let obj = this.queryAssets[uuid];
                if ( obj && obj.library){
                    obj.library[".png"] = info.path;
                }
            }
        }
    }

    /**
     * @description Assets 目录还原png的路径
     * @param info 
     */
    private handleAssetsMate(info:FileResult){
        let ext = extname(info.name);
        if ( ext == ".meta" ){
            let reslut = parse(info.name);
            reslut = parse(reslut.name);
            if ( reslut.ext == ".png" ){
                let dataStr = readFileSync(info.path,"utf-8");
                let data = JSON.parse(dataStr);
                let uuid = data.uuid;
                if ( !this.internalInfo.has(uuid) ){
                    let obj = this.queryAssets[uuid];
                    if ( obj ){
                        reslut = parse(info.path);
                        obj.file = join(reslut.dir,reslut.name);
                        obj.path = obj.file;
                    }
                }
            }else if( reslut.ext == ".pac"){
                //自动图集
                let dataStr = readFileSync(info.path,"utf-8");
                let data = JSON.parse(dataStr);
                let uuid = data.uuid;
                if ( !this.internalInfo.has(uuid) ){
                    let obj = this.queryAssets[uuid];
                    if ( obj ){
                        reslut = parse(info.path);
                        obj.file = join(reslut.dir,reslut.name);
                        obj.path = obj.file;
                    }
                }
            }
        }
    }

    async getAssets(){
        this.queryAssets = {};
        this.logger.log(`${this.module} ${this.libraryPath}`);

        FileUtils.instance.getFiles(this.libraryPath,(info)=>{
            this.handleLibraryJson(info);
            if ( Environment.isVersion3X ){
                this.handleLibraryPng(info);
            }
            return false;
        });
        FileUtils.instance.getFiles(this.assetsDBPath,(info)=>{
            this.handleAssetsMate(info);
            return false;
        });

        // writeFileSync(join(__dirname,"../../test.json"),JSON.stringify(this.queryAssets))
        let values = Object.values(this.queryAssets);
        // writeFileSync(join(__dirname,"../../test.json"),JSON.stringify(values))
        return values;
    }



}