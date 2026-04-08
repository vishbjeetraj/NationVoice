import { getCurrentUser, submitComplaint, getUserComplaints } from './store.js';
import { showNotification } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user) {
    // Redirect if not logged in
    window.location.href = '/login.html';
    return;
  }

  // Set user name
  const nameDisplay = document.getElementById('userNameDisplay');
  if (nameDisplay) {
    nameDisplay.textContent = user.name;
  }

  // Handle Image Preview
  const imageInput = document.getElementById('cImage');
  const imagePreview = document.getElementById('imagePreview');
  let loadedImageData = null;

  if (imageInput) {
    imageInput.addEventListener('change', (e) => {
      const file = e.target.files[0];
      if (file) {
        if (!file.type.startsWith('image/')) {
          showNotification('Please upload a valid image file.', 'error');
          return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
          loadedImageData = e.target.result;
          imagePreview.src = loadedImageData;
          imagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
      } else {
        loadedImageData = null;
        imagePreview.style.display = 'none';
      }
    });
  }

  // Render Table
  function renderTable() {
    const container = document.getElementById('complaintsTableContainer');
    if (!container) return;

    const complaints = getUserComplaints(user.id);
    
    if (complaints.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem 0;">You haven't submitted any complaints yet.</p>`;
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Title</th>
            <th>Category</th>
            <th>Date</th>
            <th>Status</th>
          </tr>
        </thead>
        <tbody>
    `;

    complaints.forEach(c => {
      const date = new Date(c.date).toLocaleDateString('en-IN');
      const badgeClass = c.status === 'Pending' ? 'pending' : (c.status === 'In Progress' ? 'progress' : 'resolved');
      
      html += `
        <tr>
          <td style="font-weight: 500;">${c.id}</td>
          <td>${c.title}</td>
          <td>${c.category}</td>
          <td>${date}</td>
          <td><span class="status-badge ${badgeClass}">${c.status}</span></td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;
  }

  // Handle form submission
  const form = document.getElementById('complaintForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();

      const title = document.getElementById('cTitle').value.trim();
      const category = document.getElementById('cCategory').value;
      const location = document.getElementById('cLocation').value.trim();
      const description = document.getElementById('cDescription').value.trim();

      if (!title || !category || !location || !description) {
        showNotification('Please fill in all required fields.', 'error');
        return;
      }

      const result = submitComplaint(title, description, category, location, loadedImageData);

      if (result.success) {
        showNotification('Complaint submitted successfully!');
        form.reset();
        loadedImageData = null;
        if (imagePreview) imagePreview.style.display = 'none';
        
        // Modal / Popup to show ID could be added, or just rely on table
        showNotification(`Your Complaint ID is: ${result.complaint.id}`);
        
        renderTable();
      } else {
        showNotification(result.message, 'error');
      }
    });
  }

  // Initial render
  renderTable();
});
