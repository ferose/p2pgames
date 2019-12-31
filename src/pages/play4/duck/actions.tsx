import { Actions, IAction } from '../../../ActionHelper';

export type IAlertMessageAction = IAction<typeof Actions.ALERT_MESSAGE, {message:JSX.Element}>;

export function setAlertMessageAction(message: JSX.Element): IAlertMessageAction {
    return {
        type: Actions.ALERT_MESSAGE,
        data: {
            message
        }
    }
}