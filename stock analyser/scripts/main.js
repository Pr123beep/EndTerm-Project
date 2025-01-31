// scripts/main.js

import { fetchIntradayData, fetchDailyData } from './api.js';
import { initChart, updateChart } from './chart.js';

// DOM Elements
const stockSymbolInput = document.getElementById('stock-symbol-input');
const addStockBtn = document.getElementById('add-stock-btn');
const stockList = document.getElementById('stock-list');
const chartCanvas = document.getElementById('stock-chart');
const performanceSummary = document.getElementById('overall-gain-loss');

// Data Structures to Store Stocks
let portfolio = []; // e.g. [ {symbol: 'AAPL', data: {...}} ]

// On window load (or DOMContentLoaded), initialize chart, load portfolio from localStorage, etc.
window.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  // Initialize the Chart.js chart
  initChart(chartCanvas);

  // Load portfolio from localStorage (if you want persistence)
  const savedPortfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
  portfolio = savedPortfolio;
  
  // Render any saved stocks in the UI
  portfolio.forEach((stock) => {
    addStockItemToDOM(stock.symbol, stock.latestPrice);
  });

  // Set up event listeners
  addStockBtn.addEventListener('click', handleAddStock);
}

async function handleAddStock() {
  const symbol = stockSymbolInput.value.toUpperCase().trim();
  if (!symbol) return;

  // Fetch intraday data from API
  const intradayData = await fetchIntradayData(symbol);
  if (!intradayData) {
    alert('Could not retrieve data for this symbol. Check the symbol or API limit.');
    return;
  }

  // Process intraday data to get the latest time and price
  const latestTime = Object.keys(intradayData)[0]; // first key is the most recent data
  const latestPrice = intradayData[latestTime]['4. close'];

  // Add to portfolio (in memory)
  portfolio.push({ symbol, latestPrice });
  savePortfolio();

  // Update the DOM (list item)
  addStockItemToDOM(symbol, latestPrice);

  // Clear input field
  stockSymbolInput.value = '';

  // Optionally, update chart with this stock's data
  // (If you want to show only one stock’s chart at a time, you’d do something like:)
  updateStockChart(symbol);
}

/**
 * Creates a new list item in the UL with the stock info and a remove button.
 * @param {string} symbol 
 * @param {string|number} price 
 */
function addStockItemToDOM(symbol, price) {
  const li = document.createElement('li');
  li.textContent = `${symbol}: $${Number(price).toFixed(2)}`;
  
  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    // Remove from DOM
    li.remove();
    // Remove from portfolio array
    portfolio = portfolio.filter(stock => stock.symbol !== symbol);
    savePortfolio();
  });

  li.appendChild(removeBtn);
  stockList.appendChild(li);
}

/**
 * Save current portfolio to localStorage
 */
function savePortfolio() {
  localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

/**
 * Fetch daily or intraday data and update the chart with it
 * @param {string} symbol - The stock symbol to chart
 */
async function updateStockChart(symbol) {
  // This example uses intraday data to build a small time-based chart
  const intradayData = await fetchIntradayData(symbol);
  if (!intradayData) return;

  // Sort the times in ascending order
  const timeStamps = Object.keys(intradayData).sort();
  const labels = [];
  const prices = [];

  timeStamps.forEach(time => {
    labels.push(time);
    prices.push(Number(intradayData[time]['4. close']));
  });

  // Update chart
  updateChart(labels, prices);
}

/* 
Optionally, you could add a function to periodically update your existing 
stocks in the portfolio, e.g. once per minute, but be mindful of API limits:
*/
setInterval(() => {
  portfolio.forEach(async (stock) => {
    const intradayData = await fetchIntradayData(stock.symbol);
    if (intradayData) {
      const latestTime = Object.keys(intradayData)[0];
      const latestPrice = intradayData[latestTime]['4. close'];
      // Update in-memory data
      stock.latestPrice = latestPrice;
      // Update performance summary, if you maintain cost basis, etc.
      updatePerformanceSummary();
      // Update the list item in the DOM to reflect the new price
      // (You’d need a reference to the list item or re-render the entire list.)
    }
  });
  savePortfolio();
}, 60000); // 60s interval

function updatePerformanceSummary() {
  // This function would handle overall gain/loss or other metrics,
  // but you need a cost basis or some reference data to compute that.
  // Example:
  let totalValue = 0;
  portfolio.forEach(stock => {
    totalValue += Number(stock.latestPrice); // simplistic; normally multiply by shares
  });
  
  performanceSummary.textContent = `Total current value: $${totalValue.toFixed(2)}`;
}
