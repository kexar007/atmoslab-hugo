// Outreach Gallery JavaScript
class OutreachGallery {
    constructor() {
        this.images = [];
        this.currentImageIndex = 0;
        this.lightbox = null;
        this.init();
    }

    init() {
        this.createLightbox();
        this.loadImages();
        this.bindEvents();
    }

    // Load images from the dynamically provided image list
    loadImages() {
        try {
            // Use the dynamically generated image list from the template
            if (typeof window.outreachImages !== 'undefined' && window.outreachImages.length > 0) {
                this.images = window.outreachImages.map((src, index) => ({
                    src: src,
                    alt: `Outreach Image ${index + 1}`,
                    title: `Outreach Image ${index + 1}`,
                    description: ''
                }));
            } else {
                console.warn('No outreach images found');
                this.showError('No images found in the outreach gallery');
                return;
            }

            this.renderGallery();
        } catch (error) {
            console.error('Error loading images:', error);
            this.showError('Failed to load gallery images');
        }
    }

    // Render the gallery grid
    renderGallery() {
        const galleryContainer = document.querySelector('.outreach-gallery');
        if (!galleryContainer) return;

        const galleryHTML = `
            <div class="gallery-grid">
                ${this.images.map((image, index) => `
                    <div class="gallery-item" data-index="${index}" tabindex="0" role="button" aria-label="View ${image.title}">
                        <img src="${image.src}" alt="${image.alt}" loading="lazy" onerror="this.parentElement.classList.add('error')">
                        <div class="gallery-caption">
                            <h4>${image.title}</h4>
                            <p>${image.description}</p>
                        </div>
                    </div>
                `).join('')}
            </div>
        `;

        galleryContainer.innerHTML = galleryHTML;
    }

    // Create lightbox HTML structure
    createLightbox() {
        const lightboxHTML = `
            <div class="lightbox" id="outreach-lightbox" role="dialog" aria-modal="true" aria-labelledby="lightbox-title">
                <div class="lightbox-content">
                    <button class="lightbox-close" aria-label="Close lightbox">&times;</button>
                    <img class="lightbox-image" src="" alt="">
                    <div class="lightbox-caption">
                        <h3 id="lightbox-title"></h3>
                        <p></p>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', lightboxHTML);
        this.lightbox = document.getElementById('outreach-lightbox');
    }

    // Bind event listeners
    bindEvents() {
        // Gallery item clicks
        document.addEventListener('click', (e) => {
            const galleryItem = e.target.closest('.gallery-item');
            if (galleryItem) {
                const index = parseInt(galleryItem.dataset.index);
                this.openLightbox(index);
            }
        });

        // Gallery item keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.lightbox.classList.contains('active')) {
                switch (e.key) {
                    case 'Escape':
                        this.closeLightbox();
                        break;
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousImage();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextImage();
                        break;
                }
            } else {
                // Gallery navigation
                const galleryItem = e.target.closest('.gallery-item');
                if (galleryItem && (e.key === 'Enter' || e.key === ' ')) {
                    e.preventDefault();
                    const index = parseInt(galleryItem.dataset.index);
                    this.openLightbox(index);
                }
            }
        });

        // Lightbox close button
        document.querySelector('.lightbox-close').addEventListener('click', () => {
            this.closeLightbox();
        });

        // Lightbox background click
        this.lightbox.addEventListener('click', (e) => {
            if (e.target === this.lightbox) {
                this.closeLightbox();
            }
        });

        // Prevent lightbox content click from closing
        document.querySelector('.lightbox-content').addEventListener('click', (e) => {
            e.stopPropagation();
        });

        // Touch/swipe support for mobile
        this.addTouchSupport();
    }

    // Add touch and swipe support
    addTouchSupport() {
        let startX = 0;
        let startY = 0;

        document.querySelector('.lightbox-image').addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
            startY = e.touches[0].clientY;
        });

        document.querySelector('.lightbox-image').addEventListener('touchend', (e) => {
            if (!startX || !startY) return;

            const endX = e.changedTouches[0].clientX;
            const endY = e.changedTouches[0].clientY;

            const diffX = startX - endX;
            const diffY = startY - endY;

            // Only process horizontal swipes
            if (Math.abs(diffX) > Math.abs(diffY) && Math.abs(diffX) > 50) {
                if (diffX > 0) {
                    this.nextImage();
                } else {
                    this.previousImage();
                }
            }

            startX = 0;
            startY = 0;
        });
    }

    // Open lightbox with specific image
    openLightbox(index) {
        this.currentImageIndex = index;
        const image = this.images[index];

        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const lightboxTitle = this.lightbox.querySelector('.lightbox-caption h3');
        const lightboxDescription = this.lightbox.querySelector('.lightbox-caption p');

        lightboxImage.src = image.src;
        lightboxImage.alt = image.alt;
        lightboxTitle.textContent = image.title;
        lightboxDescription.textContent = image.description;

        this.lightbox.classList.add('active');
        document.body.style.overflow = 'hidden';

        // Focus management for accessibility
        this.lightbox.focus();
    }

    // Close lightbox
    closeLightbox() {
        this.lightbox.classList.remove('active');
        document.body.style.overflow = '';
        
        // Return focus to the last focused gallery item
        const lastFocusedItem = document.querySelector(`.gallery-item[data-index="${this.currentImageIndex}"]`);
        if (lastFocusedItem) {
            lastFocusedItem.focus();
        }
    }

    // Navigate to previous image
    previousImage() {
        this.currentImageIndex = (this.currentImageIndex - 1 + this.images.length) % this.images.length;
        this.updateLightboxImage();
    }

    // Navigate to next image
    nextImage() {
        this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
        this.updateLightboxImage();
    }

    // Update lightbox image
    updateLightboxImage() {
        const image = this.images[this.currentImageIndex];
        const lightboxImage = this.lightbox.querySelector('.lightbox-image');
        const lightboxTitle = this.lightbox.querySelector('.lightbox-caption h3');
        const lightboxDescription = this.lightbox.querySelector('.lightbox-caption p');

        // Fade out, update, fade in effect
        lightboxImage.style.opacity = '0';
        
        setTimeout(() => {
            lightboxImage.src = image.src;
            lightboxImage.alt = image.alt;
            lightboxTitle.textContent = image.title;
            lightboxDescription.textContent = image.description;
            lightboxImage.style.opacity = '1';
        }, 150);
    }

    // Show error message
    showError(message) {
        const galleryContainer = document.querySelector('.outreach-gallery');
        if (galleryContainer) {
            galleryContainer.innerHTML = `
                <div class="gallery-error">
                    <p>${message}</p>
                </div>
            `;
        }
    }
}

// Initialize gallery when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new OutreachGallery();
});

// Export for potential use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = OutreachGallery;
}
