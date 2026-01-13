const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5002;

app.use(cors());
app.use(express.json());

app.post('/api/generate', (req, res) => {
    const { prompt, type } = req.body;
    
    if (!prompt) {
        return res.status(400).json({ error: 'Prompt is required' });
    }

    // Simulate AI generation
    setTimeout(() => {
        let generatedContent = '';
        if (type === 'text') {
            generatedContent = `This is a generated response for: "${prompt}". In a real-world scenario, this would be the output from an LLM like GPT-4 or Llama-3.`;
        } else {
            generatedContent = `https://via.placeholder.com/600x400/0ea5e9/ffffff?text=AI+Generated+Image+for+${encodeURIComponent(prompt)}`;
        }

        res.json({
            status: 'success',
            type,
            content: generatedContent,
            metadata: {
                model: 'GenAI-v2-Pro',
                tokensUsed: 154,
                generationTime: '1.2s'
            }
        });
    }, 2000);
});

app.get('/health', (req, res) => {
    res.json({ status: 'ok', service: 'Gen AI Backend' });
});

app.listen(PORT, () => {
    console.log(`Gen AI Backend running on port ${PORT}`);
});
