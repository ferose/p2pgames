import React from 'react';
import './App.scss';
import GameCanvas from './GameCanvas';
import Banner from './Banner';
import Menu from './Menu';

const App: React.FC = () => {
  const [modalShow, setModalShow] = React.useState(false);
  return (
    <div className="App">
      <Banner onMenuClick={() => setModalShow(true)}/>
      <GameCanvas/>

      <Menu
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default App;
