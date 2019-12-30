export enum Actions {
    NETWORK_RECEIVED_DATA = 'NETWORK_RECEIVED_DATA',
    NETWORK_SEND_DATA = 'NETWORK_SEND_DATA',

    ALERT_MESSAGE = 'ALERT_MESSAGE',
    USER_STATE = 'USER_STATE',
}

export interface IAction<TTypeName, TAction> {
    type: TTypeName,
    data: TAction
}
