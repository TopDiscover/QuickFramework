/**
         * @description 发事件 参考framework/extentions/extentions dispatch 方法
         * @param name 
         * @param data 
         */
declare function dispatch(name: string, data?: any): void;

declare interface Date {
    /**
     * @description 格式当前时间 
     * @example 
     * let now = new Date();
     * let str = now.format("yyyy:MM:dd hh:mm:ss"); //2019:11:07 10:19:51
     * str = now.format("yyyy/MM/dd");//2019/11/07
     * str = now.format("hh:mm:ss");//10:19:51
     * */
    format(format: string): string;
}

declare interface DateConstructor {
    /**
     * @description 返回当前时间的秒数
     * @example 
     * Date.timeNow()
     *  */
    timeNow(): number;
    /**
     * @description 返回当前时间的毫秒数 
     * @example 
     * Date.timeNowMillisecons()
     * */
    timeNowMillisecons(): number;
}

declare interface StringConstructor {
    /**
     * @description 格式化字符串
     * @example
     * String.format("{0}-->{1}-->{2}","one","two","three") | String.format("{0}-->{1}-->{2}",["one","two","three"])
     * => "one-->two-->three"
     * */
    format(...args: any[]): string;
}

declare function md5(data: any): any;

/**@description 调试 */
declare function log(...args: any[]): void;
declare function error(...args: any[]): void;
declare function warn(...args: any[]): void;
/**
 * @description 界面当前value的值信息
 * @param value 值 
 * @param name 名字
 * @param level 打印对象深度，不传入，如果有对象嵌套对象，默认只打印10层
 */
declare function dump(value: any, name?: string, level?: number): void;