import * as React from 'react';
import './ConnectionPrompt.scss';
import Spinner from 'react-bootstrap/Spinner';
import QRCode from 'qrcode.react';
import { UserManager, UserStateType } from './model/UserManager';

interface IConnectionPromptProps {
    userManager: UserManager;
}
interface IConnectionPromptState {}

export default class ConnectionPrompt extends React.Component<IConnectionPromptProps, IConnectionPromptState> {
    constructor(props: IConnectionPromptProps) {
        super(props);
        this.state = {};
        this.props.userManager.addListener(this);
    }

    private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    }

    private message() {
        switch (this.props.userManager.getUserState()) {
            case UserStateType.NoLink:
                return "Generating URL";
            case UserStateType.WaitingForPeer:
                return "Waiting for player to join";
            case UserStateType.Connected:
                return "Connected";
            case UserStateType.Failed:
                return this.props.userManager.errorMessage || "Failed to connect";
        }
    }

    public render() {
        const thisURL = window.location.href;
        return (
            <div className="ConnectionPrompt">
                <div className="connection-alert">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    <div>{this.message()}</div>
                    <QRCode className="qr" value={thisURL} />
                    <input
                        className="connection-url-input"
                        readOnly
                        value={thisURL}
                        onFocus={this.handleFocus}
                    />
                </div>
            </div>
        )
    }
}
