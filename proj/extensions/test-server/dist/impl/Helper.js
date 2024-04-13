"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Handler_1 = require("../core/Handler");
/**
 * @description 本地测试测试器
 */
class Helper extends Handler_1.Handler {
    constructor() {
        super(...arguments);
        this.module = "【引擎修正】";
    }
    start() {
        let ws = require("nodejs-websocket");
        let server = ws.createServer((socket) => {
            // 事件名称为text(读取字符串时，就叫做text)，读取客户端传来的字符串
            let count = 1;
            socket.on('binary', (inStream) => {
                // 在控制台输出前端传来的消息　　
                this.logger.log("服务器端收到客户端端发来的消息了！" + count++);
                // 创建空的buffer对象，收集二进制数据
                let data = Buffer.alloc(0);
                // 读取二进制数据的内容并且添加到buffer中
                inStream.on('readable', function () {
                    let newData = inStream.read();
                    if (newData)
                        data = Buffer.concat([data, newData], data.length + newData.length);
                });
                inStream.on('end', function () {
                    // 读取完成二进制数据后，处理二进制数据
                    socket.send(data);
                });
            });
            socket.on("close", (code, reason) => {
                this.logger.warn("连接关闭", code, reason);
            });
            socket.on("error", (err) => {
                this.logger.error("连接错误", err);
            });
        }).listen(3030);
        this.logger.log("本地测试服务器启动");
    }
}
exports.default = Helper;
