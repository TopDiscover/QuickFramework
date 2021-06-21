
//1:安装好node、npm、npx环境
//2:安装 gulp 命令行工具 npm install --global gulp-cli
//3:在项目目录下npm init
//4:安装 gulp，作为开发时依赖项npm install --save-dev gulp
//5:装载对应插件
//gulp-imagemin                  npm i gulp-imagemin
//gulp-htmlmin                   npm i gulp-htmlmin
//gulp-file-inline               npm i gulp-file-inline
//gulp-javascript-obfuscator     npm i gulp-javascript-obfuscator   依赖 npm i vinyl-sourcemaps-apply
//npm install --save-dev gulp del
//npm install --save-dev gulp-html-replace (目前不用)
//npm i gulp-dom


//删除无用文件（需要手动配置）、图片无损压缩、js混淆、添加js脚本、html压缩合并js和scc     (目前只测试过h5、原生没试过）
//执行gulp build



//获取 gulp
const gulp = require('gulp');
//装载imagemin
const imagemin = require("gulp-imagemin");
// 装载htmlmin
const htmlmin = require("gulp-htmlmin");
// 装载file-inline
const fileInline = require("gulp-file-inline");
//装载file-inline
const javascriptObfuscator = require("gulp-javascript-obfuscator");
//装载del
const del = require('del');
//装载htmlreplace
// const htmlreplace = require('gulp-html-replace');
//装载dom
const dom = require('gulp-dom');

//删除无用的bundle   无需要的bundle在这里先删除
async function dele(cb) {
    await del([
        './build/web-mobile/assets/aimLine',
    ]);
    cb();
}

//压缩图片任务 3版本一下语法  3版本以上语法不一样
function images(cb) {
    return gulp.src(["./build/web-mobile/**/*.{png,gif,ico}"]) //png,jpg,gif,ico结尾文件
        .pipe(imagemin({
            interlaced: true,//gif压缩
            progressive: true,//jpeg压缩
            optimizationLevel: 5,//png压缩
            svgoPlugins: [//svg压缩
                {
                    removeViewBox: true
                }
            ]
        }))
        .pipe(gulp.dest("./build/web-mobile/"))
        .on("end", cb);
}

// //处理html
function html(cb) {
    return gulp.src("./build/web-mobile/*.html")
        .pipe(fileInline())
        .pipe(htmlmin({
            collapseWhitespace: true,//压缩HTML
            removeComments: true,//清除HTML注释
            removeEmptyAttributes: true,  //删除所有空格作属性值 <input id="" /> ==> <input />
            removeScriptTypeAttributes: true,  //删除<script>的type="text/javascript"
            removeStyleLinkTypeAttributes: true,  //删除<style>和<link>的type="text/css"
            minifyJS: true,  //压缩页面JS
            minifyCSS: true //压缩页面CSS
        }))
        .pipe(gulp.dest("./build/web-mobile/")
            .on("end", cb));
}

//js混淆  低混淆，高性能模式
function js(cb) {
    return gulp.src(["./build/web-mobile/**/*.js", '!./build/web-mobile/cocos2d-js.*.js'])
        .pipe(javascriptObfuscator({
            compact: true,//在一行上面输出
            controlFlowFlattening: false,//启用代码控制流扁平化。
            deadCodeInjection: false,//默认false。设为true，表示将添加随机废代码到被混淆代码中。该选项会显著增加代码大小（高达200%）
            debugProtection: false,//如果您打开开发人员工具，可能会冻结您的浏览器
            debugProtectionInterval: false,//可以冻结您的浏览器！使用风险自负。
            disableConsoleOutput: true,//禁用console.log、console.debug等调试函数
            identifierNamesGenerator: 'hexadecimal',//16进制生成器
            // domainLock: [".zz-game.com"],  域锁 //允许仅在特定域和/或子域上运行混淆的源代码
            log: false,//启用将信息记录到控制台。
            numbersToExpressions: false,//启用数字到表达式的转换
            renameGlobals: false,//使用声明启用对全局变量和函数名称的混淆
            rotateStringArray: true,//将stringArray数组移动一个固定和随机（在代码混淆处生成）的位置
            selfDefending: true,//使用此选项进行混淆后，请勿以任何方式更改混淆代码
            shuffleStringArray: true,//随机打乱stringArray数组项。
            simplify: true,//通过简化实现额外的代码混淆
            splitStrings: false,//将文字字符串拆分为具有splitStringsChunkLength选项值长度的块。
            stringArray: true,//删除字符串文字并将其放置在特殊数组中
            target: "browser",//允许为混淆代码设置目标环境browser; browser-no-eval;node
            stringArrayEncoding: [],//对stringArrayusing 的所有字符串文字进行编码base64或rc4插入一个特殊的代码，用于在运行时对其进行解码。
            stringArrayIndexShift: true,//为所有字符串数组调用启用额外的索引移位
            stringArrayWrappersCount: 1,//设置string array每个根或函数作用域内部的包装器计数
            stringArrayWrappersChainedCalls: true,//启用string array包装器之间的链式调用
            stringArrayWrappersParametersMaxCount: 2,//允许控制字符串数组包装器参数的最大数量。
            stringArrayWrappersType: 'variable',//允许选择由stringArrayWrappersCount选项附加的包装器类型。
            stringArrayThreshold: 0.75,//您可以使用此设置来调整将字符串文字插入到stringArray
            unicodeEscapeSequence: false//允许启用/禁用字符串转换为 unicode 转义序列
        }))
        .pipe(gulp.dest("./build/web-mobile")
            .on("end", cb));
}

//删除合并后无用的css和js
function delefile(cb) {
    del([
        './build/web-mobile/style-mobile.*.css', './build/web-mobile/style-desktop.*.css',
        './build/web-mobile/src', './build/web-mobile/main.*.js',
    ]);
    cb();
}

// //插入js脚本
// function addJs(cb) {
//     return gulp.src('index.js')
//         .pipe(gulp.dest('./build/web-mobile/'));
// }

// //插入js脚本   (目前不用)
// function insertJs(cb) {
//     return gulp.src('./build/web-mobile/index.html')
//         .pipe(htmlreplace({
//             'js': 'index.js'
//         }))
//         .pipe(gulp.dest('./build/web-mobile/'));
// }

// //插入js脚本
// function insertJs(cb) {
//     return gulp.src('./build/web-mobile/index.html')
//         .pipe(dom(function () {
//             let setScript = this.createElement("script");//创建script 添加index.js脚本
//             setScript.setAttribute("type", "text/javascript");
//             setScript.setAttribute("src", "index.js");
//             this.body.insertBefore(setScript, this.body.firstChild);
//             return this;
//         }))
//         .pipe(gulp.dest('./build/web-mobile/'));
// }

exports.build = gulp.series(dele, gulp.parallel(images, js),  html, delefile)

// exports.build = gulp.series(dele, gulp.parallel(images, js), addJs, insertJs, html, delefile)

// exports.build =delefile