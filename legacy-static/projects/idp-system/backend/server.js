const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());

app.post('/api/analyze', (req, res) => {
    const { documentName, contentType } = req.body;
    
    if (!documentName) {
        return res.status(400).json({ error: 'Document name is required' });
    }

    // Simulate AI processing
    setTimeout(() => {
        res.json({
            status: 'success',
            results: {
                extractedText: `Sample text from ${documentName}...`,
                classification: 'Invoice',
                confidence: 0.98,
                entities: [
                    { type: 'Date', value: '2025-12-31' },
                    { type: 'Amount', value: '$1,250.00' },
                    { type: 'Vendor', value: 'LogiLink LLC' }
                ]
            }
        });
    }, 1500);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'IDP Backend' });
});

app.listen(PORT, () => {
    console.log(`IDP Backend running on port ${PORT}`);
});
