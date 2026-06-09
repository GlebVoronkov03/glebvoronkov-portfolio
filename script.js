// ---------- TYPED TEXT EFFECT ----------
const typedTextElement = document.getElementById('typedText');
const roles = [
    'Research Engineer',
    'Computer Vision Specialist',
    '3D Quality Researcher',
    'XR Systems Architect'
];
let roleIndex = 0;
let charIndex = 0;
let isDeleting = false;

function typeEffect() {
    const currentRole = roles[roleIndex];
    if (isDeleting) {
        typedTextElement.textContent = currentRole.substring(0, charIndex - 1);
        charIndex--;
    } else {
        typedTextElement.textContent = currentRole.substring(0, charIndex + 1);
        charIndex++;
    }

    if (!isDeleting && charIndex === currentRole.length) {
        isDeleting = true;
        setTimeout(typeEffect, 2000);
    } else if (isDeleting && charIndex === 0) {
        isDeleting = false;
        roleIndex = (roleIndex + 1) % roles.length;
        setTimeout(typeEffect, 500);
    } else {
        setTimeout(typeEffect, isDeleting ? 50 : 100);
    }
}

if (typedTextElement) {
    typeEffect();
}

// ---------- DARK MODE ----------
const themeToggle = document.getElementById('themeToggle');
const prefersDark = window.matchMedia('(prefers-color-scheme: dark)');

function setTheme(theme) {
    if (theme === 'dark') {
        document.documentElement.setAttribute('data-theme', 'dark');
        localStorage.setItem('theme', 'dark');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } else {
        document.documentElement.removeAttribute('data-theme');
        localStorage.setItem('theme', 'light');
        if (themeToggle) {
            themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
        }
    }
}

const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
    setTheme('dark');
} else if (savedTheme === 'light') {
    setTheme('light');
} else if (prefersDark.matches) {
    setTheme('dark');
}

if (themeToggle) {
    themeToggle.addEventListener('click', () => {
        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        setTheme(isDark ? 'light' : 'dark');
    });
}

// ---------- PUBLICATION TABS ----------
const tabBtns = document.querySelectorAll('.tab-btn');
const tabContents = {
    'scopus': document.getElementById('scopus-tab'),
    'rinc': document.getElementById('rinc-tab'),
    'software': document.getElementById('software-tab')
};

tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const tabId = btn.getAttribute('data-tab');
        tabBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        Object.keys(tabContents).forEach(key => {
            if (tabContents[key]) {
                tabContents[key].classList.remove('active');
            }
        });
        if (tabContents[tabId]) {
            tabContents[tabId].classList.add('active');
        }
    });
});

// ---------- ABSTRACT TOGGLE ----------
document.querySelectorAll('.abstract-link').forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const abstractId = link.getAttribute('data-abstract');
        const abstractDiv = document.getElementById(`abstract-${abstractId}`);
        if (abstractDiv) {
            const isVisible = abstractDiv.style.display === 'block';
            abstractDiv.style.display = isVisible ? 'none' : 'block';
        }
    });
});

// ---------- SMOOTH SCROLLING ----------
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href === '#') return;
        const target = document.querySelector(href);
        if (target) {
            e.preventDefault();
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ---------- COPY EMAIL ----------
const copyBtn = document.getElementById('copyEmailBtn');
const emailSpan = document.getElementById('emailAddress');
const toast = document.getElementById('toast');

function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add('show');
    setTimeout(() => {
        toast.classList.remove('show');
    }, 2000);
}

if (copyBtn && emailSpan) {
    copyBtn.addEventListener('click', async () => {
        const email = emailSpan.textContent.replace(' [at] ', '@').replace(' [dot] ', '.');
        try {
            await navigator.clipboard.writeText(email);
            showToast('Email copied!');
        } catch (err) {
            showToast('Failed to copy');
        }
    });
}

// ---------- BACK TO TOP BUTTON ----------
const backToTop = document.getElementById('backToTop');
if (backToTop) {
    window.addEventListener('scroll', () => {
        if (window.scrollY > 300) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    });
    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
}

// ---------- CONTACT MODAL ----------
const contactBtn = document.getElementById('contactBtn');
if (contactBtn) {
    contactBtn.addEventListener('click', (e) => {
        e.preventDefault();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
}

// ---------- INTERSECTION OBSERVER (fade-in animations) ----------
const observerOptions = { threshold: 0.1, rootMargin: '0px 0px -50px 0px' };
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.pub-card, .project-card, .timeline-item, .award-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    observer.observe(el);
});

// ---------- TOOLTIP FOR SOCIAL LINKS ----------
document.querySelectorAll('.social-links a, .social-links-footer a').forEach(link => {
    link.setAttribute('target', '_blank');
    link.setAttribute('rel', 'noopener noreferrer');
});
