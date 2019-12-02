import React from 'react';
import './App.scss';
import GameCanvas from './GameCanvas';
import Banner from './Banner';

const App: React.FC = () => {
  return (
    <div className="App">
      <Banner/>
      <GameCanvas/>
    </div>
  );
}

export default App;
