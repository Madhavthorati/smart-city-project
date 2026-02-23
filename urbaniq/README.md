# UrbanIQ — Smart City Platform
## VS Code Setup Guide

---

## 📁 Project Structure

```
urbaniq/
├── index.html              ← Main entry point (open this)
├── css/
│   └── main.css            ← All light-theme styles
├── js/
│   ├── main.js             ← Module router + clock + city switcher
│   └── chat.js             ← AI chatbot logic
└── modules/                ← Each city module (loads on click)
    ├── dashboard.js        ← City overview
    ├── aqi.js              ← Air Quality
    ├── bus.js              ← Bus timings & routes
    ├── traffic.js          ← Traffic status
    ├── repairs.js          ← Road repairs
    ├── electricity.js      ← Power grid
    ├── water.js            ← Water supply
    ├── waste.js            ← Waste management
    └── emergency.js        ← Emergency, hospitals, schools,
                               municipal, events, alerts, AI, map
```

---

## 🚀 Quick Start in VS Code

### Option 1 — Live Server (Recommended)
1. Open VS Code
2. Install extension: **Live Server** by Ritwick Dey
3. Open the `urbaniq/` folder in VS Code
4. Right-click `index.html` → **"Open with Live Server"**
5. Browser opens at `http://127.0.0.1:5500`

### Option 2 — Simple HTTP Server
```bash
# Python 3 (run inside the urbaniq/ folder)
cd urbaniq
python -m http.server 8080
# Open: http://localhost:8080
```

### Option 3 — Node.js
```bash
npx serve urbaniq/
# or
npx http-server urbaniq/
```

> ⚠️ **Do NOT** open `index.html` directly as `file://` — 
> the dynamic module loader requires an HTTP server.

---

## 🧭 How Navigation Works

Each sidebar item dynamically loads its own JS module:

```
User clicks "🚌 Bus & Routes"
  → loadModule('bus', navEl) in main.js
  → Injects <script src="modules/bus.js"> once
  → Calls render_bus(frameEl)
  → Content replaces the center panel
```

Every module exports one function: `render_<name>(el)`.
This makes modules fully independent and easy to edit.

---

## ✏️ How to Edit a Module

Open `modules/bus.js` and modify the `render_bus` function.
Save → Live Server auto-reloads → click the nav item to see changes.

Example — Change bus route:
```js
// In modules/bus.js, find the buses array:
{no:'BUS 17', color:'blue', from:'Sector 17', to:'ISBT Sector 43', eta:3, ...}
// Change eta:3 to eta:7 to show a different arrival time
```

---

## 🎨 Theme Customization

All colors are in `css/main.css` under `:root {}`:
```css
:root {
  --blue:   #1a6fdb;   /* Primary accent */
  --green:  #16a34a;   /* Success / Good */
  --red:    #dc2626;   /* Critical / Alert */
  --yellow: #ca8a04;   /* Warning */
  ...
}
```

---

## 🔌 Real API Integration Points

| Feature | API to integrate |
|---|---|
| Bus Timings | GMCBL API / DIMTS API / GTFS feed |
| Traffic | Google Maps Traffic API / HERE API |
| AQI | CPCB API / OpenAQ API |
| Weather | OpenWeatherMap API |
| Maps | Leaflet.js + OpenStreetMap |
| ML Models | FastAPI backend + scikit-learn/TensorFlow |
| Database | MongoDB / PostgreSQL + REST API |

---

## 🗄️ Recommended Backend Stack

```
Frontend:  HTML + CSS + Vanilla JS (this project)
Backend:   Node.js (Express) or Python (FastAPI)
Database:  MongoDB (real-time) + PostgreSQL (analytics)
ML:        Python scikit-learn / TensorFlow / Hugging Face
Realtime:  Socket.IO or Server-Sent Events
Maps:      Leaflet.js (free) or Google Maps API
```

---

## 📦 VS Code Recommended Extensions

- **Live Server** — instant reload on save
- **Prettier** — code formatting
- **ESLint** — JavaScript linting
- **Path Intellisense** — autocomplete file paths
- **GitLens** — version control
