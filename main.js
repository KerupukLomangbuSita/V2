// Mobile Menu
const mobileMenuButton = document.getElementById('mobile-menu-button');
const mobileMenu = document.getElementById('mobile-menu');
if (mobileMenuButton && mobileMenu) {
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    document.querySelectorAll('#mobile-menu a').forEach(link => {
        link.addEventListener('click', () => {
            mobileMenu.classList.add('hidden');
        });
    });
}

document.addEventListener('DOMContentLoaded', () => {
    // ... (kode dari Loading Animation sampai FAQ Accordion tetap sama) ...
    // Loading Animation
    setTimeout(() => {
        document.querySelector('.loader').classList.add('hidden');
    }, 1500);

    // Update tahun copyright
    const currentYearElement = document.getElementById('currentYear');
    if (currentYearElement) {
        currentYearElement.textContent = new Date().getFullYear();
    }

    // GANTI DENGAN NOMOR WHATSAPP BISNIS ANDA (Format: 628xxxxxxxxxx)
    const NOMOR_WHATSAPP_BISNIS = "6281267427518";  
    document.querySelectorAll('a[href*="wa.me"]').forEach(link => {
        if (link.href.includes('6281267427518')) {
            link.href = link.href.replace('6281267427518', NOMOR_WHATSAPP_BISNIS);
        }
    });

    // Animasi fade-in saat scroll
    const sections = document.querySelectorAll('.fade-in-section');
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1  
    };
    const observer = new IntersectionObserver((entries, observerInstance) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                observerInstance.unobserve(entry.target);  
            }
        });
    }, observerOptions);
    sections.forEach(section => {
        observer.observe(section);
    });

    // Back to Top Button
    const backToTopButton = document.querySelector('.back-to-top');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            backToTopButton.classList.add('active');
        } else {
            backToTopButton.classList.remove('active');
        }
    });
    backToTopButton.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // FAQ Accordion
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const answer = question.nextElementSibling;
            const icon = question.querySelector('svg');
            
            if (answer.classList.contains('hidden')) {
                answer.classList.remove('hidden');
                icon.classList.add('rotate-180');
            } else {
                answer.classList.add('hidden');
                icon.classList.remove('rotate-180');
            }
        });
    });

    // === MULAI KODE LOGIKA PENCARIAN (VERSI CTRL+F) ===
    const openSearchBtn = document.getElementById('open-search-button');
    const openSearchBtnMobile = document.getElementById('open-search-button-mobile');
    const closeSearchBtn = document.getElementById('close-search-button');
    const searchOverlay = document.getElementById('search-overlay');
    const searchInput = document.getElementById('search-input');
    const resultsContainer = document.getElementById('search-results-container');
    const navControls = document.getElementById('search-nav-controls');
    const matchCountEl = document.getElementById('search-match-count');
    const prevBtn = document.getElementById('search-prev');
    const nextBtn = document.getElementById('search-next');

    // Variabel untuk menyimpan status pencarian
    let allMatches = [];
    let currentIndex = -1;

    function performSearch() {
        clearAllHighlights();
        allMatches = [];
        currentIndex = -1;
        resultsContainer.innerHTML = '';
        const query = searchInput.value.trim();

        if (query.length < 2) {
            navControls.style.display = 'none';
            resultsContainer.innerHTML = '<div class="no-results">Ketik minimal 2 huruf untuk mencari.</div>';
            return;
        }

        const elementsToSearch = document.querySelectorAll('p, h1, h2, h3, h4, li, span');
        elementsToSearch.forEach(el => {
            if (!el.closest('#search-overlay') && !el.closest('script')) {
                const text = el.textContent;
                if (text.toLowerCase().includes(query.toLowerCase())) {
                    const parentSection = el.closest('section[id]');
                    const title = parentSection ? (parentSection.querySelector('h2, h3')?.textContent.trim() || parentSection.id) : "Hasil Pencarian";
                    addResultToList(title, text, el);
                }
            }
        });
        
        highlightAllMatches(query);

        updateNavControls();
        if (allMatches.length > 0) {
            navigateToMatch(0);
        } else {
            navControls.style.display = 'none';
            resultsContainer.innerHTML = `<div class="no-results">Tidak ada hasil untuk "<strong>${query}</strong>".</div>`;
        }
    }

    function addResultToList(title, context, element) {
        const index = allMatches.length;
        const resultItem = document.createElement('div');
        resultItem.className = 'result-item';
        resultItem.dataset.index = index;

        const itemTitle = document.createElement('div');
        itemTitle.className = 'result-item-title';
        itemTitle.textContent = title;

        const itemContext = document.createElement('div');
        itemContext.className = 'result-item-context';
        itemContext.innerHTML = context.replace(new RegExp(`(${searchInput.value.trim()})`, 'gi'), `<mark>$1</mark>`);

        resultItem.appendChild(itemTitle);
        resultItem.appendChild(itemContext);
        
        resultItem.addEventListener('click', () => {
            navigateToMatch(index);
            hideOverlay(); // Gunakan fungsi ini agar highlight tidak hilang
        });

        resultsContainer.appendChild(resultItem);
        allMatches.push(element); 
    }

    function highlightAllMatches(query) {
        const regex = new RegExp(`(${query})`, 'gi');
        allMatches.forEach(el => {
            el.innerHTML = el.innerHTML.replace(regex, `<mark class="search-highlight">$1</mark>`);
        });
        allMatches = Array.from(document.querySelectorAll('mark.search-highlight'));
    }

    function navigateToMatch(index) {
        if (allMatches.length === 0 || index < 0 || index >= allMatches.length) return;
        if (currentIndex > -1) allMatches[currentIndex].classList.remove('search-highlight-active');
        currentIndex = index;
        const currentMatch = allMatches[currentIndex];
        currentMatch.classList.add('search-highlight-active');
        currentMatch.scrollIntoView({ behavior: 'smooth', block: 'center' });
        updateNavControls();
    }

    function updateNavControls() {
        if (allMatches.length > 0) {
            navControls.style.display = 'flex';
            matchCountEl.textContent = `${currentIndex + 1}/${allMatches.length}`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = currentIndex === allMatches.length - 1;
        } else {
            navControls.style.display = 'none';
        }
    }

    function clearAllHighlights() {
        const highlights = document.querySelectorAll('mark.search-highlight, mark.search-highlight-active');
        highlights.forEach(el => {
            el.outerHTML = el.innerHTML;
        });
    }
    
    function hideOverlay() {
        searchOverlay.classList.add('hidden');
    }

    function openSearch() {
        searchOverlay.classList.remove('hidden');
        searchInput.focus();
        if (mobileMenu && !mobileMenu.classList.contains('hidden')) {
            mobileMenu.classList.add('hidden');
        }
    }

    function closeSearch() {
        hideOverlay();
        // Hanya reset total jika ditutup manual
        searchInput.value = '';
        clearAllHighlights();
        resultsContainer.innerHTML = '<div class="no-results">Mulai ketik untuk melihat hasil.</div>';
        navControls.style.display = 'none';
        allFaqItems.forEach(item => item.style.display = 'block');
    }

    let searchTimeout;
    searchInput.addEventListener('input', () => {
        clearTimeout(searchTimeout);
        searchTimeout = setTimeout(performSearch, 300);
    });

    if(openSearchBtn) openSearchBtn.addEventListener('click', openSearch);
    if(openSearchBtnMobile) openSearchBtnMobile.addEventListener('click', openSearch);
    if(closeSearchBtn) closeSearchBtn.addEventListener('click', closeSearch);
    nextBtn.addEventListener('click', () => navigateToMatch(currentIndex + 1));
    prevBtn.addEventListener('click', () => navigateToMatch(currentIndex - 1));

    document.addEventListener('keydown', (e) => {
        if (searchOverlay.classList.contains('hidden')) return;
        if (e.key === 'Escape') closeSearch();
        if (e.key === 'Enter') {
            e.preventDefault();
            if (allMatches.length > 0) {
                 navigateToMatch(currentIndex);
                 hideOverlay();
            }
        }
    });
    // === AKHIR KODE LOGIKA PENCARIAN ===

    // === Animasi Angka Berjalan (Counter) ===
    const counters = document.querySelectorAll('.counter-value');
    const counterOptions = {
        root: null,
        threshold: 0.5 // Jalankan saat 50% elemen terlihat
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const counter = entry.target;
                const goal = parseInt(counter.dataset.goal);
                const isPercentage = counter.textContent.includes('%');
                const isPlus = counter.textContent.includes('+');
                
                let count = 0;
                const duration = 2000; // Durasi animasi 2 detik
                const stepTime = Math.abs(Math.floor(duration / goal));

                const timer = setInterval(() => {
                    count += 1;
                    let text = count;
                    if (isPercentage) text += '%';
                    if (isPlus) text += '+';
                    counter.textContent = text;
                    
                    if (count === goal) {
                        clearInterval(timer);
                    }
                }, stepTime);

                observer.unobserve(counter); // Hentikan observasi setelah dijalankan
            }
        });
    }, counterOptions);

    counters.forEach(counter => {
        counterObserver.observe(counter);
    });

    // === Animasi Header Saat Scroll ===
    const header = document.querySelector('header');
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 50) { // Jika scroll lebih dari 50px
            header.classList.add('header-scrolled');
        } else {
            header.classList.remove('header-scrolled');
        }
    });

    // === Animasi Timeline Saat Scroll ===
    const timelineItems = document.querySelectorAll('.timeline-item');

    // Opsi untuk observer: animasi akan berjalan saat 20% dari item terlihat
    const timelineOptions = {
        threshold: 0.2
    };

    const timelineObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            // Jika item masuk ke dalam layar
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
            } else {
                // Jika item KELUAR dari layar, hapus class 'visible' untuk mereset animasi
                entry.target.classList.remove('visible');
            }
        });
    }, timelineOptions);

    // === Animasi Sticky Scroll untuk Fitur Unggulan ===
    const featureItems = document.querySelectorAll('.feature-item');

