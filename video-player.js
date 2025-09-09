// Video Player Functionality
document.addEventListener('DOMContentLoaded', function() {
    initializeVideoPlayer();
});

function initializeVideoPlayer() {
    const videoOverlay = document.getElementById('video-overlay');
    const playButton = document.getElementById('play-button');
    
    if (videoOverlay && playButton) {
        // Add click event to play button and overlay
        videoOverlay.addEventListener('click', function() {
            playVideo();
        });
        
        // Add keyboard support
        videoOverlay.addEventListener('keydown', function(e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                playVideo();
            }
        });
        
        // Make overlay focusable for accessibility
        videoOverlay.setAttribute('tabindex', '0');
        videoOverlay.setAttribute('role', 'button');
        videoOverlay.setAttribute('aria-label', 'Play video: Our Innovation Journey');
    }
}

function playVideo() {
    const videoOverlay = document.getElementById('video-overlay');
    const videoWrapper = document.querySelector('.video-wrapper');
    
    if (videoOverlay && videoWrapper) {
        // Hide the overlay with animation
        videoOverlay.classList.add('hidden');
        
        // Optional: Add analytics tracking
        trackVideoPlay();
        
        // Show success message
        showNotification('Video is now playing', 'success');
    }
}

function trackVideoPlay() {
    // Analytics tracking (can be integrated with Google Analytics, etc.)
    console.log('Video play tracked:', {
        timestamp: new Date().toISOString(),
        video: 'Our Innovation Journey',
        source: 'homepage'
    });
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas fa-${getNotificationIcon(type)}"></i>
        <span>${message}</span>
    `;
    
    // Style the notification
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: -400px;
        background: rgba(0, 0, 0, 0.9);
        color: #fff;
        padding: 1rem 1.5rem;
        border-radius: 12px;
        border-left: 4px solid ${getNotificationColor(type)};
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.5);
        z-index: 3000;
        transition: all 0.3s ease;
        backdrop-filter: blur(20px);
        display: flex;
        align-items: center;
        gap: 10px;
        max-width: 300px;
        font-weight: 500;
    `;
    
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.style.right = '20px';
    }, 100);
    
    // Hide notification
    setTimeout(() => {
        notification.style.right = '-400px';
        setTimeout(() => {
            if (document.body.contains(notification)) {
                document.body.removeChild(notification);
            }
        }, 300);
    }, 3000);
}

function getNotificationIcon(type) {
    switch(type) {
        case 'success': return 'check-circle';
        case 'error': return 'exclamation-circle';
        case 'warning': return 'exclamation-triangle';
        default: return 'info-circle';
    }
}

function getNotificationColor(type) {
    switch(type) {
        case 'success': return '#4CAF50';
        case 'error': return '#f44336';
        case 'warning': return '#ff9800';
        default: return '#FFD700';
    }
}

// Intersection Observer for video section animations
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const videoObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe video section when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const videoSection = document.querySelector('.video-section');
    if (videoSection) {
        videoSection.style.opacity = '0';
        videoSection.style.transform = 'translateY(50px)';
        videoSection.style.transition = 'all 0.8s ease';
        videoObserver.observe(videoSection);
    }
});