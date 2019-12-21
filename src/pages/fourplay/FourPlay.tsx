import React from 'react';
import './FourPlay.scss';
import GameCanvas from './GameCanvas';

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

        this.userManager.addListener(this);
    }

    public render() {
         return (
            <div className="FourPlay">
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
