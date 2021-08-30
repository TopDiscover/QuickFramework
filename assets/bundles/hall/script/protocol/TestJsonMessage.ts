import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { JsonMessage, serialize } from "../../../../scripts/framework/core/net/message/JsonMessage";
import { SUB_CMD_LOBBY } from "./LobbyCmd";

export class TestData extends JsonMessage{

    @serialize("test",String)
    test : string = "这是一个中文的字符串测试";

}

export class TestJsonMessage extends JsonMessage {
    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.TEST_JSON_MSG;
    @serialize("count",Number)
    count : number = 1000;

    @serialize("arr",Array,String)
    testArr: Array<string> = ["1","2","3","4"];//null;

    @serialize("mapdata",Map,Number,String)
    testMap:Map<number,string> = new Map();//null;

    @serialize("test",TestData)
    testData : TestData = new TestData();

    @serialize("hello",String)
    hello : string = "您好，我是Json消息！";

    constructor(){
        super();
        this.testMap.set(1,"ss");
        this.testMap.set(2,"s22s");
        this.testMap.set(3,"s33s");
        this.testMap.set(4,"s44s");
        this.testMap.set(5,"s55s");
        this.testMap.set(6,"s66s");
    }
}