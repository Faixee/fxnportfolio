const API_URL = 'http://localhost:5004/api';

const addLog = (message, type = 'info') => {
    const logs = document.getElementById('logs');
    const entry = document.createElement('div');
    entry.className = `log-entry ${type}`;
    const time = new Date().toLocaleTimeString();
    entry.innerText = `[${time}] ${message}`;
    logs.prepend(entry);
};

document.getElementById('executeBtn').addEventListener('click', async () => {
    const taskType = document.getElementById('taskType').value;
    const payload = document.getElementById('payload').value;

    if (!payload) {
        addLog('Error: Empty payload submitted', 'error');
        return;
    }

    const loader = document.getElementById('loader');
    const resultDiv = document.getElementById('result');
    const executeBtn = document.getElementById('executeBtn');

    loader.classList.remove('hidden');
    resultDiv.classList.add('hidden');
    executeBtn.disabled = true;

    addLog(`Initiating orchestration for task: ${taskType}`);

    try {
        const response = await fetch(`${API_URL}/orchestrate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ taskType, payload })
        });

        const data = await response.json();

        if (data.status === 'success') {
            addLog(`Orchestration completed successfully`, 'success');
            
            document.getElementById('outputBox').innerText = data.data.result;
            document.getElementById('timestamp').innerText = new Date(data.timestamp).toLocaleString();
            
            const metaGrid = document.getElementById('metadataGrid');
            metaGrid.innerHTML = `
                <div><strong>Model:</strong> ${data.data.metadata.model}</div>
                <div><strong>Confidence:</strong> ${(data.data.metadata.confidence * 100).toFixed(1)}%</div>
            `;

            resultDiv.classList.remove('hidden');
        } else {
            throw new Error(data.message || 'Execution failed');
        }
    } catch (err) {
        addLog(`System Error: ${err.message}`, 'error');
        alert(`Enterprise System Error: ${err.message}`);
    } finally {
        loader.classList.add('hidden');
        executeBtn.disabled = false;
    }
});

// Initial health check
(async () => {
    try {
        const res = await fetch('http://localhost:5004/health');
        if (res.ok) addLog('Backend connectivity verified', 'success');
    } catch (e) {
        addLog('Backend offline. Please start the server.', 'error');
    }
})();
