import { GameData } from "../../framework/data/GameData"
import { Macro } from "../../framework/defines/Macros"

export class Global extends GameData{
    static bundle = Macro.BUNDLE_RESOURCES;
    where : string  = Macro.UNKNOWN;
    prevWhere : string = Macro.UNKNOWN;
}