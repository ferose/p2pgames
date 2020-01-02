import { faBars } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import * as React from 'react';
import Button from 'react-bootstrap/Button';
import { BrowserRouter, Route, Switch, Link } from 'react-router-dom';
import './App.scss';
import Banner from './Banner';
import Menu from './Menu';
import Play4 from './pages/play4/Play4';
import { Homepage } from './pages/homepage/Homepage';
import { Markdown } from './pages/Markdown';
import { NotFound } from './pages/notfound/NotFound';
import { Provider } from "react-redux";
import { store } from './Store';
import { JumpKick } from './pages/jumpkick/JumpKick';

interface IAppProps {
}

interface IAppState {
    modalShow: boolean;
}

export default class App extends React.Component<IAppProps, IAppState> {
    constructor(props: IAppProps) {
        super(props);
        this.state = {
            modalShow: false,
        }
    }

    public render() {
        return (
            <Provider store={store}>
                <BrowserRouter forceRefresh={true}>
                    <div className="App">
                        <Banner/>
                        <div className="main-content">
                        <Switch>
                            <Route path="/" component={Homepage} exact/>
                            <Route path="/play4" component={Play4}/>
                            <Route path="/jumpkick" component={JumpKick}/>
                            <Route path="/support" render={(props) => <Markdown {...props} name="Support" />}/>
                            <Route component={NotFound}/>
                        </Switch>
                        </div>

                    <Button
                            variant="primary"
                            id="menu-button"
                            onClick={() => this.setState({modalShow: true})}>
                            <FontAwesomeIcon icon={faBars} />
                        </Button>

                        <Link to="/" id="home-button" target="_blank">
                            <img src="/img/icon.svg" alt="Games"/>
                        </Link>

                        <Menu
                            show={this.state.modalShow}
                            onHide={() => this.setState({modalShow: false})}
                        />
                    </div>
                </BrowserRouter>
            </Provider>

        );
    }
}
