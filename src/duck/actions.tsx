import { Actions } from '../ActionHelper';

export type SetInGameAction = ReturnType<typeof setInGameAction>;

export function setInGameAction(inGame: boolean) {
    return {
        type: Actions.IN_GAME,
        data: {
            inGame
        }
    }
}