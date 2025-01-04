let cart = [];

const loadAllProducts = () => {
  fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?f=a")
    .then((res) => res.json())
    .then((data) => displayProducts(data.drinks));
};

const displayProducts = (products) => {
  //   console.log("Displaying products...", products);
  const productContainer = document.querySelector(".shop");
  products.slice(0, 8).forEach((product) => {
    const div = document.createElement("div");
    div.classList.add("card");
    div.innerHTML = `
      <div>
        <img src="${product.strDrinkThumb}" alt="" style="height: 100%; width: 100%; ">
      </div>
      <h2>Name:${product.strGlass}</h2>
      <p>Category: ${product.strCategory}</p>
      <p >Instructor: ${product.strInstructions}</p>
        <button onclick="addToCart(${product.idDrink},this)">Select</button>
        <button onclick="showDetails(${product.idDrink})" class="btn btn-primary">Details</button>

    `;
    productContainer.appendChild(div);
  });
};

const showDetails = async (productId) => {
  try {
    const response = await fetch(
      `https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${productId}`
    );
    const product = await response.json();
    // console.log("Product details:", product.drinks[0]);
    const modalContent = document.querySelector(".modal-content");
    modalContent.innerHTML = `
      <h2>${product.drinks[0].strGlass}</h2>
      <img src="${product.drinks[0].strDrinkThumb}" style="height: 100%; width: 100%;">
      
      <h2>${product.drinks[0].strDrink}</h2>
      <p>Category:${product.drinks[0].strCategory}</p>
      <p>${product.drinks[0].strInstructions}</p>
      <button onclick="closeModal()" class="btn btn-primary">Close</button>
    `;
    document.querySelector(".modal").style.display = "flex";
  } catch (error) {
    console.error("Error fetching product details:", error);
  }
};

const closeModal = () => {
  document.querySelector(".modal").style.display = "none";
};

const addToCart = (productId, button) => {
  if (cart.length >= 7) {
    alert("You cannot add more than 7 products to the cart.");
    return;
  }
  fetch(`https://www.thecocktaildb.com/api/json/v1/1/lookup.php?i=${productId}`)
    .then((res) => res.json())
    .then((data) => {
      const product = data.drinks[0];
      cart.push(product);
      displayCart();
      button.textContent = "Selected";
      button.disabled = true;
    });
};

const displayCart = () => {
  const cartContainer = document.querySelector(".cart");
  cartContainer.innerHTML = `<h2>Cart (${cart.length} items)</h2>`;
  const table = document.createElement("table");
  table.innerHTML = `
    <tr>
      <th>SL</th>
      <th>Image</th>
      <th>Name</th>
    </tr>
  `;
  cart.forEach((product, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${index + 1}</td>
      <td><img src="${
        product.strDrinkThumb
      }" alt="" style="height: 60px; width: 60px; border-radius: 50%;"></td>
      <td>${product.strGlass}</td>
    `;
    table.appendChild(row);
  });
  cartContainer.appendChild(table);
};

const searchProducts = () => {
  const searchQuery = document.querySelector(".search-bar input").value;
  //   console.log(searchQuery);
  const productContainer = document.querySelector(".shop");
  productContainer.innerHTML = "";

  if (searchQuery.trim() === "") {
    loadAllProducts();
    return;
  }

  fetch(
    `https://www.thecocktaildb.com/api/json/v1/1/search.php?s=${searchQuery}`
  )
    .then((res) => res.json())
    .then((data) => {
      console.log(data.drinks);
      if (data.drinks === null) {
        alert("No data found");
      } else {
        if (data.drinks) {
          displayProducts(data.drinks);
        } else {
          displayProducts([]);
        }
      }
    });
};

document
  .querySelector(".search-bar button")
  .addEventListener("click", searchProducts);

loadAllProducts();
