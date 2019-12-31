import Peer from 'peerjs';
import { Task } from "redux-saga";
import { takeEvery } from 'redux-saga/effects';
import { Actions } from "../ActionHelper";
import { sagaMiddleware, store } from '../Store';
import { INetworkAction, IUserStateAction, setPlayerNumber } from "./duck/actions";
import { INetworkConnectedData, INetworkMessage, INetworkRejectData, NetworkMessageType } from "./NetworkHelper";
import { User } from "./User";

export enum UserStateType {
    NoLink = 1,
    ConnectingToHost,
    WaitingForPeer,
    Connected,
    Failed,
}

export class UserManager {
    public thisUser?: User;
    public otherUser?: User;

    private peer?: Peer;
    private dataConnection?: Peer.DataConnection;
    private hostID?: string;
    private recievedDataTask: Task;
    private sendDataTask: Task;

    /**
     * Make sure destroy() is called on componentWillUnmount() to avoid possible memory leak.
     */
    public constructor() {
        // this.setUserState(UserStateType.Connected);
        // return;
        this.connect();
        this.recievedDataTask = sagaMiddleware.run(this.recievedDataGenerator.bind(this));
        this.sendDataTask = sagaMiddleware.run(this.sendDataGenerator.bind(this));
    }

    private setUserState(userState: UserStateType, errorMessage?: string) {
        store.dispatch({
            type: Actions.USER_STATE,
            data: {
                userState,
                errorMessage,
            }
        } as IUserStateAction);
    }

    public thisIsHost() {
        return this.thisUser?.id === this.hostID;
    }

    private sendData(networkMessage: INetworkMessage) {
        if (!this.dataConnection) {
            console.error("No data connection");
            return;
        }
        this.dataConnection.send(networkMessage);
    }

    private recievedDataListener = (networkAction: INetworkAction) => {
        const networkMessage = networkAction.data;
        switch (networkMessage.type) {
            case NetworkMessageType.Connected:
                this.setUserState(UserStateType.Connected);
                store.dispatch(setPlayerNumber((networkMessage.data as INetworkConnectedData).player));
                break;
            case NetworkMessageType.Reject:
                const data = networkMessage.data as INetworkRejectData;
                if (data) {
                    this.setUserState(UserStateType.Failed, data.msg);
                }
                break;
        }
    }

    private sendDataListener = (networkAction: INetworkAction) => {
        const networkMessage = networkAction.data;
        this.sendData(networkMessage);
    }

    private *recievedDataGenerator() {
        yield takeEvery(Actions.NETWORK_RECEIVED_DATA, this.recievedDataListener);
    }

    private *sendDataGenerator() {
        yield takeEvery(Actions.NETWORK_SEND_DATA, this.sendDataListener);
    }

    private recievedData(networkMessage: INetworkMessage) {
        store.dispatch({
            type: Actions.NETWORK_RECEIVED_DATA,
            data: networkMessage,
        });
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
                // Player 0 is host
                this.sendData({type: NetworkMessageType.Connected,
                    data: {
                        player: 0
                    } as INetworkConnectedData
                });
            });
            conn.on('error', (e) => {
                if (e && e.message) {
                    console.error(e);
                    this.setUserState(UserStateType.Failed, `Connection Error: ${e.message}`);
                } else {
                    this.setUserState(UserStateType.Failed);
                }
            });
        }

        peer.on('open', (id) => {
            this.thisUser = new User({id});
            if (!window.location.hash) {
                this.hostID = id;
                window.history.replaceState(undefined, undefined as any, "#" + id);
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
                this.sendData({type: NetworkMessageType.Connected,
                    data: {
                        player: 1
                    } as INetworkConnectedData
                });
            });
            conn.on('error', (e) => {
                if (e && e.message) {
                    console.error(e);
                    this.setUserState(UserStateType.Failed, `Remote Connection Error: ${e.message}`);
                    this.dataConnection?.close();
                    this.dataConnection = undefined;
                } else {
                    this.setUserState(UserStateType.Failed);
                }
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
            let errorMessage = undefined;
            if (e) {
                if (this.otherUser && e.type === "peer-unavailable") {
                    this.connect(this.otherUser.id);
                }
                else if (e.type === "unavailable-id") {
                    this.connect();
                }
                else if (e.message) {
                    console.error(e, e.type);
                    errorMessage = `Error: ${e.message}`;
                }
            }
            this.setUserState(UserStateType.Failed, errorMessage);
        });
    }

    private destroyConnections() {
        this.peer?.destroy();
        this.dataConnection?.close();
        this.dataConnection = undefined;
        this.peer = undefined;
        this.thisUser = undefined;
        this.otherUser = undefined;
    }

    public destroy() {
        this.destroyConnections();
        this.recievedDataTask.cancel();
        this.sendDataTask.cancel();
    }
}