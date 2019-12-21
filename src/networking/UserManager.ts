import { User } from "./User";
import Peer from 'peerjs';
import _ from 'lodash';
import { NetworkMessageType, INetworkMessage, INetworkRejectData } from "./NetworkHelper";

export enum UserStateType {
    NoLink = 1,
    ConnectingToHost,
    WaitingForPeer,
    Connected,
    Failed,
}

export interface IUserListener {
    forceUpdate(): void;
}

export interface INetworkListener {
    onNetworkData(message: INetworkMessage): void;
}

export class UserManager {
    public thisUser?: User;
    public otherUser?: User;
    public errorMessage?: string;

    private peer?: Peer;
    private userStateType: UserStateType = UserStateType.NoLink;
    private listeners: IUserListener[] = [];
    private networkListeners: INetworkListener[] = [];
    private dataConnection?: Peer.DataConnection;
    private hostID?: string;

    public constructor() {
        // this.setUserState(UserStateType.Connected);
        // return;
        this.connect();
    }

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

    public removeListener(listener: IUserListener) {
        _.pull(this.listeners, listener);
    }

    public addNetworkListener(listener: INetworkListener) {
        this.networkListeners.push(listener);
    }

    public removeNetworkListener(listener: INetworkListener) {
        _.pull(this.networkListeners, listener);
    }

    public sendData(networkMessage: INetworkMessage) {
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
        for (const listener of this.networkListeners) {
            listener.onNetworkData(networkMessage);
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
        this.destroyConnections();

        const host = process.env.REACT_APP_PEER_SERVER_HOST;
        const config = {
            debug: 3,
        } as any;
        if (host) {
            [config.host, config.port] = host.split(":");
        }
        const peer = new Peer(id, config);
        this.peer = peer;

        if (window.location.hash && !id) {
            this.setUserState(UserStateType.ConnectingToHost);
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
                    console.error(e);
                    this.errorMessage = `Connection Error: ${e.message}`;
                }
                this.setUserState(UserStateType.Failed);
            });
        }

        peer.on('open', (id) => {
            this.thisUser = new User({id});
            if (!window.location.hash) {
                this.hostID = id;
                history.replaceState(undefined, undefined as any, id);
            }
            if (this.thisIsHost()) {
                this.setUserState(UserStateType.WaitingForPeer);
            }
        });

        peer.on('connection', (conn) => {
            if (this.dataConnection) {
                conn.on('open', () => {
                    conn.send({type: NetworkMessageType.Reject, data: {
                        msg: "Host already connected to another peer",
                    } as INetworkRejectData});
                    setTimeout(() => {
                        conn.close();
                    }, 5000);
                });
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
                    console.error(e);
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
                    this.connect(this.otherUser.id);
                }
                else if (e.type === "unavailable-id") {
                    this.connect();
                }
                else if (e.message) {
                    console.error(e, e.type);
                    this.errorMessage = `Error: ${e.message}`;
                }
            }
            this.setUserState(UserStateType.Failed);
        });
    }
}