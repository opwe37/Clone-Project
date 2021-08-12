import React, { useState } from 'react';
import './App.css';

import Header from './component/Header';
import AboveGame from './component/AboveGame';
import GameContainer from './component/GameContainer';

function App() {
  const [score, setScore] = useState(0);

  return (
    <div className="container">
      <Header score={score} />
      <AboveGame />
      <GameContainer setScore={setScore} />
    </div>
  );
}

export default App;
