import { join } from "path";
import Config from "../core/Config";
import { Extensions, GulpConfig } from "../core/Defines";
import GulpClient from "gulp";
import { Environment } from "../core/Environment";
import GulpUglify from "gulp-uglify"
import { ObfuscatorOptions } from 'javascript-obfuscator';
import gulpJavaScriptObfuscator from "gulp-javascript-obfuscator"
const htmlmin = require("gulp-htmlmin")
import GulpCleanCss from "gulp-clean-css"

/**
 * @description Gulp 压缩
 */
export default class Helper extends Config<GulpConfig> {

    module = "【Gulp】";

    
    /**@description 配置文件路径 */
    get path() {
        let out = join(this.localPath, `${Extensions.GulpCompress}.json`);
        return out;
    }

    onBeforeBuild(platform: string) {
        this.logger.log(this.module, `开始构建,构建平台:${platform}`);
    }

    onAfterBuild(dest: string, platform: string) {
        this.logger.log(this.module, `构建完成,构建目录:${dest},构建平台:${platform}`);
        if (this.data) {
            this.data.dest = dest;
            this.data.platform = platform;
        }
        this.save();
        this.run();
    }

    protected isNative(platform: string) {
        if (platform == "android" || platform == "windows" || platform == "ios" || platform == "mac") {
            return true;
        }
        return false;
    }

    protected get dest() {
        if ( Environment.isCommand ){
            return Environment.build.dest;
        }
        // return join(__dirname, "../../test");
        this.read(true);
        if (!this.data) {
            return "";
        }

        let dest = this.data.dest;
        if (this.isNative(this.data.platform)) {
            dest = join(this.buildPath, `assets`);
        }
        // this.logger.log(`${this.module}构建资源目录为 : ${dest}`);
        return dest;
    }

    /**@description 判断是否是web */
    get isWeb() {
        if ( Environment.isCommand ){
            if ( this.isNative(Environment.build.platform)){
                return false;
            }
            return true;
        }
        this.read(true)
        if (!this.data) {
            this.logger.error(`${this.module}构建信息有误`);
            return true;
        }
        if (this.isNative(this.data.platform)) {
            return false;
        }
        this.logger.log(`${this.module}构建平台:${this.data.platform}`)
        return true;
    }

    get platform() {
        if ( Environment.isCommand ){
            return Environment.build.platform;
        }
        this.read(true);
        if (!this.data) {
            this.logger.error(`${this.module}构建信息有误`);
            return "";
        }
        return this.data.platform;
    }

    get isCompex() {
        return Environment.isGulpCompex;
    }

