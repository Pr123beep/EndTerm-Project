// =================== Existing Code ===================

import { fetchYahooIntradayData, fetchStockNews } from './api.js';
import { initChart, updateChart } from './chart.js';
import { initFinnhubFetch } from './finnhub.js';

const stockSymbolInput = document.getElementById('stock-symbol-input');
const addStockBtn = document.getElementById('add-stock-btn');
const stockList = document.getElementById('stock-list');
const chartCanvas = document.getElementById('stock-chart');
const performanceSummary = document.getElementById('overall-gain-loss');
const newsContainer = document.getElementById('news-container');

let portfolio = [];

window.addEventListener('DOMContentLoaded', initApp);

function initApp() {
  initChart(chartCanvas);

  const savedPortfolio = JSON.parse(localStorage.getItem('portfolio')) || [];
  portfolio = savedPortfolio;

  portfolio.forEach((stock) => {
    addStockItemToDOM(stock.symbol, stock.latestPrice);
  });

  fetchAndDisplayNews();

  addStockBtn.addEventListener('click', handleAddStock);

  // Initialize page navigation event listeners
  initPageNavigation();

  // Initialize Finnhub fetch for Profile page (replacing Alpha Vantage)
  initFinnhubFetch();
}

async function handleAddStock() {
  const symbol = stockSymbolInput.value.toUpperCase().trim();
  if (!symbol) return;

  const intradayData = await fetchYahooIntradayData(symbol);
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
  fetchAndDisplayNews(symbol);
}

function addStockItemToDOM(symbol, price) {
  const li = document.createElement('li');
  li.textContent = `${symbol}: $${Number(price).toFixed(2)}`;

  const removeBtn = document.createElement('button');
  removeBtn.textContent = 'Remove';
  removeBtn.addEventListener('click', () => {
    li.remove();
    portfolio = portfolio.filter((stock) => stock.symbol !== symbol);
    savePortfolio();
  });

  li.appendChild(removeBtn);
  stockList.appendChild(li);
}

function savePortfolio() {
  localStorage.setItem('portfolio', JSON.stringify(portfolio));
}

async function updateStockChart(symbol) {
  const intradayData = await fetchYahooIntradayData(symbol);
  if (!intradayData) return;

  const timeStamps = Object.keys(intradayData).sort();
  const labels = [];
  const prices = [];

  timeStamps.forEach((time) => {
    labels.push(time);
    prices.push(Number(intradayData[time]['4. close']));
  });

  updateChart(labels, prices);
}

setInterval(() => {
  portfolio.forEach(async (stock) => {
    const intradayData = await fetchYahooIntradayData(stock.symbol);
    if (intradayData) {
      const latestTime = Object.keys(intradayData)[0];
      const latestPrice = intradayData[latestTime]['4. close'];
      stock.latestPrice = latestPrice;
      updatePerformanceSummary();
    }
  });
  savePortfolio();
}, 60000);

function updatePerformanceSummary() {
  let totalValue = 0;
  portfolio.forEach((stock) => {
    totalValue += Number(stock.latestPrice);
  });

  performanceSummary.textContent = `Total Portfolio Value: $${totalValue.toFixed(2)}`;
}

async function fetchAndDisplayNews() {
  const newsArticles = await fetchStockNews();
  if (!newsContainer) return;

  newsContainer.innerHTML = '';

  if (newsArticles.length === 0) {
    newsContainer.innerHTML = `<p>No business news available at the moment.</p>`;
    return;
  }

  newsArticles.forEach((article) => {
    const newsItem = document.createElement('div');
    newsItem.classList.add('news-item');
    newsItem.innerHTML = `
          <h4>${article.title}</h4>
          <p>${article.description || 'No description available.'}</p>
          <a href="${article.url}" target="_blank">Read More</a>
      `;
    newsContainer.appendChild(newsItem);
  });
}

// =================== New Code for Page Navigation ===================
function initPageNavigation() {
    const navLinks = document.querySelectorAll('.navbar a[data-page]');
    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetPageId = link.getAttribute('data-page');
        switchPage(targetPageId);
      });
    });
  }
  
  function switchPage(targetPageId) {
    const pages = ['dashboard-page', 'profile-page', 'settings-page'];
    pages.forEach((pageId) => {
      const page = document.getElementById(pageId);
      if (page) {
        page.style.display = pageId === targetPageId ? 'block' : 'none';
      }
    });
  }
  