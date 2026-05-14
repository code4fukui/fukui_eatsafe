# fukui_eatsafe

このプロジェクトは、「ふくい安全・安心飲食店認証制度」の認証店リストをスクレイピングし、ジオコーディングして地図上にマッピングします。

## デモ

[ふくい安全・安心飲食店マップ](https://code4fukui.github.io/fukui_eatsafe/)

デモページでは、飲食店の位置をインタラクティブな地図上に表示し、検索や並べ替えが可能なデータテーブルを提供します。

## 機能

- 公式の認証サイトからの飲食店データの自動スクレイピング。
- 住所のクリーニングと標準化。
- 住所から緯度・経度へのジオコーディング（API呼び出しを最小限に抑えるためのローカルキャッシュ付き）。
- `geo3x3` コードを含む、データが拡充された最終的なCSVファイル（`fukui_eatsafe.csv`）の生成。
- データを可視化するためのシンプルな静的HTMLデモページ。

## データパイプライン

このリポジトリには、データ処理パイプラインを構成する一連のDenoスクリプトが含まれています。目的は、公式のHTMLページ上にある飲食店リストを、構造化されジオコーディングされたCSVファイルに変換することです。

1. **`download.js`**: 公式サイトからソースHTMLを取得し、`certified.html` として保存します。
2. **`make.js`**: `certified.html` を解析して `certified.csv` を作成し、各飲食店の認証番号、店名、住所を抽出します。
3. **`maketownid.js`**: `certified.csv` の住所をクリーニングし、標準化された `townid` を追加して、`certified_townid.csv` を作成します。
4. **`geocode.js`**: 住所を読み込み、`geocoding.jp` APIを使用して緯度と経度を取得し、結果を `geocode.csv` に保存します。このファイルは、既知の住所への再クエリを避けるためのキャッシュとして機能します。
5. **`makedata.js`**: `certified_townid.csv` と `geocode.csv` のデータを結合し、デモページで使用される最終的な `fukui_eatsafe.csv` を生成します。

## 必要環境

- [Deno](https://deno.land/) ランタイム環境

## 使い方

`fukui_eatsafe.csv` データファイルを再生成するには、以下のスクリプトを順番に実行します。

**注意:** ジオコーディングのスクリプトは、APIの利用制限を遵守するため、新しい住所に対するAPI呼び出しの間に10秒間の遅延を設けています。

```bash
# 1. 公式サイトから最新のリストをダウンロードする
deno run -A download.js

# 2. HTMLを解析して基本的なCSVを作成する
deno run -A make.js

# 3. 住所をクリーニングし、標準化された townid を追加する
deno run -A maketownid.js

# 4. 住所をジオコーディングする（新規エントリが多い場合は時間がかかります）
deno run -A geocode.js

# 5. すべてのデータを結合して地図用の最終的なCSVを作成する
deno run -A makedata.js
```

このプロセスにより、最終的な `fukui_eatsafe.csv` ファイルが生成されます。

## データソース

データは [ふくい安全・安心飲食店認証制度](https://fukui-anshin-ninsyou.com/certified.html) のウェブサイトから取得しています。

## ライセンス

MIT License
