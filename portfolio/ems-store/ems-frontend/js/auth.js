// Updated auth.js - Backend integration
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    
    if (loginForm) {
        loginForm.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            const errorMessage = document.getElementById('errorMessage');
            
            // Show loading state
            const submitButton = loginForm.querySelector('button[type="submit"]');
            const originalText = submitButton.textContent;
            submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Logging in...';
            submitButton.disabled = true;
            
            try {
                const result = await API.login(username, password);
                
                if (result.success) {
                    // Store user info in localStorage
                    localStorage.setItem('ems_user', JSON.stringify(result.data.user));
                    localStorage.setItem('ems_loggedIn', 'true');
                    
                    // Redirect to dashboard
                    window.location.href = 'dashboard.html';
                } else {
                    errorMessage.textContent = result.error || 'Invalid credentials';
                    errorMessage.style.display = 'block';
                    
                    // Hide error after 3 seconds
                    setTimeout(() => {
                        errorMessage.style.display = 'none';
                    }, 3000);
                }
            } catch (error) {
                errorMessage.textContent = 'Network error. Please try again.';
                errorMessage.style.display = 'block';
            } finally {
                // Reset button
                submitButton.textContent = originalText;
                submitButton.disabled = false;
            }
        });
    }
    
    // Check authentication on page load
    checkAuth();
});

// Check if user is authenticated
function checkAuth() {
    const isLoggedIn = localStorage.getItem('ems_loggedIn');
    const currentPage = window.location.pathname.split('/').pop();
    
    // If not logged in and not on login page, redirect to login
    if (!isLoggedIn && currentPage !== 'index.html' && currentPage !== '') {
        window.location.href = 'index.html';
    }
    
    // If logged in and on login page, redirect to dashboard
    if (isLoggedIn && (currentPage === 'index.html' || currentPage === '')) {
        window.location.href = 'dashboard.html';
    }
}

// Handle logout
async function logout() {
    try {
        await API.logout();
        localStorage.removeItem('ems_loggedIn');
        localStorage.removeItem('ems_user');
        window.location.href = 'index.html';
    } catch (error) {
        console.error('Logout error:', error);
        // Even if API fails, clear local storage
        localStorage.removeItem('ems_loggedIn');
        localStorage.removeItem('ems_user');
        window.location.href = 'index.html';
    }
}

// Add logout event listener
document.addEventListener('DOMContentLoaded', function() {
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', function(e) {
            e.preventDefault();
            logout();
        });
    }
});