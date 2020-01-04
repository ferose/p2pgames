import QRCode from 'qrcode.react';
import * as React from 'react';
import Spinner from 'react-bootstrap/Spinner';
import { connect } from 'react-redux';
import { UserStateType } from '../networking/UserManager';
import { RootState } from '../RootReducer';
import './ConnectionPrompt.scss';

interface IConnectionPromptProps {
    userState: UserStateType,
    errorMessage?: string,
}
interface IConnectionPromptState {}

class ConnectionPromptClass extends React.Component<IConnectionPromptProps, IConnectionPromptState> {
    constructor(props: IConnectionPromptProps) {
        super(props);
        this.state = {};
    }

    private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    }

    private message() {
        switch (this.props.userState) {
            case UserStateType.NoLink:
                return "Generating URL";
            case UserStateType.WaitingForPeer:
                return "Waiting for player to join";
            case UserStateType.ConnectingToHost:
                return "Connecting to host";
            case UserStateType.Connected:
                return "Connected";
            case UserStateType.Failed:
                return this.props.errorMessage || "Failed to connect";
        }
    }

    private shouldShowInstuctions() {
        return this.props.userState === UserStateType.WaitingForPeer;
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

export default connect((state:RootState) => {
    return {
        userState: state.network.userState,
        errorMessage: state.network.errorMessage
    };
})(ConnectionPromptClass);