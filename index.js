const { NFC } = require('nfc-pcsc');
const nfc = new NFC(); // NFCリーダーのインスタンスを作成

console.log('リーダーの待機中です... カードをかざしてください。');

nfc.on('reader', reader => {
    console.log(`${reader.reader.name} を検出しました`);

    // カードが検出された時の処理
    reader.on('card', card => {
        // SuicaなどのID（IDm）を表示
        // card.uid がカード固有の番号です
        console.log(`カードを検出しました！ ID: ${card.uid}`);
    });

    // エラー処理
    reader.on('error', err => {
        console.error(`エラーが発生しました: ${err}`);
    });

    // リーダーが取り外された時
    reader.on('end', () => {
        console.log('リーダーが切断されました');
    });
});

nfc.on('error', err => {
    console.error('システムエラー:', err);
});
