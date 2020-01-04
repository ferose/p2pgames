import { IAction, Actions } from '../ActionHelper';

export function generalReducer(state={
    inGame: false
}, action: IAction<any, any>) {
    switch(action.type) {
        case Actions.IN_GAME:
            return {...state, inGame: action.data.inGame};
        default:
            return state;
    }
}