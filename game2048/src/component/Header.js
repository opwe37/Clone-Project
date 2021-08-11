import React from 'react';

export default function Header() {
    return (
        <div className="heading">
            <h1 className="title">2048</h1>
            <div className="scores-container">
                <div className="score-container">
                    8
                    <div className="score-addition">+8</div>
                </div>
                <div className="best-container">616</div>
            </div>
        </div>
    );
}