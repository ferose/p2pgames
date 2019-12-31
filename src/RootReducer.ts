import { combineReducers, Reducer } from 'redux';
import { IAction } from './ActionHelper';
import { networkReducer } from './networking/duck/reducers';
import { UserStateType } from './networking/UserManager';
import { play4Reducer } from "./pages/play4/duck/reducers";

export type RootState = {
    network: {
        userState: UserStateType,
        errorMessage?: string,
        playerNumber?: number,
    },
    play4: {
        alertMessage: JSX.Element
    }
}

export const rootReducer = combineReducers({
    network: networkReducer,
    play4: play4Reducer
}) as Reducer<RootState, IAction<any, any>>;
