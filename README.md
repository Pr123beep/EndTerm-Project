# 💹 STOCKO PORTFOLIOKO

_A modern, interactive stock analyzer & portfolio tracker with live data, charts, and news feeds._

[![License: MIT](https://img.shields.io/badge/License-MIT-green.svg)](https://opensource.org/licenses/MIT)
[![JavaScript](https://img.shields.io/badge/JavaScript-ES6-yellow.svg)](https://www.ecma-international.org/ecma-262/6.0/)
[![Chart.js](https://img.shields.io/badge/Chart.js-v3.x-blue.svg)](https://www.chartjs.org/)

---

## Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Installation](#installation)
- [Usage](#usage)
- [File Structure](#file-structure)
- [Technologies Used](#technologies-used)
- [API Integrations](#api-integrations)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

**STOCKO PORTFOLIOKO** (also known as **MarketVision: Live Insights**) is a responsive web application that helps you analyze your stock portfolio. The app allows you to:

- **Track and manage your stock holdings:** Easily add, view, and remove stocks from your portfolio.
- **Visualize stock data:** Fetch live intraday data and render interactive charts using Chart.js.
- **Stay informed:** Read the latest business news and company profiles.
- **Customize your view:** Switch between Dark Mode and Light Mode for a personalized experience.

---

## Features

- **Live Data Fetching:**  
  - Uses **Yahoo Finance API** (via RapidAPI) for intraday stock data.
  - Integrates with **Finnhub API** for real-time quotes and company profiles.

- **Interactive Charts:**  
  - Displays dynamic stock price charts powered by **Chart.js**.

- **Portfolio Management:**  
  - Add stocks with share count and cost basis.
  - Calculate total portfolio value and profit/loss.
  - Persist portfolio data using Local Storage.

- **Latest Business News:**  
  - Fetches and displays up-to-date business news articles.

- **Theme Toggle:**  
  - Seamlessly switch between Dark Mode and Light Mode.

- **Responsive & Animated UI:**  
  - Smooth page transitions, fade-in effects, and responsive design for an enhanced user experience.

---

## Installation

To run this project locally, follow these steps:

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/stock-analyzer-app.git
   cd stock-analyzer-app
   ```

2. **Configure API Keys:**
   - Open the JavaScript files (`api.js`, `finnhub.js`) located in the `scripts/` directory.
   - Replace the demo API keys with your own:
     - **RapidAPI Key** for Yahoo Finance data.
     - **Finnhub API Key** for stock quotes and company profiles.
     - **NewsAPI Key** (or the alternative news URL) as required.

3. **Open the App:**
   - Simply open the `index.html` file in your favorite browser, or run a local server (e.g., using Live Server in VS Code).

---

## License

This project is licensed under the MIT License. See the LICENSE file for details.

---

## Contact

For any questions, suggestions, or feedback, please reach out:

- **Your Name:** your.email@example.com  
- **GitHub:** [@yourusername](https://github.com/yourusername)

Happy Investing! 🚀
