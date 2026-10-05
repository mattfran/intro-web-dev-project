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
