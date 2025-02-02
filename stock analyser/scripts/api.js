
const RAPIDAPI_KEY = '59f4badec0msh765f5a26f2c009bp171eafjsn1920ab68bb99';
const RAPIDAPI_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com'; 


export async function fetchYahooIntradayData(symbol) {
  const url = `https://${RAPIDAPI_HOST}/stock/v2/get-chart?interval=5m&symbol=${symbol}&range=1d&region=US`;

  const options = {
    method: 'GET',
    headers: {
      'X-RapidAPI-Key': RAPIDAPI_KEY,
      'X-RapidAPI-Host': RAPIDAPI_HOST,
    },
  };

  try {
    const response = await fetch(url, options);
    const data = await response.json();

    if (!data.chart?.result?.[0]) {
      console.error('Yahoo Finance: No chart data found for', symbol, data);
      return null;
    }

    const result = data.chart.result[0];
    const timestamps = result.timestamp; 
    const quotes = result.indicators.quote[0].close; 


    if (!timestamps || !quotes) {
      console.error('Yahoo Finance: Missing timestamps/quotes.', symbol, data);
      return null;
    }

    const timeSeries = {};
    for (let i = 0; i < timestamps.length; i++) {
      const ts = timestamps[i];
      const price = quotes[i];
      if (price === null) continue; 

      const dateObj = new Date(ts * 1000);
      const dateStr = dateObj.toLocaleString(); 
      timeSeries[dateStr] = { '4. close': price };
    }

    return timeSeries;

  } catch (error) {
    console.error('Network/API Error (Yahoo Finance):', error);
    return null;
  }
}
