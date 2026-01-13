// Custom Cursor Logic
const cursor = document.getElementById('cursor');
const cursorDot = document.getElementById('cursor-dot');

if (cursor && cursorDot) {
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
        cursorDot.style.left = e.clientX + 'px';
        cursorDot.style.top = e.clientY + 'px';
    });

    document.addEventListener('mousedown', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(0.8)';
        cursor.style.background = 'rgba(0, 210, 255, 0.1)';
    });

    document.addEventListener('mouseup', () => {
        cursor.style.transform = 'translate(-50%, -50%) scale(1)';
        cursor.style.background = 'transparent';
    });

    // Hover effects
    const hoverElements = document.querySelectorAll('button, a, .focus-list li, .metric-item');
    hoverElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            cursor.style.width = '40px';
            cursor.style.height = '40px';
            cursor.style.borderColor = 'var(--primary)';
            cursor.style.boxShadow = '0 0 20px rgba(0, 210, 255, 0.6)';
        });
        el.addEventListener('mouseleave', () => {
            cursor.style.width = '24px';
            cursor.style.height = '24px';
            cursor.style.borderColor = 'var(--primary)';
            cursor.style.boxShadow = 'var(--neon-glow)';
        });
    });
}

// Background Particles (Flowing Data Particles)
const canvas = document.getElementById('bg-canvas');
if (canvas) {
    const ctx = canvas.getContext('2d');
    let particlesArray = [];
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
        initParticles();
    });

    class Particle {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 2 + 0.5;
            this.speedX = Math.random() * 0.5 - 0.25;
            this.speedY = Math.random() * 0.5 - 0.25;
            this.color = 'rgba(0, 210, 255, ' + (Math.random() * 0.3 + 0.1) + ')';
        }
        update() {
            this.x += this.speedX;
            this.y += this.speedY;
            if (this.x > canvas.width) this.x = 0;
            else if (this.x < 0) this.x = canvas.width;
            if (this.y > canvas.height) this.y = 0;
            else if (this.y < 0) this.y = canvas.height;
        }
        draw() {
            ctx.fillStyle = this.color;
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particlesArray = [];
        let numberOfParticles = (canvas.width * canvas.height) / 15000;
        for (let i = 0; i < numberOfParticles; i++) {
            particlesArray.push(new Particle());
        }
    }

    function connectParticles() {
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let distance = ((particlesArray[a].x - particlesArray[b].x) ** 2) + 
                               ((particlesArray[a].y - particlesArray[b].y) ** 2);
                if (distance < (canvas.width / 10) * (canvas.height / 10)) {
                    let opacity = 1 - (distance / 15000);
                    ctx.strokeStyle = `rgba(0, 210, 255, ${opacity * 0.15})`;
                    ctx.lineWidth = 0.5;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
            particlesArray[i].draw();
        }
        connectParticles();
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();
}

// AI Visualization (Neural Network / Nodes)
const vizContainer = document.querySelector('.viz-nodes');
if (vizContainer) {
    const nodeCount = 12;
    for (let i = 0; i < nodeCount; i++) {
        const node = document.createElement('div');
        node.className = 'viz-node';
        
        // Random position within container
        const angle = (i / nodeCount) * Math.PI * 2;
        const radius = 120 + Math.random() * 40;
        const x = Math.cos(angle) * radius + 200;
        const y = Math.sin(angle) * radius + 200;
        
        node.style.left = `${x}px`;
        node.style.top = `${y}px`;
        node.style.animationDelay = `${Math.random() * 2}s`;
        
        vizContainer.appendChild(node);
    }
}

// Add styles for viz nodes dynamically
const style = document.createElement('style');
style.textContent = `
    .viz-node {
        position: absolute;
        width: 6px;
        height: 6px;
        background: var(--primary);
        border-radius: 50%;
        box-shadow: 0 0 10px var(--primary);
        animation: nodePulse 3s infinite ease-in-out;
    }
    @keyframes nodePulse {
        0%, 100% { opacity: 0.3; transform: scale(1); }
        50% { opacity: 1; transform: scale(1.5); }
    }
    .viz-nodes {
        position: relative;
        width: 400px;
        height: 400px;
    }
    .viz-hologram {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        width: 250px;
        height: 250px;
        border: 1px solid rgba(0, 210, 255, 0.1);
        border-radius: 50%;
        animation: rotate 20s linear infinite;
    }
    .viz-hologram::before {
        content: '';
        position: absolute;
        inset: -10px;
        border: 1px dashed rgba(0, 210, 255, 0.2);
        border-radius: 50%;
        animation: rotate 15s linear infinite reverse;
    }
    @keyframes rotate {
        from { transform: translate(-50%, -50%) rotate(0deg); }
        to { transform: translate(-50%, -50%) rotate(360deg); }
    }
`;
document.head.appendChild(style);
