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

    function boardAdd(mark) {
        _board.push(mark);
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

    return{boardAdd, getMark}
})();

const runGame = (() => {
    const _cells = document.querySelectorAll('.cell');
    
    _cells.forEach(cell => cell.addEventListener('click', () => {
        if (cell.textContent) {return;}

        const mark = gameBoard.getMark();

        gameBoard.boardAdd(mark);
        
        cell.textContent = mark;
    }));
})();