    private get JSObfuscatorOptions() {
        const options: ObfuscatorOptions = {
            /**
             * @description 压缩代码输出在一行
             * 默认：true
             */
            compact: true,
            /**
             * @description 启用代码控制流扁平化。
             * 默认：false
             */
            controlFlowFlattening: false,
            /**
             * @description
             * ⚠️ 此选项极大地影响性能，运行时速度降低1.5倍。
             * 使用controlFlowFlatteningThreshold设置将受控制流展平影响的节点的百分比。
             * 默认值：0.75最小值：0最大值：1 
             */
            controlFlowFlatteningThreshold: 0.75,
            /**
             * @description 
             * ⚠️ 大大增加了模糊代码的大小（最多200%），只有在混淆代码的大小无关紧要时才使用。
             * 使用deadCodeInjectionThreshold设置将受死代码注入影响的节点的百分比。
             * ⚠️ 此选项强制启用stringArray选项。
             * 默认：false
             */
            deadCodeInjection: false,
            /**
             * @description 允许设置受deadCodeInjection影响的节点的百分比。
             * 默认值：0.4最小值：0最大值：1
             */
            deadCodeInjectionThreshold: 0.4,
            /**
             * @description 
             * ⚠️ 如果打开开发人员工具，可以冻结浏览器。
             * 这个选项使得几乎不可能使用开发人员工具的debugger函数（在WebKit-based和Mozilla Firefox上）。
             * 默认：false
             */
            debugProtection: false,
            /**
             * @description 
             * ⚠️ 可以冻结你的浏览器！使用风险自负。
             * 如果选中，则使用一个间隔来强制Console选项卡上的debug模式，这使得使用开发人员工具的其他功能更加困难。
             * 如果启用debugProtection，则有效。
             * 默认：0
             */
            // debugProtectionInterval: 0,
            /**
             * @description 
             * 通过将console.log、console.info、console.error、console.warn、console.debug、console.exception和console.trace
             * 替换为空函数来禁用它们。这使得调试器的使用更加困难。
             * 默认：false
             */
            disableConsoleOutput: true,
            /**
             * @description 
             * ⚠️ 此选项不适用于target: 'node'
             * 只允许在特定域和/或sub-domains上运行模糊处理的源代码。这使得人们很难复制并粘贴源代码并在别处运行。
             * 多域和sub-domains
             * 可以将代码锁定到多个域或sub-domain。
             * 例如，要锁定它，使代码只在www.example.comaddwww.example.com上运行。要使它在根域上工作，
             * 包括sub-domain（example.com，sub.example.com），请使用.example.com。
             * 默认：[]
             */
            domainLock: [],
            /**
             * @description 
             * Default: about:blank
             * ⚠️ This option does not work with target: 'node'
             * Allows the browser to be redirected to a passed URL 
             * if the source code isn't run on the domains specified by domainLock
             * 
             */
            domainLockRedirectUrl: "about:blank",

            /**
             * @description 
             * Type: string[] Default: []
             * Enables force transformation of string literals, which being matched by passed RegExp patterns.
             * ⚠️ This option affects only strings that shouldn't be transformed by stringArrayThreshold (or possible other thresholds in the future)
             * The option has a priority over reservedStrings option but hasn't a priority over conditional comments.
             * Example:
             * 	{
             *      forceTransformStrings: [
             *          'some-important-value',
             *          'some-string_\d'
             *      ]
             *  }
             */
            forceTransformStrings: [],
            /**
             * @description 
             * Default: null
             * 
             * The main goal for this option is the ability to use the same identifier names during obfuscation of multiple sources/files.
             * Currently the two types of the identifiers are supported:
             * Global identifiers:
             * All global identifiers will be written to the cache;
             * All matched undeclared global identifiers will be replaced by the values from the cache.
             * Property identifiers, only when renameProperties option is enabled:
             * All property identifiers will be written to the cache;
             * All matched property identifiers will be replaced by the values from the cache.
             */
            identifierNamesCache: null,
            /**@description 
             * Default: hexadecimal
             * Sets identifier names generator.
             * Available values:
             * dictionary: identifier names from identifiersDictionary list
             * hexadecimal: identifier names like _0xabc123
             * mangled: short identifier names like a, b, c
             * mangled-shuffled: same as mangled but with shuffled alphabet
             */
            identifierNamesGenerator: 'hexadecimal',//16进制生成器 默认hexadecimal

            /**
             * @description
             * 为identifierNamesGenerator:dictionary选项设置标识符字典。
             * 字典中的每个标识符将用于几个变体中，每个字符的大小写都不同。
             * 因此，字典中标识符的数量应该取决于原始源代码的标识符数量
             * 默认：[]
             */
            identifiersDictionary: [],
            /**
             * @description 为所有全局标识符设置前缀。
             */
            identifiersPrefix: "",
            /**
             * @description 
             * Default: false
             * Prevents obfuscation of require imports. 
             * Could be helpful in some cases when for some reason runtime environment 
             * requires these imports with static strings only.
             */
            ignoreImports: false,
            /**
             * @description 
             * Default: ''
             * Allows to set name of the input file with source code. 
             * This name will be used internally for source map generation. 
             * Required when using NodeJS API and sourceMapSourcesMode option has sources value`.
             */
            inputFileName: "",
            /**
             * @description 启用将信息记录到控制台。
             * 默认: false
             */
            log: false,
            /**
             * @description 默认值：false
             * 启用数字转换为表达式
             * Example:
             * // input
             * const foo = 1234;
             * // output
             * const foo=-0xd93+-0x10b4+0x41*0x67+0x84e*0x3+-0xff8;
             */
            numbersToExpressions: false,
            /**
             * @description
             * 默认值：default
             * 允许设置预设选项。
             * Available values:
             * default;
             * low-obfuscation;
             * medium-obfuscation;
             * high-obfuscation.
             * 所有添加选项将与选定的选项预设合并。
             */
            optionsPreset: "default",

            /**
             * @description 
             * 默认值：false
             * 使用声明启用对全局变量和函数名称的混淆
             * ⚠️ 这个选项会破坏你的代码。只有当你知道它的作用时才启用它！
             * 使用声明启用全局变量和函数名的模糊处理。
             * */
            renameGlobals: false,
            /**
             * @description 
             * 默认值：false
             * ⚠️ 在大多数情况下，此选项将破坏代码。只有当你知道它的作用时才启用它！
             * 启用属性名称的重命名。所有built-inDOM属性和核心JavaScript类中的属性都将被忽略。
             * 要设置重命名属性名的格式，请使用identifierNamesGenerator选项。
             * 要控制将重命名哪些属性，请使用reservedNames选项。
             * Example:
             * // input
             * (function () {
             *     const foo = {
             *         prop1: 1,
             *         prop2: 2,
             *         calc: function () {
             *             return this.prop1 + this.prop2;
             *         }
             *     };
             *     console.log(foo.calc());
             * })();
             * // output
             * (function () {
             *     const _0x46529b = {
             *         '_0x10cec7': 0x1,
             *         '_0xc1c0ca': 0x2,
             *         '_0x4b961d': function () {
             *             return this['_0x10cec7'] + this['_0xc1c0ca'];
             *         }
             *     };
             *     console['log'](_0x46529b['_0x4b961d']());
             * }());
             */
            renameProperties: false,
            /**
             * @description
             * Default: safe
             * ⚠️ Even in safe mode, renameProperties option MAY break your code.
             * Specifies renameProperties option mode:
             * 
             * safe - default behaviour after 2.11.0 release. 
             * Trying to rename properties in a more safe way to prevent runtime errors. 
             * With this mode some properties will be excluded from renaming.
             * 
             * unsafe - default behaviour before 2.11.0 release. 
             * Renames properties in an unsafe way without any restrictions.
             * If one file is using properties from other file, 
             * use identifierNamesCache option to keep the same property names between these files.
             */
            renamePropertiesMode: "safe",
            /**
             * @description
             * 默认值：[]
             * 禁用由传递的RegExp模式匹配的混淆和标识符生成。
             */
            reservedNames: [],
            /**
             * @description
             * 默认值：[]
             * 禁用由传递的RegExp模式匹配的字符串文本的转换。
             */
            reservedStrings: [],
            /**
             * @description
             * 默认值：0
             * 此选项为随机生成器设置种子。这对于创建可重复的结果非常有用。
             * 如果种子是0-随机生成器将在没有种子的情况下工作。
             */
            seed: 0,
            /**
             * @description
             * 默认值：false
             * ⚠️ 使用此选项进行模糊处理后，请不要以任何方式更改混淆的代码，因为任何类似代码丑陋的更改都会触发自我保护，代码将不再工作！
             * ⚠️ 此选项强制将compact值设置为true
             * 此选项使输出代码对格式化和变量重命名具有弹性。
             * 如果一个人试图在模糊的代码上使用JavaScript美化器，代码将不再工作，这使得理解和修改它变得更加困难。
             */
            selfDefending: true,
            /**
             * @description 
             * 默认：true
             * 通过简化实现额外的代码混淆。
             */
            simplify: true,
            /**
             * @description
             * 默认值：false
             * 启用模糊代码的源映射生成。
             * 源代码映射可以帮助您调试模糊的JavaScript源代码。如果希望或需要在生产环境中调试，
             * 可以将单独的源映射文件上载到一个秘密位置，然后将浏览器指向该位置。
             */
            sourceMap: false,
            /**
             * @description 
             * 默认值：``
             * 当sourceMapMode: 'separate'时，将基url设置为源映射导入url。
             */
            sourceMapBaseUrl: "",
            /**
             * @description
             * 默认值：``
             * 设置sourceMapMode: 'separate'时输出源映射的文件名。
             */
            sourceMapFileName: "",
            /**
             * @description 
             * 默认：separate
             * 指定源映射生成模式：
             * inline-使用源映射生成单个文件，而不是使用单独的文件；
             * separate-使用源映射生成相应的'.map'文件。如果您通过CLI运行模糊处理程序-使用模糊处理代码
             * //# sourceMappingUrl=file.js.map将指向源映射文件的链接添加到文件末尾。
             */
            sourceMapMode: "separate",
            /**
             * @description
             * Default: sources-content
             * Allows to control sources and sourcesContent fields of the source map:
             * 
             * sources-content - adds dummy sources field, adds sourcesContent field with the original source code;
             * 
             * sources - adds sources field with a valid source description, 
             * does not add sourcesContent field. 
             * When using NodeJS API it's required to define inputFileName
             * option that will be used as sources field value.
             */
            sourceMapSourcesMode: "sources-content",
            /**
             * @description 
             * Default: false
             * Splits literal strings into chunks with length of splitStringsChunkLength option value.
             * Example:
             * // input
             * (function(){
             *     var test = 'abcdefg';
             * })();
             * // output
             * (function(){
             *     var _0x5a21 = 'ab' + 'cd' + 'ef' + 'g';
             * })();
             */
            splitStrings: false,
            /**
             * @description
             * 默认：10
             * 设置splitStrings选项的块长度。
             */
            splitStringsChunkLength: 10,
            /**
             * @description
             * 默认：true
             * 移除字符串文字并将其放入特殊数组中。
             * 例如，var m = "Hello World";中的字符串"Hello World"将替换为var m = _0x12c456[0x1];
             */
            stringArray: true,
            /**
             * @description
             * Default: false
             * ⚠️ stringArray option must be enabled
             * Enables the transformation of calls to the stringArray. 
             * All arguments of these calls may be extracted to a different object 
             * depending on stringArrayCallsTransformThreshold value. 
             * So it makes it even harder to automatically find calls to the string array.
             */
            stringArrayCallsTransform: false,
            /**
             * @description
             * Default: 0.5
             * ⚠️ stringArray and stringArrayCallsTransformThreshold options must be enabled
             * You can use this setting to adjust the probability (from 0 to 1) that calls to the string array will be transformed.
             */
            stringArrayCallsTransformThreshold: 0.5,
            /**
             * @description 
             * 默认值：[]
             * ⚠️ stringArray选项必须启用
             * 此选项会减慢脚本的速度。
             * 使用base64或rc4对stringArray的所有字符串文本进行编码，并插入一个在运行时用于解码的特殊代码。
             * 每个stringArray值将由从传递的列表中随机选取的编码进行编码。这使得使用多个编码成为可能。
             * Available values:
             * 'none'（boolean）：不编码stringArray值
             * 'base64'（string）：使用base64对stringArray值进行编码
             * 'rc4'（string）：使用rc4对stringArray值进行编码。大约30-50比base64慢，
             * 但更难获得初始值。建议在使用rc4编码时禁用unicodeEscapeSequence选项，以防止出现非常大的混淆代码。
             * 例如，对于以下选项值，某些stringArray值将不会被编码，而某些值将使用base64和rc4编码进行编码：
             * stringArrayEncoding: [
             *     'none',
             *     'base64',
             *     'rc4'
             * ]
             */
            stringArrayEncoding: [],
            /**
             * @description
             * Default: ['hexadecimal-number']
             * ⚠️ stringArray option must be enabled
             * Allows to control the type of string array call indexes.
             * Each stringArray call index will be transformed by the randomly picked type from the passed list.
             *  This makes possible to use multiple types.
             * Available values:
             * 'hexadecimal-number' (default): transforms string array call indexes as hexadecimal numbers
             * 'hexadecimal-numeric-string': transforms string array call indexes as hexadecimal numeric string
             */
            stringArrayIndexesType: ["hexadecimal-number"],
            /**
             * @description 
             * Default: true
             * ⚠️ stringArray option must be enabled
             * Enables additional index shift for all string array calls
             */
            stringArrayIndexShift: true,
            /**
             * @description
             * Default: true
             * ⚠️ stringArray must be enabled
             * Shift the stringArray array by a fixed and random (generated at the code obfuscation) places. 
             * This makes it harder to match the order of the removed strings to their original place.
             */
            stringArrayRotate: true,
            /**
             * @description 
             * Default: true
             * ⚠️ stringArray must be enabled
             * Randomly shuffles the stringArray array items.
             */
            stringArrayShuffle: true,
            /**
             * @description Default: true
             * ⚠️ stringArray and stringArrayWrappersCount options must be enabled
             * Enables the chained calls between string array wrappers.
             */
            stringArrayWrappersChainedCalls: true,
            /**
             * @description
             * Default: 1
             * ⚠️ stringArray option must be enabled
             * Sets the count of wrappers for the string array inside each root or function scope. 
             * The actual count of wrappers inside each scope is limited by a count of literal nodes within this scope.
             */
            stringArrayWrappersCount: 1,
            /**
             * @description 
             * Default: 2
             * ⚠️ stringArray option must be enabled
             * ⚠️ Currently this option affects only wrappers added by stringArrayWrappersType function option value
             * Allows to control the maximum number of string array wrappers parameters. 
             * Default and minimum value is 2. Recommended value between 2 and 5.
             */
            stringArrayWrappersParametersMaxCount: 2,
            /**
             * @description
             * Default: variable
             * ⚠️ stringArray and stringArrayWrappersCount options must be enabled
             * Allows to select a type of the wrappers that are appending by the stringArrayWrappersCount option.
             * Available values:
             * 
             * 'variable': appends variable wrappers at the top of each scope. Fast performance.
             * 
             * 'function': appends function wrappers at random positions inside each scope. 
             * Slower performance than with variable but provides more strict obfuscation.
             * 
             * Highly recommended to use function wrappers for higher obfuscation 
             * when a performance loss doesn't have a high impact on an obfuscated application.
             */
            stringArrayWrappersType: "variable",
            /**
             * @description
             * 默认值：0.8最小值：0最大值：1
             * ⚠️ stringArray选项必须启用
             * 您可以使用此设置来调整将字符串文本插入stringArray的概率（从0到1）。
             * 此设置对于较大的代码量特别有用，因为它反复调用string array，并且会降低代码的速度。
             * stringArrayThreshold: 0等于stringArray: false。
             */
            stringArrayThreshold: 0.75,
            /**
             * @description
             * 默认值：browser
             * 允许为模糊代码设置目标环境。
             * Available values:
             * browser;
             * browser-no-eval;
             * node.
             * 当前browser和node目标的输出代码是相同的，但某些browser-specific选项不允许与node目标一起使用。
             * browser-no-eval目标的输出代码未使用eval。
             */
            target: "browser",
            /**
             * @description
             * 默认：false
             * 启用对象键的转换。
             */
            transformObjectKeys: false,
            /**
             * @description
             * 默认：false
             * 允许启用/禁用字符串转换为unicode转义序列。
             * Unicode转义序列大大增加了代码的大小，字符串可以很容易地恢复到其原始视图。建议仅对小源代码启用此选项。
             */
            unicodeEscapeSequence: false,
        }
        return options as any;
    }

