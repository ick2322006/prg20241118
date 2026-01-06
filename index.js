const { NFC } = require('nfc-pcsc');
const nfc = new NFC();

console.log('--- [診断開始] ---');
console.log('1. NFCライブラリを初期化しました。');

nfc.on('reader', reader => {
    // ここが表示されれば、ラズパイがリーダーを「認識」できています
    console.log(`2. リーダーを検出しました!: ${reader.reader.name}`);

    reader.on('card', card => {
        // ここが表示されれば、カードの読み取り成功です
        console.log(`3. カードを検出!: ID = ${card.uid}`);
    });

    reader.on('error', err => {
        console.log(`X. リーダーエラー発生: ${err}`);
    });

    reader.on('card.off', () => {
        console.log('4. カードが離れました。');
    });
});

nfc.on('error', err => {
    console.log(`X. システム全体のエラー: ${err}`);
});

// 5秒経っても何も起きない場合
setTimeout(() => {
    console.log('--- [5秒経過] もし「2. リーダーを検出」が出ていなければ、OSがリーダーを認識できていません ---');
}, 5000);
