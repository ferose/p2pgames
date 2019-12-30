import { IAction, Actions } from "../../ActionHelper";
import { UserStateType } from "../UserManager";

export type UserStateData = {userState: UserStateType, errorMessage?: string};
export type IUserStateAction = IAction<typeof Actions.USER_STATE, UserStateData>;

export function setUserStateAction(userState: UserStateType): IUserStateAction {
    return {
        type: Actions.USER_STATE,
        data: {
            userState
        }
    }
}