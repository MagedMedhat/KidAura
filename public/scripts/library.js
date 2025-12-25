// library.js - Get username from localStorage
document.addEventListener('DOMContentLoaded', function() {
    // Get user info from localStorage
    const username = localStorage.getItem('kidoraUsername') || 'Friend';
    const avatar = localStorage.getItem('kidoraAvatar') || '😎';
    
    // Update the user display
    const userNameDisplay = document.getElementById('user-name-display');
    const userAvatar = document.getElementById('user-avatar');
    
    if (userNameDisplay) {
        userNameDisplay.textContent = username;
    }
    
    if (userAvatar) {
        userAvatar.textContent = avatar;
    }
    
    console.log('Welcome, ' + username + '!');
});

// Slider function
function scrollSlider(direction) {
    const container = document.getElementById('library-container');
    if (container) {
        const cardWidth = 180;
        const gap = 25;
        const scrollAmount = (cardWidth + gap) * direction;
        
        container.scrollBy({ 
            left: scrollAmount, 
            behavior: 'smooth' 
        });
    }
}

// Logout function
function logout() {
    // Clear user data from localStorage
    localStorage.removeItem('kidoraUsername');
    localStorage.removeItem('kidoraAvatar');
    
    console.log('User logged out');
    window.location.href = '/';
}

// Make functions available globally
window.scrollSlider = scrollSlider;
window.logout = logout;

// Add keyboard navigation
document.addEventListener('keydown', function(event) {
    const container = document.getElementById('library-container');
    if (!container) return;
    
    if (event.key === 'ArrowLeft') {
        scrollSlider(-1);
    } else if (event.key === 'ArrowRight') {
        scrollSlider(1);
    }
});