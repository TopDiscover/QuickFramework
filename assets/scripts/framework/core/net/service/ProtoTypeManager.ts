import { Net } from "../Net";

export class ProtoTypeManager{
    private _logTag = `[ProtoTypeManager]`;
    private static _instance: ProtoTypeManager = null!;
    public static Instance() { return this._instance || (this._instance = new ProtoTypeManager()); }

    private _configs = new Map<string,Net.ProtoConfig>();
    private _results = new Map<string,protobuf.IParserResult>();

    /**
     * @description 注册proto文件与消息命令码之间的关系，cmd项目必须唯一
     * @param config 配置信息
     */
    register( config : Net.ProtoConfig ){
        let key = String(config.cmd);
        if ( this._configs.has(key) ){
            if ( CC_DEBUG ) {
                cc.error(`${this._logTag}Proto 类型重新注册 : ${key} : ${config.url}`);
            }
            return;
        }
        if ( CC_DEBUG ){
            cc.log(`${this._logTag}注册proto 成功 cmd : ${key} , bundle : ${config.bundle}`);
        }
        this._configs.set(key,{cmd:key,url:config.url,bundle:config.bundle,root:new protobuf.Root()});
    }

    unRegister( cmd : number | string){
        let key = String(cmd);
        if( this._configs.has(key) ){
            if ( CC_DEBUG ){
                cc.log(`${this._logTag}反注册proto cmd : ${key}`);
            }
            this._configs.delete(key);
        }else{
            if ( CC_DEBUG ){
                cc.warn(`${this._logTag}反注册proto 失败，不存在 cmd : ${key} 的绑定关系`);
            }
        }
    }

    load( cmds : (string | number)[] ){
        return new Promise<boolean>((resolove,reject)=>{
            if (cmds.length <= 0 ){
                resolove(true);
                return;
            }
            let isSuccess = true;
            for( let i = 0 ; i < cmds.length ; i++){
                this._load(cmds[i]).then((isSuccess)=>{
                    if ( !isSuccess ){
                        isSuccess = false;
                    }
                    if ( i + 1 == cmds.length ){
                        resolove(isSuccess);
                    }
                });
            }
        });
    }

    private _load(cmd : string | number){
        return new Promise<boolean>((resolove,reject)=>{
            let key = String(cmd);
            if ( this._configs.has(key) ){
                //1，加载资源
                //2,取出引用关系
                let config = this._configs.get(key);
                this.loadProto(config,(result)=>{
                    if ( result ){
                        //查看是否引入了其它proto文件
                        this.loadProtoImports(config,result.imports,()=>{
                            if( CC_DEBUG ){
                                cc.log(`${this._logTag}加载Proto${config.url}成功`);
                            }
                            resolove(true);
                            this._results.set(String(config.cmd),result);
                        });
                    }else{
                        resolove(false);
                    }
                });
            }else{
                if ( CC_DEBUG ){
                    cc.error(`${this._logTag}Proto Cmd : ${cmd} 未注册！！`);
                }
                resolove(false);
            }
        });
    }

    /**
     * @description 获取proto ParserResult
     * @param cmd 
     * @returns 
     */
    getParserResult(cmd:string|number){
        let key = String(cmd);
        if( this._results.has(key) ){
            return this._results.get(key);
        }
        return null;
    }

    decode<ProtoType>( config : Net.ProtoData ) : ProtoType{
        let result = this.getParserResult(config.cmd);
        if ( result ){
            let protoType : protobuf.Type = result.root.lookup(config.className);
            if ( protoType ){
                return protoType.decode(config.buffer) as any;
            }
        }
        return null;
    }

    private loadProto(config : Net.ProtoConfig , completeCb : (result:protobuf.IParserResult|null)=>void){
        Manager.assetManager.load(config.bundle,config.url,cc.TextAsset,()=>{},(data)=>{
            if ( data && data.data && data.data instanceof cc.TextAsset ){
                try {
                    completeCb(protobuf.parse(data.data.text,config.root));
                } catch (err) {
                    completeCb(null);
                }
            }else{
                completeCb(null);
            }
            //加载完成，删除cache
            Manager.cacheManager.remove(config.bundle,config.url);
        });
    }

    private loadProtoImports( config : Net.ProtoConfig , imports : string[] , completeCb : (isSuccess:boolean)=>void ){
        //解析引用proto所在bundle,只在是大厅或主包的或自己本bundle的proto才加载,否则直接抛出错误
        if ( !imports || imports.length <= 0 ){
            completeCb(true);
            return;
        }
        for( let i = 0 ; i < imports.length ; i++){
            let imp = imports[i];
            let pos = imp.indexOf("/proto");
            if ( pos == -1 ) {
                if( CC_DEBUG ) {
                    cc.error(`${this._logTag}${config.url}文件引用路径错误 : ${imp}`);
                }
                completeCb(false);
                break;
            }
            let bundleProto = imp.substr(0,imp.indexOf("/proto"));
            let url = imp.substr(pos+1);
            url = url.substr(0, url.length - ".proto".length);
            let _config : Net.ProtoConfig = { cmd : config.cmd , url : url , bundle : bundleProto, root:config.root};
            this.loadProto(_config,(result)=>{
                if( result ){
                    this.loadProtoImports(_config,result.imports,(isSuccess)=>{
                        if ( !isSuccess ){
                            completeCb(false);
                        }
                        if ( i + 1 == imports.length ){
                            completeCb(true);
                        }
                    });
                }else{
                    completeCb(false);
                }
            });
        }
    }
}
