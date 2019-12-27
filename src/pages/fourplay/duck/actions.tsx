import {IAction} from '../../../utilities/ActionHelper'

export const ALERT_MESSAGE = 'ALERT_MESSAGE';

export type IAlertMessageAction = IAction<typeof ALERT_MESSAGE, {message:JSX.Element}>;

export function setAlertMessageAction(message: JSX.Element): IAlertMessageAction {
    return {
        type: ALERT_MESSAGE,
        data: {
            message
        }
    }
}