const productsObj = {
  products: [{
      id: 1,
      title: "Towel",
      description: "Sunny days and warm weather - you clearly need it after a refreshing jump into the cool sea.",
      price: 10
    },
    {
      id: 2,
      title: "Enlightening book",
      description: "There's no rush out there. Take your time for a good read.",
      price: 5.99
    },
    {
      id: 3,
      title: "Waterproof camera",
      description: "Below the sea's surfare, a hidden world. Don't miss out to bring those memories back home.",
      price: 49.99
    },
    {
      id: 4,
      title: "Pinwheel",
      description: "Wondering what to do when there's only a light breeze? Back to your childhood!",
      price: 2.50
    },
  ],

  addedProducts: [],
  total: 0,
  vatPercentage: 5,

  init: function() {
    const container = document.querySelector('.wrapper-content .row');
    this.products.forEach((item) => {
      const product = this.generateProductItem(item);
      container.appendChild(product);
      const addBtn = product.querySelector('.add-to-cart-button');
      addBtn.onclick = () => this.addProduct(item);

      this.totalPriceBeforeVat = document.querySelectorAll('.shopping-cart-footer .total-price')[0];
      this.vatPrice = document.querySelectorAll('.shopping-cart-footer .total-price')[1];
      this.totalPrice = document.querySelectorAll('.shopping-cart-footer .total-price')[2];
    })
  },

  addProduct: function(item) {
    if (this.addedProducts.includes(item)) {
      return;
    }
    this.addedProducts.push(item);
    this.getTotal(item, 'add');

    const cartContent = document.querySelector('.shopping-cart-content');
    const cartTitle = document.querySelector('.shopping-cart-content .row:first-child');
    const cartFooter = document.querySelector('.shopping-cart-footer');

    cartTitle.style.display = 'flex';
    cartFooter.style.display = 'block';

    const orderRow = this.generateOrderRow(item);
    cartContent.appendChild(orderRow);
    const removeBtn = orderRow.querySelector('.remove-from-cart-button');
    removeBtn.onclick = () => this.removeProduct(item, cartTitle, cartFooter);

    const subtractQuantityBtn = orderRow.querySelector('.subtractQuantity');
    const addQuantityBtn = orderRow.querySelector('.addQuantity');

    const inputedValue = orderRow.querySelector('.inputed-value');
    const rowProductPrice = orderRow.querySelector('.product-price');

    subtractQuantityBtn.onclick = () => this.quantityControl(item, inputedValue, rowProductPrice, 'decrement');
    addQuantityBtn.onclick = () => this.quantityControl(item, inputedValue, rowProductPrice, 'increment');
  },

  generateProductItem: function(item) {
    let product = document.createElement('div');
    product.classList.add('col');
    product.innerHTML = `
          <div class="product">
            <div class="product-title">${item.title}</div>
            <div class="product-description">${item.description}</div>
            <div class="product-footer">
              <button class="add-to-cart-button">Add to cart</button>
              <div class="product-price"><strong>&euro;${item.price}</strong></div>
            </div>
          </div>`;
    return product;
  },

  generateOrderRow: function(item) {
    const orderRow = document.createElement('div');
    orderRow.id = `product-${item.id}`
    orderRow.classList.add('row');
    orderRow.innerHTML = `<div class="col" >
            <div class="product">
              <div class="product-title">${item.title}</div>
              <div class="product-description">${item.description}</div>
              <div class="product-footer">
                <button type="button" class="remove-from-cart-button">Remove</button>
              </div>
            </div>
          </div>
          <div class="col">
            <div class="product-price"><strong>&euro;${item.price}</strong></div>
          </div>
          <div class="col">
            <div class="product-quantity">
              <input type="number" value="1" class="inputed-value">
              <button type="button" class="subtractQuantity">&minus;</button>
              <button type="button" class="addQuantity">&plus;</button>
            </div>
          </div>`;
    return orderRow;
  },

  removeProduct: function(item, cartTitle, cartFooter) {
    let index = this.addedProducts.indexOf(item);
    this.addedProducts.splice(index, 1);
    const buffer = Number(document.querySelector(`#product-${item.id} .inputed-value`).value);
    document.querySelector(`#product-${item.id}`).remove();

    this.getTotal(item, 'remove', buffer);
    if (this.addedProducts.length === 0) {
      cartTitle.style.display = 'none';
      cartFooter.style.display = 'none';
    }
  },

  quantityControl: function(item, input, rowProductPrice, action) {
    if (action === 'increment') {
      this.getTotal(item, 'add');
      input.value++;
      this.updateQuantity(item, input, rowProductPrice);
    } else if (input.value > 1){
      this.getTotal(item, 'remove');
      input.value--;
      this.updateQuantity(item, input, rowProductPrice);
    }
  },

  updateQuantity: function(item, input, rowProductPrice) {
    let valueAcc = input.value * item.price;
    rowProductPrice.innerHTML = `<strong>&euro;${valueAcc.toFixed(2)}</strong>`;
  },

  getTotal: function(item, condition, buffer = 1) {
    (condition === 'remove') ?
    (this.total -= item.price * buffer) : (this.total += item.price);
    this.totalPriceBeforeVat.innerHTML = `<strong>&euro;${this.total.toFixed(2)}</strong>`;

    let vatValue = ((this.total/100) * this.vatPercentage);
    this.vatPrice.innerHTML = `<strong>&euro;${vatValue.toFixed(2)}</strong>`

    let totalToPay = this.total + vatValue;
    this.totalPrice.innerHTML = `<strong>&euro;${totalToPay.toFixed(2)}</strong>`;
  },
}

productsObj.init();
