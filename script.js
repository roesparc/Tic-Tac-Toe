const player = (() => {
    let _playerX;
    let _playerO;

    function _createPlayer(mark, name) {
        return {mark, name}
    }

    function setName(playerXName, playerOName) {
        if (playerOName === 'Bot') {
            _playerX = _createPlayer('X', playerXName.value);

            _playerO = _createPlayer('O', 'Bot');    
        } else {            
            _playerX = _createPlayer('X', playerXName.value);

            _playerO = _createPlayer('O', playerOName.value);
        }    
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
    let _playerXScore = [];
    let _playerOScore = [];
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

    function play(cells, cell, announce, playerXScore, playerOScore, restart) {
        const mark = _getMark();

        if (announce.textContent.slice(-1) === '!') {return;}

        if (cell.textContent) {return;}

        _boardAdd(mark, cell);

        _playerGameAdd(mark, cells, cell);

        _announcePlayer(mark, announce);

        _checkTie(announce);

        _checkWinner(announce);

        _updateScore(playerXScore, playerOScore);

        _playAgain(announce, restart);
    }

    function playBot(cells, cell, announce, playerXScore, playerOScore, restart) {
        play(cells, cell, announce, playerXScore, playerOScore, restart);

        _botMove(cells, announce, playerXScore, playerOScore, restart);
    }

    function _botMove(cells, announce, playerXScore, playerOScore, restart) {
        const mark = player.playerOMark();

        const cellMove = cells[Math.floor(Math.random() * 9)];

        if (announce.textContent.slice(-1) === '!') {return;}

        if (cellMove.textContent) {
            _botMove(cells, announce, playerXScore, playerOScore, restart);
        } else {
            _boardAdd(mark, cellMove);

            _playerGameAdd(mark, cells, cellMove);

            _announcePlayer(mark, announce);

            _checkTie(announce);

            _checkWinner(announce);

            _updateScore(playerXScore, playerOScore);

            _playAgain(announce, restart);
        }
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
                _assignScore('playerX');
                return true;
            }
        }

        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_winningCombinations[i].every(c => _playerOGame.includes(c))) {
                announce.textContent = `${player.playerOName()} wins!`;
                _assignScore('playerO');
                return true;
            }
        }
    }

    function _assignScore(player) {
        (player === 'playerX') ?
        _playerXScore.push(1)
        :
        _playerOScore.push(1);
    }

    function _updateScore(playerXScore, playerOScore) {
        playerXScore.textContent = _playerXScore.length;
        playerOScore.textContent = _playerOScore.length;
    }

    function restart() {
        _board = [];
        _playerXGame = [];
        _playerOGame = [];
    }

    function _playAgain(announce, restart) {
        if (announce.textContent.slice(-1) === '!') {
            restart.textContent = 'Play Again';
        }
    }

    function backMenu() {
        _board = [];
        _playerXGame = [];
        _playerOGame = [];
        _playerXScore = [];
        _playerOScore = [];
    }

    return {play, playBot, restart, backMenu}
})();

const runGame = (() => {
    const _board = document.querySelector('.board');
    const _cells = [...document.querySelectorAll('.cell')];
    const _game = document.querySelector('.game');
    const _announce = document.querySelector('.announce');
    const _startGame = document.querySelector('.start-game');
    const _playersForm = document.querySelector('.form-two-players');
    const _botForm = document.querySelector('.form-bot');
    const _twoPlayersBtn = document.querySelector('.two-players-button');
    const _playerBotBtn = document.querySelector('.player-bot-button');
    const _playerXName = document.querySelector('#player-x');
    const _playerOName = document.querySelector('#player-o');
    const _playerSingleName = document.querySelector('#single-player');
    const _playerXScoreContainer = document.querySelector('.player-x-score');
    const _playerOScoreContainer = document.querySelector('.player-o-score');
    const _restartBtn = document.querySelector('.restart-button');
    const _menuBtn = document.querySelector('.menu-button');

    const _playerXScoreName = document.createElement('div');
    const _playerXScore = document.createElement('div');
    const _playerOScoreName = document.createElement('div');
    const _playerOScore = document.createElement('div');
    
    _playerXScoreContainer.appendChild(_playerXScoreName);
    _playerXScoreContainer.appendChild(_playerXScore);
    _playerOScoreContainer.appendChild(_playerOScoreName);
    _playerOScoreContainer.appendChild(_playerOScore);

    function formSubmit(e) {
        if (e.target == _botForm) {
            _botForm.style.display = 'none';

            player.setName(_playerSingleName, 'Bot');
    
            _playerXScoreName.textContent = _playerSingleName.value;
            _playerOScoreName.textContent = 'Bot';
            _board.classList.add('board-bot');    
        } else {
            _playersForm.style.display = 'none';

            player.setName(_playerXName, _playerOName);
    
            _announce.textContent = `${player.playerXName()}'s turn`;
            _playerXScoreName.textContent = _playerXName.value;
            _playerOScoreName.textContent = _playerOName.value;    
        }

        _twoPlayersBtn.style.display = 'none';
        _playerBotBtn.style.display = 'none';
        _game.style.display = 'flex';
        _restartBtn.style.display = 'block';
        _menuBtn.style.display = 'block';

        _announce.textContent = `${player.playerXName()}'s turn`;
        _playerXScore.textContent = 0;
        _playerOScore.textContent = 0;

        e.preventDefault();
    }

    _startGame.addEventListener('click', () => {
        _startGame.style.display = 'none';
        _twoPlayersBtn.style.display = 'block';
        _playerBotBtn.style.display = 'block';
    });

    _twoPlayersBtn.addEventListener('click', () => {
        _playersForm.style.display = 'block';
        _botForm.style.display = 'none';
    });

    _playerBotBtn.addEventListener('click', () => {
        _botForm.style.display = 'block';
        _playersForm.style.display = 'none';
    });

    _botForm.addEventListener('submit', (e) => {
        formSubmit(e);
    });

    _playersForm.addEventListener('submit', (e) => {
        formSubmit(e);
    });

    _cells.forEach(cell => cell.addEventListener('click', () => {
        if (_board.classList.value == 'board') {
            gameBoard.play(
                _cells,
                cell,
                _announce,
                _playerXScore,
                _playerOScore,
                _restartBtn
            );
        } else {
            gameBoard.playBot(
                _cells,
                cell,
                _announce,
                _playerXScore,
                _playerOScore,
                _restartBtn
            );
        }
    }));

    _restartBtn.addEventListener('click', () => {
        gameBoard.restart();
        _cells.map(c => c.textContent = '');
        _announce.textContent = `${player.playerXName()}'s turn`;
        _restartBtn.textContent = 'Restart';
    });

    _menuBtn.addEventListener('click', () => {
        gameBoard.backMenu();

        _game.style.display = 'none';
        _restartBtn.style.display = 'none';
        _menuBtn.style.display = 'none';
        _startGame.style.display = 'block';

        _playerXName.value = '';
        _playerOName.value = '';
        _playerSingleName.value = '';
        _playerXScore.textContent = 0;
        _playerOScore.textContent = 0;
        _restartBtn.textContent = 'Restart';
        _announce.textContent = `${player.playerXName()}'s turn`;

        _board.classList.remove('board-bot');

        _cells.map(c => c.textContent = '');
    });
})();