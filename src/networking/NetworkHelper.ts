export enum NetworkMessageType {
    Connected = 1,
    Reject,
    Input,
    Reset,
}

export interface INetworkRejectData {
    msg: string;
}

export interface INetworkConnectedData {
    // Player number of the person receiving the request
    player: number;
}

export interface INetworkMessage {
    type: NetworkMessageType;
    data?: Object;
}