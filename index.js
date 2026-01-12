import nfc
import binascii

def on_connect(tag):
    # Suica（FeliCa）の固定IDmを取得
    idm = binascii.hexlify(tag.identifier).upper().decode()
    print(f"\n--- カードを検出しました ---")
    print(f"このカードの固定IDm: {idm}")
    print(f"この値をFirebaseの登録に使用します。")
    return False  # 1回読み取ったら待機を終了する

print("パソリにSuicaカードを置いてください...")

with nfc.ContactlessFrontend('usb') as clf:
    # カードが置かれるまで待機
    clf.connect(rdwr={'on-connect': on_connect})
