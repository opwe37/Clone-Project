import React from 'react';

export default function GameContainer() {
    return (
        <div class="game-container">
            <div class="game-message">
                <p></p>
                <div class="lower">
                    <a href="/" class="keep-playing-button">Keep going</a>
                    <a href="/" class="retry-button">Try again</a>
                </div>
            </div>
            <div class="grid-container">
                <div class="grid-row">
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                </div>
                
                <div class="grid-row">
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                </div>
                
                <div class="grid-row">
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                </div>
                
                <div class="grid-row">
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                    <div class="grid-cell"></div>
                </div>
            </div>
            
            <div class="tile-container">
                <div class="tile tile-2 tile-position-1-4">
                    <div class="tile-inner">2</div>
                </div>
                <div class="tile tile-2 tile-position-1-4">
                    <div class="tile-inner">2</div>
                </div>
                <div class="tile tile-4 tile-position-1-4 tile-merged">
                    <div class="tile-inner">4</div>
                </div>
                <div class="tile tile-8 tile-position-3-4">
                    <div class="tile-inner">8</div>
                </div>
                <div class="tile tile-2 tile-position-4-3 tile-new">
                    <div class="tile-inner">2</div>
                </div>
                <div class="tile tile-2 tile-position-4-4">
                    <div class="tile-inner">2</div>
                </div>
            </div>
        </div>
    );
}