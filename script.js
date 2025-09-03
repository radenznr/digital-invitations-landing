// Loading Animation Control
function initializeLoadingAnimation() {
    const loadingOverlay = document.getElementById('loading-overlay');
    
    // Show loading on page start
    if (loadingOverlay) {
        loadingOverlay.style.display = 'flex';
        
        // Hide loading after page is fully loaded
        window.addEventListener('load', function() {
            setTimeout(() => {
                loadingOverlay.classList.add('hide');
                
                // Remove from DOM after animation completes
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }, 1200); // Show loading for at least 1.2 seconds for better UX
        });
        
        // Fallback: hide loading after maximum 5 seconds
        setTimeout(() => {
            if (!loadingOverlay.classList.contains('hide')) {
                loadingOverlay.classList.add('hide');
                setTimeout(() => {
                    loadingOverlay.style.display = 'none';
                }, 500);
            }
        }, 5000);
    }
}

// Initialize loading animation immediately
initializeLoadingAnimation();

// DOM Content Loaded Event
document.addEventListener('DOMContentLoaded', function() {
    initializeNavigation();
    initializeGalleryFilters();
    initializeContactForm();
    initializeScrollAnimations();
    initializeSmoothScrolling();
    initializeViewTemplateButtons();
});

// Navigation Functionality
function initializeNavigation() {
    const navToggle = document.getElementById('nav-toggle');
    const navMenu = document.getElementById('nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');

    // Mobile menu toggle
    navToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
    });

    // Close mobile menu when clicking on a link
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('active');
            navToggle.classList.remove('active');
        });
    });

    // Change navbar background on scroll
    window.addEventListener('scroll', function() {
        const navbar = document.querySelector('.navbar');
        if (window.scrollY > 100) {
            navbar.style.background = 'rgba(255, 255, 255, 0.98)';
            navbar.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.1)';
        } else {
            navbar.style.background = 'rgba(255, 255, 255, 0.95)';
            navbar.style.boxShadow = 'none';
        }
    });
}

// Gallery Filter Functionality
function initializeGalleryFilters() {
    const tabButtons = document.querySelectorAll('.tab-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    // Initialize gallery - show only wedding templates by default
    function filterGallery(category) {
        galleryItems.forEach(item => {
            const itemCategory = item.getAttribute('data-category');
            
            if (category === 'all' || itemCategory === category) {
                item.style.display = 'block';
                item.classList.remove('hidden');
                
                // Add fade in animation
                setTimeout(() => {
                    item.style.opacity = '1';
                    item.style.transform = 'scale(1)';
                }, 100);
            } else {
                item.classList.add('hidden');
                item.style.opacity = '0';
                item.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    item.style.display = 'none';
                }, 300);
            }
        });
    }

    // Initialize with wedding category (default active tab)
    filterGallery('wedding');

    tabButtons.forEach(button => {
        button.addEventListener('click', function() {
            const category = this.getAttribute('data-category');

            // Update active tab
            tabButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Filter gallery items
            filterGallery(category);
        });
    });

    // Preview button functionality
    const previewButtons = document.querySelectorAll('.gallery-overlay .btn');
    previewButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            showTemplatePreview();
        });
    });
}

// Template Preview Modal (simplified version)
function showTemplatePreview() {
    alert('Template preview akan dibuka dalam tab baru. Fitur ini akan tersedia setelah integrasi dengan backend.');
}

// Contact Form Functionality
function initializeContactForm() {
    const contactForm = document.getElementById('contactForm');
    
    contactForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(this);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const eventType = formData.get('eventType');
        const message = formData.get('message') || '';

        // Basic validation
        if (!name || !email || !phone || !eventType) {
            showNotification('Mohon lengkapi semua field yang wajib diisi.', 'error');
            return;
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            showNotification('Format email tidak valid.', 'error');
            return;
        }

        // Phone validation (Indonesian format)
        const phoneRegex = /^(\+62|62|0)[0-9]{9,13}$/;
        if (!phoneRegex.test(phone.replace(/[-\s]/g, ''))) {
            showNotification('Format nomor telepon tidak valid.', 'error');
            return;
        }

        // Prepare WhatsApp message
        const submitButton = this.querySelector('button[type="submit"]');
        const originalText = submitButton.innerHTML;
        
        submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Mengirim...';
        submitButton.disabled = true;

        // Format WhatsApp message
        const whatsappMessage = formatContactFormMessage(name, email, phone, eventType, message);
        
        // Send to WhatsApp after short delay for better UX
        setTimeout(() => {
            openWhatsApp(whatsappMessage);
            
            // Show success notification
            showNotification('Formulir berhasil dikirim! Anda akan diarahkan ke WhatsApp untuk melanjutkan konsultasi.', 'success');
            
            // Reset form
            contactForm.reset();
            
            // Reset button
            submitButton.innerHTML = originalText;
            submitButton.disabled = false;
            
            // Track the event
            trackEvent('contact_form_whatsapp_sent', {
                event_type: eventType
            });
        }, 1000);
    });
}

