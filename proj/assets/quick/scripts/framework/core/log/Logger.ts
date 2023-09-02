/**
 * @description 日志封装
 */
import { LogLevel } from "../../defines/Enums";

export class LoggerImpl implements ISingleton{
    private logger : Logger = console as any;
    private _level: number = LogLevel.ALL;
    constructor(){
        this.update();
    }
    static module: string = "【日志管理器】";
    module: string = null!;
    isResident?: boolean = true;
    /**@description 当前日志等级 */
    public get level(){
        return this._level;
    }
    public set level( level ){
        this._level = level;
        this.update();
    }

    /**
     * @description 附加日志输出类型
     * @param level 
     */
    public attach( level : LogLevel ){
        if ( this.isValid(level) ){
            return;
        }
        this.level = this.level | level;
        this.update();
    }

    /**
     * @description 分离日志输出类型
     **/
    public detach( level : LogLevel ){
        if ( this.isValid(level) ){
            this.level = this.level ^ level;
            this.update();
        }
    }

    /**@description 当前日志等级是否生效 */
    public isValid( level : LogLevel ){
        if ( this.level & level ){
            return true;
        }
        return false;
    }

    /**@description 更新日志 */
    private update(){
        if ( this.isValid(LogLevel.DUMP) ){
            if ( cc.sys.isBrowser ){
                this.logger.dump = console.debug;
            }else{
                this.logger.dump = this.dump.bind(this);
            }
        }else{
            this.logger.dump = ()=>{}
        }
        if ( this.isValid(LogLevel.ERROR) ){
            this.logger.e = console.error;
        }else{
            this.logger.e = ()=>{};
        }
        if ( this.isValid(LogLevel.DEBUG) ){
            this.logger.d = console.log;
            if ( CC_EDITOR ){
                this.logger.d = cc.log;
            }
        }else{
            this.logger.d = ()=>{};
        }
        if ( this.isValid(LogLevel.WARN) ){
            this.logger.w = console.warn;
        }else{
            this.logger.w = ()=>{};
        }
    }

    private dump() {
        if (this.isValid(LogLevel.DUMP)) {
            let deep = arguments[2];
            if ( deep == undefined ){
                deep = 5;
            }
            if ( Number.isNaN(deep) ){
                deep = 10;
            }
            if ( deep > 10 ){
                deep = 10;
            }
            if ( deep <= 0 ){
                deep = 1;
                return;
            }

            //protobuf 数据特殊处理
            let data = arguments[0];
            if ( data.toJSON && typeof data.toJSON == "function"){
                data = data.toJSON();
            }

            let ret = this._dump(data, arguments[1],deep,0);
            this.logger.d(ret);
        }
    }

    private convertName(name : string,flag:string = "="){
        let out = name.length > 0 ? `${name} ${flag} ` : ` `;
        return out;
    }

    private toBoolean( name : string, v : boolean){
        return `${this.convertName(name)}${v};`
    }

    private toNumber( name : string, v:number){
        return `${this.convertName(name)}${v}`;
    }

    private toStringForDump(name : string,v:string){
        return `${this.convertName(name)}"${v}"`;
    }

    private toOther(name : string , v : any ){
        return `${this.convertName(name)}${typeof v}`;
    }

    private toUnknown(name : string ){
        let out = name.length > 0 ? `${name} ` : ` `;
        return `${out}is unknown type!`
    }

    /**@description 缩进 */
    private get indentFormat(){
        return "    ";
    }

    /**@description 一半缩进 */
    private get halfIndentFormat(){
        return "   "
    }

    private toArray(name : string , v : any[] ,deep:number,curDeep : number): string{
        let out = ""
        let num_elem = 0;
        let indent = '';
        num_elem = v.length;
        let keyName = this.convertName(name,"");
        for (let d = 0; d < curDeep; ++d) {
            indent += ' ';
        }

        out =  keyName + "[";
        for (let i = 0; i < num_elem; ++i) {
            out += "\n" + (indent.length === 0 ? '' : '' + indent) + `${this.indentFormat}[${i}]:` + this._dump(v[i], '', deep,curDeep+1);
        }
        out += "\n" + (indent.length === 0 ? '' : '' + indent + this.halfIndentFormat) + "]";
        return out;
    }

    private toObject(name : string,v:Object,deep:number,curDeep : number): string{
        let out = ""
        if (v === null) {
            out = "null";
            return out;
        }
        let indent = '';
        if (v instanceof Object) {
            for (let d = 0; d < curDeep; ++d) {
                indent += ' ';
            }
            out = "{";
            for (let p in v) {
                out += "\n" + (indent.length === 0 ? '' : '' + indent) + `${this.indentFormat}${p}:` + this._dump((v as any)[p], '', deep,curDeep+1);
            }
            out += "\n" + (indent.length === 0 ? '' : '' + indent + this.halfIndentFormat) + "}";
            return out;
        } else {
            out = "Unknown Object Type!";
            return out;
        }
    }

    private _dump(data: any, name: string = "unkown", deep: number,curDeep:number): string {
        if (curDeep > deep) {
            return "...";
        }
        name = typeof name === 'undefined' ? '' : name;
        let out = '';
        let v_name = '';
        switch (typeof data) {
            case "boolean":
                out +=  this.toBoolean(v_name,data);
                break;
            case "number":
                out +=  this.toNumber(v_name,data);
                break;
            case "string":
                out += this.toStringForDump(v_name,data);
                break;
            case "object":
                if (Array.isArray(data)){
                    out += this.toArray(name,data,deep,curDeep);
                }else{
                    out += this.toObject(name,data,deep,curDeep);
                }
                break;
            case "function":
            case "undefined":
                out += this.toOther(name,data);
                break;
            default:
                out += this.toUnknown(name);
        }
        return out;
    }
}
