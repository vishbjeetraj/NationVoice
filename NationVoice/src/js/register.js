import { registerUser } from './store.js';
import { showNotification } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const registerForm = document.getElementById('registerForm');
  
  if (registerForm) {
    registerForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const name = document.getElementById('name').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();
      
      if (!name || !email || !password || !confirmPassword) {
        showNotification('Please fill in all fields.', 'error');
        return;
      }
      
      if (password !== confirmPassword) {
        showNotification('Passwords do not match.', 'error');
        return;
      }
      
      const result = registerUser(name, email, password);
      
      if (result.success) {
        showNotification('Account created successfully! Redirecting...');
        setTimeout(() => {
          window.location.href = '/dashboard.html';
        }, 1000);
      } else {
        showNotification(result.message, 'error');
      }
    });
  }
});
