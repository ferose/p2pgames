import React from 'react';
import { IAction, Actions } from '../../../ActionHelper';

export function play4Reducer(state={
    alertMessage: <span></span>
}, action: IAction<any, any>) {
    switch(action.type) {
        case Actions.ALERT_MESSAGE:
            return {...state, alertMessage: action.data.message};
        default:
            return state;
    }
}