// store.js - Handles all data in localStorage
const STORE_KEY = 'nationvoice_data';

const initialState = {
  users: [], // { id, name, email, password, role: 'user' | 'admin' }
  complaints: [], // { id, userId, title, description, category, location, image, status: 'Pending'|'In Progress'|'Resolved', date }
  contactMessages: [], // { id, name, email, subject, message, date }
  currentUser: null // The currently logged in user
};

// Seed initial data if not present
function initializeStore() {
  if (!localStorage.getItem(STORE_KEY)) {
    const defaultData = { ...initialState };
    // Add default admin
    defaultData.users.push({
      id: 'admin_1',
      name: 'System Admin',
      email: 'admin@nationvoice.in',
      password: 'admin', // Simple for demo purposes
      role: 'admin'
    });
    saveStore(defaultData);
  }
}

function getStore() {
  const data = localStorage.getItem(STORE_KEY);
  return data ? JSON.parse(data) : { ...initialState };
}

function saveStore(data) {
  localStorage.setItem(STORE_KEY, JSON.stringify(data));
}

// Authentication
export function loginUser(email, password) {
  const store = getStore();
  const user = store.users.find(u => u.email === email && u.password === password);
  
  if (user) {
    store.currentUser = user;
    saveStore(store);
    return { success: true, user };
  }
  return { success: false, message: 'Invalid credentials. Please try again.' };
}

export function registerUser(name, email, password) {
  const store = getStore();
  
  if (store.users.find(u => u.email === email)) {
    return { success: false, message: 'Email is already registered.' };
  }

  const newUser = {
    id: `user_${Date.now()}`,
    name,
    email,
    password,
    role: 'user'
  };

  store.users.push(newUser);
  store.currentUser = newUser;
  saveStore(store);
  return { success: true, user: newUser };
}

export function logoutUser() {
  const store = getStore();
  store.currentUser = null;
  saveStore(store);
}

export function getCurrentUser() {
  return getStore().currentUser;
}

// Complaints
export function generateComplaintId() {
  return `NV-${Math.floor(Math.random() * 100000).toString().padStart(5, '0')}`;
}

export function submitComplaint(title, description, category, location, image) {
  const store = getStore();
  const user = store.currentUser;
  
  if (!user) {
    return { success: false, message: 'You must be logged in to file a complaint.' };
  }

  const newComplaint = {
    id: generateComplaintId(),
    userId: user.id,
    userName: user.name,
    title,
    description,
    category,
    location,
    image: image || null,
    status: 'Pending',
    date: new Date().toISOString()
  };

  store.complaints.push(newComplaint);
  saveStore(store);
  return { success: true, complaint: newComplaint };
}

export function getUserComplaints(userId) {
  const store = getStore();
  return store.complaints.filter(c => c.userId === userId).sort((a,b) => new Date(b.date) - new Date(a.date));
}

export function getAllComplaints() {
  const store = getStore();
  return store.complaints.sort((a,b) => new Date(b.date) - new Date(a.date));
}

export function getComplaintById(id) {
  const store = getStore();
  return store.complaints.find(c => c.id === id);
}

export function updateComplaintStatus(id, newStatus) {
  const store = getStore();
  const complaint = store.complaints.find(c => c.id === id);
  if (complaint) {
    complaint.status = newStatus;
    saveStore(store);
    return { success: true };
  }
  return { success: false, message: 'Complaint not found.' };
}

export function deleteComplaint(id) {
  const store = getStore();
  const initialLength = store.complaints.length;
  store.complaints = store.complaints.filter(c => c.id !== id);
  
  if (store.complaints.length < initialLength) {
    saveStore(store);
    return { success: true };
  }
  return { success: false, message: 'Complaint not found.' };
}

// Contact messages
export function submitContactMessage(name, email, subject, message) {
  const store = getStore();
  const newMessage = {
    id: `contact_${Date.now()}`,
    name,
    email,
    subject,
    message,
    date: new Date().toISOString()
  };

  store.contactMessages.push(newMessage);
  saveStore(store);
  return { success: true, message: newMessage };
}

export function getContactMessages() {
  const store = getStore();
  return store.contactMessages.sort((a, b) => new Date(b.date) - new Date(a.date));
}

// Initialize on load
initializeStore();
