/* ============================================================
   script.js — FSBB Consultoria
   Handles: navbar scroll, fade-in on scroll, active link, form
   ============================================================ */

(function () {
    'use strict';

    /* ----------------------------------------------------------
       1. NAVBAR — scroll shrink + active section highlight
    ---------------------------------------------------------- */
    const navbar = document.getElementById('mainNav');
    const navLinks = document.querySelectorAll('.navbar-nav .nav-link');
    const sections = document.querySelectorAll('section[id]');

    /* ----------------------------------------------------------
       LOGO SWAP — troca entre logo completa e ícone ao rolar
       Os caminhos são lidos dos atributos data-logo-full e
       data-logo-small definidos no HTML da navbar.
    ---------------------------------------------------------- */
    const navLogo = document.getElementById('navLogo');

    function swapLogo(scrolled) {
        if (!navLogo) return;
        const nextSrc = scrolled
            ? navLogo.dataset.logoSmall   // ícone ao rolar
            : navLogo.dataset.logoFull;   // logo completa no topo

        if (!nextSrc || navLogo.getAttribute('src') === nextSrc) return;

        // Fade out → troca src → fade in
        navLogo.style.opacity = '0';
        setTimeout(() => {
            navLogo.src = nextSrc;
            navLogo.style.opacity = '1';
        }, 220);
    }

    function updateNavbar() {
        const scrolled = window.scrollY > 40;
        navbar.classList.toggle('scrolled', scrolled);
        swapLogo(scrolled);
    }

    function updateActiveLink() {
        let current = '';
        const offset = navbar.offsetHeight + 32;

        sections.forEach(section => {
            if (window.scrollY >= section.offsetTop - offset) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            const href = link.getAttribute('href').replace('#', '');
            link.classList.toggle('active', href === current);
        });
    }

    window.addEventListener('scroll', () => {
        updateNavbar();
        updateActiveLink();
    }, { passive: true });

    updateNavbar();
    updateActiveLink();

    /* ----------------------------------------------------------
       2. SMOOTH SCROLL — for all anchor links
    ---------------------------------------------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;

            const target = document.querySelector(targetId);
            if (!target) return;

            e.preventDefault();

            // Close mobile navbar if open
            const navbarCollapse = document.querySelector('.navbar-collapse');
            if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                if (bsCollapse) bsCollapse.hide();
            }

            const offset = navbar.offsetHeight;
            const top = target.getBoundingClientRect().top + window.scrollY - offset;

            window.scrollTo({ top, behavior: 'smooth' });
        });
    });

    /* ----------------------------------------------------------
       3. FADE-IN ON SCROLL — IntersectionObserver
    ---------------------------------------------------------- */
    const fadeEls = document.querySelectorAll('.fade-in-element');

    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -60px 0px',
        threshold: 0.1
    };

    const fadeObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                fadeObserver.unobserve(entry.target); // animate once
            }
        });
    }, observerOptions);

    fadeEls.forEach(el => fadeObserver.observe(el));

    /* ----------------------------------------------------------
       4. HERO — immediate visibility (above the fold)
    ---------------------------------------------------------- */
    const heroContent = document.querySelector('.hero-content');
    if (heroContent) {
        setTimeout(() => {
            heroContent.classList.add('visible');
        }, 200);
    }

    /* ----------------------------------------------------------
       5. VALOR CARDS — staggered reveal
    ---------------------------------------------------------- */
    const valorCards = document.querySelectorAll('.valor-card');
    const valorObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 80);
                valorObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.15 });

    valorCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(24px)';
        card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
        valorObserver.observe(card);
    });

    /* ----------------------------------------------------------
       6. SOLUTION CARDS — staggered reveal
    ---------------------------------------------------------- */
    const solCards = document.querySelectorAll('.solucao-card');
    const solObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, i) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, i * 100);
                solObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    solCards.forEach(card => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(30px)';
        card.style.transition = 'opacity 0.6s ease, transform 0.6s ease, border-color 0.35s ease, background 0.35s ease';
        solObserver.observe(card);
    });
    /* ----------------------------------------------------------
   7. CONTACT FORM — envio via AJAX (não sai da página)
---------------------------------------------------------- */
const form = document.getElementById('contactForm');
if (form) {
    form.addEventListener('submit', function (e) {
        e.preventDefault();

        const btn = form.querySelector('.btn-submit');
        const original = btn.innerHTML;
        btn.disabled = true;
        btn.innerHTML = '<i class="fas fa-circle-notch fa-spin"></i> Enviando...';

        fetch(form.action, {
            method: 'POST',
            body: new FormData(form),
            headers: { 'Accept': 'application/json' }
        })
        .then(res => {
            if (res.ok) {
                btn.innerHTML = '<i class="fas fa-check"></i> Mensagem enviada!';
                btn.style.background = 'var(--secondary)';
                btn.style.color = '#fff';
                form.reset();
                setTimeout(() => {
                    btn.disabled = false;
                    btn.innerHTML = original;
                    btn.style.background = '';
                    btn.style.color = '';
                }, 3500);
            } else {
                throw new Error();
            }
        })
        .catch(() => {
            btn.innerHTML = '<i class="fas fa-times"></i> Erro ao enviar. Tente novamente.';
            btn.style.background = '#c0392b';
            btn.style.color = '#fff';
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = original;
                btn.style.background = '';
                btn.style.color = '';
            }, 3500);
        });
    });
}

})();