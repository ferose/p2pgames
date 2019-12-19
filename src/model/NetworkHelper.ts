export enum NetworkMessageType {
    Connected = 1,
    Reject,
    Input,
}

export interface INetworkRejectData {
    msg: string;
}

export interface INetworkMessage {
    type: NetworkMessageType;
    data?: Object;
}