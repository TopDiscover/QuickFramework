/**
 * @description 大厅网络逻辑流程控制器  
 */

 import { injectService } from "../../../../scripts/framework/decorator/Decorators";
 import { LobbyService } from "../../../../scripts/common/net/LobbyService";
 import Controller from "../../../../scripts/framework/controller/Controller";
 import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
//  import { TestProtoMessage } from "../protocol/TestProtoMessage";
 import { TestBinaryMessage } from "../protocol/TestBinaryMessage";
 import { CommonEvent } from "../../../../scripts/common/event/CommonEvent";
 import { Manager } from "../../../../scripts/common/manager/Manager";
 import { SUB_CMD_LOBBY } from "../protocol/LobbyCmd";
 import { TestJsonMessage } from "../protocol/TestJsonMessage";
 import { ServiceEvent } from "../../../../scripts/framework/base/Defines";
import { _decorator } from "cc";
 const { ccclass, property } = _decorator;
 
 @ccclass
 @injectService(LobbyService.instance)
 export default class HallNetController extends Controller<LobbyService> {
 
     protected bindingEvents() {
         super.bindingEvents()
         this.registerEvent(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_JSON_MSG, this.onTestJsonMessage, TestJsonMessage);
        //  this.registerEvent(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_PROTO_MSG, this.onTestProtoMessage, TestProtoMessage);
         this.registerEvent(MainCmd.CMD_LOBBY, SUB_CMD_LOBBY.TEST_BINARY_MSG, this.onTestBinaryMessage, TestBinaryMessage);
     }
 
     private onTestJsonMessage(data: TestJsonMessage) {
         dispatch(CommonEvent.TEST_JSON_MSG, data.hello);
     }
 
    //  private onTestProtoMessage(data: TestProtoMessage) {
    //      dispatch(CommonEvent.TEST_PROTO_MSG, data.data.hello);
    //  }
 
     private onTestBinaryMessage(data: TestBinaryMessage) {
         dispatch(CommonEvent.TEST_BINARY_MSG, data.hello)
     }
 
     protected onNetOpen(event: ServiceEvent) {
         let result = super.onNetOpen(event);
         if (result) dispatch(CommonEvent.LOBBY_SERVICE_CONNECTED, this.service);
         return result;
     }
 
     protected onNetClose(event: ServiceEvent) {
         let result = super.onNetClose(event);
         if (result) dispatch(CommonEvent.LOBBY_SERVICE_CLOSE, this.service);
         return result;
     }
 
 }
 
 Manager.hallNetManager.register(HallNetController);
 