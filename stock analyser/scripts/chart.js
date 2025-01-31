// scripts/chart.js

// We'll create a single chart instance for demonstration.
// If you need multiple charts, you can make them similarly,
// or dynamically generate them.

let stockChart; // We'll initialize it later in an init function

/**
 * Initialize a line chart using Chart.js
 * @param {HTMLCanvasElement} canvas - The canvas element where the chart renders
 */
export function initChart(canvas) {
  const ctx = canvas.getContext('2d');

  // Create gradient for the chart fill
  const gradient = ctx.createLinearGradient(0, 0, 0, 400);
  gradient.addColorStop(0, 'rgba(75, 192, 192, 0.8)');
  gradient.addColorStop(1, 'rgba(75, 192, 192, 0.1)');

  // Initialize the chart
  stockChart = new Chart(ctx, {
    type: 'line',
    data: {
      labels: [], // Timestamps go here
      datasets: [
        {
          label: 'Stock Price',
          data: [], // Prices go here
          borderColor: 'rgba(75, 192, 192, 1)',
          backgroundColor: gradient, // Apply the gradient
          borderWidth: 2,
          fill: true, // Enable fill for the gradient
          tension: 0.1, // Add slight curve to the line
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

/**
 * Update the chart labels and data
 * @param {string[]} labels - Array of labels (timestamps)
 * @param {number[]} prices - Array of closing prices
 */
export function updateChart(labels, prices) {
  if (!stockChart) {
    console.error('Chart not initialized yet!');
    return;
  }

  // Update chart data
  stockChart.data.labels = labels;
  stockChart.data.datasets[0].data = prices;

  // Re-render the chart
  stockChart.update();
}