import React from 'react';

export default function Header() {
    return (
        <div class="heading">
            <h1 class="title">2048</h1>
            <div class="scores-container">
                <div class="score-container">
                    8
                    <div class="score-addition">+8</div>
                </div>
                <div class="best-container">616</div>
            </div>
        </div>
    );
}