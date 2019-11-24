import React from 'react';
import './App.css';
import Board from './Board';
import GameCanvas from './GameCanvas';

const App: React.FC = () => {
  return (
    <div className="App">
      <GameCanvas/>
    </div>
  );
}

export default App;
