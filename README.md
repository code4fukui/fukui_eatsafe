# fukui_eatsafe

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

This project maps the list of certified "Fukui Safe and Secure Restaurants" with their latitude and longitude.

## Demo
[Fukui Safe and Secure Restaurant Map](https://code4fukui.github.io/fukui_eatsafe/)

## Features
- Provides a map view of certified restaurants in Fukui prefecture, Japan
- Includes a CSV viewer to browse the list of certified restaurants

## Requirements
- [Deno](https://deno.land/) runtime environment

## Usage
To generate the final data:

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

This will generate the `fukui_eatsafe.csv` file which can be used to display the map.

## Data / API
The data is sourced from the [Fukui Safe and Secure Restaurant Certification System](https://fukui-anshin-ninsyou.com/certified.html) website.

## License
MIT License — see [LICENSE](LICENSE).