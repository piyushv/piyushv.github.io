// =========================================
// MAIN.JS — Cinematic Editorial Portfolio
// GSAP ScrollTrigger animations
// =========================================

document.addEventListener('DOMContentLoaded', () => {

    // ---- GSAP Animations ----
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        const isMobile = window.matchMedia('(max-width: 768px)').matches;

        if (!prefersReducedMotion && !isMobile) {

            // GSAP sets initial hidden state via JS (not CSS)
            // This ensures content is visible if JS fails
            const allFadeUp = document.querySelectorAll('.gsap-fade-up');
            gsap.set(allFadeUp, { opacity: 0, y: 40 });

            // Hero entrance — staggered on load
            const heroElements = document.querySelectorAll('.hero .gsap-fade-up');
            if (heroElements.length) {
                gsap.to(heroElements, {
                    opacity: 1,
                    y: 0,
                    duration: 0.9,
                    stagger: 0.15,
                    ease: 'power3.out',
                    delay: 0.3,
                });
            }

            // Section headers — fade up on scroll
            gsap.utils.toArray('.section-header.gsap-fade-up').forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.7,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none',
                    }
                });
            });

            // Project features — text + image stagger
            gsap.utils.toArray('.project-feature.gsap-fade-up').forEach(el => {
                const text = el.querySelector('.project-text');
                const visual = el.querySelector('.project-visual');

                // Set children hidden
                if (text) gsap.set(text, { opacity: 0, y: 40 });
                if (visual) gsap.set(visual, { opacity: 0, y: 30, scale: 0.97 });

                // Parent becomes visible immediately (it's a layout container)
                gsap.set(el, { opacity: 1, y: 0 });

                const tl = gsap.timeline({
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 82%',
                        toggleActions: 'play none none none',
                    }
                });

                if (text) {
                    tl.to(text, { opacity: 1, y: 0, duration: 0.8, ease: 'power3.out' });
                }
                if (visual) {
                    tl.to(visual, { opacity: 1, y: 0, scale: 1, duration: 0.8, ease: 'power3.out' }, '-=0.5');
                }
            });

            // Parallax on project images
            gsap.utils.toArray('.project-visual img').forEach(img => {
                gsap.fromTo(img,
                    { yPercent: -5 },
                    {
                        yPercent: 5,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: img.closest('.project-feature'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            });

            // Parallax on project numbers
            gsap.utils.toArray('.project-number').forEach(num => {
                gsap.fromTo(num,
                    { yPercent: 0 },
                    {
                        yPercent: -25,
                        ease: 'none',
                        scrollTrigger: {
                            trigger: num.closest('.project-feature'),
                            start: 'top bottom',
                            end: 'bottom top',
                            scrub: true,
                        }
                    }
                );
            });

            // About section fade up
            gsap.utils.toArray('.about-section .gsap-fade-up').forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 85%',
                        toggleActions: 'play none none none',
                    }
                });
            });

            // Footer fade up
            gsap.utils.toArray('.site-footer .gsap-fade-up').forEach(el => {
                gsap.to(el, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: 'power3.out',
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none',
                    }
                });
            });
        }
    }


    // ---- Header scroll state ----
    const header = document.querySelector('.site-header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 60) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }, { passive: true });
    }


    // ---- Smooth scroll for anchor links ----
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') {
                e.preventDefault();
                window.scrollTo({ top: 0, behavior: 'smooth' });
                return;
            }

            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                e.preventDefault();
                const top = targetElement.getBoundingClientRect().top + window.scrollY - 80;
                window.scrollTo({ top, behavior: 'smooth' });
            }
        });
    });


    // ---- Back to top ----
    const backTopLink = document.querySelector('.footer-back-top');
    if (backTopLink) {
        backTopLink.addEventListener('click', (e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: 'smooth' });
        });
    }


    // ---- Magnetic hover on pill buttons ----
    if (!window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        document.querySelectorAll('.hero-links a, .footer-links a').forEach(btn => {
            btn.addEventListener('mousemove', (e) => {
                const rect = btn.getBoundingClientRect();
                const x = e.clientX - rect.left - rect.width / 2;
                const y = e.clientY - rect.top - rect.height / 2;
                btn.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
            });
            btn.addEventListener('mouseleave', () => {
                btn.style.transform = 'translate(0, 0)';
                btn.style.transition = 'transform 0.4s cubic-bezier(0.16, 1, 0.3, 1)';
            });
            btn.addEventListener('mouseenter', () => {
                btn.style.transition = 'transform 0.1s ease';
            });
        });
    }


    // ---- Image Lightbox for Case Study Pages ----
    initImageLightbox();
});


// ---- Lightbox Functionality ----
function initImageLightbox() {
    const caseStudyContent = document.querySelector('.case-study-content');
    if (!caseStudyContent) return;

    const images = caseStudyContent.querySelectorAll('img');
    if (images.length === 0) return;

    const lightbox = document.createElement('div');
    lightbox.className = 'lightbox-overlay';
    lightbox.innerHTML = `
        <button class="lightbox-close" aria-label="Close image"></button>
        <div class="lightbox-content">
            <img class="lightbox-image" src="" alt="">
        </div>
    `;
    document.body.appendChild(lightbox);

    const lightboxImg = lightbox.querySelector('.lightbox-image');
    const lightboxClose = lightbox.querySelector('.lightbox-close');

    images.forEach(img => {
        img.addEventListener('click', () => {
            lightboxImg.src = img.src;
            lightboxImg.alt = img.alt;
            lightbox.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    });

    function closeLightbox() {
        lightbox.classList.remove('active');
        document.body.style.overflow = '';
        setTimeout(() => { lightboxImg.src = ''; }, 300);
    }

    lightboxClose.addEventListener('click', (e) => {
        e.stopPropagation();
        closeLightbox();
    });

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target.closest('.lightbox-content') === e.target) {
            closeLightbox();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && lightbox.classList.contains('active')) {
            closeLightbox();
        }
    });
}
