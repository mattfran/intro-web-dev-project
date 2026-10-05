// Product data
const products = [
  { id: 'breads', name: 'Breads', description: 'We bake loaves daily. White and whole wheat.', priceRange: '$4 to $9' },
  { id: 'pastries', name: 'Pastries', description: 'We have croissants, danishes, and cinnamon rolls.', priceRange: '$3 to $6' },
  { id: 'cakes', name: 'Cakes', description: 'For birthdays and other occasions.', priceRange: '$25 to $100' }
];

// Favorites state
let favorites = [];

// Load favorites from localStorage
function loadFavorites() {
  try {
    const stored = localStorage.getItem('bakery-favorites');
    return stored ? JSON.parse(stored) : [];
  } catch (e) {
    return [];
  }
}

// Save the favorites to localStorage
function saveFavorites() {
  localStorage.setItem('bakery-favorites', JSON.stringify(favorites));
}

// Toggle a product's favorite status and re-render
function toggleFavorite(productId) {
  const index = favorites.indexOf(productId);
  if (index === -1) {
    favorites.push(productId);
  } else {
    favorites.splice(index, 1);
  }
  saveFavorites();
  renderFavorites();
}

// Update buttons and the favorites summary section
function renderFavorites() {
  // Update button states
  const buttons = document.querySelectorAll('.favorite-btn');
  buttons.forEach(function (btn) {
    const productId = btn.getAttribute('data-product-id');
    const isFav = favorites.includes(productId);
    btn.classList.toggle('active', isFav);
    btn.textContent = isFav ? 'Remove from Favorites' : 'Add to Favorites';
  });

  const summary = document.getElementById('favorites-summary');
  if (!summary) return;

  if (favorites.length === 0) {
    summary.innerHTML = '<h2>Your favorites</h2><p>No favorites yet.</p>';
    return;
  }

  // Build th list of items
  const listItems = favorites.map(function (id) {
    const product = products.find(function (p) { return p.id === id; });
    return product ? '<li>' + product.name + '</li>' : '';
  }).join('');

  summary.innerHTML = '<h2>Your favorites</h2><ul>' + listItems + '</ul>';
}

// Initialize the favorites
function initFavorites() {
  favorites = loadFavorites();

  const grid = document.querySelector('.products-grid');
  if (grid) {
    grid.addEventListener('click', function (event) {
      const btn = event.target.closest('.favorite-btn');
      if (btn) {
        const productId = btn.getAttribute('data-product-id');
        toggleFavorite(productId);
      }
    });
  }

  renderFavorites();
}

// Contact form code

// Load contact name/email from localStorage
function loadContactData() {
  try {
    return {
      name: localStorage.getItem('bakery-contact-name') || '',
      email: localStorage.getItem('bakery-contact-email') || ''
    };
  } catch (e) {
    return { name: '', email: '' };
  }
}

// Save contact name/email to localStorage
function saveContactData(name, email) {
  try {
    localStorage.setItem('bakery-contact-name', name);
    localStorage.setItem('bakery-contact-email', email);
  } catch (e) {
    // noop; ignore storage errors
  }
}

// Insert an error message directly after a field
function showError(field, message) {
  const span = document.createElement('span');
  span.className = 'error-message';
  span.textContent = message;
  field.parentNode.insertBefore(span, field.nextSibling);
  field.classList.add('input-error');
}

// Remove all error messages from the form
function clearErrors(form) {
  const errors = form.querySelectorAll('.error-message');
  errors.forEach(function (el) { el.remove(); });
  const fields = form.querySelectorAll('.input-error');
  fields.forEach(function (el) { el.classList.remove('input-error'); });
}

// Validate the contact form and display errors
function validateForm(form) {
  clearErrors(form);
  let isValid = true;

  const name = form.elements['name'];
  const email = form.elements['email'];
  const pickupDate = form.elements['pickup-date'];
  const requestType = form.elements['request-type'];

  // Required checks
  if (!name.value.trim()) {
    showError(name, 'This field is required.');
    isValid = false;
  }

  if (!email.value.trim()) {
    showError(email, 'This field is required.');
    isValid = false;
  }

  if (!pickupDate.value.trim()) {
    showError(pickupDate, 'This field is required.');
    isValid = false;
  }

  if (!requestType.value.trim()) {
    showError(requestType, 'This field is required.');
    isValid = false;
  }

  // Name minimum length
  if (name.value.trim() && name.value.trim().length < 2) {
    showError(name, 'Name must be at least 2 characters long.');
    isValid = false;
  }

  // Email format
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() && !emailPattern.test(email.value.trim())) {
    showError(email, 'Please enter a valid email address.');
    isValid = false;
  }

  return isValid;
}

// Initilize the contact form by prefillng stored data and attach submit handler
function initContactForm() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const stored = loadContactData();
  if (stored.name) {
    form.elements['name'].value = stored.name;
  }
  if (stored.email) {
    form.elements['email'].value = stored.email;
  }

  form.addEventListener('submit', function (event) {
    event.preventDefault();

    if (validateForm(form)) {
      const name = form.elements['name'].value.trim();
      const email = form.elements['email'].value.trim();
      saveContactData(name, email);

      // Show success message
      clearErrors(form);
      const success = document.createElement('span');
      success.className = 'success-message';
      success.textContent = "We've recieved your message!";
      form.insertBefore(success, form.firstChild);

      form.reset();

      // Prefill again, reset clears the fields
      if (name) form.elements['name'].value = name;
      if (email) form.elements['email'].value = email;

      // Remove the success message after a few seconds
      setTimeout(function () {
        if (success.parentNode) success.remove();
      }, 4000);
    }
  });
}

// Init depending on the page
function init() {
  if (document.querySelector('.products-grid')) {
    initFavorites();
  }
  if (document.getElementById('contact-form')) {
    initContactForm();
  }
}

// Wait for the DOM to be ready before init
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}
