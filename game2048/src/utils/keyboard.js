import hotkeys from 'hotkeys-js';

const observerMap = {};

export function addKey(key, func) {
    if (!observerMap[key]) {
        observerMap[key] = [];
        hotkeys(key, () => execFuncs(key));
    }
    observerMap[key].push(func);
}

export function removeKey(key, func) {
    observerMap[key] = observerMap[key].filter(item => item !== func);
}

function execFuncs(key) {
    for (const func of observerMap[key]) {
        func();
    }
}