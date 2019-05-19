const menuItems = {};
let price;

async function getMenuItems() {
  price = 0;
  const data = await fetch('./menu-items.json')
    .then(result => result.json())
    .then(result => result.menuItems);
  await createCategories(data);
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
  const randomMenuItem = () => {
    return React.createElement(
      'div',
      null,
      element('h3', null, `${item.category}`),
      element('h2', null, `${item.name}`),
      element('p', null, `${item.description}`),
    );
  };

  const totalPrice = () => {
    return React.createElement('div', null, `$${price.toFixed(2)}`);
  };

  const priceDiv = document.querySelector('.price');
  const categoryDiv = document.querySelector(`#${category}`);
  ReactDOM.render(element(randomMenuItem), categoryDiv);
  ReactDOM.render(element(totalPrice), priceDiv);
}

function printMenu() {
  window.print();
}

getMenuItems();

document.querySelector('button').addEventListener('click', getMenuItems);
document.querySelector('.print').addEventListener('click', printMenu);
