import React from 'react';
import './App.scss';
import GameCanvas from './GameCanvas';
import Banner from './Banner';
import Menu from './Menu';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import ConnectionPrompt from './ConnectionPrompt';
import { UserManager, UserStateType, IUserListener } from './model/UserManager';

interface IAppProps {}
interface IAppState {
    modalShow: boolean;
    message: JSX.Element;
}

export default class App extends React.Component<IAppProps, IAppState> implements IUserListener {
    private userManager: UserManager = new UserManager();

    constructor(props: IAppProps) {
        super(props);
        this.state = {
            message: <span></span>,
            modalShow: false,
        }

        this.userManager.addListener(this);
    }

    public render() {
         return (
            <div className="App">
            <Banner/>
            <div id="alert">
                {this.state.message}
            </div>
            <GameCanvas userManager={this.userManager} setMessage={message => this.setState({message})}/>

            {this.userManager.getUserState() !== UserStateType.Connected &&
                <ConnectionPrompt userManager={this.userManager}/>
            }

            <Button
                variant="primary"
                id="menu-button"
                onClick={() => this.setState({modalShow: true})}
            >
                <FontAwesomeIcon icon={faBars} />
            </Button>

            <Menu
                show={this.state.modalShow}
                onHide={() => this.setState({modalShow: false})}
            />
            </div>
      );
    }
}
