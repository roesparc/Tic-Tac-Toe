const gameBoard = (() => {
    let game = [];
    return{game}
})();

const player = (mark) => {
    return {mark}
}

const playerX = player('X');

const playerO = player('O');

const runGame = (() => {
    const _cells = document.querySelectorAll('.cell');
    for (let i = 0; i < _cells.length; i++) {
        const _cell = _cells.item([i])
        _cell.addEventListener('click', () => {
            let _player;
            if (_cell.textContent) {return;}
            if (!gameBoard.game.length
                || gameBoard.game.slice(-1) == 'O') {
                _player = playerX;
            } else {
                _player = playerO;
            }
            gameBoard.game.push(_player.mark);
            _cell.textContent = _player.mark;
        });
    }
})();