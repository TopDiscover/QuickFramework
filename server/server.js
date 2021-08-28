var ws = require('nodejs-websocket');
var server = ws.createServer(function(socket){
// 事件名称为text(读取字符串时，就叫做text)，读取客户端传来的字符串
　  var count = 1;
    socket.on('binary', function(inStream) {
　　     // 在控制台输出前端传来的消息　　
        console.log("服务器端收到客户端端发来的消息了！"+ count++);
        // 创建空的buffer对象，收集二进制数据
      var data = new Buffer(0)
      // 读取二进制数据的内容并且添加到buffer中
      inStream.on('readable', function() {
        var newData = inStream.read()
        if (newData)
          data = Buffer.concat([data, newData], data.length + newData.length)
      })
      inStream.on('end', function() {
        // 读取完成二进制数据后，处理二进制数据
        socket.send(data);
      })
    });
}).listen(3000);