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
            case UserStateType.ConnectingToHost:
                return "Connecting to host";
            case UserStateType.Connected:
                return "Connected";
            case UserStateType.Failed:
                return this.props.userManager.errorMessage || "Failed to connect";
        }
    }

    private shouldShowInstuctions() {
        const userState = this.props.userManager.getUserState()
        return userState === UserStateType.WaitingForPeer;
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

                    {this.shouldShowInstuctions() &&
                        <>
                        <QRCode className="qr" value={thisURL} />
                        <input
                            className="connection-url-input"
                            readOnly
                            value={thisURL}
                            onFocus={this.handleFocus}
                        />
                        <div className="connection-instruction">Share this URL, scan the barcode or Airdrop it to your friend to connect with them.</div>
                        </>
                    }
                </div>
            </div>
        )
    }
}
