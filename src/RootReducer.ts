import { combineReducers, Reducer } from 'redux';
import { IAction } from './ActionHelper';
import { networkReducer } from './networking/duck/reducers';
import { UserStateType } from './networking/UserManager';
import { play4Reducer } from "./pages/play4/duck/reducers";
import { generalReducer } from './duck/reducers';

export type RootState = {
    general: {
        gameName?: string,
    }
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
    general: generalReducer,
    network: networkReducer,
    play4: play4Reducer
}) as Reducer<RootState, IAction<any, any>>;