if (window.matchMedia("(min-width: 769px)").matches) { // Hanya jalankan di layar besar
        const featureObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                // Logika ini hanya perlu mengubah class berdasarkan status isIntersecting
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-active');
                } else {
                    entry.target.classList.remove('is-active');
                }
            });
        }, {
            // Opsi baru yang lebih presisi
            root: null, // viewport sebagai root
            // Ini adalah "sihir"-nya: membuat zona pemicu setipis 1px di tengah layar
            rootMargin: "-50% 0px -50% 0px",
            threshold: 0 // Picu animasi segera setelah elemen menyentuh zona tengah
        });

        featureItems.forEach(item => {
            featureObserver.observe(item);
        });
    }

    // Mulai amati setiap item timeline
    timelineItems.forEach(item => {
        timelineObserver.observe(item);
    });

    // ... (kode Testimonial Carousel dan Bubble tetap sama) ...
    const carousel = document.querySelector('.testimonial-carousel');
    if (carousel) {
        const track = carousel.querySelector('.testimonial-track');
        const cards = carousel.querySelectorAll('.testimonial-card');
        const nextButton = carousel.querySelector('.testimonial-nav.next');
        const prevButton = carousel.querySelector('.testimonial-nav.prev');
        let carouselCurrentIndex = 0;
        let cardWidth = 0;
        let autoplayInterval = null;
        const setupCarousel = () => {
            if (cards.length === 0) return;
            cardWidth = carousel.offsetWidth;
            cards.forEach(card => { card.style.minWidth = `${cardWidth}px`; });
            track.style.transform = `translateX(-${carouselCurrentIndex * cardWidth}px)`;
        };
        const moveToSlide = (targetIndex) => {
            carouselCurrentIndex = targetIndex;
            track.style.transform = `translateX(-${carouselCurrentIndex * cardWidth}px)`;
        };
        const startAutoplay = () => {
            stopAutoplay();
            autoplayInterval = setInterval(() => {
                const nextIndex = (carouselCurrentIndex + 1) % cards.length;
                moveToSlide(nextIndex);
            }, 5000);
        };
        const stopAutoplay = () => { clearInterval(autoplayInterval); };
        nextButton.addEventListener('click', () => {
            const nextIndex = (carouselCurrentIndex + 1) % cards.length;
            moveToSlide(nextIndex);
            startAutoplay();
        });
        prevButton.addEventListener('click', () => {
            const prevIndex = (carouselCurrentIndex - 1 + cards.length) % cards.length;
            moveToSlide(prevIndex);
            startAutoplay();
        });
        window.addEventListener('resize', setupCarousel);
        setupCarousel();
        startAutoplay();
    }

});