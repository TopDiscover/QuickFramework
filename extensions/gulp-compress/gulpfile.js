// 获取 gulp
let gulp = require('gulp')
// 获取 uglify 模块（用于压缩 JS）
let uglify = require('gulp-uglify')
//装载del
const del = require('del');
const helper = require("./dist/Helper")

const dest = helper.helper.dest;

// 压缩 js 文件
gulp.task("tomin", (done) => {
    gulp.src(`${dest}/**/*.js`)
        .pipe(uglify())
        .pipe(gulp.dest(`${dest}_min`))
        .on("end",()=>{
            console.log(`压缩JS到缓存目录:${dest}_min完成`)
            done();
        });
});

gulp.task("tosource", (done) => {
    gulp.src(`${dest}_min/**/*.js`)
        .pipe(uglify())
        .pipe(gulp.dest(dest))
        .on("end",()=>{
            console.log(`复制压缩文件到构建目录${dest}`);
            done();
        });
});

gulp.task("delete", (done) => {
    del(`${dest}_min`, { force: true }).then(()=>{
        console.log(`删除压缩缓存目录:${dest}_min`);
        done();
    },()=>{
        console.error(`删除压缩缓存目录失败:${dest}_min`);
        done();
    });
})

gulp.task("complete",(done)=>{
    console.log(`恭喜您,压缩完成!!!!`);
    done();
});

gulp.task("default", gulp.series("tomin","tosource","delete","complete"));