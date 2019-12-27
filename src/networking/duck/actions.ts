import { IAction, USER_STATE } from "../../ActionHelper";
import { UserStateType } from "../UserManager";

export type UserStateData = {userState: UserStateType, errorMessage?: string};
export type IUserStateAction = IAction<typeof USER_STATE, UserStateData>;

export function setUserStateAction(userState: UserStateType): IUserStateAction {
    return {
        type: USER_STATE,
        data: {
            userState
        }
    }
}