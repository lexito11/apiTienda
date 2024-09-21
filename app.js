let products = [];
let cart = [];

window.onload = function () {
    fetchProducts();
    fetchCategories();
}
async function fetchProducts() {
    try {
        const response = await fetch('https://fakestoreapi.com/products');
        products = await response.json();
        displayProducts(products);
    } catch (error) {
        console.error('Error al obtener los productos:', error);
    }
}
async function fetchCategories() {
    try {
        const response = await fetch('https://fakestoreapi.com/products/categories');
        const categories = await response.json();
        populateCategoryFilter(categories);
    } catch (error) {
        console.error('Error al obtener categorias:', error);
    }
}
function populateCategoryFilter(categories) {
    const categoryFilter = document.getElementById('category-filter');
    categories.forEach(category => {
        const option = document.createElement('option');
        option.value = category;
        option.textContent = capitalizeFirstLetter(category);
        categoryFilter.appendChild(option);
    });
}

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}
function displayProducts(productsToDisplay) {
    const productContainer = document.getElementById('product-list');
    productContainer.innerHTML = '';
    productsToDisplay.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';

        productCard.innerHTML = `
            <h3>${product.title}</h3>
            <img src="${product.image}" alt="${product.title}" width="100" height="100">
            <p>Precio: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;
        productContainer.appendChild(productCard);
    });
}
function addToCart(productId) {
    const product = products.find(item => item.id === productId);
    const cartItem = cart.find(item => item.id === productId);

    if (cartItem) {
        alert('Producto ya agregado en el carrito');
    } else {
        cart.push({ ...product, quantity: 1 });
        updateCart();
    }
}
function updateCart() {
    const cartContainer = document.getElementById('cart');
    cartContainer.innerHTML = '';

    cart.forEach(item => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';

        cartItem.innerHTML = `
            <h4>${item.title}</h4>
            <p>Precio: $${item.price}</p>
            <p>Cantidad: 
                <button onclick="changeQuantity(${item.id}, -1)">-</button>
                ${item.quantity}
                <button onclick="changeQuantity(${item.id}, 1)">+</button>
            </p>
            <button onclick="removeFromCart(${item.id})">Eliminar</button>
        `;
        cartContainer.appendChild(cartItem);
    });

    displayCartSummary();
}
function changeQuantity(productId, amount) {
    const cartItem = cart.find(item => item.id === productId);
    if (cartItem) {
        cartItem.quantity += amount;
        if (cartItem.quantity === 0) {
            removeFromCart(productId);
        } else {
            updateCart();
        }
    }
}
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}
function displayCartSummary() {
    const total = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
    const summary = document.getElementById('cart-summary');
    summary.innerHTML = `Total: $${total.toFixed(2)}`;
}
function handlePriceSort(order) {
    if (order === 'asc' || order === 'desc') {
        filterByPrice(order);
    }
}
function handleCategoryFilter(category) {
    if (category) {
        filterByCategory(category);
    } else {
        displayProducts(products);
    }
}
function filterByPrice(order) {
    const sortedProducts = [...products].sort((a, b) => {
        return order === 'asc' ? a.price - b.price : b.price - a.price;
    });
    displayProducts(sortedProducts);
}
function filterByCategory(category) {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
}