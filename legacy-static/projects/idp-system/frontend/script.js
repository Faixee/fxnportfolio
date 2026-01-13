const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const analyzeBtn = document.getElementById('analyzeBtn');
const resultsSection = document.getElementById('resultsSection');
const processingOverlay = document.getElementById('processingOverlay');
const dataDisplay = document.getElementById('dataDisplay');
const stageIndicator = document.getElementById('stageIndicator');

// Drag & Drop
dropZone.addEventListener('click', () => fileInput.click());
dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});
dropZone.addEventListener('dragleave', () => dropZone.classList.remove('dragover'));
dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    if (e.dataTransfer.files.length) handleFile(e.dataTransfer.files[0]);
});
fileInput.addEventListener('change', () => {
    if (fileInput.files.length) handleFile(fileInput.files[0]);
});

function handleFile(file) {
    dropZone.querySelector('p').innerHTML = `File Selected: <strong>${file.name}</strong>`;
    analyzeBtn.disabled = false;
    analyzeBtn.onclick = () => startAnalysis(file);
}

async function startAnalysis(file) {
    analyzeBtn.disabled = true;
    resultsSection.classList.remove('hidden');
    processingOverlay.classList.remove('hidden');
    dataDisplay.classList.add('hidden');

    const stages = [
        "Preprocessing Image...",
        "De-skewing & Noise Reduction...",
        "Running CNN Layout Analysis...",
        "Extracting Text Layers...",
        "Identifying Named Entities...",
        "Validating Confidence Scores..."
    ];

    // Simulate Stages
    for (const stage of stages) {
        stageIndicator.innerText = stage;
        await new Promise(r => setTimeout(r, 800));
    }

    // Actual API Call
    const formData = new FormData();
    formData.append('document', file);

    try {
        const res = await fetch('http://localhost:5005/api/analyze', {
            method: 'POST',
            body: formData
        });
        const data = await res.json();

        if (data.status === 'success') {
            displayResults(data.data);
        } else {
            alert('Analysis Failed');
        }
    } catch (e) {
        console.error(e);
        alert('System Error');
    }
}

function displayResults(data) {
    processingOverlay.classList.add('hidden');
    dataDisplay.classList.remove('hidden');

    document.getElementById('confScore').innerText = (data.confidence * 100).toFixed(1) + '%';
    document.getElementById('docClass').innerText = data.classification;
    document.getElementById('entOrg').innerText = data.extractedData.entities.find(e => e.type === 'ORG')?.value || 'N/A';
    document.getElementById('entAmt').innerText = data.extractedData.entities.find(e => e.type === 'MONEY')?.value || 'N/A';
    document.getElementById('procTime').innerText = data.processingTimeMs + 'ms';
    
    document.getElementById('jsonOutput').innerText = JSON.stringify(data, null, 2);
}
