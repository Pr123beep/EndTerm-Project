// scripts/api.js

// --- Replace the placeholder with your actual API key and base URL ---
const ALPHA_VANTAGE_API_KEY = 'K8CXAIVO2M5180ER';
const BASE_URL_ALPHA = 'https://www.alphavantage.co/query';

/**
 * Fetch intraday data (e.g. 1-minute interval) for the given symbol.
 * @param {string} symbol - The stock symbol (e.g. 'AAPL').
 * @returns {Object} - Parsed JSON response or null if there's an error.
 */
export async function fetchIntradayData(symbol) {
  const url = `${BASE_URL_ALPHA}?function=TIME_SERIES_INTRADAY` + 
              `&symbol=${symbol}&interval=1min&apikey=${ALPHA_VANTAGE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    // Check if the expected data field exists
    if (data['Time Series (1min)']) {
      return data['Time Series (1min)'];
    } else {
      // Could be an invalid symbol or API limit reached
      console.error('Error or Invalid response:', data);
      return null;
    }
  } catch (error) {
    console.error('Network/API Error:', error);
    return null;
  }
}

/**
 * Fetch daily data for the given symbol.
 * You might use this for longer-term charts or performance summaries.
 * @param {string} symbol 
 * @returns {Object} - Parsed JSON or null if error.
 */
export async function fetchDailyData(symbol) {
  const url = `${BASE_URL_ALPHA}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${ALPHA_VANTAGE_API_KEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data['Time Series (Daily)']) {
      return data['Time Series (Daily)'];
    } else {
      console.error('Error or Invalid response:', data);
      return null;
    }
  } catch (error) {
    console.error('Network/API Error:', error);
    return null;
  }
}

