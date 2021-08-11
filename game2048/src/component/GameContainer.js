import React, { useState } from 'react';

export default function GameContainer() {
    const [tileList, setTileList] = useState([
        {value: 2, row: 4, col: 1},
        {value: 2, row: 4, col: 1},
        {value: 4, row: 4, col: 1},
        {value: 8, row: 4, col: 3},
        {value: 2, row: 4, col: 4},
        {value: 2, row: 3, col: 4},
    ]);

    return (
        <div className="game-container">

            <div className="game-message">

                <p></p>
                <div class="lower">
                    <a href="/" className="keep-playing-button">Keep going</a>
                    <a href="/" className="retry-button">Try again</a>
                </div>

            </div>

            <div className="grid-container">

                { new Array(4).fill(0).map( _ => (
                    <div className="grid-row">
                        { new Array(4).fill(0).map( _ => (
                            <div className="grid-cell"></div>
                        )) }
                    </div>
                )) }

            </div>
            
            <div class="tile-container">
                { tileList.map(tile => (
                    <div className={`tile tile-${tile.value} tile-position-${tile.col}-${tile.row}`}>
                        <div className="tile-inner">{tile.value}</div>
                    </div>
                )) }
                {/* 
                합쳐지거나 새로 만들어지는 타일이 있을 때, 아래처럼 표시해야 함
                <div class="tile tile-4 tile-position-1-4 tile-merged">
                    <div class="tile-inner">4</div>
                </div>
                <div class="tile tile-2 tile-position-4-3 tile-new">
                    <div class="tile-inner">2</div>
                </div>
                 */}
            </div>
        </div>
    );
}