import { BinaryStreamMessage, serialize, Int8Value, Int16Value, Int32Value, Float32Value, Float64Value, Uint8Value, Uint16Value, Uint32Value, StringValue } from "../../framework/net/BinaryStreamMessage";
import { MainCmd, SUB_CMD_LOBBY } from "../../common/protocol/CmdNetID";

export class TestBinaryMessage extends BinaryStreamMessage {
    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.CMD_LOBBY_TEST_BINARY;
    // @serialize("value32",Float32Value)
    // float32 : number = 32;

    // @serialize("value64",Float64Value)
    // float64: number = 64;

    // @serialize("int8",Int8Value)
    // int8: number = 18;

    // @serialize("int16",Int16Value)
    // int16: number = 116;

    // @serialize("int32",Int32Value)
    // int32: number = 132;

    // @serialize("uint8",Uint8Value)
    // uint8: number = 8;

    // @serialize("uint16",Uint16Value)
    // uint16: number = 16;

    // @serialize("uint32",Uint32Value)
    // uint32: number = 32;

    @serialize("str",StringValue)
    str : string = "这只是一个测试，你没看错";

    // @serialize("mapdata",Map,Number,Int32Value)
    // testMap:Map<number,number> = new Map();//null;

    constructor(){
        super();
        // this.testMap.set(1,1);
        // this.testMap.set(2,2);
        // this.testMap.set(3,2);
        // this.testMap.set(4,4);
        // this.testMap.set(5,5);
        // this.testMap.set(6,6);
    }
}
