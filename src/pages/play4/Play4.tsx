import React from 'react';
import './Play4.scss';
import GameCanvas from './GameCanvas';
import {Helmet} from 'react-helmet';
import { connect } from 'react-redux';
import { setAlertMessageAction } from './duck/actions';
import ConnectionPrompt from '../../ConnectionPrompt';
import { UserManager, UserStateType } from '../../networking/UserManager';
import { RootState } from '../../RootReducer';
import { setUserStateAction } from '../../networking/duck/actions';

interface IPlay4Props {
    message: JSX.Element;
    userState: UserStateType;
}
interface IPlay4State {
}

class Play4Class extends React.Component<IPlay4Props, IPlay4State> {
    private userManager: UserManager;

    constructor(props: IPlay4Props) {
        super(props);
        this.userManager = new UserManager();
    }

    public render() {
         return (
            <div className="Play4">
                <Helmet>
                    <title>PVP Games - Play 4</title>
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
        message: state.play4.alertMessage,
        userState: state.network.userState,
    }
}, {setAlertMessageAction, setUserStateAction})(Play4Class);