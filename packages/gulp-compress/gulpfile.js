// 获取 gulp
let gulp = require('gulp')
// 获取 uglify 模块（用于压缩 JS）
let uglify = require('gulp-uglify')
//装载del
const del = require('del');
const helper = require("./dist/Helper")
// 装载htmlmin
const htmlmin = require("gulp-htmlmin");
// 装载file-inline
const fileInline = require("gulp-file-inline");

//装载imagemin
const imagemin = require("gulp-imagemin");

//装载pngquant
const pngquant = require('imagemin-pngquant')

//css 压缩
const cleanCSS = require('gulp-clean-css');

//cache
const cache = require('gulp-cache')

// JS混淆
const javascriptObfuscator = require("gulp-javascript-obfuscator");


//参数解析
const minimist = require('minimist');
const { normalize, join, parse } = require('path');
const { readdirSync, readdir, statSync } = require('fs');

const dest = helper.helper.dest;
const dirs = helper.helper.dirs;
const isWeb = helper.helper.isWeb;
const platform = helper.helper.platform;

let options = minimist(process.argv.slice(2), {
    string: "compex",
    default: { "compex": false }
});

console.log(options);

// 压缩 js 文件
gulp.task("tomin", (done) => {
    for (let i = 0; i < dirs.length; i++) {
        let tominDir = `${dirs[i]}`;
        let tominSrc = `${dirs[i]}/**/*.js`;
        if (options.compex) {
            console.log("代码混淆分支处理");
            //js混淆  低混淆，高性能模式
            gulp.src(tominSrc)
                .pipe(uglify())
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
                .pipe(gulp.dest(`${tominDir}`))
                .on("end", () => {
                    console.log(`压缩JS:${tominDir}完成`)
                    if (i == dirs.length - 1) {
                        done();
                    }
                })
        } else {
            console.log("非代码混淆分支处理");
            gulp.src(tominSrc)
                .pipe(uglify())
                .pipe(gulp.dest(`${tominDir}`))
                .on("end", () => {
                    console.log(`压缩JS:${tominDir}完成`)
                    if (i == dirs.length - 1) {
                        done();
                    }
                });
        }
    }
    if (dirs.length == 0) {
        done();
    }
});

gulp.task("complete", (done) => {
    console.log(`恭喜您,压缩完成!!!!`);
    done();
});

gulp.task("start", (done) => {
    console.log(`构建平台:${platform}压缩开始`)
    done();
})

//web平台压缩 html
gulp.task("tomin-html", (done) => {
    gulp.src(`${dest}/*.html`)
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
        .pipe(gulp.dest(`${dest}`))
        .on("end", () => {
            console.log(`压缩html:${dest}完成`)
            done();
        });
});

function readDir(dir, files) {
    let stat = statSync(dir);
    if (!stat.isDirectory()) {
        return files;
    }
    var subpaths = readdirSync(dir);
    let subpath = "";
    for (var i = 0; i < subpaths.length; ++i) {
        if (subpaths[i][0] === '.') {
            continue;
        }
        subpath = join(dir, subpaths[i]);
        stat = statSync(subpath);
        if (stat.isFile()) {
            let ret = parse(subpath);
            if (ret.ext == ".js" || ret.ext == ".css" ){
                files.push(subpath);
            }
        }
    }
}

gulp.task("delete-useless", (done) => {
    console.log(`删除${dest}目录下无用文件`)
    let files = [];
    readDir(dest, files)
    readDir(join(dest,"src"),files);
    files.forEach((filePath)=>{
        let temp = parse(filePath);
        if ( temp.ext == ".js" ){
            if ( temp.name.includes("main") || temp.name.includes("settings") ){
                del(filePath,{force:true});
            }
        }else{
            del(filePath,{force:true});
        }
    })
    done();
})

gulp.task("tomin-css", (done) => {
    gulp.src(`${dest}/*.css`)
        .pipe(cleanCSS())
        .pipe(gulp.dest(`${dest}`))
        .on("end", () => {
            console.log(`压缩css:${dest}完成`)
            done();
        });
});

//压缩图片任务 3版本一下语法  3版本以上语法不一样
gulp.task("tomin-images", (done) => {
    //png,jpg,gif,ico结尾文件
    console.log(dest);
    gulp.src([`${dest}/*.{png,gif,ico,jpg}`])
        .pipe(cache(imagemin({
            interlaced: true,//gif压缩
            progressive: true,//jpeg压缩
            optimizationLevel: 5,//png压缩
            svgoPlugins: [//svg压缩
                {
                    removeViewBox: true
                }
            ],
            use: [pngquant()]
        })))
        .pipe(gulp.dest(dest))
        .on("end", () => {
            console.log(`压缩图片完成:${dest}`);
            done();
        });
})

if (isWeb) {
    // 2.4.x 版本，web版本已经进行了js压缩
    gulp.task("default", gulp.series("start", "tomin", "tomin-html", "tomin-images", "delete-useless", "complete"));
} else {
    gulp.task("default", gulp.series("start", "tomin", "complete"));
}
