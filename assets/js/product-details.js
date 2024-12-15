const addToCart=document.getElementById("add_to_cart_pd")
addToCart.addEventListener("click",()=>{
   const selProd=JSON.parse( localStorage.getItem("selectedProduct"))
   console.log("selProd",selProd)
   try {
    addProductToCart(selProd)
    window.location.href = "cart.html";
   } catch (error) {
    console.log("err",error)
   }



})
async function fetchProductDetails(productId) {
    try {
        let products = JSON.parse(localStorage.getItem("PRODUCTS")) || [];
        const selectedProduct = products?.find((item) => item?.product_id == productId);
        console.log("selectedProduct",selectedProduct,products,productId)
      displayProductDetails(selectedProduct); // Call function to display product details
    } catch (error) {
      console.error("Error fetching product data:", error);
    }
  }




function displayProductDetails(product) {
    localStorage.setItem("selectedProduct", JSON.stringify(product))
    console.log("selectedProductselectedProduct",product, encodeURI(product.product_image.image_1))
    // Update product name, price, and image
    document.getElementById("product_name_d").textContent = product.product_name;
    document.getElementById("product_cost_d").textContent = `Rs. ${product.price}`;
    document.getElementById("reviews_pd").textContent = ``;
    document.getElementById("description_pd").textContent = product?.short_description || "No Description Available";
    document.getElementById("description_long_pd").textContent = product?.description || "No Details Available";
    document.getElementById("reviews_count_pd").textContent = product?.reviews?.length ?`${product?.reviews?.length} Reviews`: "Be The First One To Review";
    document.getElementById("rating_p").innerHTML =  `<div class="mediox-ratings">
    ${new Array(Math.ceil(product.rating?product.rating:5)) // Generate an array of size up to 5 (rounded up)
      .fill(0) // Fill the array with placeholder values
      .map(() => {
        return `<span class="mediox-ratings__icon">
                  <i class="icon-star"></i>
                </span>`;
      })
      .join("")}

    </div>`;
    document.getElementById("productDetImage").src = encodeURI(product.product_image.image_1);
    // document.querySelector(".product-details__image img").alt = product.name;

    // // Update product description
    // document.querySelector(".product-details__description__text").textContent = product.description;

    // Update reviews dynamically if available
    const reviewsSection = document.getElementById("review_item_pd");
    if (product.reviews && product.reviews.length > 0) {
      reviewsSection.innerHTML = ""; // Clear existing reviews
      product.reviews.forEach((review) => {
        reviewsSection.innerHTML += `
          <li class="comments-one__card">
            <div class="comments-one__card__image">
              <img src="${review.userImage}" alt="${review.userName}" />
            </div>
            <div class="comments-one__card__content">
              <div class="comments-one__card__top">
                <div class="comments-one__card__info">
                  <h3 class="comments-one__card__name">${review.userName}</h3>
                  <p class="comments-one__card__date">${review.date}</p>
                </div>
                <div class="mediox-ratings">${generateRatingStars(review.rating)}</div>
              </div>
              <p class="comments-one__card__text">${review.comment}</p>
            </div>
          </li>`;
      });
    }else{
        reviewsSection.innerHTML = "No Reviews!";
    }
  }

  // Helper function to generate star ratings
  function generateRatingStars(rating) {
    let stars = "";
    for (let i = 0; i < 5; i++) {
      stars += `<span class="mediox-ratings__icon">
                  <i class="icon-star${i < rating ? '' : '-o'}"></i>
                </span>`;
    }
    return stars;
  }
  function getProductIdFromUrl() {
    const params = new URLSearchParams(window.location.search);
    return params.get("id");
  }


document.addEventListener("DOMContentLoaded", () => {
    const productId = getProductIdFromUrl();

    if (productId) {
      fetchProductDetails(productId);

    } else {
      console.error("No product ID found in the URL.");
    }

  });

  const postReview = (event) => {

    event.preventDefault(); // Prevent form submission

    // Get form input values
    const name = document.querySelector('input[name="name"]').value.trim();
    const email = document.querySelector('input[name="email"]').value.trim();
    const message = document.querySelector('textarea[name="message"]').value.trim();

    // Input validation (optional but recommended)
    if (!name || !email || !message) {
      alert("Please fill out all fields.");
      return;
    }

    // Create a new review object
    const newReview = {
      userName: name,
      userEmail: email,
      comment: message,
      date: new Date().toLocaleDateString(), // Add current date
      userImage: "assets/images/default-user.png", // Placeholder image
      rating: 5, // Default rating (modify if needed)
    };

    // Retrieve existing reviews from localStorage
    let reviews = JSON.parse(localStorage.getItem("REVIEWS")) || [];

    // Add the new review to the array
    reviews.push(newReview);

    // Save updated reviews back to localStorage
    localStorage.setItem("REVIEWS", JSON.stringify(reviews));

    // Show confirmation alert
    alert("Review is under process");

    // Reset the form fields
    document.querySelector('input[name="name"]').value = "";
    document.querySelector('input[name="email"]').value = "";
    document.querySelector('textarea[name="message"]').value = "";
  };
