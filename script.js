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

    function getX() {
        return _playerX;
    }

    function getO() {
        return _playerO;
    }
    
    return {setName, getX, getO}
})();

const gameBoard = (() => {
    let disableClick;
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

    function play(cells, cell, announce, playerXScore, playerOScore, restart, play) {
        const mark = _getMark();

        if (disableClick) {return;}
        else {
            if (announce.textContent.slice(-1) === '!') {return;}

            if (cell.textContent) {return;}
    
            _boardAdd(mark, cell);
    
            _playerGameAdd(mark, cells, cell);
    
            _announcePlayer(mark, announce);
    
            _checkTie(announce);
    
            _checkWinner(cells, announce);
    
            _updateScore(playerXScore, playerOScore);
    
            _playAgain(announce, restart);
    
            if (play === 'playBot') {
                if (announce.textContent.slice(-1) === '!') {return;}

                disableClick = true;
    
                setTimeout(() => {
                    botLogic._botMove(cells, announce, playerXScore, playerOScore, restart);
                    
                    disableClick = false;
                }, 600);
            }
        }
    }

    function _getMark() {
        let _playerMark;

        if (_board.length % 2 === 0) {
            _playerMark = player.getX().mark;
        }
        else {
            _playerMark = player.getO().mark;
        }

        return _playerMark;
    }

    function _boardAdd(mark, cell) {
        _board.push(mark);

        const span = document.createElement('span');
        span.classList.add('mark-wrap-initial');
        cell.appendChild(span);

        setTimeout(() => {
            span.classList.add('mark-wrap-after')
        }, 10);

        span.textContent = mark;
    }

    function _playerGameAdd(mark, cells, cell) {
        const _boardCell = cells.indexOf(cell);

        (mark === player.getX().mark) ?
        _playerXGame.push(_boardCell)
        :
        _playerOGame.push(_boardCell);
    }

    function _announcePlayer(mark, announce) {
        (mark === player.getO().mark) ?
        announce.textContent = `${player.getX().name}'s turn`
        :
        announce.textContent = `${player.getO().name}'s turn`;
    }

    function _checkTie(announce) {
        if (_board.length === 9) {
            announce.textContent = 'It\'s a tie!';
        }
    }

    function _checkWinner(cells, announce) {
        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_winningCombinations[i].every(c => _playerXGame.includes(c))) {
                announce.textContent = `${player.getX().name} wins!`;

                _assignScore('playerX');

                const combination = _winningCombinations[i];

                for (let i = 0; i < _winningCombinations[i].length; i++) {
                    const index = combination[i];
                    cells[index].classList.add('winner-x');
                }

                setTimeout(() => {
                    announce.classList.add('announce-win-x');
                }, 300);

                return true;
            }
        }

        for (let i = 0; i < _winningCombinations.length; i++) {
            if (_winningCombinations[i].every(c => _playerOGame.includes(c))) {
                announce.textContent = `${player.getO().name} wins!`;

                _assignScore('playerO');

                const combination = _winningCombinations[i];

                for (let i = 0; i < _winningCombinations[i].length; i++) {
                    const index = combination[i];
                    cells[index].classList.add('winner-o');
                }

                setTimeout(() => {
                    announce.classList.add('announce-win-o');
                }, 300);

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

    function _playAgain(announce, restart) {
        if (announce.textContent.slice(-1) === '!') {
            restart.innerHTML =
            'Play Again <img src="./img/restart.svg" class="restart-svg">';
        }
    }

    const botLogic = (() => {
        let _percentage = 0;

        function _botMove(cells, announce, playerXScore, playerOScore, restart) {
            const mark = player.getO().mark;
            const cellMove = calculateMove(cells);
    
            _boardAdd(mark, cellMove);
    
            _playerGameAdd(mark, cells, cellMove);
    
            _announcePlayer(mark, announce);
    
            _checkTie(announce);
    
            _checkWinner(cells, announce);
    
            _updateScore(playerXScore, playerOScore);
    
            _playAgain(announce, restart);
        }

        function setPercentage(value) {
            _percentage = value;
        }

        function calculateMove(cells) {
            let move;
            const _rand = Math.random() * 100;

            function _random() {
                const cellMove = Math.floor(Math.random() * 9);
    
                if (cells[cellMove].textContent) {
                    _random();
                }
                else {
                    move = cellMove;
                }
            }    
            
            if (_rand < _percentage) {
                if (_minimax(player.getO().mark).score == -10) {
                    _random();
                }
                else {
                    move = _minimax(player.getO().mark).index;
                }
            }
            else {
                _random();
            }

            return cells[move];
        }

        function _minimax(selectedPlayer) {
            const freeSpots = _emptyCells();
            
            if (selectedPlayer == player.getX().mark) {
                var playerGame = _playerXGame
            }
            else {
                var playerGame = _playerOGame
            }
    
            if (_MiniMaxCheckWinner(_playerXGame)) {
                return {score: -10}
            }
            else if (_MiniMaxCheckWinner(_playerOGame)) {
                return {score: 10}
            }
            else if (freeSpots.length === 0) {
                return {score: 0}
            }
    
            let moves = [];
    
            for (let i = 0; i < freeSpots.length; i++) {
                let move = {};
                move.index = freeSpots[i];
                playerGame.push(freeSpots[i]);
    
                if (selectedPlayer == player.getO().mark) {
                    const result = _minimax(player.getX().mark);
                    move.score = result.score;
                }
                else {
                    const result = _minimax(player.getO().mark);
                    move.score = result.score;
                }
    
                playerGame.pop();
    
                moves.push(move);
            }
    
            let bestMove;
    
            if (selectedPlayer === player.getO().mark) {
                let bestScore = -11;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score > bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
            else {
                let bestScore = 11;
                for (let i = 0; i < moves.length; i++) {
                    if (moves[i].score < bestScore) {
                        bestScore = moves[i].score;
                        bestMove = i;
                    }
                }
            }
    
            return moves[bestMove];
        }
    
        function _emptyCells(){
            let cellIndexes = [0, 1, 2, 3, 4, 5, 6, 7, 8];
    
            for (let i = 0; i < cellIndexes.length; i++) {
                if (_playerXGame.includes(cellIndexes[i]) ||
                    _playerOGame.includes(cellIndexes[i])) {
                        cellIndexes.splice(i, 1);
                        i -= 1;
                }
            }
    
            return cellIndexes;
        }
    
        function _MiniMaxCheckWinner(player) {
            for (let i = 0; i < _winningCombinations.length; i++) {
                if (_winningCombinations[i].every(c => player.includes(c))) {
                    return true
                }
            }
        }    

        return {_botMove, setPercentage}
    })();

    function restart() {
        _board = [];
        _playerXGame = [];
        _playerOGame = [];
    }

    function backMenu() {
        _board = [];
        _playerXGame = [];
        _playerOGame = [];
        _playerXScore = [];
        _playerOScore = [];
    }

    return {play, restart, backMenu, botLogic}
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
    const _twoPlayersSvg = document.querySelector('.two-players-svg');
    const _playerBotBtn = document.querySelector('.player-bot-button');
    const _playerBotSvg =document.querySelector('.bot-svg');
    const _playerXName = document.querySelector('#player-x');
    const _playerOName = document.querySelector('#player-o');
    const _playerSingleName = document.querySelector('#single-player');
    const _playerXScoreContainer = document.querySelector('.player-x-score');
    const _playerOScoreContainer = document.querySelector('.player-o-score');
    const _restartBtn = document.querySelector('.restart-button');
    const _menuBtn = document.querySelector('.menu-button');
    const _selectDifficulty = document.querySelector('.set-difficulty');
    const _difficulty = document.querySelector('#difficulty');
    const _menu = document.querySelector('.menu');
    const _gameBtns = document.querySelector('.game-buttons');

    const _playerXScoreName = document.createElement('div');
    const _playerXScore = document.createElement('div');
    const _playerOScoreName = document.createElement('div');
    const _playerOScore = document.createElement('div');
    
    _playerXScoreContainer.appendChild(_playerXScoreName);
    _playerXScoreContainer.appendChild(_playerXScore);
    _playerOScoreContainer.appendChild(_playerOScoreName);
    _playerOScoreContainer.appendChild(_playerOScore);

    function _formSubmit(e) {
        if (e.target == _botForm) {
            _botForm.classList.remove('reveal');
            _board.classList.add('bot-board');    

            _selectDifficulty.style.top = '17%';
            _game.style.marginTop = '19rem';

            player.setName(_playerSingleName, 'Bot');
    
            _playerXScoreName.textContent = _playerSingleName.value;
            _playerOScoreName.textContent = 'Bot';
        }
        else {
            _playersForm.classList.remove('reveal');

            player.setName(_playerXName, _playerOName);
    
            _playerXScoreName.textContent = _playerXName.value;
            _playerOScoreName.textContent = _playerOName.value;
        }

        _twoPlayersBtn.style.display = 'none';
        _playerBotBtn.style.display = 'none';

        _game.classList.add('reveal');

        setTimeout(() => {
            _gameBtns.classList.add('reveal');
        }, 1200);
        
        setTimeout(() => {
            _playerXScoreContainer.classList.add('reveal');
            _playerOScoreContainer.classList.add('reveal');
            _announce.classList.add('reveal');
        }, 600);

        _announce.textContent = `${player.getX().name}'s turn`;
        _playerXScore.textContent = 0;
        _playerOScore.textContent = 0;

        e.preventDefault();
    }

    function _reset(source) {
        const _markWrap = document.querySelectorAll('.mark-wrap-initial');

        gameBoard.restart();

        _markWrap.forEach(wrap => {
            wrap.classList.remove('mark-wrap-after');
        });

        _announce.classList.remove('announce-win-x');
        _announce.classList.remove('announce-win-o');

        setTimeout(() => {
            _cells.map(cell => {
                cell.textContent = '';
                cell.classList.remove('winner-x');
                cell.classList.remove('winner-o');    
            });
        }, 300);

        _restartBtn.innerHTML =
        'Restart <img src="./img/restart.svg" class="restart-svg">';

        if (player.getX()) {
            _announce.textContent = `${player.getX().name}'s turn`;
        }
        else {return;}

        if (source !== 'difficulty') {
            const _restartSvg = document.querySelector('.restart-svg');

            _restartSvg.classList.add('restart-svg-click');
    
            setTimeout(() => {
                _restartSvg.classList.remove('restart-svg-click');
            }, 1000);
        }
    }

    function _backToMenu() {
        gameBoard.backMenu();

        _board.classList.remove('bot-board');
        _game.classList.remove('reveal');
        _gameBtns.classList.remove('reveal');
        _selectDifficulty.classList.remove('reveal');
        _announce.classList.remove('reveal');
        _announce.classList.remove('announce-win-x');
        _announce.classList.remove('announce-win-o');
        _playerXScoreContainer.classList.remove('reveal');
        _playerOScoreContainer.classList.remove('reveal');
        _menu.classList.remove('menu-up');

        _startGame.style.display = 'block';
        _game.style.marginTop = '14rem';
        _selectDifficulty.style.top = '24%';

        _playerXName.value = '';
        _playerOName.value = '';
        _playerSingleName.value = '';
        _difficulty.value = 'easy';
        gameBoard.botLogic.setPercentage(0);

        _playerXScore.textContent = 0;
        _playerOScore.textContent = 0;
        _announce.textContent = `${player.getX().name}'s turn`;

        _restartBtn.innerHTML =
        'Restart <img src="./img/restart.svg" class="restart-svg">';

        _cells.map(cell => {
            cell.textContent = '';
            cell.classList.remove('winner-x');
            cell.classList.remove('winner-o');    
        });
}

    _startGame.addEventListener('click', () => {
        _menu.classList.add('menu-up');

        _startGame.style.display = 'none';
        _twoPlayersBtn.style.display = 'block';
        _playerBotBtn.style.display = 'block';
    });

    _twoPlayersBtn.addEventListener('click', () => {
        _playersForm.classList.add('reveal');
        _botForm.classList.remove('reveal');
        _selectDifficulty.classList.remove('reveal');
    });
    _twoPlayersBtn.addEventListener('mouseover', () => {
        _twoPlayersSvg.style.filter = 'invert(100%) drop-shadow(0 0 2px #99C24D)';
    });
    _twoPlayersBtn.addEventListener('mouseout', () => {
        _twoPlayersSvg.style.filter = null;
    });

    _playerBotBtn.addEventListener('click', () => {
        _botForm.classList.add('reveal');
        _selectDifficulty.classList.add('reveal');
        _playersForm.classList.remove('reveal');
    });
    _playerBotBtn.addEventListener('mouseover', () => {
        _playerBotSvg.style.filter = 'invert(100%) drop-shadow(0 0 2px #38AECC)';
    });
    _playerBotBtn.addEventListener('mouseout', () => {
        _playerBotSvg.style.filter = null;
    });

    _botForm.addEventListener('submit', (e) => {
        _formSubmit(e);
    });

    _playersForm.addEventListener('submit', (e) => {
        _formSubmit(e);
    });

    _selectDifficulty.addEventListener('change', () => {
        if (_difficulty.value === 'easy') {
            gameBoard.botLogic.setPercentage(0);
        }
        else if (_difficulty.value === 'medium') {
            gameBoard.botLogic.setPercentage(70);
        }
        else if (_difficulty.value === 'impossible') {
            gameBoard.botLogic.setPercentage(100);
        }

        _reset('difficulty');
        gameBoard.backMenu();

        _playerXScore.textContent = 0;
        _playerOScore.textContent = 0;
    })

    _restartBtn.addEventListener('click', _reset);

    _menuBtn.addEventListener('click', _backToMenu);

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
        }
        else {
            _restartBtn.removeEventListener('click', _reset);
            _menuBtn.removeEventListener('click', _backToMenu);

            gameBoard.play(
                _cells,
                cell,
                _announce,
                _playerXScore,
                _playerOScore,
                _restartBtn,
                'playBot'
            );

            setTimeout(() => {
                _restartBtn.addEventListener('click', _reset);
                _menuBtn.addEventListener('click', _backToMenu);
            }, 600);    
        }
    }));
})();