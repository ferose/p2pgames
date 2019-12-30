export enum Actions {
    RECEIVED_DATA = 'NETWORK_MESSAGE',
    ALERT_MESSAGE = 'ALERT_MESSAGE',
    USER_STATE = 'USER_STATE',
}

export interface IAction<TTypeName, TAction> {
    type: TTypeName,
    data: TAction
}
