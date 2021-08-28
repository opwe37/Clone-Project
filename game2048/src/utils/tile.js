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

let currentId = 0;
export function createNewTile(tileList) {
    let tile = null;
    
    while (!tile || (tileList && isTileCollision(tile, tileList))) {
        tile = {
            id: currentId++,

            value: 2,
            row: Math.floor(Math.random() * 4) + 1,
            col: Math.floor(Math.random() * 4) + 1,

            isMerged: false,
            isNew: true,
            isDisabled: false,
        }
    }
    
    return tile;
}

function isTileCollision(newTile, tileList) {
    return tileList.some(tile => tile.row === newTile.row && tile.col === newTile.col);
}

export function moveTile({ tileList, row, col }) {
    const isMoveCol = col !== 0;
    const isMinus = row + col < 0;

    const sortedTileList = tileList
        .filter(item => !item.isDisabled)
        .map(item => ( { ...item, isMerged: false, isNew: false } ))
        .sort((a, b) => {
            // 좌우 키가 눌렸다면? 1차적으로 같은 row 끼리 뭉쳐있어야 함
            //                    row 기준 정렬 필요(정렬 방식 상관 X)
            const res = isMoveCol ? a.row - b.row : a.col - b.col;
            if (res) {
                return res;
            } else {
                if (isMoveCol) {
                    return isMinus ? a.col - b.col : b.col - a.col;
                } else {
                    return isMinus ? a.row - b.row : b.row - a.row;
                }
            }
        });

    // 키 방향으로 타일 밀착
    let isMoved = false;
    const initPos = isMinus ? 1 : 4;
    let pos = initPos;
    for (let i = 0; i < sortedTileList.length; i++) {
        if (isMoveCol) {
            if (sortedTileList[i].col !== pos) { isMoved = true }
            sortedTileList[i].col = pos;
            pos = isMinus ? pos + 1 : pos - 1;

            if (sortedTileList[i].row !== sortedTileList[i + 1]?.row) { pos = initPos; }
        } else {
            if (sortedTileList[i].row !== pos) { isMoved = true }
            sortedTileList[i].row = pos;
            pos = isMinus ? pos + 1 : pos - 1;

            if (sortedTileList[i].col !== sortedTileList[i + 1]?.col) { pos = initPos; }
        }
    }

    let isMerged = false;
    const newTileList = [...sortedTileList];
    let blankPos = 0;
    for (let i = 0; i < sortedTileList.length; i++) {
        if (sortedTileList[i].isDisabled) { continue; }
        
        // 해당 타일 앞에서 병합이 이뤄졌고
        // 병합이 수행된 줄이 같은 줄 일때, 현재 타일을 병합으로 인해 생긴 빈 공간으로 이동
        if (blankPos && 
            (isMoveCol 
                ? sortedTileList[i].row === sortedTileList[i-1]?.row 
                : sortedTileList[i].col === sortedTileList[i-1]?.col
            )) {
            if (isMoveCol) {
                sortedTileList[i].col = blankPos;
            } else {
                sortedTileList[i].row = blankPos;
            }
            blankPos = isMinus ? blankPos + 1 : blankPos - 1;
        } else {
            blankPos = 0;
        }

        if ((isMoveCol 
                ? sortedTileList[i].row === sortedTileList[i+1]?.row 
                : sortedTileList[i].col === sortedTileList[i+1]?.col
            ) && sortedTileList[i].value === sortedTileList[i+1]?.value) {
            isMerged = true;

            const tile = createNewTile();
            tile.row = sortedTileList[i].row;
            tile.col = sortedTileList[i].col;
            tile.value = sortedTileList[i].value * 2;
            tile.isMerged = true;
            tile.isNew = false;
            newTileList.push(tile);

            // 다음 moveTile() 호출 시 만들어지는 새 타일 리스트에 포함되지 않도록 설정
            sortedTileList[i].isDisabled = true;
            sortedTileList[i+1].isDisabled = true;
            
            // 병합된 타일을 겹치게 만들고
            // 겹쳐지면서 만들어지는 빈 공간을 이후 타일이 존재할 시 채우기 위해 blankPos 변수 활용
            if (isMoveCol) {
                blankPos = sortedTileList[i+1].col;
                sortedTileList[i+1].col = sortedTileList[i].col;
            } else {
                blankPos = sortedTileList[i+1].row;
                sortedTileList[i+1].row = sortedTileList[i].row;
            }
        } 
    }

    return [newTileList, isMerged || isMoved];
}