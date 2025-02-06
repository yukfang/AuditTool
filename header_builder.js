// Select the <header> element
const header = document.querySelector('header');

// Create a <nav> element
const nav = document.createElement('nav');
nav.className = 'nav-menu'; // Add a class if needed

// List of menu items with their href and target attributes
const menuItems = [
  { text: 'Home', href: '/', target: '_self' },
  { text: 'Engaged Session', href: 'engaged-session', target: '_self' },
  { text: 'App S+', href: 'app', target: '_self' },
  { text: 'Catalog Video', href: 'catalog-video', target: '_self' },
  { text: 'S+ Traffic', href: 's+traffic', target: '_self' }
];

// Create and append <a> elements for each menu item
menuItems.forEach(item => {
  const link = document.createElement('a');
  link.href = item.href;
  link.target = item.target;
  link.textContent = item.text;
  nav.appendChild(link);
});

// Append the <nav> to the <header>
header.appendChild(nav);
