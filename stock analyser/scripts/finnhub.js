

const FINNHUB_API_KEY = 'cuhfj49r01qva71tmf4gcuhfj49r01qva71tmf50';

export function initFinnhubFetch() {
  const finnhubBtn = document.getElementById('fetch-alpha-btn');
  if (finnhubBtn) {
    finnhubBtn.addEventListener('click', async () => {
      const symbolInput = document.getElementById('alpha-stock-input');
      const symbol = symbolInput.value.toUpperCase().trim();
      if (!symbol) return;

      const data = await fetchFinnhubQuote(symbol);
      displayFinnhubQuote(symbol, data);
    });
  }

  const profileBtn = document.getElementById('fetch-profile-btn');
  if (profileBtn) {
    profileBtn.addEventListener('click', async () => {
      const symbolInput = document.getElementById('alpha-stock-input');
      const symbol = symbolInput.value.toUpperCase().trim();
      if (!symbol) return;

      const profileData = await fetchCompanyProfile(symbol);
      displayCompanyProfile(symbol, profileData);
    });
  }
}

async function fetchFinnhubQuote(symbol) {
  const url = `https://finnhub.io/api/v1/quote?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.c) {
      return data;
    } else {
      console.error('Finnhub: Unexpected response', data);
      alert('Could not fetch quote data. Please check the symbol or API key.');
      return null;
    }
  } catch (error) {
    console.error('Finnhub: Network/API Error', error);
    alert('Network error while fetching Finnhub quote data.');
    return null;
  }
}

function displayFinnhubQuote(symbol, quoteData) {
  const container = document.getElementById('alpha-vantage-data');
  container.innerHTML = '';
  if (!quoteData) {
    container.innerHTML = `<p>No quote data available for ${symbol}.</p>`;
    return;
  }

  const table = document.createElement('table');
  table.style.width = '100%';
  table.style.borderCollapse = 'collapse';

  const header = document.createElement('tr');
  ['Metric', 'Value'].forEach((text) => {
    const th = document.createElement('th');
    th.textContent = text;
    th.style.border = '1px solid #ccc';
    th.style.padding = '8px';
    header.appendChild(th);
  });
  table.appendChild(header);

  const rows = [
    ['Current Price', quoteData.c],
    ['High Price', quoteData.h],
    ['Low Price', quoteData.l],
    ['Open Price', quoteData.o],
    ['Previous Close', quoteData.pc],
  ];

  rows.forEach((rowData) => {
    const row = document.createElement('tr');
    rowData.forEach((val, idx) => {
      const td = document.createElement('td');
      if (idx === 1 && !isNaN(val)) {
        td.textContent = Number(val).toFixed(2);
      } else {
        td.textContent = val;
      }
      td.style.border = '1px solid #ccc';
      td.style.padding = '8px';
      row.appendChild(td);
    });
    table.appendChild(row);
  });

  container.appendChild(table);
}

async function fetchCompanyProfile(symbol) {
  const url = `https://finnhub.io/api/v1/stock/profile2?symbol=${symbol}&token=${FINNHUB_API_KEY}`;
  try {
    const response = await fetch(url);
    const data = await response.json();
    if (data && data.name) {
      return data;
    } else {
      console.error('Finnhub Profile: Unexpected response', data);
      alert('No profile data available for this symbol.');
      return null;
    }
  } catch (error) {
    console.error('Finnhub Profile: Network/API Error', error);
    alert('Network error while fetching profile data.');
    return null;
  }
}

function displayCompanyProfile(symbol, profileData) {
  const container = document.getElementById('alpha-vantage-data');
  container.innerHTML = '';
  if (!profileData) {
    container.innerHTML = `<p>No profile data available for ${symbol}.</p>`;
    return;
  }

  const profileHTML = `
    <h3>${profileData.name} (${symbol})</h3>
    <img src="${profileData.logo}" alt="${profileData.name} Logo" style="width:100px;" />
    <p><strong>Industry:</strong> ${profileData.finnhubIndustry || 'N/A'}</p>
    <p><strong>Website:</strong> <a href="${profileData.weburl}" target="_blank">${profileData.weburl}</a></p>
    <p>${profileData.description || ''}</p>
  `;
  container.innerHTML = profileHTML;
}
