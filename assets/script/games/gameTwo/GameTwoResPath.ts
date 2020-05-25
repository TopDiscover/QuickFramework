import { GamePathDelegate } from "../../common/base/ResPath";

export default class GameTwoResPath extends GamePathDelegate {
    res(path:string){
        return "games/gameTwo/" + path;
    }
}