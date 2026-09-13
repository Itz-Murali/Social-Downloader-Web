<div align="center">

<img src="public/logo.jpg" alt="Social Downloader logo" width="50%" />

# Social Downloader

**One input bar for YouTube, Instagram and Pinterest.**
Paste a link (or just type a search), get the original media back in seconds.

No signup · No watermarks · No limits

[![License: MIT](https://img.shields.io/badge/license-MIT-7cf5c4.svg)](LICENSE)
[![Made with React](https://img.shields.io/badge/made%20with-React-149eca.svg)](https://react.dev)
[![PRs Welcome](https://img.shields.io/badge/PRs-welcome-ff5a5f.svg)](#contributing)

</div>

---

## Overview

Social Downloader is a single-page React app built around one idea: **one field should be enough.**
Drop in a YouTube link, an Instagram reel, a Pinterest pin, or just plain search words, and the app
detects the platform automatically and resolves the original file: video, audio, or image, with no
account, no queue, and no watermark tax.

Everything runs client-side. Nothing you search is stored on a server; only your recent queries are
kept locally on your own device.

## Features

| | |
|---|---|
| 🎯 **One omnibar** | A single input detects YouTube, Instagram, Pinterest and plain-text search as you type |
| ⚡ **Instant resolution** | Streams and image URLs come back in their original quality, ready to save |
| 🎬 **Full platform coverage** | YouTube video & audio, Instagram/Facebook posts, reels, stories and carousels, Pinterest pins and boards |
| 🕘 **Local history** | Recent queries are remembered on-device and can be cleared any time |
| 🌗 **Light & dark themes** | Theme preference is detected and toggleable |
| 🔒 **Privacy-first** | No server-side storage, no accounts, no tracking |
| 📱 **Installable** | Ships as a PWA with a full manifest and icon set |

## How it works

1. **Drop anything in** — a reel, a pin, a watch link, or plain words. No tabs, no platform picker.
2. **The bar reads it** — the host is matched the moment you type and the interface adapts to that platform.
3. **Originals come back** — direct stream and image URLs, untouched quality, ready to save or pipe elsewhere.

## Tech stack

- **React 18** with hooks (`react-scripts` / Create React App tooling)
- **lucide-react** for icons
- Plain CSS (`src/styles/global.css`) — no framework dependency
- A tiny **Vercel serverless function** (`api/download.mjs`) that proxies allow-listed media hosts so files can be force-downloaded instead of opened inline
- Public, key-free third-party APIs for platform resolution (see `src/lib/api.js`)


## Getting started

### Prerequisites

- Node.js 18+ (or [Bun](https://bun.sh), a `bun.lock` is included)
- npm, yarn, or bun

### Installation

```bash
git clone https://github.com/Itz-Murali/Social-Downloader-Web.git
cd Social-Downloader-Web

# with npm
npm install

# or with bun
bun install
```

### Run locally

```bash
npm start
# or
bun run start
```

The app runs at `http://localhost:3000`.

### Build for production

```bash
npm run build
# or
bun run build
```

The optimized build is output to `build/`.

## Deployment

The app is a static React build plus one serverless function
(`api/download.mjs`), so it deploys cleanly to **Vercel** with zero
configuration: push the repo, import it into Vercel, and the API route is
picked up automatically.

## Supported sources

| Source | What it handles |
|---|---|
| **YouTube** | Watch, share and short links · separate video/audio streams · keyword search (up to 8 results) |
| **Instagram & Facebook** | Posts, reels, TV and stories · every slide of a carousel · original files, no watermark pass |
| **Pinterest** | Single pin at full resolution · idea pin video streams · text query returns a board of results |

## Privacy

Social Downloader does not run its own backend for resolving media, requests
go straight from your browser to public, key-free APIs. The only local
persistence is a short list of recent queries, kept in your browser and
clearable at any time from the app itself.

## Disclaimer

This project is intended for personal use only. Please respect the rights of
original creators and the terms of service of each platform when downloading
content.

## Contributing

Issues and pull requests are welcome. If you're proposing a larger change,
please open an issue first to discuss what you'd like to change.

## 👩‍💻 Creators

<table width="100%">
    <tr>
      <td align="center" width="50%">
        <img src="https://random-images-anya.vercel.app/anya" width="260"><br><br>
        <b>𝜜ɴყꫝㅤ𓆩💗𓆪</b><br><br>
        <a href="https://github.com/itz-Anya">
          <img src="https://img.shields.io/badge/GitHub-Itz--Anya-black?style=for-the-badge&logo=github">
        </a>
      </td>
      <td align="center" width="50%">
        <img src="https://itz-murali-images.vercel.app/api" width="260"><br><br>
        <b>𝐌 𝐔 𝐑 𝚨 𝐋 𝐈 𓂃ִֶָ⋆.˚</b><br><br>
        <a href="https://github.com/Itz-Murali">
          <img src="https://img.shields.io/badge/GitHub-Itz--Murali-black?style=for-the-badge&logo=github">
        </a>
      </td>
    </tr>
  </table>


---


## License

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for details.

---

<div align="center">
<sub>Built with a single input bar, three platforms, and no watermarks.</sub>
</div>
