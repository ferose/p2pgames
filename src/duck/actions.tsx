import { Actions } from '../ActionHelper';

export type SetGameNameAction = ReturnType<typeof setGameNameAction>;

export function setGameNameAction(gameName: string) {
    return {
        type: Actions.GAME_NAME,
        data: {
            gameName
        }
    }
}