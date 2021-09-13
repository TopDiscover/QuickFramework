import NetHelper from "../../../../scripts/framework/core/net/service/NetHelper";
import { LobbyService } from "../../../../scripts/common/net/LobbyService";
import { TestBinaryMessage } from "../protocol/TestBinaryMessage";
import { HttpPackage } from "../../../../scripts/framework/core/net/http/HttpClient";
import { TestJsonMessage } from "../protocol/TestJsonMessage";
import { Http } from "../../../../scripts/framework/core/net/http/Http";
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "../protocol/LobbyCmd";
import { CmmProto } from "../../../../scripts/common/net/CmmProto";
import { HallProtoConfig } from "../../proto/HallProtoConfig";

class _HallNetHelper extends NetHelper<LobbyService>{

    constructor() {
        super(LobbyService.instance);
    }

    sendProtoMessage(hello: string) {

        type RoomInfo = typeof tp.RoomInfo;
        let RoomInfo : RoomInfo = Manager.protoManager.lookup(HallProtoConfig.CMD_ROOM_INFO.className) as any;
        let roomInfo = new CmmProto<tp.RoomInfo>(RoomInfo);
        roomInfo.data = RoomInfo.create();
        roomInfo.mainCmd = HallProtoConfig.CMD_ROOM_INFO.mainCmd;
        roomInfo.subCmd = HallProtoConfig.CMD_ROOM_INFO.subCmd;
        roomInfo.cmd = HallProtoConfig.CMD_ROOM_INFO.cmd;
        roomInfo.data.name = "高级VIP专场";
        roomInfo.data.roomID = 9999;
        type UserInfo = typeof tp.UserInfo;
        let UserInfo : UserInfo = Manager.protoManager.lookup("tp.UserInfo") as any ;
        let userInfo = UserInfo.create();
        userInfo.id = 6666;
        userInfo.level = 10;
        userInfo.money = 9900009999
        userInfo.name = "我就是玩！！！"

        let GenderType = Manager.protoManager.lookup("tp.GenderType") as protobuf.Enum;
        userInfo.gender = ((GenderType.values as any) as typeof tp.GenderType).female;
        roomInfo.data.players = [];
        roomInfo.data.players.push(userInfo);
        this.service.send(roomInfo);
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
        httpPackage.data.type = Http.Type.POST;
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
