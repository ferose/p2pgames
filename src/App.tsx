import React, { RefObject } from 'react';
import './App.scss';
import GameCanvas from './GameCanvas';
import Banner from './Banner';
import Menu from './Menu';

const App: React.FC = () => {
  const [modalShow, setModalShow] = React.useState(false);
  const gameCanvasRef: RefObject<GameCanvas> = React.createRef();

  function requestfullscreen() {
    if (!gameCanvasRef.current) return;
    gameCanvasRef.current.requestfullscreen();
  }

  return (
    <div className="App">
      <Banner
        onMenuClick={() => setModalShow(true)}
      />
      <GameCanvas ref={gameCanvasRef}/>

      <Menu
        requestfullscreen={requestfullscreen}
        show={modalShow}
        onHide={() => setModalShow(false)}
      />
    </div>
  );
}

export default App;
