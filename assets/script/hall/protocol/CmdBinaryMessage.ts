import { BinaryStreamMessage, serialize, Int8Value, Int16Value, Int32Value } from "../../framework/net/BinaryStreamMessage";
import { MainCmd, SUB_CMD_LOBBY } from "../../common/protocol/CmdNetID";

export class TestBinaryMessage extends BinaryStreamMessage {
    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.CMD_LOBBY_TEST_BINARY;
    @serialize("count",Int8Value)
    count : number = 1000;

    @serialize("arr",Array,Int16Value)
    testArr: Array<string> = ["1","2","3","4"];//null;

    @serialize("mapdata",Map,Number,Int32Value)
    testMap:Map<number,number> = new Map();//null;

    constructor(){
        super();
        this.testMap.set(1,1);
        this.testMap.set(2,2);
        this.testMap.set(3,2);
        this.testMap.set(4,4);
        this.testMap.set(5,5);
        this.testMap.set(6,6);
    }
}
