const player = (() => {
    let _playerX;
    let _playerO;

    function _createPlayer(mark, name) {
        return {mark, name}
    }

    function setName(playerXName, playerOName) {
        _playerX = _createPlayer('X', playerXName.value);

        _playerO = _createPlayer('O', playerOName.value);
    }

    function playerXMark() {
        return _playerX.mark;
    }

    function playerXName() {
        return _playerX.name;
    }

    function playerOMark() {
        return _playerO.mark;
    }

    function playerOName() {
        return _playerO.name;
    }
    
    return {
        setName,
        playerXMark,
        playerXName,
        playerOMark,
        playerOName
    }
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

    function play(cells, cell, announce) {
        const mark = _getMark();

        if (_checkWinner(announce)) {return;}

        if (cell.textContent) {return;}

        _boardAdd(mark, cell);

        _playerGameAdd(mark, cells, cell);

        _announcePlayer(mark, announce);

        _checkTie(announce);

        _checkWinner(announce);
    }

    function _getMark(){
        let _playerMark;

        if (_board.length % 2 === 0) {
            _playerMark = player.playerXMark();
        } else {
            _playerMark = player.playerOMark();
        }

        return _playerMark;
    }

    function _boardAdd(mark, cell) {
        _board.push(mark);
        
        cell.textContent = mark;
    }

    function _playerGameAdd(mark, cells, cell) {
        const _boardCell = cells.indexOf(cell);

        (mark === player.playerXMark()) ?
        _playerXGame.push(_boardCell)
        :
        _playerOGame.push(_boardCell);
    }

    function _announcePlayer(mark, announce) {
        (mark === player.playerOMark()) ?
        announce.textContent = `${player.playerXName()}'s turn`
        :
        announce.textContent = `${player.playerOName()}'s turn`;
    }

    function _checkTie(announce) {
        if (_board.length === 9) {
            announce.textContent = 'It\s a tie!';
        }
    }

    function _checkWinner(announce) {
        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_winningCombinations[i].every(c => _playerXGame.includes(c))) {
                announce.textContent = `${player.playerXName()} wins!`;
                return true;
            }
        }

        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_winningCombinations[i].every(c => _playerOGame.includes(c))) {
                announce.textContent = `${player.playerOName()} wins!`;
                return true;
            }
        }
    }

    // console.log()

    return {play}
})();

const runGame = (() => {
    const _cells = [...document.querySelectorAll('.cell')];
    const _board = document.querySelector('.board');
    const _announce = document.querySelector('.announce');
    const _startGame = document.querySelector('.start-game');
    const _playersForm = document.querySelector('form');
    const _playerXName = document.querySelector('#player-x');
    const _playerOName = document.querySelector('#player-o');

    _startGame.addEventListener('click', () => {
        _startGame.style.display = 'none';

        _playersForm.style.display = 'block';
    });

    _playersForm.addEventListener('submit', (e) => {
        _playersForm.style.display = 'none';

        _board.style.display = 'grid';

        _announce.style.display = 'block';

        player.setName(_playerXName, _playerOName);

        _announce.textContent = `${player.playerXName()}'s Turn`;

        e.preventDefault();
    });
    
    _cells.forEach(cell => cell.addEventListener('click', () => {
        gameBoard.play(_cells, cell, _announce);
    }));
})();