// Format contact form data for WhatsApp message
function formatContactFormMessage(name, email, phone, eventType, message) {
    const eventTypes = {
        'wedding': 'Pernikahan',
        'engagement': 'Lamaran',
        'birthday': 'Ulang Tahun',
        'graduation': 'Wisuda',
        'other': 'Lainnya'
    };
    
    const eventTypeName = eventTypes[eventType] || eventType;
    
    let whatsappMessage = `🌟 *KONSULTASI UNDANGAN DIGITAL S2MOMENTS* 🌟\n\n`;
    whatsappMessage += `👤 *Nama:* ${name}\n`;
    whatsappMessage += `📧 *Email:* ${email}\n`;
    whatsappMessage += `📱 *No. Telepon:* ${phone}\n`;
    whatsappMessage += `🎉 *Jenis Acara:* ${eventTypeName}\n`;
    
    if (message.trim()) {
        whatsappMessage += `💬 *Pesan Tambahan:*\n${message}\n`;
    }
    
    whatsappMessage += `\n✨ Saya tertarik untuk konsultasi pembuatan undangan digital dengan S2Moments. Mohon informasi lebih lanjut tentang paket dan harga yang tersedia.\n\n`;
    whatsappMessage += `Terima kasih! 🙏`;
    
    return whatsappMessage;
}

// Notification System
function showNotification(message, type = 'info') {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.notification');
    existingNotifications.forEach(notif => notif.remove());

    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
            <span>${message}</span>
            <button class="notification-close">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `;

    // Add styles
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#6366f1'};
        color: white;
        padding: 16px 20px;
        border-radius: 12px;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
        z-index: 10000;
        max-width: 400px;
        animation: slideInRight 0.3s ease;
    `;

    // Add to DOM
    document.body.appendChild(notification);

    // Close button functionality
    const closeButton = notification.querySelector('.notification-close');
    closeButton.addEventListener('click', function() {
        notification.style.animation = 'slideOutRight 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    });

    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }
    }, 5000);
}

// Scroll Animations
function initializeScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in-up');
            }
        });
    }, observerOptions);

    // Observe elements for animation
    const animateElements = document.querySelectorAll('.feature-card, .gallery-item, .step, .testimonial-card');
    animateElements.forEach(element => {
        observer.observe(element);
    });
}

// Smooth Scrolling for Navigation Links
function initializeSmoothScrolling() {
    const navLinks = document.querySelectorAll('a[href^="#"]');
    
    navLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = targetSection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// Hero Button Actions
document.addEventListener('DOMContentLoaded', function() {
    const ctaButtons = document.querySelectorAll('.hero-buttons .btn-primary, .nav-link.cta-btn, .cta-section .btn');
    const previewButtons = document.querySelectorAll('.hero-buttons .btn-secondary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Open WhatsApp for consultation
            openWhatsApp('Halo, saya tertarik untuk konsultasi membuat undangan digital dengan S2Moments.');
        });
    });
    
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Scroll to gallery section
            const gallerySection = document.getElementById('gallery');
            if (gallerySection) {
                const navbarHeight = document.querySelector('.navbar').offsetHeight;
                const targetPosition = gallerySection.offsetTop - navbarHeight - 20;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});

// WhatsApp Integration
function openWhatsApp(message = '') {
    const phoneNumber = '6281211114522'; // Updated WhatsApp number
    const defaultMessage = message || 'Halo, saya tertarik dengan layanan undangan digital S2Moments.';
    const encodedMessage = encodeURIComponent(defaultMessage);
    const whatsappURL = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
    
    window.open(whatsappURL, '_blank');
}

