# fukui_eatsafe

> 日本語のREADMEはこちらです: [README.ja.md](README.ja.md)

This project scrapes, geocodes, and maps the list of certified "Fukui Safe and Secure Restaurants" (ふくい安全・安心飲食店認証制度).

## Demo

[Fukui Safe and Secure Restaurant Map](https://code4fukui.github.io/fukui_eatsafe/)

The demo page displays restaurant locations on an interactive map and provides a searchable, sortable table of the data.

## Features

- Automated scraping of restaurant data from the official certification website.
- Address cleaning and standardization.
- Geocoding of addresses to latitude and longitude, with local caching to minimize API calls.
- Generates a final, enriched CSV file (`fukui_eatsafe.csv`) with `geo3x3` codes.
- Simple, static HTML demo page for visualizing the data.

## Data Pipeline

This repository contains a series of Deno scripts that form a data processing pipeline. The goal is to convert the list of restaurants on the official HTML page into a structured, geocoded CSV file.

1.  **`download.js`**: Fetches the source HTML from the official website and saves it as `certified.html`.
2.  **`make.js`**: Parses `certified.html` to create `certified.csv`, extracting the certification number, name, and address for each restaurant.
3.  **`maketownid.js`**: Cleans addresses from `certified.csv` and adds a standardized `townid`, creating `certified_townid.csv`.
4.  **`geocode.js`**: Reads addresses, finds their latitude and longitude using the `geocoding.jp` API, and saves the results to `geocode.csv`. This file acts as a cache to avoid re-querying known addresses.
5.  **`makedata.js`**: Combines the data from `certified_townid.csv` and `geocode.csv` to produce the final `fukui_eatsafe.csv` used by the demo page.

## Requirements

- [Deno](https://deno.land/) runtime environment

## Usage

To regenerate the `fukui_eatsafe.csv` data file, run the following scripts in order.

**Note:** The geocoding script has a 10-second delay between API calls for new addresses to comply with API usage limits.

```bash
# 1. Download the latest list from the official website
deno run -A download.js

# 2. Parse the HTML into a basic CSV
deno run -A make.js

# 3. Clean addresses and add standardized town IDs
deno run -A maketownid.js

# 4. Geocode addresses (will be slow if there are many new entries)
deno run -A geocode.js

# 5. Combine all data into the final CSV for the map
deno run -A makedata.js
```

This process will generate the final `fukui_eatsafe.csv` file.

## Data Source

The data is sourced from the [Fukui Safe and Secure Restaurant Certification System](https://fukui-anshin-ninsyou.com/certified.html) website.

## License

MIT License