
const APIKEY = 'C53B7YYT8EQEYNVH';
const BASEURL= 'https://www.alphavantage.co/query';


export async function fetchIntradayData(symbol) {
  const url = `${BASEURL}?function=TIME_SERIES_INTRADAY` + 
              `&symbol=${symbol}&interval=5min&apikey=${APIKEY}`;

  try {
    const response = await fetch(url);
    const data = await response.json();

    if (data['Time Series (5min)']) {
      return data['Time Series (5min)'];
    } else {
      console.error('Error or Invalid response:', data);
      return null;
    }
  } catch (error) {
    console.error('Network/API Error:', error);
    return null;
  }
}


export async function fetchDailyData(symbol) {
  const url = `${BASEURL}?function=TIME_SERIES_DAILY&symbol=${symbol}&apikey=${APIKEY}`;

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

