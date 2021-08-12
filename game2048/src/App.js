import React, { useEffect, useRef, useState } from 'react';
import './App.css';

import Header from './component/Header';
import AboveGame from './component/AboveGame';
import GameContainer from './component/GameContainer';

function App() {
  const [total, setTotal] = useState(0);
  const [bestScore, setBestScore] = useState(0);
  const score = useRef(0);

  function changeScore(s) {
    score.current = s;
  }

  useEffect(() => {
    const preVal = window.localStorage.getItem('bestScore');
    if (preVal) { setBestScore(preVal) }
    
    return () => {
      window.localStorage.removeItem('bestScore');
    }
  }, []);

  useEffect(() => {
    const currentBest = window.localStorage.getItem('bestScore');
    if (total > currentBest) {
      window.localStorage.setItem('bestScore', total);
      setBestScore(total)
    }
  }, [total]);

  return (
    <div className="container">
      <Header score={score.current} total={total} />
      <AboveGame />
      <GameContainer setScore={changeScore} setTotal={setTotal} />
    </div>
  );
}

export default App;
