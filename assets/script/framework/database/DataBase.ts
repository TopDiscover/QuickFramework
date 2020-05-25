import { getSingleton } from "../base/Singleton";

export type DataBaseTable = "cache_png" | "cache_json" | "cache_atlas";

export function dataBase(){
    return getSingleton(DataBase);
}
class DataBase{

    private config = {
        name : "AppCaches",//数据库名
        version : 1, //
    };

    private db : IDBDatabase = null;
    private tables : DataBaseTable[] = ["cache_png","cache_json","cache_atlas"];
    private static _instance: DataBase = null;
    private logTag = "[DataBase]";
    public static Instance() { return this._instance || (this._instance = new DataBase()); }

    public open( name ?: string , tables? : DataBaseTable[] , version? : number){
        this.config.name = name || this.config.name;
        this.config.version = version || this.config.version;
        this.tables = tables || this.tables;

        if ( this.isSupport() ){
            let request = this.getWindonwIndexedDB().open(this.config.name,this.config.version);
            request.onerror = (e)=>{
                if ( CC_DEBUG ) cc.error(this.logTag,`打开数据库失败`);
            };
            request.onsuccess = (e : any)=>{
                this.db = e.target.result;
                if ( CC_DEBUG ) cc.log(this.logTag,`找开数据库成功`);
            };
            request.onupgradeneeded = (e : any)=>{
                cc.log(this.logTag,`onupgradeneeded`);
                this.db = e.target.result;
                for( let i = 0 ; i < this.tables.length ; i++ ){
                    if ( !this.db.objectStoreNames.contains(this.tables[i]) ){
                        this.db.createObjectStore(this.tables[i]);
                    }
                }
            };
        }
        else{
            if ( CC_DEBUG ) cc.warn(this.logTag,"no support indexedDB");
        }
    }

    public isSupport( ){
        let _windown : any = window;;
        if ( _windown.indexedDB || _windown.mozIndexedDB || _windown.webkitIndexedDB || _windown.msIndexedDB ){
            return true;
        }
        return false;
    }

    private getWindonwIndexedDB( ) : IDBFactory{
        let _windown : any = window;
        if ( _windown.indexedDB ){
            return _windown.indexedDB;
        }
        _windown.indexedDB = _windown.indexedDB || _windown.mozIndexedDB || _windown.webkitIndexedDB || _windown.msIndexedDB;
        return _windown.indexedDB;
    }

    public close( ){
        if ( this.db ){
            this.db.close();
            if ( CC_DEBUG ) cc.log(this.logTag, `数据关闭`);
        }
    }

    public deleteDatabase( ){
        if ( this.isSupport() ){
            this.getWindonwIndexedDB().deleteDatabase(this.config.name);
            if ( CC_DEBUG ) cc.log(this.logTag, `删除数据库${this.config.name}`);
        }
    }

    public put( stroeName : DataBaseTable , data : { key : string , data : any} ){
        if ( this.db ){
            let store = this.db.transaction(stroeName,"readwrite").objectStore(stroeName);
            let request = store.put(data.data,data.key);
            request.onerror = ()=>{
                if ( CC_DEBUG ) cc.error(this.logTag,`添加数据库中已经有该数据`);
            };
            request.onsuccess =()=>{
                if ( CC_DEBUG ) cc.log(this.logTag, "添加数据已存入数据");
            };
        }
    }

    public get( stroeName : DataBaseTable , key : string ){
        return new Promise<any>((resolve)=>{
            if ( this.db ){
                let store = this.db.transaction(stroeName,"readwrite").objectStore(stroeName);
                let request = store.get(key);
                request.onerror = ()=>{
                    if ( CC_DEBUG ) cc.error(this.logTag,`get error ${stroeName} -> ${key}`);
                    resolve(null);
                };
                request.onsuccess = (e : any)=>{
                    if ( CC_DEBUG ) cc.log(this.logTag,`get success ${stroeName} -> ${key}`);
                    resolve(e.target.result);
                };
            }
        });
    }

    public delete( stroeName : DataBaseTable , key : string ){
        if ( this.db ){
            let store = this.db.transaction(stroeName,"readwrite").objectStore(stroeName);
            let request = store.delete(key);
            request.onerror = ()=>{
                if ( CC_DEBUG ) cc.error(this.logTag,`delete error ${stroeName} -> ${key}`);
            };
            request.onsuccess = ()=>{
                if ( CC_DEBUG ) cc.log(this.logTag,`delete success ${stroeName} -> ${key}`);
            };
        }
    }

    public clear( stroeName : DataBaseTable ){
        //删除全部存储数据
        if ( this.db ){
            let store = this.db.transaction(stroeName,"readwrite").objectStore(stroeName);
            let request = store.clear();
            request.onerror = ()=>{
                if ( CC_DEBUG ) cc.error(this.logTag,`clear error ${stroeName}`);
            };
            request.onsuccess = ()=>{
                if ( CC_DEBUG ) cc.log(this.logTag,`clear success ${stroeName}`);
            };
        }
    }

}
