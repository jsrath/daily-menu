const menuItems = {};
let price;

async function getMenuItems() {
  price = 0;
  try {
    const response = await fetch('./menu-items.json');
    if (!response.ok) {
      throw new Error(`Menu data unavailable (HTTP ${response.status})`);
    }
    const result = await response.json();
    createCategories(result.menuItems);
  } catch (error) {
    console.error(error);
    document.querySelector('.price').textContent = 'Unable to load menu';
  }
}

function createCategories(items) {
  const categories = [...new Set(items.map(item => item.category))];
  categories.forEach(category => {
    menuItems[category] = items.filter(item => item.category === category);
    getRandomItem(menuItems[category], category);
  });
}

function getRandomItem(items, category) {
  const item = items[Math.floor(Math.random() * items.length)];
  price = price ? price + item.price : item.price;

  const element = React.createElement;
  const randomMenuItem = () =>
    element(
      'div',
      null,
      element('h3', null, `${item.category}`),
      element('h2', null, `${item.name}`),
      element('p', null, `${item.description}`),
    );

  const totalPrice = () => element('div', null, `$${price.toFixed(2)}`);

  const priceDiv = document.querySelector('.price');
  const categoryDiv = document.querySelector(`#${category}`);
  if (!priceDiv || !categoryDiv) {
    return;
  }
  ReactDOM.render(element(randomMenuItem), categoryDiv);
  ReactDOM.render(element(totalPrice), priceDiv);
}

function printMenu() {
  window.print();
}

function initDailyMenu() {
  document.querySelector('.regen').addEventListener('click', getMenuItems);
  document.querySelector('.print').addEventListener('click', printMenu);
  getMenuItems();
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initDailyMenu);
} else {
  initDailyMenu();
}
