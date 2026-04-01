# Google SERP Preset Switch for SEO

A Tampermonkey / Greasemonkey userscript that adds a quick-switch panel on Google SERP pages, letting you toggle common SEO query parameters (`gl`, `cr`, `lr`, `hl`, `pws`) with one click.

## Features

- One-click preset switching for country (`gl`), country restriction (`cr`), language (`lr`), interface language (`hl`), and personalization (`pws`)
- Supports google.com, google.com.hk, google.co.jp, google.co.uk
- Lightweight — no dependencies, no external requests

## Supported Parameters

| Parameter | Description | Example |
|-----------|-------------|---------|
| `gl` | Country of the search | `us`, `jp`, `hk`, `uk` |
| `cr` | Country restriction | `countryUS`, `countryJP` |
| `lr` | Language restriction | `lang_en`, `lang_ja` |
| `hl` | Interface language | `en`, `ja`, `zh-CN` |
| `pws` | Personalization | `0` (disabled), `1` (enabled) |

## Installation

1. Install [Tampermonkey](https://www.tampermonkey.net/) (Chrome) or [Greasemonkey](https://www.greasespot.net/) (Firefox)
2. Click the raw script link: [`google-serp-preset-switch.user.js`](https://github.com/wweggplant/google-serp-preset-switch/raw/main/google-serp-preset-switch.user.js)
3. Confirm installation in the userscript manager

## Usage

1. Go to any Google search results page on a supported domain
2. The preset switch panel will appear on the page
3. Click any preset to reload the SERP with the selected parameters applied

## License

[MIT](LICENSE)
