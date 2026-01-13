const logger = require('../utils/logger');

class OCRService {
    async processDocument(fileBuffer, fileName) {
        logger.info(`Starting OCR processing for: ${fileName}`);

        // Simulate advanced processing stages
        await this._simulateProcessingStage('Preprocessing & De-skewing', 800);
        await this._simulateProcessingStage('Layout Analysis (CNN)', 1200);
        await this._simulateProcessingStage('Text Extraction (LSTM)', 1500);
        await this._simulateProcessingStage('Entity Recognition (BERT)', 1000);

        // Mock Result based on filename or random
        const isInvoice = fileName.toLowerCase().includes('invoice');
        
        return {
            documentId: `DOC-${Date.now()}`,
            classification: isInvoice ? 'Financial Document / Invoice' : 'General Contract',
            confidence: 0.985,
            extractedData: {
                merchant: isInvoice ? 'Tech Solutions Inc.' : 'Global Corp Ltd.',
                date: new Date().toISOString().split('T')[0],
                totalAmount: isInvoice ? '$4,500.00' : 'N/A',
                entities: [
                    { type: 'ORG', value: 'Tech Solutions Inc.', confidence: 0.99 },
                    { type: 'DATE', value: '2025-01-15', confidence: 0.98 },
                    { type: 'MONEY', value: '$4,500.00', confidence: 0.97 }
                ]
            },
            processingTimeMs: 4500
        };
    }

    async _simulateProcessingStage(stageName, ms) {
        logger.info(`Executing stage: ${stageName}`);
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

module.exports = new OCRService();
