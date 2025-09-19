document.addEventListener('DOMContentLoaded', () => {
    const boardElement = document.getElementById('board');
    const messageElement = document.getElementById('message');
    const resetButton = document.getElementById('reset-button');
    const BOARD_SIZE = 8;
    const EMPTY = 0, BLACK = 1, WHITE = 2;
    let board = [];
    let currentPlayer = BLACK;

    // ゲームの初期化
    function initializeBoard() {
        board = Array(BOARD_SIZE).fill(null).map(() => Array(BOARD_SIZE).fill(EMPTY));
        board[3][3] = WHITE;
        board[3][4] = BLACK;
        board[4][3] = BLACK;
        board[4][4] = WHITE;
        currentPlayer = BLACK; // 常に黒から開始
        renderBoard();
        updateMessage();
    }

    // 盤面を描画
    function renderBoard() {
        boardElement.innerHTML = '';
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                const cell = document.createElement('div');
                cell.classList.add('cell');
                cell.dataset.row = r;
                cell.dataset.col = c;
                
                if (board[r][c] !== EMPTY) {
                    const piece = document.createElement('div');
                    piece.classList.add('piece', board[r][c] === BLACK ? 'black' : 'white');
                    cell.appendChild(piece);
                }
                
                // クリックイベントを追加
                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
    }

    // メッセージとプレイヤー情報を更新
    function updateMessage() {
        const blackCount = countPieces(BLACK);
        const whiteCount = countPieces(WHITE);
        
        let statusText = 黒: ${blackCount} 白: ${whiteCount} | 現在のプレイヤー: ${currentPlayer === BLACK ? '黒' : '白'};
        
        messageElement.textContent = statusText;
    }

    // 石の数をカウント
    function countPieces(player) {
        let count = 0;
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] === player) {
                    count++;
                }
            }
        }
        return count;
    }

    // セルがクリックされた時の処理
    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        // すでに石があるか、ひっくり返せる石がない場合は置けない
        if (board[row][col] !== EMPTY || getPiecesToFlip(row, col, currentPlayer).length === 0) {
            return;
        }
        
        const piecesToFlip = getPiecesToFlip(row, col, currentPlayer);
        
        // 石を置く
        board[row][col] = currentPlayer;
        
        // ひっくり返す
        piecesToFlip.forEach(([r, c]) => {
            board[r][c] = currentPlayer;
        });

        renderBoard();
        switchPlayer();
        checkGameOver();
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

    // プレイヤーを交代
    function switchPlayer() {
        currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
        updateMessage();
        
        // 次のプレイヤーが置ける場所がないかチェック（パス）
        if (!canPlaceAnywhere(currentPlayer)) {
            // もう一度プレイヤーを交代して、相手も置けないか確認
            currentPlayer = currentPlayer === BLACK ? WHITE : BLACK;
            if (!canPlaceAnywhere(currentPlayer)) {
                checkGameOver(); // 両者置けない場合はゲーム終了
            } else {
                updateMessage();
                alert(パス！${currentPlayer === BLACK ? '黒' : '白'}の番です。);
            }
        }
    }
    
    // 現在のプレイヤーがどこかに石を置けるかチェック
    function canPlaceAnywhere(player) {
        for (let r = 0; r < BOARD_SIZE; r++) {
            for (let c = 0; c < BOARD_SIZE; c++) {
                if (board[r][c] === EMPTY && getPiecesToFlip(r, c, player).length > 0) {
                    return true;
                }
            }
        }
        return false;
    }

    // ゲーム終了のチェック
    function checkGameOver() {
        const blackCount = countPieces(BLACK);
        const whiteCount = countPieces(WHITE);

        if (blackCount === 0 || whiteCount === 0) {
            endGame(blackCount, whiteCount);
        } else if (blackCount + whiteCount === BOARD_SIZE * BOARD_SIZE) {
            endGame(blackCount, whiteCount);
        } else if (!canPlaceAnywhere(BLACK) && !canPlaceAnywhere(WHITE)) {
            endGame(blackCount, whiteCount);
        }
    }

    // ゲーム終了処理と勝敗判定
    function endGame(blackCount, whiteCount) {
        let resultMessage = '';
        if (blackCount > whiteCount) {
            resultMessage = 黒の勝利！ 黒: ${blackCount} 白: ${whiteCount};
        } else if (whiteCount > blackCount) {
            resultMessage = 白の勝利！ 黒: ${blackCount} 白: ${whiteCount};
        } else {
            resultMessage = 引き分け！ 黒: ${blackCount} 白: ${whiteCount};
        }
        messageElement.textContent = ゲーム終了！ ${resultMessage};
        
        // クリックイベントを全て削除
        const cells = document.querySelectorAll('.cell');
        cells.forEach(cell => {
            cell.removeEventListener('click', handleCellClick);
        });
    }

    // リセットボタンのイベントリスナー
    resetButton.addEventListener('click', () => {
        initializeBoard();
    });

    // 初回ゲーム開始
    initializeBoard();
});