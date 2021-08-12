import React, { useEffect, useState } from 'react';
import { addKey, removeKey } from '../utils/keyboard';
import { createNewTile, initTile, moveTile } from '../utils/tile';

export default function GameContainer({ setScore, setTotal }) {
    const [tileList, setTileList] = useState(initTile);

    function moveAndCreate({ row, col }) {
        const movedTileList = moveTile({ tileList, row, col });

        const score = movedTileList.reduce((acc, tile) => tile.isMerged ? acc + tile.value : acc, 0);
        setScore(score);
        setTotal(t => t + score);
        
        const newTile = createNewTile(movedTileList);
        movedTileList.push(newTile);
        setTileList(movedTileList);
    }

    useEffect(() => {
        addKey('up', pressKeyUp);
        addKey('down', pressKeyDown);
        addKey('left', pressKeyLeft);
        addKey('right', pressKeyRight);

        return () => {
            removeKey('up', pressKeyUp);
            removeKey('down', pressKeyDown);
            removeKey('left', pressKeyLeft);
            removeKey('right', pressKeyRight);
        };
    });

    function pressKeyUp() { moveAndCreate({ row: -1, col: 0 }); }
    function pressKeyDown() { moveAndCreate({ row: 1, col: 0 }); }
    function pressKeyLeft() { moveAndCreate({ row: 0, col: -1 }); }
    function pressKeyRight() { moveAndCreate({ row: 0, col: 1 }); }

    return (
        <div className="game-container">

            <div className="game-message">

                <p></p>
                <div className="lower">
                    <a href="/" className="keep-playing-button">Keep going</a>
                    <a href="/" className="retry-button">Try again</a>
                </div>

            </div>

            <div className="grid-container">

                { new Array(4).fill(0).map( (_, idx) => (
                    <div key={idx} className="grid-row">
                        { new Array(4).fill(0).map( (_, idx) => (
                            <div key={idx} className="grid-cell"></div>
                        )) }
                    </div>
                )) }

            </div>
            
            <div className="tile-container">
                { tileList.map(tile => (
                    <div key={tile.id} className={`tile tile-${tile.value} tile-position-${tile.col}-${tile.row} ${tile.isMerged ? 'tile-merged' : ''} ${tile.isNew ? 'tile-new' : ''}`}>
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