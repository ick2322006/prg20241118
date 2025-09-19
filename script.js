document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const messageElement = document.getElementById('message');
    const resetButton = document.getElementById('reset-button');
    const BOARD_SIZE = 8;
    const EMPTY = 0, BLACK = 1, WHITE = 2;
    let board = [];
    let currentPlayer = BLACK;
    const players = {
        [BLACK]: '黒',
        [WHITE]: '白'
    };

    // ゲームの初期化
    function initializeBoard() {
        board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
        board[3][3] = WHITE;
        board[3][4] = BLACK;
        board[4][3] = BLACK;
        board[4][4] = WHITE;
        currentPlayer = BLACK;
        renderBoard();
        updateMessage();
    }

    // 盤面を描画
    function renderBoard() {
        boardElement.innerHTML = '';
        const validMoves = findValidMoves(currentPlayer);

        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                // 石を置ける場所にハイライトを追加
                if (validMoves.some(move => move.row === r && move.col === c)) {
                    cell.classList.add('valid-move');
                }

                if (board[r][c] !== EMPTY) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', board[r][c] === BLACK ? 'black' : 'white');
                    cell.appendChild(piece);
                }
                
                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
    }

    // メッセージとスコアを更新
    function updateMessage(status = 'playing') {
        const blackCount = board.flat().filter(p => p === BLACK).length;
        const whiteCount = board.flat().filter(p => p === WHITE).length;
        
        if (status === 'playing') {
            messageElement.innerHTML = 現在のプレイヤー: **${players[currentPlayer]}**<br>黒: ${blackCount} | 白: ${whiteCount};
        } else if (status === 'gameover') {
            let resultMessage = '';
            if (blackCount > whiteCount) {
                resultMessage = '黒の勝ちです！';
            } else if (whiteCount > blackCount) {
                resultMessage = '白の勝ちです！';
            } else {
                resultMessage = '引き分けです！';
            }
            messageElement.innerHTML = **ゲーム終了！** ${resultMessage}<br>黒: ${blackCount} | 白: ${whiteCount};
        } else if (status === 'pass') {
            messageElement.innerHTML = **${players[currentPlayer]}**は置ける場所がないためパスします。<br>黒: ${blackCount} | 白: ${whiteCount};
        }
    }

    // セルがクリックされた時の処理
    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (!isValidMove(row, col, currentPlayer)) {
            return;
        }

        const piecesToFlip = getPiecesToFlip(row, col, currentPlayer);
        
        // 石を置く
        board[row][col] = currentPlayer;
        
        // ひっくり返す
        piecesToFlip.forEach(([r, c]) => {
            board[r][c] = currentPlayer;
        });

        switchPlayer();
    }

    // プレイヤーを交代し、次の手番をチェック
    function switchPlayer() {
        currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
        
        // 次のプレイヤーが置ける場所があるかチェック
        if (findValidMoves(currentPlayer).length === 0) {
            updateMessage('pass');
            currentPlayer = currentPlayer === BLACK ? WHITE : BLACK; // プレイヤーをもう一度交代
            
            // パスした後に、相手も置ける場所がないかチェック
            if (findValidMoves(currentPlayer).length === 0) {
                endGame();
                return;
            }
        }
        
        renderBoard();
        updateMessage();
    }
    
    // ひっくり返せる石を取得
    function getPiecesToFlip(row, col, player) {
        const opponent = player === BLACK ? WHITE : BLACK;
        const directions = [
            [-1, 0], [1, 0], [0, -1], [0, 1],
            [-1, -1], [-1, 1], [1, -1], [1, 1]
        ];
        const piecesToFlip = [];

        directions.forEach(([dr, dc]) => {
            const currentFlip = [];
            let r = row + dr;
            let c = col + dc;

            while (r >= 0 && r < BOARD_SIZE && c >= 0 && c < BOARD_SIZE) {
                if (board[r][c] === opponent) {
                    currentFlip.push([r, c]);
                } else if (board[r][c] === player) {
                    piecesToFlip.push(...currentFlip);
                    break;
                } else {
                    break;
                }
                r += dr;
                c += dc;
            }
        });
        
        return piecesToFlip;
    }

    // 有効な手かどうかを判定
    function isValidMove(row, col, player) {
        if (board[row][col] !== EMPTY) {
            return false;
        }
        return getPiecesToFlip(row, col, player).length > 0;
    }

    // 置ける場所をすべて取得
    function findValidMoves(player) {
        const moves = [];
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (isValidMove(r, c, player)) {
                    moves.push({ row: r, col: c });
                }
            }
        }
        return moves;
    }

    // ゲーム終了処理
    function endGame() {
        updateMessage('gameover');
        // クリックイベントを停止
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => cell.removeEventListener('click', handleCellClick));
    }

    // リセットボタンのイベントリスナー
    resetButton.addEventListener('click', initializeBoard);

    // 初回ゲーム開始
    initializeBoard();
});

