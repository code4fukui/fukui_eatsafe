# fukui_eatsafe
 
[ふくい安全・安心飲食店認証制度 認証店一覧](https://fukui-anshin-ninsyou.com/certified.html)に緯度経度を足したCSVデータにして、マップにしました

## how to make

```
# download html
deno run -A download.js
# make certified.csv
deno run -A make.js
# make certified_townid.csv
deon run -A maketownid.js
# make geocode.csv
deno run -A geocode.js
# make final data
deno run -A makedata.js
```

## map

[ふくい安心飲食店マップ](https://code4fukui.github.io/fukui_eatsafe/)
