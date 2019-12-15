import * as React from 'react';
import './ConnectionPrompt.scss';
import Spinner from 'react-bootstrap/Spinner';
import QRCode from 'qrcode.react';

interface IConnectionPromptProps {}
interface IConnectionPromptState {}

export default class ConnectionPrompt extends React.Component<IConnectionPromptProps, IConnectionPromptState> {
    private handleFocus = (event: React.FocusEvent<HTMLInputElement>) => {
        event.target.select();
    }

    public render() {
        const thisURL = "http://localhost:3000/";
        return (
            <div className="ConnectionPrompt">
                <div className="connection-alert">
                    <Spinner animation="border" role="status">
                        <span className="sr-only">Loading...</span>
                    </Spinner>
                    <div>Waiting for player to join</div>
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