// View Template Invitation Handler
function viewTemplateInvitation(templateId) {
    // Create WhatsApp message for specific template
    const message = `Halo! Saya tertarik dengan template undangan "${templateId}". Bisakah Anda memberikan informasi lebih lanjut dan contoh undangannya?`;
    const encodedMessage = encodeURIComponent(message);
    const whatsappUrl = `https://wa.me/6281211114522?text=${encodedMessage}`;
    
    // Open WhatsApp in new tab
    window.open(whatsappUrl, '_blank');
    
    // Track the event
    trackEvent('template_view_request', {
        template_id: templateId
    });
}

// Initialize View Template Buttons
function initializeViewTemplateButtons() {
    const viewButtons = document.querySelectorAll('.btn-view-template');
    
    viewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateId = this.getAttribute('data-template');
            viewTemplateInvitation(templateId);
        });
    });
}


// Add WhatsApp floating button
document.addEventListener('DOMContentLoaded', function() {
    // Create floating WhatsApp button
    const whatsappButton = document.createElement('div');
    whatsappButton.className = 'whatsapp-float';
    whatsappButton.innerHTML = '<i class="fab fa-whatsapp"></i>';
    whatsappButton.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 60px;
        height: 60px;
        background: #25d366;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        cursor: pointer;
        box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4);
        z-index: 1000;
        transition: all 0.3s ease;
        animation: pulse 2s infinite;
    `;

    whatsappButton.addEventListener('click', function() {
        openWhatsApp();
    });

    whatsappButton.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.1)';
        this.style.boxShadow = '0 6px 25px rgba(37, 211, 102, 0.6)';
    });

    whatsappButton.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
        this.style.boxShadow = '0 4px 20px rgba(37, 211, 102, 0.4)';
    });

    document.body.appendChild(whatsappButton);

    // Add pulse animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
            50% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.6), 0 0 0 10px rgba(37, 211, 102, 0.1); }
            100% { box-shadow: 0 4px 20px rgba(37, 211, 102, 0.4); }
        }
        
        @keyframes slideInRight {
            from { transform: translateX(100%); opacity: 0; }
            to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
            from { transform: translateX(0); opacity: 1; }
            to { transform: translateX(100%); opacity: 0; }
        }
        
        .notification-content {
            display: flex;
            align-items: center;
            gap: 12px;
        }
        
        .notification-close {
            background: none;
            border: none;
            color: white;
            cursor: pointer;
            padding: 4px;
            border-radius: 4px;
            transition: background 0.3s ease;
        }
        
        .notification-close:hover {
            background: rgba(255, 255, 255, 0.2);
        }
    `;
    document.head.appendChild(style);
});

// Contact Methods Click Handlers
document.addEventListener('DOMContentLoaded', function() {
    const contactMethods = document.querySelectorAll('.contact-method');
    
    contactMethods.forEach(method => {
        method.addEventListener('click', function() {
            const icon = this.querySelector('i');
            
            if (icon.classList.contains('fa-whatsapp')) {
                openWhatsApp('Halo, saya ingin bertanya tentang layanan S2Moments.');
            } else if (icon.classList.contains('fa-envelope')) {
                window.location.href = 'mailto:hello@s2moments.id?subject=Pertanyaan tentang S2Moments';
            } else if (icon.classList.contains('fa-instagram')) {
                window.open('https://instagram.com/s2moments.id', '_blank');
            }
        });
        
        // Add hover effect
        method.style.cursor = 'pointer';
        method.addEventListener('mouseenter', function() {
            this.style.transform = 'translateX(10px)';
            this.style.transition = 'transform 0.3s ease';
        });
        
        method.addEventListener('mouseleave', function() {
            this.style.transform = 'translateX(0)';
        });
    });
});

// Stats Animation on Scroll
function animateStats() {
    const stats = document.querySelectorAll('.stat strong');
    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const finalValue = target.textContent.replace(/[^\d]/g, '');
                let currentValue = 0;
                const increment = Math.ceil(finalValue / 50);
                const suffix = target.textContent.replace(/[\d,]/g, '');

                const counter = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(counter);
                    }
                    target.textContent = currentValue.toLocaleString('id-ID') + suffix;
                }, 30);

                observer.unobserve(target);
            }
        });
    }, { threshold: 0.5 });

    stats.forEach(stat => observer.observe(stat));
}

