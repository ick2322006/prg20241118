// script.js (抜粋)

const nfcIdInput = document.getElementById('nfc-input');
const statusMessage = document.getElementById('status-message');

// 1. ログインチェック (管理者向け機能ではないため省略可、またはシンプルに)
// ログイン処理は別途実装する必要がありますが、ここでは記録処理に焦点を当てます。

// 2. 入力フィールドの変更を監視 (NFCリーダーからの入力)
nfcIdInput.addEventListener('change', handleNfcScan);

async function handleNfcScan(event) {
    const scannedNfcId = event.target.value.trim();
    if (!scannedNfcId) return;

    // 入力フィールドをクリアして次のスキャンに備える
    event.target.value = ''; 
    statusMessage.textContent = '読み取り中...';

    try {
        // 3. attendeesコレクションでIDを検索し、存在確認
        const attendeeRef = db.collection('attendees').doc(scannedNfcId);
        const doc = await attendeeRef.get();

        if (!doc.exists) {
            statusMessage.textContent = `エラー: ID ${scannedNfcId} は登録されていません。`;
            console.error("No such attendee!");
            return;
        }

        const attendeeData = doc.data();
        
        // 4. attendanceRecordsコレクションに出席を記録
        await db.collection('attendanceRecords').add({
            nfcId: scannedNfcId,
            name: attendeeData.name, // 記録の参照を容易にするために名前も格納
            timestamp: firebase.firestore.FieldValue.serverTimestamp(), // サーバー側の正確な時刻
            date: new Date().toISOString().split('T')[0], // YYYY-MM-DD
            type: 'check-in' // または、前回の記録を見て check-out を決定するロジックを追加
        });

        statusMessage.textContent = `${attendeeData.name} さんの出席（check-in）を記録しました！`;

    } catch (error) {
        console.error("Firestoreへの書き込みエラー: ", error);
        statusMessage.textContent = `重大なエラーが発生しました: ${error.message}`;
    }
}
