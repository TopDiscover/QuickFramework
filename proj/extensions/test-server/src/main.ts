
/**
 * @en 
 * @zh 为扩展的主进程的注册方法
 */
export const methods: { [key: string]: (...any: any) => any } = {
    startServer() {
        let ws = require("nodejs-websocket");
        let server = ws.createServer((socket:any)=> {
            // 事件名称为text(读取字符串时，就叫做text)，读取客户端传来的字符串
            let count = 1;
            socket.on('binary', (inStream:any) =>{
                // 在控制台输出前端传来的消息　　
                console.log("服务器端收到客户端端发来的消息了！" + count++);
                // 创建空的buffer对象，收集二进制数据
                let data = Buffer.alloc(0);
                // 读取二进制数据的内容并且添加到buffer中
                inStream.on('readable', function () {
                    let newData = inStream.read()
                    if (newData)
                        data = Buffer.concat([data, newData], data.length + newData.length)
                })
                inStream.on('end', function () {
                    // 读取完成二进制数据后，处理二进制数据
                    socket.send(data);
                })
            });
            socket.on("close",(code:any, reason:any)=>{
                console.warn("连接关闭",code,reason);
            });
            socket.on("error",(err:any)=>{
                console.error("连接错误",err);
            })
        }).listen(3000);
        console.log("本地测试服务器启动")
    },
};

/**
 * @en Hooks triggered after extension loading is complete
 * @zh 扩展加载完成后触发的钩子
 */
export const load = function () { };

/**
 * @en Hooks triggered after extension uninstallation is complete
 * @zh 扩展卸载完成后触发的钩子
 */
export const unload = function () { };
