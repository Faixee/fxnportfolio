const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5003;

app.use(cors());
app.use(express.json());

app.post('/api/predict', (req, res) => {
    const { dataPoints } = req.body;
    
    if (!dataPoints || !Array.isArray(dataPoints)) {
        return res.status(400).json({ error: 'Valid data points array is required' });
    }

    // Simulate ML Prediction (Linear Regression / Trend Analysis)
    setTimeout(() => {
        const lastValue = dataPoints[dataPoints.length - 1];
        const trend = dataPoints[dataPoints.length - 1] > dataPoints[0] ? 'Upward' : 'Downward';
        const prediction = lastValue * (trend === 'Upward' ? 1.15 : 0.85);

        res.json({
            status: 'success',
            analysis: {
                currentTrend: trend,
                predictedNextValue: prediction.toFixed(2),
                confidenceInterval: [ (prediction * 0.95).toFixed(2), (prediction * 1.05).toFixed(2) ],
                anomalyDetected: Math.random() > 0.8
            }
        });
    }, 1200);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'ML Analytics Backend' });
});

app.listen(PORT, () => {
    console.log(`ML Analytics Backend running on port ${PORT}`);
});
