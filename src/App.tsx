import React, { RefObject } from 'react';
import './App.scss';
import GameCanvas from './GameCanvas';
import Banner from './Banner';
import Menu from './Menu';
import Button from 'react-bootstrap/Button';

const App: React.FC = () => {
  const [modalShow, setModalShow] = React.useState(false);

  return (
    <div className="App">
      <Banner/>
      <div id="alert">
        Game status goes here.
      </div>
      <GameCanvas/>

      <Button id="menu-button" onClick={() => setModalShow(true)}>Menu</Button>

      <Menu
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default App;
