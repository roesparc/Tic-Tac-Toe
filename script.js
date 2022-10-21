const gameBoard = (() => {
    let game = ['X', 'O', 'X', 'O', 'X', 'O', 'X', 'O', 'X'];

    for (let i = 0; i < 9; i++) {
        const cell = document.querySelectorAll('.cell');
        cell[i].textContent = game[i];
    }

})();