
import { Node } from 'cc';

export interface ILogicManager {
    push( logicType : any ):void;
    onLoad( node : Node ):void;
    onDestroy( node : Node ):void;
}

