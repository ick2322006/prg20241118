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
                
                cell.addEventListener('click', handleCellClick);
                boardElement.appendChild(cell);
            }
        }
    }

    // メッセージを更新
    function updateMessage() {
        messageElement.textContent = 現在のプレイヤー: ${currentPlayer === BLACK ? '黒' : '白'};
    }

    // セルがクリックされた時の処理
    function handleCellClick(event) {
        const row = parseInt(event.target.dataset.row);
        const col = parseInt(event.target.dataset.col);

        if (board[row][col] !== EMPTY) {
            return; // 既に石がある場合は何もしない
        }

        const piecesToFlip = getPiecesToFlip(row, col, currentPlayer);
        
        if (piecesToFlip.length > 0) {
            // 石を置く
            board[row][col] = currentPlayer;
            
            // ひっくり返す
            piecesToFlip.forEach(([r, c]) => {
                board[r][c] = currentPlayer;
            });

            // 盤面を再描画して、プレイヤーを交代
            renderBoard();
            switchPlayer();
        }
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
        // ここでパスやゲーム終了のチェックを追加することもできます
    }

    // リセットボタンのイベントリスナー
    resetButton.addEventListener('click', () => {
        currentPlayer = BLACK;
        initializeBoard();
    });

    // 初回ゲーム開始
    initializeBoard();
});

