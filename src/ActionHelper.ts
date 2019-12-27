export const ALERT_MESSAGE = 'ALERT_MESSAGE';
export const USER_STATE = 'USER_STATE';

export interface IAction<TTypeName, TAction> {
    type: TTypeName,
    data: TAction
}
