# ⚡ FitNova — Holistic Fitness & Wellness Ecosystem

> An all-in-one modern fitness web platform uniting personalized workout generation, macro & TDEE nutrition planning, guided mindfulness, and real-time nearby facility discovery into a high-performance, responsive experience.

[![Vercel Deployment](https://img.shields.io/badge/Live%20Demo-Vercel-black?style=for-the-badge&logo=vercel)](https://fitnova-sepia.vercel.app)
[![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/HTML)
[![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6+-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![OpenStreetMap](https://img.shields.io/badge/OpenStreetMap-Overpass_API-7EBC6F?style=for-the-badge&logo=openstreetmap&logoColor=white)](https://wiki.openstreetmap.org/wiki/Overpass_API)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg?style=for-the-badge)](LICENSE)

🌐 **Live Production App**: **[https://fitnova-sepia.vercel.app](https://fitnova-sepia.vercel.app)**

---

## 🌟 Key Features

| Module | Description | Technical Implementation |
| :--- | :--- | :--- |
| **🏋️ Dynamic Workout Generator** | Tailored multi-tiered routine generator by fitness goal, equipment (bodyweight, dumbbells, full gym), and difficulty level. | Interactive state machine with step-by-step rep tracking and persistent progress checkboxes. |
| **📊 Health Metrics Dashboard** | Precision metabolic calculators for Body Mass Index (BMI), Basal Metabolic Rate (BMR), and Total Daily Energy Expenditure (TDEE). | Dual Metric/Imperial conversions, Mifflin-St Jeor formula, and visual needle gauge rendering. |
| **🥗 Nutrition & Macro Planner** | Personalized calorie and macronutrient breakdown (carbs, proteins, fats) based on user goals (Fat Loss, Maintenance, Muscle Gain). | Dynamic recipe modal with dietary filtering (Vegan, Vegetarian, Keto, Balanced). |
| **🧘 4-7-8 Guided Breathwork** | Guided respiratory mindfulness bubble pacing users through inhale (4s), hold (7s), and exhale (8s) rhythms. | Synchronized SVG/CSS keyframe animation loops and real-time cycle countdowns. |
| **📍 Geolocation Fitness Finder** | Locates nearby gyms, yoga studios, sports centers, swimming pools, and running paths within 5 km. | HTML5 Geolocation + OpenStreetMap Overpass Turbo API + Haversine distance algorithm. |
| **🤖 Legend AI Coaching Bot** | Interactive floating consultation assistant providing instant guidance on workout splits, pricing, and nutrition. | Responsive floating chat widget with instant keyword intent mapping and quick prompt chips. |
| **💧 Hydration Tracker** | Daily water intake monitor with incremental glass tracking and localStorage state persistence. | Real-time percentage progress bar and persistent client-side storage. |

---

## 🛠️ Architecture & Tech Stack

```
fitnova/
├── index.html        # Semantic HTML5 structure with Open Graph & SEO metadata
├── fitness.css       # Custom design system, orbital backgrounds, glassmorphism & responsive drawer
├── fitness.js        # Engine for workout generation, health formulas, Overpass API & AI assistant
├── vercel.json       # Vercel deployment headers, security policies & clean routing
└── README.md         # Documentation & project overview
```

* **Core Languages**: HTML5, CSS3, JavaScript (ES6+)
* **APIs & Web Standards**:
  * [OpenStreetMap Overpass API](https://overpass-api.de/) for spatial leisure & sport facility querying
  * HTML5 `navigator.geolocation` for coordinate detection
  * Google Maps Search API integration for one-click turn-by-turn navigation
* **Mathematical Models & Algorithms**:
  * **Haversine Formula**: Calculates great-circle distance between user coordinates and queried fitness centers
  * **Mifflin-St Jeor Equation**: Computes baseline resting metabolic rate (BMR)
* **Design & Aesthetics**:
  * Bespoke dark theme with CSS glassmorphism, orbital ambient particle rings, and responsive mobile drawer navigation
  * Google Fonts: *Bebas Neue* & *DM Sans*

---

## 🚀 Getting Started

### 1. Clone the Repository
```bash
git clone https://github.com/zaptox369/fitnova.git
cd fitnova
```

### 2. Run Locally
FitNova is built purely with vanilla web technologies, requiring zero build steps or heavy node modules:

* Simply open `index.html` in any modern web browser:
  ```bash
  # Windows
  start index.html

  # macOS
  open index.html

  # Linux
  xdg-open index.html
  ```
* Or serve locally via Python / Live Server:
  ```bash
  python -m http.server 3000
  ```
  Then navigate to `http://localhost:3000`.

---

## ☁️ Deployment

FitNova is optimized for instant deployment on [Vercel](https://vercel.com):

```bash
# Deploy to production via Vercel CLI
npx vercel --prod
```

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
