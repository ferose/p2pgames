import React from 'react';
import './FourPlay.scss';
import GameCanvas from './GameCanvas';
import {Helmet} from "react-helmet";

import ConnectionPrompt from '../../ConnectionPrompt';
import { UserManager, UserStateType, IUserListener } from '../../networking/UserManager';

interface IFourPlayProps {}
interface IFourPlayState {
    message: JSX.Element;
}

export default class FourPlay extends React.Component<IFourPlayProps, IFourPlayState> implements IUserListener {
    private userManager: UserManager = new UserManager();

    constructor(props: IFourPlayProps) {
        super(props);
        this.state = {
            message: <span></span>,
        }
    }

    componentWillMount() {
        this.userManager.addListener(this);
    }

    componentWillUnmount() {
        this.userManager.removeListener(this);
    }

    public render() {
         return (
            <div className="FourPlay">
                <Helmet>
                    <title>Peer to Peer Games - 4 Play</title>
                </Helmet>

                <div id="alert">
                    {this.state.message}
                </div>
                <GameCanvas userManager={this.userManager} setMessage={message => this.setState({message})}/>

                {this.userManager.getUserState() !== UserStateType.Connected &&
                    <ConnectionPrompt userManager={this.userManager}/>
                }
            </div>
      );
    }
}
