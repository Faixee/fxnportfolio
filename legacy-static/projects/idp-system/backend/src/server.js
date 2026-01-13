const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const logger = require('./utils/logger');
const ocrService = require('./services/ocrService');

const app = express();
const PORT = process.env.PORT || 5005;

// Configuration
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

const upload = multer({ storage: multer.memoryStorage() });

// Rate Limiter
const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 50
});
app.use('/api/', limiter);

// Routes
app.post('/api/analyze', upload.single('document'), async (req, res) => {
    try {
        if (!req.file) {
            logger.warn('Analysis request rejected: No file provided');
            return res.status(400).json({ error: 'No document uploaded' });
        }

        const result = await ocrService.processDocument(req.file.buffer, req.file.originalname);
        res.json({ status: 'success', data: result });

    } catch (error) {
        logger.error(`Processing failed: ${error.message}`);
        res.status(500).json({ error: 'Internal Processing Error' });
    }
});

app.get('/health', (req, res) => {
    res.json({ status: 'active', system: 'IDP Core', version: '2.0.0' });
});

app.listen(PORT, () => {
    logger.info(`IDP Enterprise Engine running on port ${PORT}`);
});
