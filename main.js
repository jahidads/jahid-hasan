// Main JavaScript for the portfolio site
// Added interactive features: skills tabs, mixitup, portfolio popup, services modal, swiper, input animations, scroll highlighter, sidebar toggles

// Toggling Skill Tabs
const tabs = document.querySelectorAll('[data-target]');
const tabContent = document.querySelectorAll('[data-content]');

tabs.forEach(tab => {
    tab.addEventListener('click', () => {
        const target = document.querySelector(tab.dataset.target);

        tabContent.forEach(tabContents => {
            tabContents.classList.remove('skills-active');
        })

        if (target) target.classList.add('skills-active');

        tabs.forEach(t => {
            t.classList.remove('skills-active');
        })

        tab.classList.add('skills-active');
    })
})

// Mix it up Sorting (requires mixitup library)
if (typeof mixitup !== 'undefined') {
    let mixerPortfolio = mixitup('.work-container', {
        selectors: {
            target: '.work-card'
        },
        animation: {
            duration: 300
        }
    });
}

// Active link changing for work filters
const linkWork = document.querySelectorAll('.work-item');

function activeWork() {
    linkWork.forEach(l => l.classList.remove('active-work'))
    this.classList.add('active-work')
}
linkWork.forEach(l => l.addEventListener('click', activeWork));

// Portfolio Popup

document.addEventListener('click', (e) => {
    if(e.target.classList.contains('work-button')){
        togglePortfolioPopup();
        portfolioItemDetails(e.target.parentElement);
    }
})

function togglePortfolioPopup() {
    const popup = document.querySelector('.portfolio-popup');
    if (popup) popup.classList.toggle('open');
}

document.addEventListener('click', (e) => {
    if (e.target.closest('.portfolio-popup-close')) togglePortfolioPopup();
});

function portfolioItemDetails(portfolioItem) {
    if (!portfolioItem) return;
    const thumbImg = portfolioItem.querySelector('.work-img');
    const title = portfolioItem.querySelector('.work-title');
    const details = portfolioItem.querySelector('.portfolio-item-details');

    const ppImg = document.querySelector('.pp-thumbnail img');
    const ppSubtitle = document.querySelector('.portfolio-popup-subtitle span');
    const ppBody = document.querySelector('.portfolio-popup-body');

    if (ppImg && thumbImg) ppImg.src = thumbImg.src;
    if (ppSubtitle && title) ppSubtitle.innerHTML = title.innerHTML;
    if (ppBody && details) ppBody.innerHTML = details.innerHTML;
}

// Services Popup
const modalViews = document.querySelectorAll('.services-modal');
const modelBtns = document.querySelectorAll('.services-button');
const modalCloses = document.querySelectorAll('.services-modal-close');

let modal = function(modalClick) {
    if (modalViews[modalClick]) modalViews[modalClick].classList.add('active-modal');
}

modelBtns.forEach((modelBtn, i) => {
    modelBtn.addEventListener('click', () => {
        modal(i);
    })
})

modalCloses.forEach((modalClose) => {
    modalClose.addEventListener('click', () => {
        modalViews.forEach((modalView) => {
            modalView.classList.remove('active-modal');
        })
    })
})

// Swiper Testimonial (requires Swiper JS)
if (typeof Swiper !== 'undefined') {
    let swiper = new Swiper(".testimonials-container", {
        spaceBetween: 24,
        loop: true,
        grabCursor: true,
        pagination: {
          el: ".swiper-pagination",
          clickable: true,
        },
        breakpoints: {
            576: {
                slidesPerView: 2,
            },
            768: {
                slidesPerView: 2,
                spaceBetween: 48,
            },
        },
    });
}

// Input Animation
const inputs = document.querySelectorAll('.input');

function focusFunc() {
    let parent = this.parentNode;
    if (parent) parent.classList.add('focus');
}

function blurFunc() {
    let parent = this.parentNode;
    if (parent && this.value == "") {
        parent.classList.remove('focus');
    }
}

inputs.forEach((input) => {
    input.addEventListener('focus', focusFunc);
    input.addEventListener('blur', blurFunc);
})

// Contact form validation + toast notification
const contactForm = document.getElementById('contactForm');
const toast = document.getElementById('toast');

function showToast(message, type = 'success', timeout = 3500) {
    if (!toast) return;
    toast.className = 'toast ' + type + ' show';
    toast.innerHTML = `<span class="icon">${type === 'success' ? '✓' : '⚠'}</span><div class="message">${message}</div>`;

    // Auto hide
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => {
        if (toast) toast.classList.remove('show');
    }, timeout);
}

function validateInput(input) {
    if (!input) return false;
    if (input.required && input.value.trim() === '') return false;
    if (input.type === 'email') {
        // simple email regex
        const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\\.,;:\s@\"]+\.)+[^<>()[\]\\.,;:\s@\"]{2,})$/i;
        return re.test(String(input.value).toLowerCase());
    }
    if (input.type === 'tel') {
        // at least 7 digits/characters for phone
        return /[0-9]{7,}/.test(input.value.replace(/[^0-9]/g, ''));
    }
    return true;
}

