
enum EventName {
    GREETING = 'greeting',
    GOODBYE = 'goodbye',
    FINISHED_WALK = 'finished-walk',
    START_BRAKING = 'start-braking',
    END_BRAKING = 'end-braking',
    SHOW_COIN = 'show-coin',
    GAME_START = 'game-start',
    GAME_OVER = 'game-over',
    NEW_LEVEL = 'new-level',
    SHOW_TALK = 'show-talk',
    SHOW_GUIDE = 'show-guide',
    UPDATE_PROGRESS = 'update-progress',
    MAIN_CAR_INI_SUCCUSS = "MAIN_CAR_INI_SUCCUSS",
    PLAY_SOUND = "PLAY_SOUND",
}

enum CustomerState {
    NONE,
    GREETING,
    GOODBYE,
}

enum AudioSource {
    BACKGROUND = 'audio/music/background',
    CLICK = 'click',
    CRASH = 'crash',
    GETMONEY = 'getMoney',
    INCAR = 'inCar',
    NEWORDER = 'newOrder',
    START = 'start',
    STOP = 'stop',
    TOOTING1 = 'tooting1',
    TOOTING2 = 'tooting2',
    WIN = 'win',
}

enum CarGroup {
    NORMAL = 1 << 0,
    MAIN_CAR = 1 << 11,
    OTHER_CAR = 1 << 12,
}

export class TaxiConstants {
    public static EventName = EventName;
    public static CustomerState = CustomerState;
    public static AudioSource = AudioSource;
    public static CarGroup = CarGroup;
    public static UIPage = {
        mainUI: 'mainUI',
        gameUI: 'gameUI',
        resultUI: 'resultUI',
    };

    public static GameConfigID = 'TAXI_GAME_CACHE';
    public static PlayerConfigID = 'playerInfo';
    public static MaxLevel = 18;
}