    /**@description JS 压缩  */
    toMinJS(done: () => void) {
        if (this.isCompex) {
            this.logger.log(`${this.module}代码混淆分支处理`);
            this.logger.log(`${this.module}构建目录${this.dest}`);
            //js混淆  低混淆，高性能模式
            GulpClient.src(`${this.dest}/**/*.js`)
                .pipe(GulpUglify())
                .pipe(gulpJavaScriptObfuscator(this.JSObfuscatorOptions) as NodeJS.ReadWriteStream)
                .pipe(GulpClient.dest(`${this.dest}`))
                .on("end", () => {
                    this.logger.log(`${this.module}压缩JS:${this.dest}完成`)
                    done();
                }).on("error",()=>{
                    this.logger.error(`${this.module}压缩JS:${this.dest}错误`);
                })
        } else {
            this.logger.log(`${this.module}非代码混淆分支处理`);
            GulpClient.src(`${this.dest}/**/*.js`)
                .pipe(GulpUglify())
                .pipe(GulpClient.dest(`${this.dest}`))
                .on("end", () => {
                    this.logger.log(`${this.module}压缩JS:${this.dest}完成`)
                    done();
                }).on("error",()=>{
                    this.logger.error(`${this.module}压缩JS:${this.dest}错误`);
                })
        }
    }

    complete(done:()=>void){
        this.logger.log(`构建平台:${this.platform}压缩开始`)
        done();
    }

    start(done:()=>void){
        this.logger.log(`构建平台:${this.platform}压缩开始`)
        done();
    }

    toMinHtml(done:()=>void){
        GulpClient.src(`${this.dest}/*.html`)
        // .pipe(fileInline())
        .pipe(htmlmin({
            collapseWhitespace: true,//压缩HTML
            removeComments: true,//清除HTML注释
            removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
            // removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
            // removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
            minifyJS: true,  //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(GulpClient.dest(`${this.dest}`))
        .on("end", () => {
            this.logger.log(`压缩html:${this.dest}完成`)
            done();
        });
    }

    toMinCSS(done:()=>void){
        GulpClient.src(`${this.dest}/*.css`)
        .pipe(GulpCleanCss())
        .pipe(GulpClient.dest(`${this.dest}`))
        .on("end", () => {
            this.logger.log(`压缩css:${this.dest}完成`)
            done();
        });
    }

    async run() {
        this.chdir(__dirname);
        await this.exec("node ../../node_modules/gulp/bin/gulp.js");
    }
}