document.getElementById('generateBtn').addEventListener('click', async () => {
    const prompt = document.getElementById('promptInput').value;
    const style = document.getElementById('styleInput').value;
    const length = document.getElementById('lengthInput').value;
    const btn = document.getElementById('generateBtn');
    const outputDiv = document.getElementById('outputContent');
    const metaInfo = document.getElementById('metaInfo');

    if (!prompt) {
        alert('Please enter a prompt');
        return;
    }

    // Set Loading State
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner"></span> Generating...';
    outputDiv.innerHTML = '';
    metaInfo.classList.add('hidden');

    try {
        const response = await fetch('http://localhost:5006/api/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ prompt, style, length })
        });

        const data = await response.json();

        if (data.status === 'success') {
            typeWriterEffect(data.data.content, outputDiv);
            
            // Update Meta
            document.getElementById('tokenCount').innerText = data.data.metadata.tokensUsed;
            document.getElementById('latency').innerText = data.data.metadata.latencyMs;
            setTimeout(() => metaInfo.classList.remove('hidden'), 500);
        } else {
            outputDiv.innerText = 'Error generating content.';
        }
    } catch (e) {
        console.error(e);
        outputDiv.innerText = 'System Error: Backend unreachable.';
    } finally {
        btn.disabled = false;
        btn.innerHTML = '<i class="fas fa-magic"></i> GENERATE CONTENT';
    }
});

function typeWriterEffect(text, element) {
    let i = 0;
    const speed = 20;
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    type();
}
