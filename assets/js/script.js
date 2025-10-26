// Mobile Navigation
document.addEventListener('DOMContentLoaded', function() {
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');

    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking on a regular link
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                // Don't close menu if this is a dropdown toggle
                const parentItem = link.closest('.nav-item');
                if (!parentItem.classList.contains('dropdown')) {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                }
            });
        });

        // Handle dropdown toggles
        document.querySelectorAll('.nav-item.dropdown .nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault(); // Prevent navigation for dropdown toggle
                const parentItem = link.closest('.nav-item');
                const isExpanded = parentItem.classList.contains('expanded');
                
                // Close all other dropdowns
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    item.classList.remove('expanded');
                    item.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
                });
                
                // Toggle current dropdown
                if (!isExpanded) {
                    parentItem.classList.add('expanded');
                    parentItem.querySelector('.nav-link').setAttribute('aria-expanded', 'true');
                }
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!hamburger.contains(event.target) && !navMenu.contains(event.target)) {
                hamburger.classList.remove('active');
                navMenu.classList.remove('active');
                // Close all dropdowns when closing menu
                document.querySelectorAll('.nav-item.dropdown').forEach(item => {
                    item.classList.remove('expanded');
                    item.querySelector('.nav-link').setAttribute('aria-expanded', 'false');
                });
            }
        });
    }

    // Carousel functionality
    const carousel = document.querySelector('.carousel-container');
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');

    if (carousel && carouselSlides.length > 0) {
        let currentSlide = 0;

        function updateCarousel() {
            const translateX = -currentSlide * 100;
            carousel.style.transform = `translateX(${translateX}%)`;
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                currentSlide = currentSlide > 0 ? currentSlide - 1 : carouselSlides.length - 1;
                updateCarousel();
            });
        }

        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                currentSlide = currentSlide < carouselSlides.length - 1 ? currentSlide + 1 : 0;
                updateCarousel();
            });
        }

        // Auto-advance carousel every 5 seconds
        setInterval(() => {
            currentSlide = currentSlide < carouselSlides.length - 1 ? currentSlide + 1 : 0;
            updateCarousel();
        }, 5000);
    }

    // News ticker click handlers
    const tickerItems = document.querySelectorAll('.ticker-item');
    tickerItems.forEach(item => {
        item.addEventListener('click', function() {
            // For now, just show an alert - in a real app this would navigate to the news article
            alert(`Clicked on: ${this.textContent}`);
        });
    });

    // Smooth scrolling for anchor links
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

    // Add loading animation for cards
    const cards = document.querySelectorAll('.card, .announcement-card, .person-card, .media-card');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';

        setTimeout(() => {
            card.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
        }, index * 100);
    });
});

// Utility functions
function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
}

// Function to get paper count for a person
function getPaperCount(authorSlug) {
    // This would typically fetch from an API or data file
    // For now, return a random number for demo purposes
    return Math.floor(Math.random() * 5) + 1;
}

// Add click handlers for announcement cards
document.addEventListener('DOMContentLoaded', function() {
    const announcementCards = document.querySelectorAll('.announcement-card');
    announcementCards.forEach(card => {
        card.addEventListener('click', function() {
            const title = this.querySelector('.announcement-title').textContent;
            alert(`More information about: ${title}`);
        });
    });
});
