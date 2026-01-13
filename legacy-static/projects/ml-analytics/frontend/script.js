let chartInstance = null;

document.getElementById('predictBtn').addEventListener('click', async () => {
    const dataInput = document.getElementById('dataInput').value;
    const btn = document.getElementById('predictBtn');
    
    // Validate Input
    const data = dataInput.split(',').map(x => parseFloat(x.trim())).filter(x => !isNaN(x));
    
    if (data.length < 2) {
        alert('Please enter at least 2 numerical values.');
        return;
    }

    btn.disabled = true;
    btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Processing...';

    try {
        const start = performance.now();
        const response = await fetch('http://localhost:5001/api/predict', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ data })
        });

        const res = await response.json();
        const end = performance.now();

        if (res.status === 'success') {
            updateDashboard(res.data, data, end - start);
        } else {
            alert('Prediction Failed');
        }

    } catch (e) {
        console.error(e);
        alert('System Error: Analytics Engine Offline');
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-calculator"></i> Run Prediction Model';
    }
});

function updateDashboard(result, inputData, latency) {
    // Update KPIs
    document.getElementById('predValue').innerText = result.prediction;
    document.getElementById('procTime').innerText = Math.round(latency);

    // Update Features List
    const list = document.getElementById('featuresList');
    list.innerHTML = '';
    result.featuresImportance.forEach(f => {
        const item = `
            <div class="feature-item">
                <div class="feature-name">${f.feature}</div>
                <div class="feature-bar-bg">
                    <div class="feature-bar-fill" style="width: ${f.importance * 100}%"></div>
                </div>
                <div class="feature-val">${(f.importance * 100).toFixed(0)}%</div>
            </div>
        `;
        list.innerHTML += item;
    });

    // Update Chart
    renderChart(inputData, parseFloat(result.prediction));
}

function renderChart(historicalData, prediction) {
    const ctx = document.getElementById('mainChart').getContext('2d');
    
    if (chartInstance) {
        chartInstance.destroy();
    }

    // Generate Labels
    const labels = historicalData.map((_, i) => `T-${historicalData.length - i}`);
    labels.push('Forecast');

    // Chart Data
    const dataPoints = [...historicalData, prediction];
    
    chartInstance = new Chart(ctx, {
        type: 'line',
        data: {
            labels: labels,
            datasets: [{
                label: 'Metric Trend',
                data: dataPoints,
                borderColor: '#bb86fc',
                backgroundColor: 'rgba(187, 134, 252, 0.1)',
                borderWidth: 2,
                pointBackgroundColor: '#03dac6',
                fill: true,
                tension: 0.4
            }]
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
                legend: { display: false },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    backgroundColor: '#1e1e1e',
                    titleColor: '#e0e0e0',
                    bodyColor: '#e0e0e0',
                    borderColor: '#333',
                    borderWidth: 1
                }
            },
            scales: {
                y: {
                    grid: { color: '#333' },
                    ticks: { color: '#a0a0a0' }
                },
                x: {
                    grid: { display: false },
                    ticks: { color: '#a0a0a0' }
                }
            }
        }
    });
}
