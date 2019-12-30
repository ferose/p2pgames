import * as React from 'react';
import { takeEvery } from 'redux-saga/effects'
import { Task } from "redux-saga";
import { INetworkMessage } from './NetworkHelper';
import { store, sagaMiddleware } from '../Store';
import { Actions } from '../ActionHelper';
import { INetworkAction } from './duck/actions';

/**
 * Allows sending and recieving data to other players.
 * A UserManager must be alive for these components to function.
 * Make sure super is called when overriding componentWillUnmount().
 */
export abstract class NetworkComponent<TProps = {}, TState = {}> extends React.Component<TProps, TState> {
    private recievedDataTask: Task;

    public constructor(props: TProps) {
        super(props);
        this.recievedDataTask = sagaMiddleware.run(this.recievedDataGenerator.bind(this));
    }

    private recievedDataListener = (networkAction: INetworkAction) => {
        const networkMessage = networkAction.data;
        this.onRecievedData(networkMessage);
    }

    private *recievedDataGenerator() {
        yield takeEvery(Actions.NETWORK_RECEIVED_DATA, this.recievedDataListener);
    }

    protected sendData = (networkData: INetworkMessage) => {
        store.dispatch({
            type: Actions.NETWORK_SEND_DATA,
            data: networkData,
        });
    }

    protected abstract onRecievedData(networkData: INetworkMessage): void;

    componentWillUnmount() {
        this.recievedDataTask.cancel();
    }
}
