import { IAction, Actions } from "../../ActionHelper";
import { UserStateType } from "../UserManager";
import { INetworkMessage } from "../NetworkHelper";

export type UserStateData = {userState: UserStateType, errorMessage?: string};
export type IUserStateAction = IAction<typeof Actions.USER_STATE, UserStateData>;
export type INetworkAction = IAction<typeof Actions.NETWORK_RECEIVED_DATA | typeof Actions.NETWORK_SEND_DATA, INetworkMessage>;
export type PlayerNumberAction = ReturnType<typeof setPlayerNumber>;

export function setPlayerNumber(playerNumber: number) {
    return {
        type: Actions.PLAYER_NUMBER,
        data: {
            playerNumber,
        }
    }
}

export function setUserStateAction(userState: UserStateType): IUserStateAction {
    return {
        type: Actions.USER_STATE,
        data: {
            userState,
        }
    }
}