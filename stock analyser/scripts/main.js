import { fetchIntradayData, fetchDailyData } from './api.js';
import { initChart, updateChart } from './chart.js';

// DOM 
const stockSymbolInput = document.getElementById('stock-symbol-input');
const addStockBtn = document.getElementById('add-stock-btn');
const stockList = document.getElementById('stock-list');
const chartCanvas = document.getElementById('stock-chart');
const performanceSummary = document.getElementById('overall-gain-loss');

let portfolio = [];

window.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  initChart(chartCanvas);

  const savedPortfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
  portfolio = savedPortfolio;
  
  portfolio.forEach((stock) => {
    addStockItemToDOM(stock.symbol, stock.latestPrice);
  });

  addStockBtn.addEventListener('click', handleAddStock);
}

async function handleAddStock() {
  const symbol = stockSymbolInput.value.toUpperCase().trim();
  if (!symbol) return;

  const intradayData = await fetchIntradayData(symbol);
  if (!intradayData) {
    alert('Could not retrieve data for this symbol. Check the symbol or API limit.');
    return;
  }

  const latestTime = Object.keys(intradayData)[0];
  const latestPrice = intradayData[latestTime]['4. close'];

  portfolio.push({ symbol, latestPrice });
  savePortfolio();

  addStockItemToDOM(symbol, latestPrice);
  stockSymbolInput.value = '';


  updateStockChart(symbol);
}

function addStockItemToDOM(symbol, price) {
  const li = document.createElement('li');
  li.textContent = `${symbol}: $${Number(price).toFixed(2)}`;
  
  // Remove button
  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    li.remove();
    portfolio = portfolio.filter(stock => stock.symbol !== symbol);
    savePortfolio();
  });

  li.appendChild(removeBtn);
  stockList.appendChild(li);
}


function savePortfolio() {
  localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

async function updateStockChart(symbol) {
  const intradayData = await fetchIntradayData(symbol);
  if (!intradayData) return;

  const timeStamps = Object.keys(intradayData).sort();
  const labels = [];
  const prices = [];

  timeStamps.forEach(time => {
    labels.push(time);
    prices.push(Number(intradayData[time]['4. close']));
  });

  updateChart(labels, prices);
}


setInterval(() => {
  portfolio.forEach(async (stock) => {
    const intradayData = await fetchIntradayData(stock.symbol);
    if (intradayData) {
      const latestTime = Object.keys(intradayData)[0];
      const latestPrice = intradayData[latestTime]['4. close'];
      stock.latestPrice = latestPrice;
      updatePerformanceSummary();
    }
  });
  savePortfolio();
}, 50000); 

function updatePerformanceSummary() {
  let totalValue = 0;
  portfolio.forEach(stock => {
    totalValue += Number(stock.latestPrice);
  });
  
  performanceSummary.textContent = `Total current value: $${totalValue.toFixed(2)}`;
}
