import { combineReducers, Reducer } from 'redux';
import { IAction } from './ActionHelper';
import { networkReducer } from './networking/duck/reducers';
import { UserStateType } from './networking/UserManager';
import { fourplayReducer } from "./pages/fourplay/duck/reducers";

export type RootState = {
    network: {
        userState: UserStateType,
        errorMessage?: string,
        playerNumber?: number,
    },
    fourplay: {
        alertMessage: JSX.Element
    }
}

export const rootReducer = combineReducers({
    network: networkReducer,
    fourplay: fourplayReducer
}) as Reducer<RootState, IAction<any, any>>;