if (contactForm) {
    contactForm.addEventListener('submit', function (e) {
        e.preventDefault();

        const formElements = Array.from(contactForm.elements).filter(el => (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA'));
        let firstInvalid = null;
        let allValid = true;

        formElements.forEach(el => {
            if (!validateInput(el)) {
                allValid = false;
                if (!firstInvalid) firstInvalid = el;
                // add a visual cue
                el.parentNode.classList.add('focus');
            }
        });

        if (!allValid) {
            showToast('Please fill out the form correctly.', 'error', 3000);
            if (firstInvalid) firstInvalid.focus();
            return;
        }

        // Simulate successful submission (replace with AJAX/fetch to server if needed)
        showToast('Message sent successfully. Thank you!', 'success', 3200);

        // Clear fields after a short delay so user sees their input cleared after the toast appears
        setTimeout(() => {
            formElements.forEach(el => {
                if (el.type !== 'submit' && el.type !== 'button') el.value = '';
                if (el.tagName === 'TEXTAREA') el.value = '';
                if (el.parentNode) el.parentNode.classList.remove('focus');
            });
        }, 400);
    });
}

// Share panel functionality
const btnShare = document.getElementById('btnShare');
const sharePanel = document.getElementById('sharePanel');

function buildSocialLinks(url, title) {
    const encodedUrl = encodeURIComponent(url);
    const encodedTitle = encodeURIComponent(title || document.title);
    return {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
        twitter: `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
        linkedin: `https://www.linkedin.com/shareArticle?mini=true&url=${encodedUrl}&title=${encodedTitle}`
    };
}

if (btnShare && sharePanel) {
    const pageUrl = window.location.href;
    const pageTitle = document.title;
    const links = buildSocialLinks(pageUrl, pageTitle);

    // Populate anchor elements with social link targets
    sharePanel.querySelectorAll('[data-share]').forEach(a => {
        const key = a.getAttribute('data-share');
        if (links[key]) a.href = links[key];
    });

    // Toggle panel
    btnShare.addEventListener('click', (e) => {
        e.stopPropagation();
        const isOpen = sharePanel.classList.toggle('show');
        btnShare.setAttribute('aria-expanded', String(isOpen));
        sharePanel.setAttribute('aria-hidden', String(!isOpen));
    });

    // handle panel actions (copy / native share)
    sharePanel.addEventListener('click', async (e) => {
        const actionEl = e.target.closest('[data-action]');
        if (actionEl) {
            const action = actionEl.getAttribute('data-action');
            if (action === 'copy') {
                try {
                    await navigator.clipboard.writeText(pageUrl);
                    showToast('Link copied to clipboard', 'success', 2200);
                } catch (err) {
                    // fallback
                    const inp = document.createElement('input');
                    document.body.appendChild(inp);
                    inp.value = pageUrl;
                    inp.select();
                    try { document.execCommand('copy'); showToast('Link copied to clipboard', 'success', 2200); } catch (e) { showToast('Unable to copy link', 'error', 2200); }
                    inp.remove();
                }
                sharePanel.classList.remove('show');
            }

            if (action === 'native') {
                if (navigator.share) {
                    try {
                        await navigator.share({ title: pageTitle, text: pageTitle, url: pageUrl });
                        showToast('Shared successfully', 'success', 2000);
                    } catch (err) {
                        // user cancelled or failed
                        showToast('Share cancelled', 'error', 1400);
                    }
                } else {
                    showToast('Native share not available on this device', 'error', 2200);
                }
                sharePanel.classList.remove('show');
            }
        }
    });

    // Close share panel when clicking outside
    document.addEventListener('click', (e) => {
        if (!btnShare.contains(e.target) && sharePanel.classList.contains('show')) {
            sharePanel.classList.remove('show');
            btnShare.setAttribute('aria-expanded', 'false');
            sharePanel.setAttribute('aria-hidden', 'true');
        }
    });
}

// Scroll Section Active Link
const sections = document.querySelectorAll('section[id]');

window.addEventListener('scroll', navHighlighter);

function navHighlighter() {
    let scrollY = window.pageYOffset;
    sections.forEach(current => {
        const sectionHeight = current.offsetHeight;
        const sectionTop = current.offsetTop - 50;
        const sectionId = current.getAttribute('id');

        const ref = document.querySelector('.nav-menu a[href*=' + sectionId + ']');
        if (!ref) return;

        if(scrollY > sectionTop && scrollY <= sectionTop + sectionHeight) {
            ref.classList.add('active-link');
        }else {
            ref.classList.remove('active-link');
        }
    })
}

// Activating Sidebar
const navMenu = document.getElementById('sidebar');
const navToggle = document.getElementById('nav-toggle');
const navClose = document.getElementById('nav-close');

if(navToggle) {
    navToggle.addEventListener('click', () => {
        if (navMenu) navMenu.classList.add('show-sidebar');
    })
}

if(navClose) {
    navClose.addEventListener('click', () => {
        if (navMenu) navMenu.classList.remove('show-sidebar');
    })
}
