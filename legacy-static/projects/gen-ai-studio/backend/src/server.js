const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const llmService = require('./services/llmService');

const app = express();
const PORT = process.env.PORT || 5006;

app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100
});
app.use('/api/', limiter);

app.post('/api/generate', async (req, res) => {
    try {
        const { prompt, style, length } = req.body;
        
        if (!prompt) {
            return res.status(400).json({ error: 'Prompt is required' });
        }

        const result = await llmService.generateContent(prompt, style || 'professional', length || 'medium');
        
        res.json({
            status: 'success',
            data: result
        });
    } catch (error) {
        logger.error(`Generation failed: ${error.message}`);
        res.status(500).json({ error: 'Generation Failed' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'active', system: 'Gen AI Studio', version: '2.0.0' });
});

app.listen(PORT, () => {
    logger.info(`Gen AI Studio Engine running on port ${PORT}`);
});
