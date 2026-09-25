document.addEventListener('DOMContentLoaded', () => {
  // Check Authentication
  const token = localStorage.getItem('adminToken');
  if (!token) {
    window.location.href = 'index.html';
    return;
  }

  // Set Username
  const username = localStorage.getItem('adminUsername');
  if (username) {
    const nameEl = document.querySelector('.profile-info .name');
    if (nameEl) nameEl.textContent = username;
  }

  initSidebar();
  initDashboard();
  initNav();

  // Logout
  document.getElementById('logoutBtn')?.addEventListener('click', (e) => {
    e.preventDefault();
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUsername');
    window.location.href = 'index.html';
  });
});

function initSidebar() {
  const sidebar = document.getElementById('sidebar');
  const mobileToggle = document.getElementById('mobileToggle');
  const closeSidebar = document.getElementById('closeSidebar');

  mobileToggle?.addEventListener('click', () => {
    sidebar.classList.add('active');
  });

  closeSidebar?.addEventListener('click', () => {
    sidebar.classList.remove('active');
  });

  document.addEventListener('click', (e) => {
    if (window.innerWidth <= 768) {
      if (!sidebar.contains(e.target) && e.target !== mobileToggle) {
        sidebar.classList.remove('active');
      }
    }
  });
}

let allAppointments = [];

async function initDashboard() {
  const token = localStorage.getItem('adminToken');
  const tableBody = document.getElementById('appointmentsTableBody');

  try {
    const res = await fetch('/api/appointments', {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    
    if (res.status === 401 || res.status === 403) {
      localStorage.removeItem('adminToken');
      window.location.href = 'index.html';
      return;
    }

    allAppointments = await res.json();
    updateStats(allAppointments);
    renderTable(allAppointments);
    
    const settingsRes = await fetch('/api/settings');
    const settings = await settingsRes.json();
    const visitorCountEl = document.getElementById('admin-visitor-count');
    if (visitorCountEl) {
      visitorCountEl.textContent = settings.visitor_count || '0';
    }
  } catch (error) {
    console.error('Error fetching data:', error);
    tableBody.innerHTML = '<tr><td colspan="7">Error loading data. Is the server running?</td></tr>';
  }

  // Filter logic
  const filterSelect = document.querySelector('.select-filter');
  filterSelect?.addEventListener('change', (e) => {
    const status = e.target.value;
    if (status === 'all') {
      renderTable(allAppointments);
    } else {
      renderTable(allAppointments.filter(a => a.status === status));
    }
  });
}

function updateStats(data) {
  const today = new Date().toISOString().split('T')[0];
  const pending = data.filter(a => a.status === 'pending').length;
  const total = data.length;
  
  // Note: For simplicity, "Appointments Today" is mocked based on the date field in DB.
  const todayAppts = data.filter(a => a.date && a.date.startsWith(today)).length;
  const messagesCount = data.filter(a => a.message && a.message !== 'None' && a.message.trim() !== '').length;

  const statValues = document.querySelectorAll('.stat-value');
  if (statValues.length >= 4) {
    statValues[0].textContent = todayAppts;
    statValues[1].textContent = pending;
    statValues[2].textContent = total;
    statValues[3].textContent = messagesCount;
  }
}

function getInitials(name) {
  if (!name) return 'U';
  return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
}

function renderTable(data) {
  const tableBody = document.getElementById('appointmentsTableBody');
  tableBody.innerHTML = '';

  if (data.length === 0) {
    tableBody.innerHTML = '<tr><td colspan="7" style="text-align:center;">No appointments found.</td></tr>';
    return;
  }

  data.forEach(appt => {
    const tr = document.createElement('tr');
    tr.innerHTML = `
      <td>
        <div class="patient-cell">
          <div class="patient-avatar">${getInitials(appt.name)}</div>
          <div>
            <div class="patient-name">${appt.name}</div>
          </div>
        </div>
      </td>
      <td>${new Date(appt.date).toLocaleDateString()}</td>
      <td>${appt.condition}</td>
      <td>${appt.phone}</td>
      <td style="max-width: 200px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;" title="${appt.message || 'None'}">${appt.message || '-'}</td>
      <td>
        <span class="badge-status badge-${appt.status}">${appt.status}</span>
      </td>
      <td>
        <div class="action-btns">
          ${appt.status === 'pending' ? `<button class="btn btn-outline btn-small confirm-btn" data-id="${appt.id}" title="Confirm">✓</button>` : ''}
        </div>
      </td>
    `;
    tableBody.appendChild(tr);
  });

  // Attach event listeners for confirm buttons
  document.querySelectorAll('.confirm-btn').forEach(btn => {
    btn.addEventListener('click', async function() {
      const id = this.getAttribute('data-id');
      const token = localStorage.getItem('adminToken');
      
      try {
        const res = await fetch(`/api/appointments/${id}`, {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
          },
          body: JSON.stringify({ status: 'confirmed' })
        });

        if (res.ok) {
          // Update local state and re-render
          const index = allAppointments.findIndex(a => a.id == id);
          if (index > -1) {
            allAppointments[index].status = 'confirmed';
            updateStats(allAppointments);
            
            const currentFilter = document.querySelector('.select-filter').value;
            if (currentFilter === 'all') renderTable(allAppointments);
            else renderTable(allAppointments.filter(a => a.status === currentFilter));
          }
        }
      } catch (err) {
        console.error('Failed to update status', err);
        alert('Failed to update status');
      }
    });
  });
}

// -----------------------------------------------------------------------------
// SETTINGS LOGIC
// -----------------------------------------------------------------------------
async function initSettings() {
  const token = localStorage.getItem('adminToken');

  // Load current settings
  try {
    const res = await fetch('/api/settings');
    const settings = await res.json();
    if (settings.home_image) document.getElementById('preview-home_image').src = settings.home_image;
    if (settings.doctor_image) document.getElementById('preview-doctor_image').src = settings.doctor_image;
    if (settings.why_us_image) document.getElementById('preview-why_us_image').src = settings.why_us_image;
  } catch(err) {
    console.error('Failed to load settings', err);
  }

  // Handle forms
  const uploadForms = document.querySelectorAll('.image-upload-form');
  uploadForms.forEach(form => {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const key = form.getAttribute('data-key');
      const fileInput = form.querySelector('input[type="file"]');
      if (!fileInput.files.length) return;

      const formData = new FormData();
      formData.append('key', key);
      formData.append('image', fileInput.files[0]);

      const btn = form.querySelector('button');
      const originalText = btn.textContent;
      btn.textContent = 'Uploading...';
      btn.disabled = true;

      try {
        const res = await fetch('/api/upload', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData
        });
        const data = await res.json();

        if (res.ok) {
          alert('Image updated successfully!');
          document.getElementById(`preview-${key}`).src = data.imagePath;
          fileInput.value = ''; // Reset input
        } else {
          alert(data.error || 'Failed to upload image.');
        }
      } catch(err) {
        alert('Server error. Please try again.');
      } finally {
        btn.textContent = originalText;
        btn.disabled = false;
      }
    });
  });

  // Initialize Gallery
  loadGallery();

  const galleryForm = document.getElementById('gallery-upload-form');
  galleryForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const fileInput = document.getElementById('gallery-image-input');
    if (!fileInput.files.length) return;

    const formData = new FormData();
    formData.append('image', fileInput.files[0]);

    const btn = document.getElementById('gallery-upload-btn');
    const originalText = btn.textContent;
    btn.textContent = 'Uploading...';
    btn.disabled = true;

    try {
      const res = await fetch('/api/gallery', {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      const data = await res.json();
      
      if (res.ok) {
        fileInput.value = ''; // Reset input
        loadGallery(); // Reload grid
      } else {
        alert(data.error || 'Failed to upload gallery image.');
      }
    } catch (err) {
      alert('Server error. Please try again.');
    } finally {
      btn.textContent = originalText;
      btn.disabled = false;
    }
  });
}

