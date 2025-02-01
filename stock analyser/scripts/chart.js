
let stockChart; 


export function initChart(canvas) {
  const ctx = canvas.getContext('2d');

  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
  gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');

  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], 
      datasets: [
        {
          label: 'Stock Price',
          data: [], 
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: gradient, 
          borderWidth: 2,
          fill: true, 
          tension: 0.1, 
        },
      ],
    },
    options: {
      responsive: true,
      plugins: {
        legend: {
          display: true,
          position: 'top',
        },
      },
      scales: {
        x: {
          display: true,
          title: {
            display: true,
            text: 'Time',
          },
        },
        y: {
          display: true,
          title: {
            display: true,
            text: 'Price (USD)',
          },
        },
      },
    },
  });
}


export function updateChart(labels, prices) {
  if (!stockChart) {
    console.error('Chart not initialized yet!');
    return;
  }

  stockChart.data.labels = labels;
  stockChart.data.datasets[0].data = prices;
  stockChart.update();
}