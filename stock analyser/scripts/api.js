

const RAPIDAPI_KEY = '47f8166344msh01d3e2a14a86f6dp1df103jsnc00ce27f4276';
const RAPIDAPI_HOST = 'apidojo-yahoo-finance-v1.p.rapidapi.com';

const NEWSAPI_KEY = 'c6caf300dbf94cf3a6a16b58ba4c7a77';
const NEWSAPI_URL = 'https://newsapi.org/v2/everything';

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
            // --> HH:MM format
            const dateStr = dateObj.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
            timeSeries[dateStr] = { '4. close': price };
        }

        return timeSeries;

    } catch (error) {
        console.error('Network/API Error (Yahoo Finance):', error);
        return null;
    }
}

const NEWS_API_URL = 'https://saurav.tech/NewsAPI/top-headlines/category/business/in.json';

export async function fetchStockNews() {
    try {
        const response = await fetch(NEWS_API_URL);
        const data = await response.json();

        console.log("🔍 News API Response:", data);
        if (data && data.articles && data.articles.length > 0) {
            return data.articles.slice(0, 5);
        } else {
            console.warn('⚠️ No business news found. Check API response.');
            return [];
        }
    } catch (error) {
        console.error('❌ Network/API Error (Business News):', error);
        return [];
    }
}
