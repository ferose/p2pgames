export enum NetworkMessageType {
    Connected = 1,
    Reject,
}

export interface INetworkMessage {
    type: NetworkMessageType;
    data?: Object;
}