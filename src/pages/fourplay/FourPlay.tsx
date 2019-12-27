import React from 'react';
import './FourPlay.scss';
import GameCanvas from './GameCanvas';
import {Helmet} from 'react-helmet';
import { connect } from 'react-redux';
import { setAlertMessageAction } from './duck/actions';
import ConnectionPrompt from '../../ConnectionPrompt';
import { UserManager, UserStateType } from '../../networking/UserManager';
import { RootState } from '../../RootReducer';

interface IFourPlayProps {
    message: JSX.Element;
}
interface IFourPlayState {
}

class FourPlayClass extends React.Component<IFourPlayProps, IFourPlayState> {
    static defaultProps = {
        message: <span></span>
    }

    private userManager: UserManager = new UserManager();

    public render() {
         return (
            <div className="FourPlay">
                <Helmet>
                    <title>Peer to Peer Games - 4 Play</title>
                </Helmet>

                <div id="alert">
                    {this.props.message}
                </div>
                <GameCanvas userManager={this.userManager}/>

                {this.userManager.getUserState() !== UserStateType.Connected &&
                    <ConnectionPrompt/>
                }
            </div>
      );
    }
}

export default connect((state:RootState) => {
    return {
        message: state.fourplay.alertMessage
    }
}, {setAlertMessageAction})(FourPlayClass);