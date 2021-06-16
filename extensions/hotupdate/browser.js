'use strict';

// 扩展内定义的方法
exports.methods = {
    showPanel() {
        Editor.Panel.open('hotupdate');
    },
};

// 当扩展被启动的时候执行
exports.load = function() {};

// 当扩展被关闭的时候执行
exports.unload = function() {};