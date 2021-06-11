import NetHelper from "../../../../scripts/framework/controller/NetHelper";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { TestProtoMessage } from "../protocol/TestProtoMessage";
import { TestBinaryMessage } from "../protocol/TestBinaryMessage";
import { HttpPackage, HttpRequestType } from "../../../../scripts/framework/net/HttpClient";
import { TestJsonMessage } from "../protocol/TestJsonMessage";

class _HallNetHelper extends NetHelper<LobbyService>{

    constructor() {
        super(LobbyService.instance);
    }

    sendProtoMessage(hello: string) {
        let testProto = new TestProtoMessage();
        testProto.data.hello = hello;
        testProto.data.afvalue = 4.5;
        this.service.send(testProto);
    }

    sendJsonMessage(hello: string) {
        let msg = new TestJsonMessage();
        msg.hello = hello;
        this.service.send(msg);
    }

    sendBinaryMessage(hello: string) {
        let binaryMessage = new TestBinaryMessage();
        binaryMessage.hello = hello;
        this.service.send(binaryMessage);
    }

    sendHttpMessage() {

        let httpPackage = new HttpPackage();
        httpPackage.data.url = "https://httpbin.org/post";
        httpPackage.data.type = HttpRequestType.POST;
        //"text/plain;charset=UTF-8""Accept-Encoding","gzip,deflate"
        //httpPackage.data.requestHeader = [{name : "Content-Type" , value : "text/plain"},{name:"Accept-Encoding",value:"gzip,deflate"}]
        httpPackage.data.requestHeader = { name: "Content-Type", value: "text/plain" }
        httpPackage.data.data = new Uint8Array([1, 2, 3, 4, 5]);
        httpPackage.send((data) => {
            log("数据返回")
        }, () => {
            log("数据错误")
        })

        httpPackage = new HttpPackage();
        httpPackage.data.url = "https://httpbin.org/get";
        // httpPackage.data.requestHeader = {name : "Content-Type" , value : "text/plain"}
        httpPackage.params = {
            a: 100,
            b: "zheng"
        }
        httpPackage.send((data) => {
            log("数据返回")
        }, () => {
            log("数据错误")
        })

    }
}
export let HallNetHelper = new _HallNetHelper();