async function loadGallery() {
  try {
    const res = await fetch('/api/gallery');
    if (!res.ok) return;
    const images = await res.json();
    
    const countStatus = document.getElementById('gallery-count-status');
    const uploadBtn = document.getElementById('gallery-upload-btn');
    const fileInput = document.getElementById('gallery-image-input');
    
    if (countStatus) countStatus.textContent = `${images.length} / 20 Images`;
    
    if (images.length >= 20) {
      if (uploadBtn) uploadBtn.disabled = true;
      if (fileInput) fileInput.disabled = true;
    } else {
      if (uploadBtn) uploadBtn.disabled = false;
      if (fileInput) fileInput.disabled = false;
    }

    const grid = document.getElementById('gallery-grid');
    if (grid) {
      grid.innerHTML = '';
      images.forEach(img => {
        const div = document.createElement('div');
        div.style.position = 'relative';
        div.style.borderRadius = '8px';
        div.style.overflow = 'hidden';
        div.style.border = '1px solid var(--border-color)';
        
        div.innerHTML = `
          <img src="${img.image_path}" style="width: 100%; height: 100px; object-fit: cover; display: block;">
          <button class="btn btn-danger delete-gallery-btn" data-id="${img.id}" style="position: absolute; top: 4px; right: 4px; padding: 4px 8px; font-size: 12px; background: red; color: white; border: none; border-radius: 4px; cursor: pointer;">X</button>
        `;
        grid.appendChild(div);
      });

      // Attach delete listeners
      document.querySelectorAll('.delete-gallery-btn').forEach(btn => {
        btn.addEventListener('click', async function() {
          if (!confirm('Are you sure you want to delete this image?')) return;
          const id = this.getAttribute('data-id');
          const token = localStorage.getItem('adminToken');
          
          try {
            const res = await fetch(`/api/gallery/${id}`, {
              method: 'DELETE',
              headers: { 'Authorization': `Bearer ${token}` }
            });
            if (res.ok) {
              loadGallery();
            } else {
              const data = await res.json();
              alert(data.error || 'Failed to delete image.');
            }
          } catch(err) {
            alert('Server error.');
          }
        });
      });
    }
  } catch(err) {
    console.error('Failed to load gallery', err);
  }
}

// -----------------------------------------------------------------------------
// NAVIGATION LOGIC
// -----------------------------------------------------------------------------
function initNav() {
  const navItems = document.querySelectorAll('.sidebar-nav .nav-item[data-view]');
  const views = {
    'dashboard-view': document.getElementById('dashboard-view'),
    'settings-view': document.getElementById('settings-view')
  };

  navItems.forEach(item => {
    item.addEventListener('click', (e) => {
      e.preventDefault();
      // Remove active class
      navItems.forEach(nav => nav.classList.remove('active'));
      // Add active class
      item.classList.add('active');

      // Hide all views
      Object.values(views).forEach(view => {
        if(view) view.style.display = 'none';
      });

      // Show selected view
      const viewId = item.getAttribute('data-view');
      if (views[viewId]) {
        views[viewId].style.display = 'block';
        if (viewId === 'settings-view') {
          initSettings();
        }
      }
    });
  });
}

