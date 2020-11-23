import NetHelper from "../../../../script/framework/controller/NetHelper";
import { LobbyService } from "../../../../script/common/net/LobbyService";
import { TestMsg, UpdateMoney } from "../protocol/HallMessage";
import { TestBinaryMessage } from "../protocol/CmdBinaryMessage";
import { HttpPackage, HttpRequestType } from "../../../../script/framework/net/HttpClient";
import { GameService } from "../../../../script/common/net/GameService";


class _HallNetHelper extends NetHelper<LobbyService>{

    constructor(){
        super(LobbyService.instance);
    }

    private gameService : GameService  = GameService.instance;

    sendProtoMessage() {
        let testProto = new TestMsg();
        testProto.data.awesomeField = "这是一个中文的测试";
        testProto.data.afvalue = 4.5;
        this.service.send(testProto);
        this.gameService.send(testProto);
    }

    sendJsonMessage() {
        let msg = new UpdateMoney();
        this.service.send(msg);
    }

    sendBinaryMessage() {
        let binaryMessage = new TestBinaryMessage();
        this.service.send(binaryMessage);
    }

    sendHttpMessage( ){

        let httpPackage = new HttpPackage();
        httpPackage.data.url = "https://httpbin.org/post";
        httpPackage.data.type = HttpRequestType.POST;
        //"text/plain;charset=UTF-8""Accept-Encoding","gzip,deflate"
        //httpPackage.data.requestHeader = [{name : "Content-Type" , value : "text/plain"},{name:"Accept-Encoding",value:"gzip,deflate"}]
        httpPackage.data.requestHeader = {name : "Content-Type" , value : "text/plain"}
        httpPackage.data.data = new Uint8Array([1,2,3,4,5]);
        httpPackage.send((data)=>{
            cc.log("数据返回")
        },()=>{
            cc.log("数据错误")
        })

        httpPackage = new HttpPackage();
        httpPackage.data.url = "https://httpbin.org/get";
        // httpPackage.data.requestHeader = {name : "Content-Type" , value : "text/plain"}
        httpPackage.params = {
            a : 100,
            b : "zheng"
        }
        httpPackage.send((data)=>{
            cc.log("数据返回")
        },()=>{
            cc.log("数据错误")
        })

    }
}
export let HallNetHelper = new _HallNetHelper();
