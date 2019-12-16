import { User } from "./User";
import Peer from 'peerjs';
import { NetworkMessageType, INetworkMessage } from "./NetworkHelper";

export enum UserStateType {
    NoLink = 1,
    WaitingForPeer,
    Connected,
    Failed,
}

type Listener = React.Component;

export class UserManager {
    public self: User | null = null;
    public other: User | null = null;
    public errorMessage: string|null = null;

    private userStateType: UserStateType = UserStateType.NoLink;
    private listeners: Listener[] = [];
    private dataConnection?: Peer.DataConnection;

    private setUserState(state: UserStateType) {
        this.userStateType = state;
        for (const listener of this.listeners) {
            listener.forceUpdate();
        }
    }

    public getUserState() {
        return this.userStateType;
    }

    public addListener(listener: Listener) {
        this.listeners.push(listener);
        listener.setState({userStateType: this.userStateType});
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
        }
    }

    private connect() {
        const peer = new Peer(undefined, {
            debug: 3
        });

        if (window.location.hash) {
            this.setUserState(UserStateType.WaitingForPeer);
            this.other = new User({id: window.location.hash.replace("#", "")});
            const conn = peer.connect(this.other.id, {
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
                    this.errorMessage = `Error: ${e.message}`;
                }
                this.setUserState(UserStateType.Failed);
            });
        } else {
            peer.on('open', (id) => {
                this.self = new User({id});
                if (!window.location.hash) {
                    window.location.hash = id;
                    this.setUserState(UserStateType.WaitingForPeer);
                }
            });
        }

        peer.on('connection', (conn) => {
            if (this.dataConnection) {
                conn.send({type: NetworkMessageType.Reject, data: {
                    msg: "Host already connected to another peer",
                }})
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
                    this.errorMessage = `Error: ${e.message}`;
                }
                this.setUserState(UserStateType.Failed);
            });
        });
        peer.on('disconnected', () => {
            console.error('disconnected');
        });
        peer.on('close', () => {
            console.error('close');
        });
        peer.on('error', (e) => {
            if (e && e.message) {
                this.errorMessage = `Error: ${e.message}`;
            }
            this.setUserState(UserStateType.Failed);
        });
    }
}