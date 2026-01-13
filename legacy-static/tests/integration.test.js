const http = require('http');

async function testEndpoint(port, path, method, body) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'localhost',
            port: port,
            path: path,
            method: method,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        const req = http.request(options, (res) => {
            let data = '';
            res.on('data', (chunk) => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`Status ${res.statusCode}: ${data}`));
                }
            });
        });

        req.on('error', (e) => reject(e));
        if (body) req.write(JSON.stringify(body));
        req.end();
    });
}

async function runTests() {
    console.log('--- Starting System Integration Tests ---\n');

    // Test IDP System (Port 5001)
    try {
        console.log('[IDP] Testing /api/analyze...');
        const res = await testEndpoint(5001, '/api/analyze', 'POST', { documentName: 'test.pdf' });
        console.log('[IDP] PASS: Extracted classification:', res.results.classification);
    } catch (e) {
        console.log('[IDP] FAIL:', e.message);
    }

    // Test Gen AI Studio (Port 5002)
    try {
        console.log('[GenAI] Testing /api/generate...');
        const res = await testEndpoint(5002, '/api/generate', 'POST', { prompt: 'Hello AI', type: 'text' });
        console.log('[GenAI] PASS: Generated content length:', res.content.length);
    } catch (e) {
        console.log('[GenAI] FAIL:', e.message);
    }

    // Test ML Analytics (Port 5003)
    try {
        console.log('[Analytics] Testing /api/predict...');
        const res = await testEndpoint(5003, '/api/predict', 'POST', { dataPoints: [1, 2, 3, 4, 5] });
        console.log('[Analytics] PASS: Predicted value:', res.analysis.predictedNextValue);
    } catch (e) {
        console.log('[Analytics] FAIL:', e.message);
    }

    // Test AI Orchestrator (Port 5004)
    try {
        console.log('[Orchestrator] Testing /api/orchestrate...');
        const res = await testEndpoint(5004, '/api/orchestrate', 'POST', { taskType: 'summarize', payload: 'Deep learning is a subset of machine learning.' });
        console.log('[Orchestrator] PASS: Execution status:', res.status);
    } catch (e) {
        console.log('[Orchestrator] FAIL:', e.message);
    }

    console.log('\n--- Tests Completed ---');
}

runTests();
