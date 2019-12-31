import React from 'react';
import './FourPlay.scss';
import GameCanvas from './GameCanvas';
import {Helmet} from 'react-helmet';
import { connect } from 'react-redux';
import { setAlertMessageAction } from './duck/actions';
import ConnectionPrompt from '../../ConnectionPrompt';
import { UserManager, UserStateType } from '../../networking/UserManager';
import { RootState } from '../../RootReducer';
import { setUserStateAction } from '../../networking/duck/actions';

interface IFourPlayProps {
    message: JSX.Element;
    userState: UserStateType;
}
interface IFourPlayState {
}

class FourPlayClass extends React.Component<IFourPlayProps, IFourPlayState> {
    private userManager: UserManager;

    constructor(props: IFourPlayProps) {
        super(props);
        this.userManager = new UserManager();
    }

    public render() {
         return (
            <div className="FourPlay">
                <Helmet>
                    <title>Peer to Peer Games - 4 Play</title>
                </Helmet>

                <div id="alert">
                    {this.props.message}
                </div>
                <GameCanvas/>

                {this.props.userState !== UserStateType.Connected &&
                    <ConnectionPrompt/>
                }
            </div>
      );
    }

    componentWillUnmount() {
        this.userManager.destroy();
    }
}

export default connect((state:RootState) => {
    return {
        message: state.fourplay.alertMessage,
        userState: state.network.userState,
    }
}, {setAlertMessageAction, setUserStateAction})(FourPlayClass);