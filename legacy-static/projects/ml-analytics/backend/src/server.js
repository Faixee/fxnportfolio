const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const predictiveService = require('./services/predictiveService');

const app = express();
const PORT = process.env.PORT || 5001;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200
});
app.use('/api/', limiter);

app.post('/api/predict', async (req, res) => {
    try {
        const { data } = req.body;
        
        if (!data || !Array.isArray(data) || data.length === 0) {
            return res.status(400).json({ error: 'Valid numeric data array is required' });
        }

        const result = await predictiveService.predict(data);
        
        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        logger.error(`Prediction failed: ${error.message}`);
        res.status(500).json({ error: 'Prediction Engine Error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'active', system: 'ML Analytics Engine', version: '2.0.0' });
});

app.listen(PORT, () => {
    logger.info(`ML Analytics Engine running on port ${PORT}`);
});
