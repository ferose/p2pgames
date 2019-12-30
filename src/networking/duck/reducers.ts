import { UserStateType } from "../UserManager";
import { IAction, Actions } from "../../ActionHelper";
import { UserStateData, IPlayerNumberAction } from "./actions";

export function networkReducer(state={
    userState: UserStateType.NoLink
}, action: IAction<any, any>) {
    switch(action.type) {
        case Actions.USER_STATE: {
            const data = action.data as UserStateData;
            return {...state, userState: data.userState};
        }
        case Actions.PLAYER_NUMBER: {
            const data = (action as IPlayerNumberAction).data;
            return {...state, playerNumber: data.playerNumber};
        }
        default:
            return state;
    }
}