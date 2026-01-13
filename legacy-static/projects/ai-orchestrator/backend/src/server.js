const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const rateLimit = require('express-rate-limit');
const logger = require('./utils/logger');
const errorHandler = require('./middleware/errorHandler');
const aiService = require('./services/aiService');

const app = express();
const PORT = process.env.PORT || 5004;

// Security Middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Logging Middleware
app.use(morgan('combined', { stream: { write: message => logger.info(message.trim()) } }));

// Rate Limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use('/api/', limiter);

// Routes
app.post('/api/orchestrate', async (req, res, next) => {
  try {
    const { taskType, payload } = req.body;
    
    if (!taskType || !payload) {
      const err = new Error('taskType and payload are required');
      err.statusCode = 400;
      throw err;
    }

    const result = await aiService.processTask(taskType, payload);
    res.json({
      status: 'success',
      timestamp: new Date().toISOString(),
      data: result
    });
  } catch (error) {
    next(error);
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'up', version: '1.0.0', service: 'AI Orchestrator' });
});

// Error Handling
app.use(errorHandler);

app.listen(PORT, () => {
  logger.info(`Enterprise AI Orchestrator running on port ${PORT}`);
});
