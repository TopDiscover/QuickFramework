import { serialize, BYTE, SHORT, INT, FLOAT, DOUBLE, UBYTE, USHORT, UINT, STRING, BinaryStream, BOOL } from "../../../../scripts/framework/core/net/message/BinaryStreamMessage"
import { MainCmd } from "../../../../scripts/common/protocol/CmdDefines";
import { SUB_CMD_LOBBY } from "./LobbyCmd";

class BinaryStreamMessage extends BinaryStream{
    get cmd() { return "";};
}

class TestData extends BinaryStreamMessage{

    @serialize("vFloat",FLOAT)
    vFloat : number = 32.666666;

    @serialize("vDouble",DOUBLE)
    vDouble: number = 88888.33333;
}

export class TestBinaryMessage extends BinaryStreamMessage {
    get cmd(){ return String(this.mainCmd) + String(this.subCmd);}
    mainCmd = MainCmd.CMD_LOBBY;
    subCmd = SUB_CMD_LOBBY.TEST_BINARY_MSG;

    @serialize("vbool",BOOL)
    vbool : boolean = true;

    @serialize("vString",STRING)
    vString : string = "这只是一个测试，你没看错";

    @serialize("vFloat",FLOAT)
    vFloat : number = 32.3333344;

    @serialize("vDouble",DOUBLE)
    vDouble: number = 64.9999999;

    @serialize("vByte",BYTE)
    vByte: number = 18;

    @serialize("vShort",SHORT)
    vShort: number = 116;

    @serialize("vInt",INT)
    vInt: number = 132;

    @serialize("vUByte",UBYTE)
    vUByte: number = 8;

    @serialize("vUShort",USHORT)
    vUShort: number = 16;

    @serialize("vUInt",UINT)
    vUInt: number = 32;

    @serialize("vArray",Array,INT)
    vArray : Array<number> = [1,2,3,4,5,6]

    @serialize("vMap",Map,String,DOUBLE)
    vMap:Map<string,number> = new Map();

    @serialize("vUser",TestData)
    vUser : TestData = new TestData();

    @serialize("vHello",STRING)
    vHello : string = "您好，我是Binary消息！"

    @serialize("vLimitString",STRING,12)
    vLimitString : string = "这是一个定长字节数字符串的测试";

    constructor(){
        super();
        this.vMap.set("keyy_1",1);
        this.vMap.set("keyy_2",2);
        this.vMap.set("keyy_3",2);
        this.vMap.set("keyy_4",4);
        this.vMap.set("keyy_5",5);
    }
}
