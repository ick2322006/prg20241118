const { NFC } = require('nfc-pcsc');
const nfc = new NFC();

console.log('NFCリーダーを待機中...');

nfc.on('reader', reader => {
    console.log(`${reader.reader.name} を検出しました`);

    // カードが置かれたときの処理
    reader.on('card', card => {
        // card.uid がカードの固有番号（IDm）です
        console.log(`カードを検出しました！ ID: ${card.uid}`);
    });

    // エラー処理
    reader.on('error', err => {
        console.error(`エラーが発生しました: ${err}`);
    });

    // カードが離れたとき
    reader.on('card.off', card => {
        console.log('カードが離れました');
    });
});

nfc.on('error', err => {
    console.error('NFCエラー:', err);
});
