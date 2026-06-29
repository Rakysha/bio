/* ============================================
   PORTFOLIO — MAIN SCRIPT
   ============================================ */

(function () {
    'use strict';

    // ---- State ----
    let currentSlide = 0;
    const totalSlides = 3;
    let isTransitioning = false;
    let touchStartY = 0;
    let touchEndY = 0;

    // ---- DOM refs ----
    const slides = document.querySelectorAll('.slide');
    const dots = document.querySelectorAll('.nav-dot');
    const overlay = document.getElementById('transitionOverlay');
    const scrollIndicator = document.getElementById('scrollIndicator');
    const btnExplore = document.getElementById('btnExplore');
    const canvas = document.getElementById('particleCanvas');
    const ctx = canvas.getContext('2d');

    // ============================================
    //  PARTICLE SYSTEM
    // ============================================
    const particles = [];
    const PARTICLE_COUNT = 80;
    const connectionDistance = 120;
    let mouse = { x: -1000, y: -1000 };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    class Particle {
        constructor() {
            this.reset();
        }

        reset() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height;
            this.size = Math.random() * 1.8 + 0.5;
            this.speedX = (Math.random() - 0.5) * 0.4;
            this.speedY = (Math.random() - 0.5) * 0.4;
            this.opacity = Math.random() * 0.4 + 0.1;
        }

        update() {
            this.x += this.speedX;
            this.y += this.speedY;

            // Mouse repulsion
            const dx = this.x - mouse.x;
            const dy = this.y - mouse.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            if (dist < 150) {
                const force = (150 - dist) / 150;
                this.x += (dx / dist) * force * 1.5;
                this.y += (dy / dist) * force * 1.5;
            }

            // Wrap around
            if (this.x < -10) this.x = canvas.width + 10;
            if (this.x > canvas.width + 10) this.x = -10;
            if (this.y < -10) this.y = canvas.height + 10;
            if (this.y > canvas.height + 10) this.y = -10;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fillStyle = `rgba(77, 124, 255, ${this.opacity})`;
            ctx.fill();
        }
    }

    function initParticles() {
        particles.length = 0;
        for (let i = 0; i < PARTICLE_COUNT; i++) {
            particles.push(new Particle());
        }
    }

    function drawConnections() {
        for (let i = 0; i < particles.length; i++) {
            for (let j = i + 1; j < particles.length; j++) {
                const dx = particles[i].x - particles[j].x;
                const dy = particles[i].y - particles[j].y;
                const dist = Math.sqrt(dx * dx + dy * dy);
                if (dist < connectionDistance) {
                    const opacity = (1 - dist / connectionDistance) * 0.12;
                    ctx.beginPath();
                    ctx.moveTo(particles[i].x, particles[i].y);
                    ctx.lineTo(particles[j].x, particles[j].y);
                    ctx.strokeStyle = `rgba(77, 124, 255, ${opacity})`;
                    ctx.lineWidth = 0.5;
                    ctx.stroke();
                }
            }
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        particles.forEach(p => {
            p.update();
            p.draw();
        });
        drawConnections();
        requestAnimationFrame(animateParticles);
    }

    // ============================================
    //  TYPING EFFECT
    // ============================================
    const phrases = [
        'IT-специалист • Автоматизация • AI/LLM',
        'Node.js • PostgreSQL • Telegram Bots',
        '16 лет — и уже Middle+ уровень',
    ];
    let phraseIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typingEl = document.getElementById('typingText');

    function typeEffect() {
        const current = phrases[phraseIndex];

        if (!isDeleting) {
            typingEl.textContent = current.substring(0, charIndex + 1);
            charIndex++;
            if (charIndex === current.length) {
                isDeleting = true;
                setTimeout(typeEffect, 2200);
                return;
            }
            setTimeout(typeEffect, 55);
        } else {
            typingEl.textContent = current.substring(0, charIndex - 1);
            charIndex--;
            if (charIndex === 0) {
                isDeleting = false;
                phraseIndex = (phraseIndex + 1) % phrases.length;
                setTimeout(typeEffect, 400);
                return;
            }
            setTimeout(typeEffect, 30);
        }
    }

    // ============================================
    //  SLIDE TRANSITIONS
    // ============================================
    function goToSlide(index) {
        if (isTransitioning || index === currentSlide || index < 0 || index >= totalSlides) return;
        isTransitioning = true;

        const direction = index > currentSlide ? 'up' : 'down'; // scroll direction
        const oldSlide = slides[currentSlide];
        const newSlide = slides[index];

        // Update scroll indicator
        if (scrollIndicator) {
            scrollIndicator.classList.toggle('hidden', index > 0);
        }

        // Phase 1: Exit current slide
        oldSlide.classList.add(direction === 'up' ? 'slide--exit-up' : 'slide--exit-down');

        // Overlay flash
        overlay.style.transition = 'opacity 0.35s ease-in';
        overlay.style.opacity = '0.6';

        setTimeout(() => {
            // Hide old slide
            oldSlide.classList.remove('slide--active', 'slide--exit-up', 'slide--exit-down');
            oldSlide.style.opacity = '0';
            oldSlide.style.visibility = 'hidden';

            // Show new slide
            newSlide.style.opacity = '1';
            newSlide.style.visibility = 'visible';
            newSlide.classList.add('slide--active');
            newSlide.classList.add(direction === 'up' ? 'slide--enter-up' : 'slide--enter-down');

            // Fade out overlay
            overlay.style.transition = 'opacity 0.5s ease-out';
            overlay.style.opacity = '0';

            // Update nav dots
            dots.forEach(d => d.classList.remove('active'));
            dots[index].classList.add('active');

            currentSlide = index;

            // Cleanup
            setTimeout(() => {
                newSlide.classList.remove('slide--enter-up', 'slide--enter-down');
                isTransitioning = false;
            }, 700);
        }, 400);
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    // ============================================
    //  EVENT LISTENERS
    // ============================================

    // Mouse wheel
    let wheelTimeout;
    window.addEventListener('wheel', (e) => {
        if (wheelTimeout) return;
        wheelTimeout = setTimeout(() => { wheelTimeout = null; }, 900);

        if (e.deltaY > 30) nextSlide();
        else if (e.deltaY < -30) prevSlide();
    }, { passive: true });

    // Keyboard
    window.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
            e.preventDefault();
            nextSlide();
        }
        if (e.key === 'ArrowUp' || e.key === 'PageUp') {
            e.preventDefault();
            prevSlide();
        }
    });

    // Touch events
    window.addEventListener('touchstart', (e) => {
        touchStartY = e.changedTouches[0].screenY;
    }, { passive: true });

    window.addEventListener('touchend', (e) => {
        touchEndY = e.changedTouches[0].screenY;
        const diff = touchStartY - touchEndY;
        if (Math.abs(diff) > 60) {
            if (diff > 0) nextSlide();
            else prevSlide();
        }
    }, { passive: true });

    // Nav dots
    dots.forEach(dot => {
        dot.addEventListener('click', () => {
            const target = parseInt(dot.dataset.slide, 10);
            goToSlide(target);
        });
    });

    // Explore button
    if (btnExplore) {
        btnExplore.addEventListener('click', () => nextSlide());
    }

    // Mouse tracking for particles & card glow
    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;

        // Card spotlight effect
        document.querySelectorAll('.contact-card').forEach(card => {
            const rect = card.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width) * 100;
            const y = ((e.clientY - rect.top) / rect.height) * 100;
            card.style.setProperty('--mouse-x', x + '%');
            card.style.setProperty('--mouse-y', y + '%');
        });
    });

    // Window resize
    window.addEventListener('resize', () => {
        resizeCanvas();
    });

    // ============================================
    //  STACK CARD TILT EFFECT
    // ============================================
    document.querySelectorAll('[data-tilt]').forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = ((y - centerY) / centerY) * -8;
            const rotateY = ((x - centerX) / centerX) * 8;
            card.style.transform = `translateY(-4px) perspective(600px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = '';
        });
    });

    // ============================================
    //  INIT
    // ============================================
    resizeCanvas();
    initParticles();
    animateParticles();

    // Start typing after welcome animation
    setTimeout(typeEffect, 1800);

})();
