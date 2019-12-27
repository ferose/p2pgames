import React from 'react';
import './FourPlay.scss';
import GameCanvas from './GameCanvas';
import {Helmet} from 'react-helmet';
import { connect } from 'react-redux';
import { setAlertMessageAction } from './duck/actions';
import ConnectionPrompt from '../../ConnectionPrompt';
import { UserManager, UserStateType, IUserListener } from '../../networking/UserManager';

interface IFourPlayProps {
    message: JSX.Element;
}
interface IFourPlayState {
}

class FourPlayClass extends React.Component<IFourPlayProps, IFourPlayState> implements IUserListener {
    static defaultProps = {
        message: <span></span>
    }

    private userManager: UserManager = new UserManager();

    componentDidMount() {
        this.userManager.addListener(this);
    }

    componentDidUnmount() {
        this.userManager.removeListener(this);
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
                <GameCanvas userManager={this.userManager} setMessage={message => this.setState({message})}/>

                {this.userManager.getUserState() !== UserStateType.Connected &&
                    <ConnectionPrompt userManager={this.userManager}/>
                }
            </div>
      );
    }
}

const mapStateToProps = (state:{alertMessage: JSX.Element}) => {
    return {
        message: state.alertMessage
    }
}

export default connect(mapStateToProps, {setAlertMessageAction} )(FourPlayClass);