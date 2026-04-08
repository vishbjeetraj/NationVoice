import { getComplaintById } from './store.js';
import { showNotification } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('trackForm');
  const container = document.getElementById('resultContainer');
  
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const id = document.getElementById('trackId').value.trim().toUpperCase();
      if (!id) return;
      
      const complaint = getComplaintById(id);
      
      if (!complaint) {
        showNotification('No complaint found with that ID.', 'error');
        container.style.display = 'none';
        return;
      }

      // Render the result
      const date = new Date(complaint.date).toLocaleDateString('en-IN', {
        year: 'numeric', month: 'long', day: 'numeric',
        hour: '2-digit', minute:'2-digit'
      });
      const badgeClass = complaint.status === 'Pending' ? 'pending' : (complaint.status === 'In Progress' ? 'progress' : 'resolved');

      let imageHtml = '';
      if (complaint.image) {
        imageHtml = `
          <div style="margin-top: 2rem;">
            <p style="font-weight: 500; margin-bottom: 0.5rem;">Attached Evidence:</p>
            <img src="${complaint.image}" alt="Complaint Image" style="max-width: 100%; border-radius: 8px; max-height: 400px; object-fit: cover; box-shadow: var(--glass-shadow);">
          </div>
        `;
      }

      container.innerHTML = `
        <div class="glass animate-fade-in" style="padding: 2.5rem;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 1rem;">
            <div>
              <div style="font-size: 0.9rem; color: var(--text-muted); font-weight: 600;">COMPLAINT ID: ${complaint.id}</div>
              <h2 style="margin: 0.5rem 0;">${complaint.title}</h2>
              <div style="font-size: 0.95rem; color: var(--text-muted);">Reported By: <strong>${complaint.userName}</strong> on ${date}</div>
            </div>
            <div style="font-size: 1.2rem;">
              <span class="status-badge ${badgeClass}" style="padding: 0.6rem 1.2rem;">${complaint.status}</span>
            </div>
          </div>
          
          <hr style="border: 0; border-top: 1px solid var(--border); margin: 2rem 0;">
          
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 2rem;">
            <div>
              <p style="font-weight: 500; margin-bottom: 0.5rem; color: var(--text);">Category:</p>
              <p style="color: var(--text-muted);">${complaint.category}</p>
            </div>
            <div>
              <p style="font-weight: 500; margin-bottom: 0.5rem; color: var(--text);">Location:</p>
              <p style="color: var(--text-muted);">${complaint.location}</p>
            </div>
          </div>

          <div style="margin-top: 2rem;">
            <p style="font-weight: 500; margin-bottom: 0.5rem; color: var(--text);">Description:</p>
            <p style="color: var(--text-muted); background: var(--surface-opaque); padding: 1rem; border-radius: 8px;">
              ${complaint.description}
            </p>
          </div>

          ${imageHtml}

        </div>
      `;
      
      container.style.display = 'block';
    });

    // Check query params if accessed directly from external link (e.g. ?id=NV-123)
    const urlParams = new URLSearchParams(window.location.search);
    const queryId = urlParams.get('id');
    if (queryId) {
      document.getElementById('trackId').value = queryId;
      form.dispatchEvent(new Event('submit'));
    }
  }
});
