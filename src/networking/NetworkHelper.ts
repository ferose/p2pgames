export enum NetworkMessageType {
    Connected = 1,
    Reject,
    Input,
    Reset,
}

export interface INetworkRejectData {
    msg: string;
}

export interface INetworkMessage {
    type: NetworkMessageType;
    data?: Object;
}