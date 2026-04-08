import { loginUser } from './store.js';
import { showNotification } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const loginForm = document.getElementById('loginForm');
  
  if (loginForm) {
    loginForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      
      if (!email || !password) {
        showNotification('Please fill in all fields.', 'error');
        return;
      }
      
      const result = loginUser(email, password);
      
      if (result.success) {
        showNotification('Login successful! Redirecting...');
        // Redirect based on role
        setTimeout(() => {
          if (result.user.role === 'admin') {
            window.location.href = '/admin.html';
          } else {
            window.location.href = '/dashboard.html';
          }
        }, 1000);
      } else {
        showNotification(result.message, 'error');
      }
    });
  }
});
