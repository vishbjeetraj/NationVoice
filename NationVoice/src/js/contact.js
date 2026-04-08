import { submitContactMessage } from './store.js';
import { showNotification } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return;

  contactForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const name = document.getElementById('contactName').value.trim();
    const email = document.getElementById('contactEmail').value.trim();
    const subject = document.getElementById('contactSubject').value.trim();
    const message = document.getElementById('contactMessage').value.trim();

    if (!name || !email || !subject || !message) {
      showNotification('Please complete all fields before sending.', 'error');
      return;
    }

    const result = submitContactMessage(name, email, subject, message);
    if (result.success) {
      showNotification('Your message has been sent. Thank you!');
      contactForm.reset();
    } else {
      showNotification('Unable to send message. Please try again.', 'error');
    }
  });
});
