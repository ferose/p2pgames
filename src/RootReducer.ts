import { combineReducers } from 'redux';
import { fourplayReducer } from "./pages/fourplay/duck/reducers";
import { networkReducer } from './networking/duck/reducers';
import { UserStateData } from './networking/duck/actions';

export type RootState = {
    network: UserStateData,
    fourplay: {
        alertMessage: JSX.Element
    }
}

export const rootReducer = combineReducers({
    network: networkReducer,
    fourplay: fourplayReducer
});
