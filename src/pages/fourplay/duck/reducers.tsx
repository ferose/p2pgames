import React from 'react';
import { IAction, ALERT_MESSAGE } from '../../../ActionHelper';

export function fourplayReducer(state={
    alertMessage: <span></span>
}, action: IAction<any, any>) {
    switch(action.type) {
        case ALERT_MESSAGE:
            return {...state, alertMessage: action.data.message};
        default:
            return state;
    }
}