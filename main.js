/* ===================================
   Baisen Machinery - Main JavaScript
   =================================== */

document.addEventListener('DOMContentLoaded', function() {

    // ===== Hero Slider =====
    const slides = document.querySelectorAll('.hero-slide');
    const dots = document.querySelectorAll('.dot');
    const prevBtn = document.getElementById('heroPrev');
    const nextBtn = document.getElementById('heroNext');
    let currentSlide = 0;
    let slideInterval;

    function goToSlide(index) {
        slides[currentSlide].classList.remove('active');
        dots[currentSlide].classList.remove('active');
        currentSlide = (index + slides.length) % slides.length;
        slides[currentSlide].classList.add('active');
        dots[currentSlide].classList.add('active');
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startSlider() {
        slideInterval = setInterval(nextSlide, 5000);
    }

    function resetSlider() {
        clearInterval(slideInterval);
        startSlider();
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', function() {
            nextSlide();
            resetSlider();
        });
    }

    if (prevBtn) {
        prevBtn.addEventListener('click', function() {
            prevSlide();
            resetSlider();
        });
    }

    dots.forEach(function(dot) {
        dot.addEventListener('click', function() {
            goToSlide(parseInt(this.dataset.index));
            resetSlider();
        });
    });

    startSlider();

    // ===== Mobile Navigation =====
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');
    let navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);

    function toggleMenu() {
        mobileToggle.classList.toggle('active');
        navMenu.classList.toggle('active');
        navOverlay.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    if (mobileToggle) {
        mobileToggle.addEventListener('click', toggleMenu);
    }

    if (navOverlay) {
        navOverlay.addEventListener('click', toggleMenu);
    }

    // Close menu on link click
    document.querySelectorAll('.nav-link').forEach(function(link) {
        link.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // ===== Sticky Header =====
    const header = document.getElementById('header');
    
    window.addEventListener('scroll', function() {
        if (window.scrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // ===== Active Nav Link on Scroll =====
    const sections = document.querySelectorAll('section[id]');
    const navLinks = document.querySelectorAll('.nav-link:not(.nav-cta)');

    function updateActiveNav() {
        const scrollPos = window.scrollY + 150;

        sections.forEach(function(section) {
            const top = section.offsetTop;
            const height = section.offsetHeight;
            const id = section.getAttribute('id');

            if (scrollPos >= top && scrollPos < top + height) {
                navLinks.forEach(function(link) {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === '#' + id) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }

    window.addEventListener('scroll', updateActiveNav);

    // ===== Smooth Scroll =====
    document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                const headerHeight = header ? header.offsetHeight : 0;
                const targetPosition = target.offsetTop - headerHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // ===== Product Filter =====
    const filterBtns = document.querySelectorAll('.filter-btn');
    const productCards = document.querySelectorAll('.product-card');

    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            // Update active button
            filterBtns.forEach(function(b) { b.classList.remove('active'); });
            this.classList.add('active');

            const filter = this.dataset.filter;

            productCards.forEach(function(card) {
                if (filter === 'all' || card.dataset.category === filter) {
                    card.style.display = '';
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        card.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                        card.style.opacity = '1';
                        card.style.transform = 'translateY(0)';
                    }, 50);
                } else {
                    card.style.opacity = '0';
                    card.style.transform = 'translateY(20px)';
                    setTimeout(function() {
                        card.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // ===== Counter Animation =====
    const statNumbers = document.querySelectorAll('.stat-number');
    let countersStarted = false;

    function animateCounters() {
        statNumbers.forEach(function(num) {
            const target = parseInt(num.dataset.target);
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;

            function updateCounter() {
                current += step;
                if (current < target) {
                    num.textContent = Math.floor(current).toLocaleString();
                    requestAnimationFrame(updateCounter);
                } else {
                    num.textContent = target.toLocaleString();
                }
            }

            updateCounter();
        });
    }

    // Intersection Observer for counters
    const statsBar = document.querySelector('.stats-bar');
    if (statsBar) {
        const statsObserver = new IntersectionObserver(function(entries) {
            entries.forEach(function(entry) {
                if (entry.isIntersecting && !countersStarted) {
                    countersStarted = true;
                    animateCounters();
                }
            });
        }, { threshold: 0.5 });

        statsObserver.observe(statsBar);
    }

    // ===== Scroll Animations =====
    const animateElements = document.querySelectorAll(
        '.category-card, .product-card, .advantage-card, .news-card, .about-feature, .region-item'
    );

    const scrollObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry, index) {
            if (entry.isIntersecting) {
                setTimeout(function() {
                    entry.target.classList.add('visible');
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
                scrollObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    animateElements.forEach(function(el) {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        scrollObserver.observe(el);
    });

    // ===== Back to Top Button =====
    const backToTop = document.getElementById('backToTop');

    window.addEventListener('scroll', function() {
        if (window.scrollY > 500) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });

    if (backToTop) {
        backToTop.addEventListener('click', function() {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }

    // ===== Contact Form =====
    const contactForm = document.getElementById('contactForm');
    
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form data
            const formData = new FormData(this);
            const data = {};
            formData.forEach(function(value, key) {
                data[key] = value;
            });

            // Simple validation
            if (!data.name || !data.email || !data.country || !data.message) {
                showFormMessage('Please fill in all required fields.', 'error');
                return;
            }

            // Show success message (in production, send to server)
            showFormMessage('Thank you! Your message has been received. We will contact you within 24 hours.', 'success');
            this.reset();
        });
    }

    function showFormMessage(message, type) {
        // Remove existing messages
        const existing = document.querySelector('.form-message');
        if (existing) existing.remove();

        const msg = document.createElement('div');
        msg.className = 'form-message ' + type;
        msg.textContent = message;
        msg.style.cssText = 'padding:14px 20px;border-radius:8px;margin-bottom:16px;font-size:0.9rem;font-weight:500;' +
            (type === 'success' ? 'background:#d4edda;color:#155724;border:1px solid #c3e6cb;' : 'background:#f8d7da;color:#721c24;border:1px solid #f5c6cb;');

        contactForm.insertBefore(msg, contactForm.firstChild);

        setTimeout(function() {
            msg.style.opacity = '0';
            setTimeout(function() { msg.remove(); }, 300);
        }, 5000);
    }

    // ===== Touch Swipe for Hero Slider =====
    let touchStartX = 0;
    let touchEndX = 0;

    const heroEl = document.querySelector('.hero');
    if (heroEl) {
        heroEl.addEventListener('touchstart', function(e) {
            touchStartX = e.changedTouches[0].screenX;
        }, { passive: true });

        heroEl.addEventListener('touchend', function(e) {
            touchEndX = e.changedTouches[0].screenX;
            handleSwipe();
        }, { passive: true });
    }

    function handleSwipe() {
        const diff = touchStartX - touchEndX;
        if (Math.abs(diff) > 50) {
            if (diff > 0) {
                nextSlide();
            } else {
                prevSlide();
            }
            resetSlider();
        }
    }

});
