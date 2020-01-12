import React from 'react';
import './Play4.scss';
import GameCanvas from './GameCanvas';
import {Helmet} from 'react-helmet';
import { connect } from 'react-redux';
import ConnectionPrompt from '../../components/ConnectionPrompt';
import { UserManager, UserStateType } from '../../networking/UserManager';
import { RootState } from '../../RootReducer';
import { store } from '../../Store';
import { setGameNameAction } from '../../duck/actions';

interface IPlay4Props {
    message: JSX.Element;
    userState: UserStateType;
}
interface IPlay4State {
}

export const PLAY4_ID = "play4";

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

    componentDidMount() {
        store.dispatch(setGameNameAction(PLAY4_ID));
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
}, {})(Play4Class);