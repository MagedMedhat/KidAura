document.addEventListener('DOMContentLoaded', function() {
    const authForm = document.getElementById('auth-form');
    const signupSection = document.getElementById('signup-section');
    
    // Handle login form submission
    authForm.addEventListener('submit', function(e) {
        e.preventDefault();
        
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        
        if (username && password) {
            // Store username in localStorage
            localStorage.setItem('kidoraUsername', username);
            localStorage.setItem('kidoraAvatar', '😎'); // Default avatar
            
            console.log('User logged in:', username);
            window.location.href = '/library';
        } else {
            alert('Please fill in all fields');
        }
    });
});

// Show signup section
function showSignup() {
    document.getElementById('signup-section').style.display = 'block';
}

// Hide signup section
function hideSignup() {
    document.getElementById('signup-section').style.display = 'none';
    document.getElementById('email').value = '';
}

// Create account function
function createAccount() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const email = document.getElementById('email').value;
    
    if (username && password && email) {
        // Store user info
        localStorage.setItem('kidoraUsername', username);
        localStorage.setItem('kidoraAvatar', '🌟'); // New user avatar
        
        alert('Account created successfully! Welcome ' + username + '!');
        window.location.href = '/library';
    } else {
        alert('Please fill in all fields');
    }
}

// Make functions available globally
window.showSignup = showSignup;
window.hideSignup = hideSignup;
window.createAccount = createAccount;