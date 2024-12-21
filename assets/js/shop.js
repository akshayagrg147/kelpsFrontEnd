const KELPS_BASE_URL=JSON.parse(localStorage.getItem("KELPS_BASE_URL"))

const PRODUCTS = "PRODUCTS";
const productsRef = [];

// The API endpoint (replace with your own API URL)
const API_URL = `${KELPS_BASE_URL}/product_list`;
// const API_URL =
// "http://3.110.117.10/product_list";
function onSearch() {
  const searchBox = document.getElementById("searchItem");
  const searchValue = searchBox.value;
  const data = JSON.parse(localStorage.getItem("PRODUCTS"));
  const filteredData = data?.filter((item) =>
    item.product_name.toLowerCase().includes(searchValue.toLowerCase())
  );

  createCards(filteredData);
  renderShowResults(filteredData, searchValue);
}

function onSubmitForm(event) {
  event.preventDefault();
  onSearch();
}

function filterByCategory(sourceFilter) {
  const data = JSON.parse(localStorage.getItem("PRODUCTS"));
  const filteredData = data?.filter((item) => item?.product_category_id === sourceFilter);
  console.log("category", filteredData);
  createCards(filteredData);
}

function onSelect(val) {
  const filters = {
    priceHL: "priceHL",
    priceLH: "priceLH",
    ratingHL: "ratingHL",
    ratingLH: "ratingLH",
  };
  const data = JSON.parse(localStorage.getItem("PRODUCTS"));
  if (val === filters.priceLH) {
    const filteredData = data?.sort((a, b) =>Number(a.price)  - Number(b.price) );
    createCards(filteredData);
  } else if (val === filters.priceHL) {
    const filteredData = data?.sort((a, b) => Number(b.price)  - Number(a.price));
    createCards(filteredData);
  } else if (val === filters.ratingLH) {
    const filteredData = data?.sort((a, b) => Number(a.rating?a.rating:5)  - Number(b.rating?b.rating:5));
    createCards(filteredData);
  } else if (val === filters.ratingHL) {
    const filteredData = data?.sort((a, b) => Number(b.rating?b.rating:5)  - Number(a.rating?a.rating:5));
    createCards(filteredData);
  }
  console.log("selected", val);
}

const addProductToCart = (addItem) => {

  console.log("addItem", addItem);
  let cart = JSON.parse(localStorage.getItem("cart")) || [];
  const isProductExist = cart?.find((item) => item?.product_id === addItem?.product_id);
  if (!isProductExist) {
    cart = [...cart, addItem];
    localStorage.setItem("cart", JSON.stringify(cart));
  }
};

function renderShowResults(data, search) {
  const totalProducts = document.getElementById("totalProducts");
  const totalPara = ` <p class="product__showing-text" >
  Showing <b>${data?.length}</b> Results ${
    search ? `for <b>"${search}"</b>` : "..."
  }
</p>`;
  totalProducts.innerHTML = totalPara;
}

function navigateToProductDetails(productId) {
  // Navigate to 'product-details.html' with the product ID as a query parameter
  window.location.href = `product-details.html?id=${productId}`;
}

// Function to create and insert cards into the HTML
function createCards(data) {
  const searchBox = document.getElementById("searchItem");
  searchBox.value = "";
  const cardContainer = document.getElementById("myCardClass");

  renderShowResults(data);
  // Clear the container before adding new cards
  cardContainer.innerHTML = "";

  if (data?.length === 0) {
    const card = document.createElement("div");
    const empty = `<h4>No Products Available!</h4>`;
    card.className = " col-xl-4 col-sm-6";
    cardContainer.innerHTML = empty;
  }



  // Loop through the data and create cards
  console.log("inside",data)
  data.forEach((item) => {
    const card = document.createElement("div");
    card.className = " col-xl-4 col-sm-6";

    // Add content to the card
    card.innerHTML = `
                  <div
                    class="product__item wow fadeInUp"
                    data-wow-duration="1500ms"
                    data-wow-delay="000ms"

                  >
                    <div class="product__item__image" onclick="navigateToProductDetails(${item.product_id})">
                      <img
                        src=${encodeURI(item?.product_image?.image_1)}
                        alt="Shelcal 500"
                        style="height:200px;width:100%"
                        href="product-details.html"
                      />
                    </div>
                    <!-- /.product-image -->
                    <div class="product__item__content">
                      <div class="mediox-ratings">
                      ${new Array(Math.ceil(item.rating?item.rating:5)) // Generate an array of size up to 5 (rounded up)
                        .fill(0) // Fill the array with placeholder values
                        .map(() => {
                          return `<span class="mediox-ratings__icon">
                                    <i class="icon-star"></i>
                                  </span>`;
                        })
                        .join("")}

                      </div>
                      <!-- /.product-ratings -->
                      <h4 class="product__item__title">
                        <a >${item.product_name?.slice(
                          0,
                          10
                        )}</a>
                      </h4>
                      <!-- /.product-title -->
                      <div class="product__item__price">Rs. ${item?.price}</div>
                      <!-- /.product-price -->
                      <a href="cart.html" class="product__item__btn mediox-btn" onClick='addProductToCart(${JSON.stringify(
                        item
                      )})'>
                        <span>Add to Cart</span>
                        <span class="mediox-btn__icon"
                          ><i class="icon-up-right-arrow"></i
                        ></span> </a
                      ><!-- /.mediox-btn -->
                    </div>
                    <!-- /.product-content -->

                  <!-- /.product-item -->
                </div>
    `;
    console.log("first")
    // Append the card to the container
    cardContainer.appendChild(card);

  });
}

const randomCategory = () => {
  const categories = [
    "healthCare",
    "medicalService",
    "neurology",
    "cardiology",
    "skinCare",
  ];
  const randomIndex = Math.floor(Math.random() * categories.length);
  return categories[randomIndex];
};

// Function to fetch data from the API
async function fetchData() {
  try {
    const response = await fetch(API_URL);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    let data = await response.json();
    // data = data?.map((each) => ({
    //   ...each,
    //   category: randomCategory(),
    //   title: each?.title?.slice(0, 10),
    //   rating: Math.random() * 5,
    //   price: Math.floor(Math.random() * 1000) + 1,
    // }));
    const productsList=data?.data
    localStorage.setItem("PRODUCTS", JSON.stringify(productsList));
    console.log("productsList",productsList)
    createCards(productsList); // Pass the data to the function that creates cards
  } catch (error) {
    console.error("Failed to fetch data:", error);
  }
}

// Call the fetchData function when the page loads

async function getCategories(url) {
  try {
    console.log("entered");
    const response = await fetch(url, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    // Parse the response data as JSON
    const data = await response.json();
    localStorage.setItem("categories", JSON.stringify(data?.data));
    renderCategories();
  } catch (error) {
    console.error("API request failed:", error);
    return null; // Return null in case of error
  }
}

const renderCategories = () => {
  const categoryListDO = document.getElementById("categoryList");
  const categories = JSON.parse(localStorage.getItem("categories"));
  categories.forEach((each) => {
    const categoryItem = document.createElement("li");
    categoryItem.innerHTML = `
      <a  onclick="filterByCategory(${each.id})">
        <span class="product-categories__icon">
          <i class="icon-arrow-point-to-right"></i>
        </span>
        <!-- /.product-categories__icon -->
        ${each.name}
      </a>
    `;
    categoryListDO.appendChild(categoryItem)
  });
};

fetchData();
getCategories(
  `${KELPS_BASE_URL}/admin_action/category?user_id=17`
);


