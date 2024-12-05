function storeSubTotal(item) {}

function renderCart() {
  const row = document.getElementById("cartTable");
  row.innerHTML = ""; // Clear existing content
  const cart = JSON.parse(localStorage.getItem("cart")) || []; // Get cart items or initialize as empty array

  // Handle empty cart
  if (!cart.length) {
    row.innerHTML = `<h1 style="text-align:center;margin:50px">Your Cart is Empty!</h1>`;
    return; // Exit the function early
  }

  // Render cart items
  cart.forEach((item, index) => {
    const productCard = `
          <tr>
            <td>
              <div class="cart-page__table__meta">
                <div class="cart-page__table__meta__img">
                  <img
                    src="${
                     encodeURI(item?.product_image?.image_1)
                    }"
                    alt=""
                  />
                </div>
                <h3 class="cart-page__table__meta__title">
                  <a href="product-details.html">${
                    item?.product_name?.slice(0,16)
                  }</a>
                </h3>
              </div>
            </td>
            <td class="cart-page__table__price">Rs. ${
              item?.price
            }</td>
            <td>
              <div class="product-details__quantity">
                <div class="quantity-box">
                  <button type="button" class="sub" onClick="updateQuantity(${index}, -1)">
                    <i class="fa fa-minus"></i>
                  </button>
                  <input type="text" value="${item?.quantity || 1}" readonly />
                  <button type="button" class="add" onClick="updateQuantity(${index}, 1)">
                    <i class="fa fa-plus"></i>
                  </button>
                </div>
              </div>
            </td>
            <td class="cart-page__table__total">
              <span>Rs. ${(item?.price || 0) * (item?.quantity || 1)}</span>
            </td>
            <td>
              <a href="#" class="cart-page__table__remove" onClick="removeFromCart(${index})">
                <i class="icon-close"></i>
              </a>
            </td>
          </tr>`;
    row.innerHTML += productCard;
  });
  calculateGrandTotal();
}

function updateQuantity(index, change) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];
  if (cart[index]) {
    cart[index].quantity = Math.max(1, (cart[index].quantity || 1) + change);
    localStorage.setItem("cart", JSON.stringify(cart));
    renderCart();
    calculateGrandTotal();
  }
}

function removeFromCart(index) {
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  cart.splice(index, 1);
  localStorage.setItem("cart", JSON.stringify(cart));
  renderCart();
  calculateGrandTotal();
}

function emptyCart() {
  localStorage.removeItem("cart");
  renderCart();
  calculateGrandTotal();
}

function calculateGrandTotal() {
  console.log("inside");
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const grandTotal = document.getElementById("grandTotal");
  let total = 0;

  cart?.forEach((item) => {
    total += (item?.price || 0) * (item?.quantity || 1);
  });
  console.log("inside", total, cart);
  grandTotal.innerHTML = total;
}

renderCart();


const containerF = document.getElementById('containerF');
const containerAd = document.getElementById('containerAd');
const addressForm = document.getElementById('addressForm');
const addressDisplay = document.getElementById('addressDisplay');
const addressDetails = document.getElementById('addressDetails');
const editButton = document.getElementById('editButton');

addressForm.addEventListener('submit', (event) => {
  event.preventDefault(); // Prevent page reload

  // Get form data
  const formData = new FormData(addressForm);
  const address = {
    name: formData.get('name'),
    street: formData.get('street'),
    city: formData.get('city'),
    state: formData.get('state'),
    zip: formData.get('zip'),
    country: formData.get('country'),
  };

  // Display the address
  addressDetails.innerHTML = `
    <strong>${address.name}</strong><br>
    ${address.street}<br>
    ${address.city}, ${address.state} - ${address.zip}<br>
    ${address.country}
  `;

  // Hide the form and show the address display
  addressForm.classList.add('hidden');
  addressDisplay.classList.remove('hidden');
  containerF.classList.add('hidden');
  containerAd.classList.remove('hidden');
});

// Handle edit button click
editButton.addEventListener('click', () => {
  // Show the form and hide the address display
  addressForm.classList.remove('hidden');
  addressDisplay.classList.add('hidden');
  containerAd.classList.add('hidden');
  containerF.classList.remove('hidden');
});


// function renderCart() {
//   const row = document.getElementById("cartTable");
//   row.innerHTML = ""; // Clear existing content
//   const cart = JSON.parse(localStorage.getItem("cart")) || []; // Get cart items or initialize as empty array
//   if (!cart.length) {
//     row.innerHTML = `<h1 style="text-align:center;margin:50px">Your Cart is Empty!</h1>`;
//     return; // Exit the function early
//   }
//   cart?.forEach((item) => {
//     const productCard = `
//         <tr>
//           <td>
//             <div class="cart-page__table__meta">
//               <div class="cart-page__table__meta__img">
//                 <img
//                   src=${
//                     item?.image ||
//                     "https://img.freepik.com/premium-photo/white-pill-is-spilled-top-white-bottle_880935-570.jpg?ga=GA1.1.1428315958.1707616094&semt=ais_hybrid"
//                   }
//                   alt="${item?.title || "Product"}"
//                 />
//               </div>
//               <h3 class="cart-page__table__meta__title">
//                 <a href="product-details.html">${
//                   item?.title || "Product Name"
//                 }</a>
//               </h3>
//             </div>
//           </td>
//           <td class="cart-page__table__price">Rs. ${item?.price || "0.00"}</td>
//           <td>
//             <div class="product-details__quantity">
//               <div class="quantity-box">
//                 <button type="button" class="sub">
//                   <i class="fa fa-minus"></i>
//                 </button>
//                 <input type="text" value="${item?.quantity || 1}" />
//                 <button type="button" class="add">
//                   <i class="fa fa-plus"></i>
//                 </button>
//               </div>
//             </div>
//           </td>
//           <td class="cart-page__table__total">
//             <span>Rs. ${(item?.price || 0) * (item?.quantity || 1)}</span>
//           </td>
//           <td>
//             <a href="#" class="cart-page__table__remove" onClick="removeFromCart('${
//               item.id
//             }')">
//               <i class="icon-close"></i>
//             </a>
//           </td>
//         </tr>`;
//     // Append the productCard to the table
//     row.innerHTML += productCard;
//   });
// }

// // Example function to remove an item from the cart
// function removeFromCart(id) {
//   let cart = JSON.parse(localStorage.getItem("cart")) || [];
//   cart = cart.filter((item) => item.id !== id);
//   localStorage.setItem("cart", JSON.stringify(cart));
//   renderCart();
// }

// renderCart();

// function emptyCart() {
//   localStorage.removeItem("cart");
//   renderCart();
// }
