import { getCurrentUser, logoutUser } from './store.js';

// Setup Theme Toggle
function setupTheme() {
  const savedTheme = localStorage.getItem('theme') || 'light';
  document.documentElement.setAttribute('data-theme', savedTheme);
}

window.toggleTheme = function() {
  const currentTheme = document.documentElement.getAttribute('data-theme');
  const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', newTheme);
  localStorage.setItem('theme', newTheme);
};

// Setup Navbar dynamically based on auth state
function setupNavbar() {
  const user = getCurrentUser();
  const navLinks = document.querySelector('.nav-links');
  
  if (!navLinks) return;

  const currentPath = window.location.pathname;
  
  let leftLinks = `
    <li><a href="/" class="${currentPath === '/' ? 'active' : ''}">Home</a></li>
    <li><a href="/about.html" class="${currentPath.includes('about') ? 'active' : ''}">About</a></li>
    <li><a href="/contact.html" class="${currentPath.includes('contact') ? 'active' : ''}">Contact Us</a></li>
    <li><a href="/track.html" class="${currentPath.includes('track') ? 'active' : ''}">Track Status</a></li>
  `;

  let rightLinks = '';
  
  if (user) {
    if (user.role === 'admin') {
      rightLinks += `<li><a href="/admin.html" style="color: var(--primary); font-weight: 700;">Admin Panel</a></li>`;
    } else {
      rightLinks += `<li><a href="/dashboard.html" style="color: var(--primary); font-weight: 700;">My Dashboard</a></li>`;
    }
    rightLinks += `
      <li><a href="#" id="logoutBtn">Logout</a></li>
    `;
  } else {
    rightLinks += `
      <li><a href="/login.html">Login</a></li>
      <li><a href="/register.html" class="btn btn-primary" style="color: white;">Join Now</a></li>
    `;
  }

  // Combine and update
  navLinks.innerHTML = `
    ${leftLinks}
    ${rightLinks}
    <li><button class="btn btn-secondary" onclick="window.toggleTheme()" style="padding: 0.4rem 0.6rem; font-size: 1.2rem;" title="Toggle Theme">🌓</button></li>
  `;

  // Bind logout
  const logoutBtn = document.getElementById('logoutBtn');
  if (logoutBtn) {
    logoutBtn.addEventListener('click', (e) => {
      e.preventDefault();
      logoutUser();
      window.location.href = '/';
    });
  }
}

// Global Notification System
export function showNotification(message, type = 'success') {
  // Remove existing if any
  const existing = document.querySelector('.notification');
  if (existing) {
    existing.remove();
  }

  const el = document.createElement('div');
  el.className = `notification ${type}`;
  el.textContent = message;
  
  document.body.appendChild(el);
  
  // Trigger animation
  setTimeout(() => el.classList.add('show'), 10);
  
  // Remove after 3 seconds
  setTimeout(() => {
    el.classList.remove('show');
    setTimeout(() => el.remove(), 400); // Wait for transition
  }, 3000);
}

// Mobile Menu
function setupMobileMenu() {
  const header = document.querySelector('header .nav-container');
  if (!header) return;

  const btn = document.createElement('button');
  btn.className = 'mobile-menu-btn';
  btn.innerHTML = '☰';
  
  // insert before nav-links container
  const navLinks = document.querySelector('.nav-links');
  if (navLinks) {
    navLinks.parentNode.insertBefore(btn, navLinks);
    
    btn.addEventListener('click', () => {
      navLinks.classList.toggle('active');
    });
  }
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  setupTheme();
  setupNavbar();
  setupMobileMenu();
});
