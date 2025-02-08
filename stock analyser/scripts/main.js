import { fetchYahooIntradayData, fetchStockNews } from './api.js';
import { initChart, updateChart } from './chart.js';
import { initFinnhubFetch } from './finnhub.js';

let portfolio = []; 
let currentSymbol = null;

document.addEventListener('DOMContentLoaded', () => {
  initFinnhubFetch();

  const canvas = document.getElementById('stock-chart');
  initChart(canvas);

  loadPortfolioFromLocalStorage();

  renderPortfolioList();

  document.getElementById('add-stock-btn').addEventListener('click', addStockToPortfolio);
  document.getElementById('stock-symbol-input').addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addStockToPortfolio();
  });

  setupNavigation();

  displayNews();

  setupThemeToggle();

  //-->Auto-refresh data every 1 minute<--//
  setInterval(() => {
     refreshPortfolioData();
  }, 60000);
});

function setupNavigation() {
  const navLinks = document.querySelectorAll('.navbar ul li a');
  const dashboardPage = document.getElementById('dashboard-page');
  const profilePage = document.getElementById('profile-page');

  navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.getAttribute('data-page');
      if (page === 'dashboard-page') {
        dashboardPage.style.display = 'block';
        profilePage.style.display = 'none';
      } else if (page === 'profile-page') {
        dashboardPage.style.display = 'none';
        profilePage.style.display = 'block';
      }
    });
  });
}

async function addStockToPortfolio() {
  const symbolInput = document.getElementById('stock-symbol-input');
  const symbol = symbolInput.value.toUpperCase().trim();
  if (!symbol) return;

  const sharesStr = prompt(`How many shares of ${symbol} do you own?`, '10');
  const costBasisStr = prompt(`What is your cost basis (price/share) for ${symbol}?`, '100');

  const shares = parseFloat(sharesStr);
  const costBasis = parseFloat(costBasisStr);

  if (isNaN(shares) || isNaN(costBasis)) {
    alert('Invalid shares or cost basis. Stock not added.');
    return;
  }

  const existing = portfolio.find(item => item.symbol === symbol);
  if (existing) {
    alert(`${symbol} is already in your portfolio. Remove it or edit it first.`);
    return;
  }

  portfolio.push({
    symbol,
    shares,
    costBasis,
    currentPrice: 0
  });

  symbolInput.value = ''; 
  savePortfolioToLocalStorage();
  renderPortfolioList();
  await updateCurrentStockData(symbol); 
}

function renderPortfolioList() {
  const stockList = document.getElementById('stock-list');
  stockList.innerHTML = '';

  portfolio.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.symbol} - ${item.shares} shares @ \$${item.costBasis}`;

    const removeBtn = document.createElement('button');
    removeBtn.textContent = 'Remove';
    removeBtn.style.marginLeft = '10px';
    removeBtn.addEventListener('click', () => {
      removeStock(item.symbol);
    });

    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View';
    viewBtn.style.marginLeft = '5px';
    viewBtn.addEventListener('click', async () => {
      await updateCurrentStockData(item.symbol);
    });

    li.appendChild(viewBtn);
    li.appendChild(removeBtn);
    stockList.appendChild(li);
  });

  calculatePortfolioPerformance();
}

function removeStock(symbol) {
  portfolio = portfolio.filter(item => item.symbol !== symbol);
  savePortfolioToLocalStorage();
  renderPortfolioList();

  if (symbol === currentSymbol) {
    updateChart([], []);
    currentSymbol = null;
  }
}

async function updateCurrentStockData(symbol) {
  currentSymbol = symbol;

  const timeSeries = await fetchYahooIntradayData(symbol);
  if (!timeSeries) {
    alert(`No chart data found for ${symbol}.`);
    return;
  }

  const labels = Object.keys(timeSeries);
  const prices = Object.values(timeSeries).map(obj => obj['4. close']);

  updateChart(labels, prices);

  const lastPrice = prices[prices.length - 1];
  const item = portfolio.find(p => p.symbol === symbol);
  if (item) {
    item.currentPrice = lastPrice;
    calculatePortfolioPerformance();
  }
}


function calculatePortfolioPerformance() {
  let totalValue = 0;
  let totalCost = 0;

  portfolio.forEach(item => {
    if (!item.currentPrice) return;
    totalValue += item.currentPrice * item.shares;
    totalCost += item.costBasis * item.shares;
  });

  const overallGainLoss = document.getElementById('overall-gain-loss');
  const overallPL = document.getElementById('overall-pl');

  overallGainLoss.textContent = `Total Portfolio Value: $${totalValue.toFixed(2)}`;

  const pl = totalValue - totalCost;
  overallPL.textContent = `Profit/Loss: $${pl.toFixed(2)}`;
  overallPL.style.color = (pl >= 0) ? 'limegreen' : 'red';
}

async function refreshPortfolioData() {
  for (const item of portfolio) {
    const timeSeries = await fetchYahooIntradayData(item.symbol);
    if (!timeSeries) continue;
    const prices = Object.values(timeSeries).map(obj => obj['4. close']);
    const lastPrice = prices[prices.length - 1];
    item.currentPrice = lastPrice;
  }
  calculatePortfolioPerformance();

  if (currentSymbol) {
    await updateCurrentStockData(currentSymbol);
  }
}

function loadPortfolioFromLocalStorage() {
  const saved = localStorage.getItem('stockPortfolio');
  if (saved) {
    portfolio = JSON.parse(saved);
  } else {
    portfolio = [];
  }
}

function savePortfolioToLocalStorage() {
  localStorage.setItem('stockPortfolio', JSON.stringify(portfolio));
}


async function displayNews() {
  const newsContainer = document.getElementById('news-container');
  const articles = await fetchStockNews();

  articles.forEach(article => {
    const item = document.createElement('div');
    item.classList.add('news-item');
    const dateStr = new Date(article.publishedAt).toLocaleDateString();

    item.innerHTML = `
      <h4>${article.title}</h4>
      <p>${article.description || ''}</p>
      <p><small>${dateStr} | <a href="${article.url}" target="_blank">Read More</a></small></p>
    `;
    newsContainer.appendChild(item);
  });
}


function setupThemeToggle() {
  const themeSwitch = document.getElementById('theme-switch');
  const toggleLabel = document.getElementById('toggle-label');
  
  const isLight = localStorage.getItem('lightTheme') === 'true';
  document.body.classList.toggle('light-theme', isLight);
  themeSwitch.checked = isLight;
  toggleLabel.textContent = isLight ? 'Light Mode' : 'Dark Mode';

  themeSwitch.addEventListener('change', () => {
    document.body.classList.toggle('light-theme');
    const lightEnabled = document.body.classList.contains('light-theme');
    localStorage.setItem('lightTheme', lightEnabled.toString());
    toggleLabel.textContent = lightEnabled ? 'Light Mode' : 'Dark Mode';
  });
}