// Initialize stats animation
document.addEventListener('DOMContentLoaded', animateStats);

// ===================================
// TESTIMONIALS MODERN SLIDER
// ===================================

function initializeTestimonialsSlider() {
    const testimonialsTrack = document.getElementById('testimonials-track');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const dots = document.querySelectorAll('.dot');
    
    if (!testimonialsTrack || !prevBtn || !nextBtn) return;
    
    let currentSlide = 0;
    const totalSlides = document.querySelectorAll('.testimonial-slide').length;
    
    // Auto-play interval
    let autoPlayInterval;
    const autoPlayDelay = 5000; // 5 seconds
    
    // Update slider position
    function updateSlider() {
        const translateX = -currentSlide * 100;
        testimonialsTrack.style.transform = `translateX(${translateX}%)`;
        
        // Update dots
        dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === currentSlide);
        });
        
        // Update button states
        prevBtn.disabled = currentSlide === 0;
        nextBtn.disabled = currentSlide === totalSlides - 1;
    }
    
    // Go to specific slide
    function goToSlide(slideIndex) {
        currentSlide = Math.max(0, Math.min(slideIndex, totalSlides - 1));
        updateSlider();
    }
    
    // Next slide
    function nextSlide() {
        if (currentSlide < totalSlides - 1) {
            currentSlide++;
        } else {
            currentSlide = 0; // Loop back to first slide
        }
        updateSlider();
    }
    
    // Previous slide
    function prevSlide() {
        if (currentSlide > 0) {
            currentSlide--;
        } else {
            currentSlide = totalSlides - 1; // Loop to last slide
        }
        updateSlider();
    }
    
    // Start auto-play
    function startAutoPlay() {
        autoPlayInterval = setInterval(nextSlide, autoPlayDelay);
    }
    
    // Stop auto-play
    function stopAutoPlay() {
        clearInterval(autoPlayInterval);
    }
    
    // Event listeners
    nextBtn.addEventListener('click', () => {
        nextSlide();
        stopAutoPlay();
        setTimeout(startAutoPlay, 3000); // Restart auto-play after 3 seconds
    });
    
    prevBtn.addEventListener('click', () => {
        prevSlide();
        stopAutoPlay();
        setTimeout(startAutoPlay, 3000); // Restart auto-play after 3 seconds
    });
    
    // Dot navigation
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000); // Restart auto-play after 3 seconds
        });
    });
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (e.key === 'ArrowLeft') {
            prevSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        } else if (e.key === 'ArrowRight') {
            nextSlide();
            stopAutoPlay();
            setTimeout(startAutoPlay, 3000);
        }
    });
    
    // Pause auto-play on hover
    const testimonialsSection = document.querySelector('.testimonials');
    if (testimonialsSection) {
        testimonialsSection.addEventListener('mouseenter', stopAutoPlay);
        testimonialsSection.addEventListener('mouseleave', startAutoPlay);
    }
    
    // Touch/Swipe support for mobile
    let startX = 0;
    let endX = 0;
    
    testimonialsTrack.addEventListener('touchstart', (e) => {
        startX = e.touches[0].clientX;
        stopAutoPlay();
    });
    
    testimonialsTrack.addEventListener('touchmove', (e) => {
        e.preventDefault(); // Prevent scrolling
    });
    
    testimonialsTrack.addEventListener('touchend', (e) => {
        endX = e.changedTouches[0].clientX;
        const diff = startX - endX;
        
        if (Math.abs(diff) > 50) { // Minimum swipe distance
            if (diff > 0) {
                nextSlide(); // Swipe left - next slide
            } else {
                prevSlide(); // Swipe right - previous slide
            }
        }
        
        setTimeout(startAutoPlay, 3000);
    });
    
    // Initialize slider
    updateSlider();
    startAutoPlay();
    
    // Intersection Observer for animation on scroll
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.8s ease forwards';
            }
        });
    }, observerOptions);
    
    // Observe testimonial cards
    document.querySelectorAll('.testimonial-card').forEach(card => {
        observer.observe(card);
    });
}

// Initialize testimonials slider
document.addEventListener('DOMContentLoaded', initializeTestimonialsSlider);

