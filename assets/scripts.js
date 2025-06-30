// Loading Screen
window.addEventListener('load', () => {
    setTimeout(() => {
        document.getElementById('loading').classList.add('hidden');
    }, 1500);
});

// Navbar Scroll Effect
window.addEventListener('scroll', () => {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// Cursor Trail Effect
const cursorTrail = document.getElementById('cursor-trail');
let mouseX = 0, mouseY = 0;
let trailX = 0, trailY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateTrail() {
    trailX += (mouseX - trailX) * 0.1;
    trailY += (mouseY - trailY) * 0.1;
    
    cursorTrail.style.left = trailX + 'px';
    cursorTrail.style.top = trailY + 'px';
    cursorTrail.style.opacity = '1';
    
    requestAnimationFrame(animateTrail);
}
animateTrail();

// Particle System
const canvas = document.getElementById('particle-canvas');
const ctx = canvas.getContext('2d');
let particles = [];

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

class Particle {
    constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 1;
        this.opacity = Math.random() * 0.5 + 0.2;
    }

    update() {
        this.x += this.vx;
        this.y += this.vy;

        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
    }

    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(79, 172, 254, ${this.opacity})`;
        ctx.fill();
    }
}

function initParticles() {
    particles = [];
    for (let i = 0; i < 50; i++) {
        particles.push(new Particle());
    }
}

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    particles.forEach(particle => {
        particle.update();
        particle.draw();
    });

    // Draw connections
    particles.forEach((particle, i) => {
        particles.slice(i + 1).forEach(otherParticle => {
            const dx = particle.x - otherParticle.x;
            const dy = particle.y - otherParticle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);

            if (distance < 100) {
                ctx.beginPath();
                ctx.moveTo(particle.x, particle.y);
                ctx.lineTo(otherParticle.x, otherParticle.y);
                ctx.strokeStyle = `rgba(79, 172, 254, ${0.1 * (1 - distance / 100)})`;
                ctx.lineWidth = 1;
                ctx.stroke();
            }
        });
    });

    requestAnimationFrame(animateParticles);
}

resizeCanvas();
initParticles();
animateParticles();

window.addEventListener('resize', () => {
    resizeCanvas();
    initParticles();
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Navigation
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('.nav-links a');

function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

window.addEventListener('scroll', updateActiveNav);

// Scroll Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Contact Form
document.getElementById('contact-form').addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form data
    const formData = new FormData(this);
    const data = Object.fromEntries(formData);
    
    // Simulate form submission
    const submitBtn = this.querySelector('.submit-btn');
    const originalText = submitBtn.textContent;
    
    submitBtn.textContent = 'Sending...';
    submitBtn.disabled = true;
    
    setTimeout(() => {
        submitBtn.textContent = 'Message Sent! ✓';
        submitBtn.style.background = 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)';
        
        setTimeout(() => {
            this.reset();
            submitBtn.textContent = originalText;
            submitBtn.disabled = false;
            submitBtn.style.background = 'var(--gradient-4)';
        }, 2000);
    }, 1500);
});

// LinkedIn Data Integration (Simulation)
const linkedInData = {
    name: "Full Stack Developer",
    headline: "Transforming Ideas into Digital Reality",
    experience: [
        {
            company: "LogiLink LLC",
            position: "Senior Full Stack Developer",
            duration: "January 2025 - Present",
            description: "Leading development of innovative web solutions using cutting-edge technologies."
        }
    ],
    skills: [
        "JavaScript", "React", "Node.js", "Python", "AWS", "MongoDB", 
        "TypeScript", "Next.js", "Docker", "Kubernetes"
    ],
    projects: [
        {
            name: "AI Analytics Platform",
            description: "Revolutionary data visualization platform with ML capabilities"
        },
        {
            name: "E-Commerce Innovation",
            description: "Next-gen shopping experience with AR integration"
        }
    ]
};

// Auto-type effect for hero title
const heroTitle = document.querySelector('.hero-title');
const titles = ['FAIZAN MURTUZA', 'AI VISIONARY', 'ML INNOVATOR', 'THE AI ARCHITECT'];
let currentTitle = 0;

function typeTitle() {
    const title = titles[currentTitle];
    let i = 0;
    heroTitle.textContent = '';
    
    const typeInterval = setInterval(() => {
        heroTitle.textContent += title[i];
        i++;
        
        if (i === title.length) {
            clearInterval(typeInterval);
            setTimeout(() => {
                currentTitle = (currentTitle + 1) % titles.length;
                setTimeout(typeTitle, 1000);
            }, 3000);
        }
    }, 150);
}

// Start auto-type after page load
setTimeout(typeTitle, 2000);

// Dynamic stats counter with real values
function animateStats() {
    const statNumbers = document.querySelectorAll('.stat-number');
    const targets = [40, 3, 50, 100]; // Real values from resume
    
    statNumbers.forEach((stat, index) => {
        const target = targets[index];
        const increment = target / 50;
        let current = 0;
        
        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                stat.textContent = target + (stat.textContent.includes('%') ? '%' : target === 3 ? '+' : '%');
                clearInterval(timer);
            } else {
                stat.textContent = Math.floor(current) + (stat.textContent.includes('%') ? '%' : '+');
            }
        }, 50);
    });
}

// Trigger stats animation when in view
const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            animateStats();
            statsObserver.unobserve(entry.target);
        }
    });
});

const aboutSection = document.getElementById('about');
if (aboutSection) {
    statsObserver.observe(aboutSection);
}

// Enhanced hover effects
document.querySelectorAll('.project-card, .skill-category, .timeline-item').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-15px) scale(1.02)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0) scale(1)';
    });
});

// Performance optimization
let ticking = false;

function updateParallax() {
    const scrolled = window.pageYOffset;
    const parallax = document.querySelector('.bg-animation');
    const speed = scrolled * 0.5;
    
    parallax.style.transform = `translateY(${speed}px)`;
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        requestAnimationFrame(updateParallax);
        ticking = true;
    }
});

console.log('🚀 GOAT Portfolio loaded successfully!');
console.log('🎨 This portfolio represents the pinnacle of web development artistry');
console.log('⚡ Optimized for performance and user experience');
console.log('🌟 Ready to make an impact!'); 