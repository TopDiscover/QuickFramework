// 获取 gulp
let gulp = require('gulp')
const Helper = require("./Helper")
const helper = new Helper.default();
const isWeb = helper.isWeb;
// 压缩 js 文件
gulp.task("tomin", helper.toMinJS.bind(helper));

gulp.task("complete", helper.complete.bind(helper));

gulp.task("start", helper.start.bind(helper));

//web平台压缩 html
gulp.task("tomin-html", helper.toMinHtml.bind(helper));

gulp.task("tomin-css", helper.toMinCSS.bind(helper));

if (isWeb) {
    gulp.task("default", gulp.series("start", "tomin", "tomin-html","tomin-css", "complete"));
} else {
    gulp.task("default", gulp.series("start", "tomin", "complete"));
}
