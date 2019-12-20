import * as React from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import './App.scss';

import Menu from './Menu';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'
import Banner from './Banner';
import FourPlay from './FourPlay';

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
           <BrowserRouter>
            <div className="App">
                <Banner/>
                <Switch>
                 <Route path="/" component={FourPlay} exact/>
                 <Route path="/4play" component={FourPlay}/>
               </Switch>

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
          </BrowserRouter>
        );
    }
}
