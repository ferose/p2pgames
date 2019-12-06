import React from 'react';
import './App.scss';
import GameCanvas from './GameCanvas';
import Banner from './Banner';
import Menu from './Menu';
import Button from 'react-bootstrap/Button';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBars } from '@fortawesome/free-solid-svg-icons'

const App: React.FC = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const [status, setStatus] = React.useState(<span></span>);

  return (
    <div className="App">
      <Banner/>
      <div id="alert">
        {status}
      </div>
      <GameCanvas setStatus={setStatus}/>

      <Button
        variant="primary"
        id="menu-button"
        onClick={() => setModalShow(true)}
      >
        <FontAwesomeIcon icon={faBars} />
      </Button>

      <Menu
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default App;
