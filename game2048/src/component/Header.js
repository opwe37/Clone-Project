import React from 'react';

export default function Header({ score, total }) {
    return (
        <div className="heading">
            <h1 className="title">2048</h1>
            <div className="scores-container">
                <div className="score-container">
                    { total }
                    <div key={total} className="score-addition">+{score}</div>
                </div>
                <div className="best-container">{window.localStorage.getItem('bestScore') ?? 0}</div>
            </div>
        </div>
    );
}