import { getCurrentUser, getAllComplaints, updateComplaintStatus, deleteComplaint } from './store.js';
import { showNotification } from './main.js';

document.addEventListener('DOMContentLoaded', () => {
  const user = getCurrentUser();
  if (!user || user.role !== 'admin') {
    // Redirect if not logged in or not admin
    window.location.href = '/login.html';
    return;
  }

  let complaints = [];
  const filterSelect = document.getElementById('filterStatus');

  function loadData() {
    complaints = getAllComplaints();
    renderTable();
  }

  function renderTable() {
    const container = document.getElementById('adminTableContainer');
    if (!container) return;

    const filterVal = filterSelect ? filterSelect.value : 'All';
    const filtered = filterVal === 'All' ? complaints : complaints.filter(c => c.status === filterVal);

    if (filtered.length === 0) {
      container.innerHTML = `<p style="color: var(--text-muted); text-align: center; padding: 2rem 0;">No complaints found.</p>`;
      return;
    }

    let html = `
      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Citizen</th>
            <th>Title / Location</th>
            <th>Category / Date</th>
            <th>Status</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
    `;

    filtered.forEach(c => {
      const date = new Date(c.date).toLocaleDateString('en-IN');
      const badgeClass = c.status === 'Pending' ? 'pending' : (c.status === 'In Progress' ? 'progress' : 'resolved');
      
      html += `
        <tr>
          <td style="font-weight: 500;">
            ${c.id}
          </td>
          <td>
            <strong>${c.userName}</strong>
          </td>
          <td>
            <div style="font-weight: 600;">${c.title}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${c.location}</div>
          </td>
          <td>
            <div>${c.category}</div>
            <div style="font-size: 0.85rem; color: var(--text-muted);">${date}</div>
          </td>
          <td>
            <select class="form-control status-select" data-id="${c.id}" style="padding: 0.4rem; font-size: 0.9rem; width: auto; background-color: var(--surface);">
              <option value="Pending" ${c.status === 'Pending' ? 'selected' : ''}>Pending</option>
              <option value="In Progress" ${c.status === 'In Progress' ? 'selected' : ''}>In Progress</option>
              <option value="Resolved" ${c.status === 'Resolved' ? 'selected' : ''}>Resolved</option>
            </select>
          </td>
          <td>
            <button class="btn btn-danger delete-btn" data-id="${c.id}" style="padding: 0.4rem 0.8rem; font-size: 0.8rem;">Delete</button>
          </td>
        </tr>
      `;
    });

    html += `</tbody></table>`;
    container.innerHTML = html;

    // Attach Action Listeners
    attachListeners();
  }

  function attachListeners() {
    // Status Change
    document.querySelectorAll('.status-select').forEach(select => {
      select.addEventListener('change', (e) => {
        const id = e.target.getAttribute('data-id');
        const newStatus = e.target.value;
        const res = updateComplaintStatus(id, newStatus);
        if (res.success) {
          showNotification(`Status updated to ${newStatus}`);
          loadData(); // Re-render to sort or apply filters
        } else {
          showNotification(res.message, 'error');
        }
      });
    });

    // Delete
    document.querySelectorAll('.delete-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        if (confirm('Are you sure you want to delete this complaint? This cannot be undone.')) {
          const id = e.target.getAttribute('data-id');
          const res = deleteComplaint(id);
          if (res.success) {
            showNotification('Complaint deleted.');
            loadData();
          } else {
            showNotification(res.message, 'error');
          }
        }
      });
    });
  }

  if (filterSelect) {
    filterSelect.addEventListener('change', renderTable);
  }

  // Initial Load
  loadData();
});