// Lazy Loading for Images (if you add actual images later)
function initializeLazyLoading() {
    const images = document.querySelectorAll('img[data-src]');
    
    const imageObserver = new IntersectionObserver(function(entries) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                img.src = img.dataset.src;
                img.classList.remove('lazy');
                imageObserver.unobserve(img);
            }
        });
    });

    images.forEach(img => imageObserver.observe(img));
}

// Search Functionality (for future expansion)
function initializeSearch() {
    const searchInput = document.getElementById('search');
    if (!searchInput) return;

    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase();
        const galleryItems = document.querySelectorAll('.gallery-item');
        
        galleryItems.forEach(item => {
            const title = item.querySelector('h4').textContent.toLowerCase();
            const category = item.getAttribute('data-category');
            
            if (title.includes(searchTerm) || category.includes(searchTerm)) {
                item.style.display = 'block';
            } else {
                item.style.display = 'none';
            }
        });
    });
}

// Performance Optimization
function optimizePerformance() {
    // Debounce scroll events
    let scrollTimeout;
    window.addEventListener('scroll', function() {
        if (scrollTimeout) {
            clearTimeout(scrollTimeout);
        }
        scrollTimeout = setTimeout(function() {
            // Handle scroll events here if needed
        }, 16); // ~60fps
    });

    // Preload critical resources
    const criticalImages = [
        // Add actual image URLs here when you have them
    ];

    criticalImages.forEach(src => {
        const link = document.createElement('link');
        link.rel = 'preload';
        link.as = 'image';
        link.href = src;
        document.head.appendChild(link);
    });
}

// Initialize performance optimizations
document.addEventListener('DOMContentLoaded', optimizePerformance);

// Error Handling
window.addEventListener('error', function(e) {
    console.error('JavaScript Error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Analytics Integration (placeholder)
function trackEvent(eventName, properties = {}) {
    // Google Analytics or other analytics integration would go here
    console.log('Event tracked:', eventName, properties);
    
    // Example: gtag('event', eventName, properties);
}

// Track user interactions
document.addEventListener('DOMContentLoaded', function() {
    // Track CTA button clicks
    const ctaButtons = document.querySelectorAll('.btn-primary');
    ctaButtons.forEach(button => {
        button.addEventListener('click', function() {
            trackEvent('cta_click', {
                button_text: this.textContent.trim(),
                section: this.closest('section')?.className || 'unknown'
            });
        });
    });

    // Track template previews
    const previewButtons = document.querySelectorAll('.gallery-overlay .btn');
    previewButtons.forEach(button => {
        button.addEventListener('click', function() {
            const templateName = this.closest('.gallery-item').querySelector('h4').textContent;
            trackEvent('template_preview', {
                template_name: templateName
            });
        });
    });

    // Track contact form submissions
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function() {
            trackEvent('contact_form_submit', {
                section: 'contact'
            });
        });
    }
});

// Accessibility Improvements
document.addEventListener('DOMContentLoaded', function() {
    // Add keyboard navigation for gallery tabs
    const tabButtons = document.querySelectorAll('.tab-btn');
    tabButtons.forEach((button, index) => {
        button.addEventListener('keydown', function(e) {
            if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
                e.preventDefault();
                const nextIndex = e.key === 'ArrowRight' 
                    ? (index + 1) % tabButtons.length 
                    : (index - 1 + tabButtons.length) % tabButtons.length;
                tabButtons[nextIndex].focus();
                tabButtons[nextIndex].click();
            }
        });
    });

    // Add focus indicators
    const focusableElements = document.querySelectorAll('button, a, input, select, textarea');
    focusableElements.forEach(element => {
        element.addEventListener('focus', function() {
            this.style.outline = '2px solid #d4af37';
            this.style.outlineOffset = '2px';
        });
        
        element.addEventListener('blur', function() {
            this.style.outline = 'none';
        });
    });
});

// Add CSS animations dynamically
const animationStyles = document.createElement('style');
animationStyles.textContent = `
    .whatsapp-float i {
        font-size: 28px;
        color: white;
    }
    
    .fade-in-up {
        opacity: 0;
        transform: translateY(30px);
        animation: fadeInUp 0.6s ease forwards;
    }
    
    @keyframes fadeInUp {
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .gallery-item {
        opacity: 0;
        transform: translateY(20px);
        transition: all 0.5s ease;
    }
    
    .gallery-item.fade-in-up {
        opacity: 1;
        transform: translateY(0);
    }
`;
document.head.appendChild(animationStyles);
