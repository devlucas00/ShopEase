const cartIcon = document.querySelector('.cart-icon');
const cartPanel = document.getElementById('cart-panel');
const closeCart = document.getElementById('close-cart');
const addToCartButtons = document.querySelectorAll('.product-card a');
const cartItemsContainer = document.querySelector('.cart-items');
const cartCount = document.getElementById('cart-count');
const cartSubtotal = document.getElementById('cart-subtotal');
const cartTotal = document.getElementById('cart-total');

let cart = [];

function openCart() {
  cartPanel.classList.add('open');
}

function closeCartPanel() {
  cartPanel.classList.remove('open');
}

function updateCartCount() {
  const totalItems = cart.reduce((acc, item) => acc + item.quantity, 0);
  cartCount.textContent = totalItems;
}

function updateCartTotals() {
  const subtotal = cart.reduce((acc, item) => acc + item.price * item.quantity, 0);
  cartSubtotal.textContent = `R$ ${subtotal.toFixed(2)}`;
  cartTotal.textContent = `R$ ${subtotal.toFixed(2)}`;
}

function renderCart() {
  cartItemsContainer.innerHTML = ''; 

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    return;
  }

  cart.forEach(item => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    cartItem.innerHTML = `
      <div class="item-info">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h4>${item.name}</h4>
          <p>R$ ${item.price.toFixed(2)}</p>
        </div>
      </div>
      <div class="item-actions">
        <button class="decrease">-</button>
        <span>${item.quantity}</span>
        <button class="increase">+</button>
      </div>
    `;

    cartItem.querySelector('.increase').addEventListener('click', () => {
      item.quantity++;
      renderCart();
      updateCartCount();
      updateCartTotals();
    });

    cartItem.querySelector('.decrease').addEventListener('click', () => {
      if (item.quantity > 1) {
        item.quantity--;
      } else {
        cart = cart.filter(prod => prod.name !== item.name);
      }
      renderCart();
      updateCartCount();
      updateCartTotals();
    });

    cartItemsContainer.appendChild(cartItem);
  });
}

addToCartButtons.forEach(button => {
  button.addEventListener('click', (e) => {
    e.preventDefault();
    const card = e.target.closest('.product-card');
    const name = card.querySelector('.product-name').textContent;
    const priceText = card.querySelector('.product-price').textContent.replace('R$ ', '').replace('.', '').replace(',', '.');
    const price = parseFloat(priceText);
    const image = card.querySelector('img').src;

    const existingProduct = cart.find(item => item.name === name);

    if (existingProduct) {
      existingProduct.quantity++;
    } else {
      cart.push({ name, price, image, quantity: 1 });
    }

    renderCart();
    updateCartCount();
    updateCartTotals();
    openCart();
  });
});


cartIcon.addEventListener('click', openCart);
closeCart.addEventListener('click', closeCartPanel);


//
const checkoutBtn = document.getElementById('checkout-btn');
const checkoutMessage = document.getElementById('checkout-message');

checkoutBtn.addEventListener('click', (e) => {
  e.preventDefault();

  const nome = document.getElementById('checkout-name').value.trim();
  const email = document.getElementById('checkout-email').value.trim();
  const endereco = document.getElementById('checkout-address').value.trim();

  if(nome && email && endereco) {
    checkoutMessage.textContent = "Compra finalizada com sucesso!";
    checkoutMessage.style.display = "block";

    cart = [];
    renderCart();
    updateCartCount();
    updateCartTotals();
    document.getElementById('checkout-name').value = "";
    document.getElementById('checkout-email').value = "";
    document.getElementById('checkout-address').value = "";
  } else {
    checkoutMessage.textContent = "Por favor, preencha todos os campos!";
    checkoutMessage.style.color = "red";
    checkoutMessage.style.display = "block";
  }
});
