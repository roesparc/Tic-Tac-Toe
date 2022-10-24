const player = (() => {
    const playerX = _createPlayer('X');
    const playerO = _createPlayer('O');

    function _createPlayer(mark) {
        return {mark}
    }
    
    return {playerX, playerO}
})();

const gameBoard = (() => {
    let _board = [];
    let _playerXGame = [];
    let _playerOGame = [];
    const _winningCombinations = [
        [0, 1, 2],
        [3, 4, 5],
        [6, 7, 8],
        [0, 3, 6],
        [1, 4, 7],
        [2, 5, 8],
        [0, 4, 8],
        [2, 4, 6]
    ];

    function boardAdd(mark, cell) {
        _board.push(mark);
        
        cell.textContent = mark;
    }

    function getMark(){
        let _selectedPlayer;

        if (_board.length % 2 === 0) {
            _selectedPlayer = player.playerX;
        } else {
            _selectedPlayer = player.playerO;
        }

        return _selectedPlayer.mark;
    }

    function playerGameAdd(mark, cells, cell) {
        const boardCell = cells.indexOf(cell);

        (mark == 'X') ?
        _playerXGame.push(boardCell)
        :
        _playerOGame.push(boardCell);
    }

    function checkWinner() {
        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_winningCombinations[i].every(c => _playerXGame.includes(c))) {return true;}
        }

        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_winningCombinations[i].every(c => _playerOGame.includes(c))) {return true;}
        }
    }

    // console.log()

    return {boardAdd, getMark, playerGameAdd, checkWinner}
})();

const runGame = (() => {
    const _cells = [...document.querySelectorAll('.cell')];
    
    _cells.forEach(cell => cell.addEventListener('click', () => {
        const mark = gameBoard.getMark();

        if (cell.textContent) {return;}

        if (gameBoard.checkWinner()) {return;}

        gameBoard.boardAdd(mark, cell);

        gameBoard.playerGameAdd(mark, _cells, cell);        
    }));
})();