export function initTile() {
    const tileList = [];

    const tile1 = createNewTile(tileList);
    if (Math.random() < 0.1) { tile1.value = 4; }
    tileList.push(tile1);

    const tile2 = createNewTile(tileList);
    if (Math.random() < 0.1) { tile2.value = 4; }
    tileList.push(tile2);

    return tileList;
}

export function createNewTile(tileList) {
    let tile = null;
    
    while (!tile || isTileCollision(tile, tileList)) {
        tile = {
            value: 2,
            row: Math.floor(Math.random() * 4) + 1,
            col: Math.floor(Math.random() * 4) + 1,
        }
    }
    
    return tile;
}

function isTileCollision(newTile, tileList) {
    return tileList.some(tile => tile.row === newTile.row && tile.col === newTile.col);
}