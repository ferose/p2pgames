import { User } from "./User";
import Peer from 'peerjs';
import { NetworkMessageType, INetworkMessage, INetworkRejectData } from "./NetworkHelper";

export enum UserStateType {
    NoLink = 1,
    WaitingForPeer,
    Connected,
    Failed,
}

export interface IUserListener {
    forceUpdate() : void;
}

export class UserManager {
    public thisUser?: User;
    public otherUser?: User;
    public errorMessage?: string;

    private peer?: Peer;
    private userStateType: UserStateType = UserStateType.NoLink;
    private listeners: IUserListener[] = [];
    private dataConnection?: Peer.DataConnection;
    private hostID?: string;

    private setUserState(state: UserStateType) {
        this.userStateType = state;
        for (const listener of this.listeners) {
            listener.forceUpdate();
        }
    }

    public thisIsHost() {
        return this.thisUser?.id === this.hostID;
    }

    public getUserState() {
        return this.userStateType;
    }

    public addListener(listener: IUserListener) {
        this.listeners.push(listener);
    }

    public constructor() {
        this.connect();
    }

    private sendData(networkMessage: INetworkMessage) {
        if (!this.dataConnection) {
            console.error("No data connection");
            return;
        }
        this.dataConnection.send(networkMessage);
    }

    private recievedData(networkMessage: INetworkMessage) {
        switch (networkMessage.type) {
            case NetworkMessageType.Connected:
                this.setUserState(UserStateType.Connected);
                break;
            case NetworkMessageType.Reject:
                const data = networkMessage.data as INetworkRejectData;
                if (data) {
                    this.errorMessage = data.msg;
                    this.setUserState(UserStateType.Failed);
                }
                break;
        }
    }

    private destroyConnections() {
        this.peer?.destroy();
        this.dataConnection?.close();
        this.dataConnection = undefined;
        this.peer = undefined;
        this.thisUser = undefined;
        this.otherUser = undefined;
    }

    private connect(id?: string) {
        const peer = new Peer(id, {
            debug: 3
        });
        this.peer = peer;

        if (window.location.hash && !id) {
            this.setUserState(UserStateType.WaitingForPeer);
            this.hostID = window.location.hash.replace("#", "");
            this.otherUser = new User({id: this.hostID});
            const conn = peer.connect(this.otherUser.id, {
                reliable: true,
            });
            this.dataConnection = conn;
            conn.on('data', (data) => {
                this.recievedData(data);
            });
            conn.on('open', () => {
                this.sendData({type: NetworkMessageType.Connected});
            });
            conn.on('error', (e) => {
                if (e && e.message) {
                    this.errorMessage = `Connection Error: ${e.message}`;
                }
                this.setUserState(UserStateType.Failed);
            });
        }

        peer.on('open', (id) => {
            this.thisUser = new User({id});
            if (!window.location.hash) {
                this.hostID = id;
                window.location.hash = id;
                this.setUserState(UserStateType.WaitingForPeer);
            }
        });

        peer.on('connection', (conn) => {
            if (this.dataConnection) {
                conn.send({type: NetworkMessageType.Reject, data: {
                    msg: "Host already connected to another peer",
                } as INetworkRejectData})
                conn.close();
                return;
            };
            this.dataConnection = conn;
            conn.on('data', (data) => {
                this.recievedData(data);
            });
            conn.on('open', () => {
                this.sendData({type: NetworkMessageType.Connected});
            });
            conn.on('error', (e) => {
                if (e && e.message) {
                    this.errorMessage = `Remote Connection Error: ${e.message}`;
                    this.dataConnection?.close();
                    this.dataConnection = undefined;
                }
                this.setUserState(UserStateType.Failed);
            });
        });
        peer.on('disconnected', () => {
            if (!peer.destroyed) {
                peer.reconnect();
            }
            console.error('disconnected');
        });
        peer.on('close', () => {
            console.error('close');
        });
        peer.on('error', (e) => {
            if (e) {
                if (this.otherUser && e.type === "peer-unavailable") {
                    this.destroyConnections();
                    this.connect(this.otherUser.id);
                    return;
                }
                if (e.message) {
                    this.errorMessage = `Error: ${e.message}`;
                }
            }
            this.setUserState(UserStateType.Failed);
        });
    }
}