/**
 * @description 日志封装
 */
import { EDITOR } from "cc/env";
import { LogLevel } from "../../defines/Enums";
import { log, sys } from "cc";

export class LoggerImpl implements ISingleton {
    private logger: Logger = console as any;
    private _level: number = LogLevel.ALL;
    private readonly _indentFormat: string = "    ";
    private readonly _halfIndentFormat: string = "   ";
    private readonly _typeHandlers: Map<string, (name: string, value: any, deep?: number, curDeep?: number) => string>;
    private _visited: Set<any>;

    constructor() {
        this._typeHandlers = new Map<string, (name: string, value: any, deep?: number, curDeep?: number) => string>([
            ['boolean', (name: string, v: boolean) => `${this.convertName(name)}${v};`] as [string, (name: string, value: any, deep?: number, curDeep?: number) => string],
            ['number', (name: string, v: number) => `${this.convertName(name)}${v}`] as [string, (name: string, value: any, deep?: number, curDeep?: number) => string],
            ['string', (name: string, v: string) => `${this.convertName(name)}"${v}"`] as [string, (name: string, value: any, deep?: number, curDeep?: number) => string],
            ['object', (name: string, v: any, deep: number, curDeep: number) => this.handleObject(name, v, deep, curDeep)] as [string, (name: string, value: any, deep?: number, curDeep?: number) => string],
        ]);
        this._visited = new Set();
        this.update();
    }
    static module: string = "【日志管理器】";
    module: string = null!;
    isResident?: boolean = true;
    /**@description 当前日志等级 */
    public get level() {
        return this._level;
    }
    public set level(level) {
        this._level = level;
        this.update();
    }

    /**
     * @description 附加日志输出类型
     * @param level 
     */
    public attach(level: LogLevel) {
        this.level = this.level | level;
        this.update();
    }

    /**
     * @description 分离日志输出类型
     **/
    public detach(level: LogLevel) {
        if (this.isValid(level)) {
            this.level = this.level ^ level;
            this.update();
        }
    }

    /**@description 当前日志等级是否生效 */
    public isValid(level: LogLevel) {
        if (this.level & level) {
            return true;
        }
        return false;
    }

    /**
     * @description 更新日志
     */
    private update() {
        const updateLogger = (level: LogLevel, method: string, defaultFunc: Function) => {
            (this.logger as any)[method] = this.isValid(level) ? defaultFunc : () => {};
        };

        if (sys.isBrowser) {
            updateLogger(LogLevel.DUMP, 'dump', console.info);
        } else {
            updateLogger(LogLevel.DUMP, 'dump', this.dump.bind(this));
        }
        updateLogger(LogLevel.ERROR, 'e', console.error);
        updateLogger(LogLevel.DEBUG, 'd', EDITOR ? log : console.log);
        updateLogger(LogLevel.WARN, 'w', console.warn);
    }

    /**
     * @description dump
     */
    private dump(...args: any[]) {
        if (!this.isValid(LogLevel.DUMP)) return;

        const [data, name = "unknown", inputDeep = 5] = args;
        const deep = Math.min(Math.max(1, inputDeep), 10);
        
        try {
            if (data === null || data === undefined) {
                this.logger.d("null");
                return;
            }

            this._visited.clear();
            const processedData = (typeof data === "object" && data?.toJSON) ? 
                data.toJSON() : data;

            const timestamp = new Date().toISOString();
            const ret = this._dump(processedData, name, deep, 0);
            console.info(`[${timestamp}] ${name}=`, ret);
        } catch (e) {
            console.error("Dump error:", e);
        }
    }

    /**
     * @description 处理对象
     */
    private handleObject(name: string, value: any, deep: number = 5, curDeep: number = 0): string {
        if (value === null || value === undefined) return "null";
        if (this._visited.has(value)) return "[Circular Reference]";
        
        this._visited.add(value);
        const result = Array.isArray(value) ? 
            this.toArray(name, value, deep, curDeep) : 
            this.toObject(name, value, deep, curDeep);
        this._visited.delete(value);
        
        return result;
    }

    /**
     * @description dump
     */
    private _dump(data: any, name: string = "unknown", deep: number, curDeep: number): string {
        if (curDeep >= deep) return "...";
        
        const type = typeof data;
        const handler = this._typeHandlers.get(type);
        if (handler) {
            if (type === 'object') {
                return handler(name, data, deep, curDeep);
            }
            return handler(name, data);
        }
        return this.toUnknown(name);
    }

    /**
     * @description 转换名称
     */
    private convertName(name: string, flag: string = "=") {
        let out = name.length > 0 ? `${name} ${flag} ` : ` `;
        return out;
    }

    /**
     * @description 转换未知类型
     */
    private toUnknown(name: string) {
        let out = name.length > 0 ? `${name} ` : ` `;
        return `${out}is unknown type!`
    }

    /**
     * @description 数组转换
     */
    private toArray(name: string, v: any[], deep: number, curDeep: number): string {
        let out = ""
        let num_elem = 0;
        let indent = '';
        num_elem = v.length;
        let keyName = this.convertName(name, "");
        for (let d = 0; d < curDeep; ++d) {
            indent += ' ';
        }

        out = keyName + "[";
        for (let i = 0; i < num_elem; ++i) {
            out += "\n" + (indent.length === 0 ? '' : '' + indent) + `${this._indentFormat}[${i}]:` + this._dump(v[i], '', deep, curDeep + 1);
        }
        out += "\n" + (indent.length === 0 ? '' : '' + indent + this._halfIndentFormat) + "]";
        return out;
    }

    /**
     * @description 对象转换
     */
    private toObject(name: string, v: Object, deep: number, curDeep: number): string {
        let out = ""
        if (v === null || v === undefined) {
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
                out += "\n" + (indent.length === 0 ? '' : '' + indent) + `${this._indentFormat}${p}:` + this._dump((v as any)[p], '', deep, curDeep + 1);
            }
            out += "\n" + (indent.length === 0 ? '' : '' + indent + this._halfIndentFormat) + "}";
            return out;
        } else {
            out = "Unknown Object Type!";
            return out;
        }
    }
}
