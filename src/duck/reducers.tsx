import { IAction, Actions } from '../ActionHelper';

export function generalReducer(state={
    gameName: undefined
}, action: IAction<any, any>) {
    switch(action.type) {
        case Actions.GAME_NAME:
            return {...state, gameName: action.data.gameName};
        default:
            return state;
    }
}