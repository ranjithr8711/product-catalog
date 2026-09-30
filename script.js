const products = [
    {
        id: 1,
        name: "Wireless Headphones",
        category: "Electronics",
        price: 2499,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 2,
        name: "Smart Watch",
        category: "Electronics",
        price: 3999,
        image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 3,
        name: "Men's T-Shirt",
        category: "Clothing",
        price: 799,
        image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 4,
        name: "Women's Jacket",
        category: "Clothing",
        price: 1999,
        image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 5,
        name: "Running Shoes",
        category: "Shoes",
        price: 2999,
        image: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 6,
        name: "Casual Sneakers",
        category: "Shoes",
        price: 2499,
        image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 7,
        name: "Leather Wallet",
        category: "Accessories",
        price: 999,
        image: "https://images.unsplash.com/photo-1627123424574-724758594e93?auto=format&fit=crop&w=500&q=80"
    },
    {
        id: 8,
        name: "Backpack",
        category: "Accessories",
        price: 1499,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?auto=format&fit=crop&w=500&q=80"
    }
];

let cart = JSON.parse(localStorage.getItem("cart")) || [];

const productContainer = document.getElementById("productContainer");
const cartContainer = document.getElementById("cartContainer");
const cartTotal = document.getElementById("cartTotal");
const noProducts = document.getElementById("noProducts");

const searchInput = document.getElementById("search");
const categorySelect = document.getElementById("category");
const priceInput = document.getElementById("price");
const sortSelect = document.getElementById("sort");
const emptyCartButton = document.getElementById("emptyCart");


function displayProducts(productList) {

    productContainer.innerHTML = "";

    if (productList.length === 0) {
        noProducts.style.display = "block";
        return;
    }

    noProducts.style.display = "none";

    productList.forEach(function(product) {

        const productCard = document.createElement("article");

        productCard.className = "product-card";

        productCard.innerHTML = `
            <img
                src="${product.image}"
                alt="${product.name}"
                class="product-image"
            >

            <div class="product-info">

                <h3>${product.name}</h3>

                <p class="product-category">
                    ${product.category}
                </p>

                <p class="product-price">
                    ₹${product.price.toFixed(2)}
                </p>

                <button
                    class="add-cart-btn"
                    data-id="${product.id}"
                >
                    Add to Cart
                </button>

            </div>
        `;

        productContainer.appendChild(productCard);
    });
}


function filterAndSortProducts() {

    const searchText = searchInput.value.toLowerCase().trim();

    const selectedCategory = categorySelect.value;

    const maximumPrice = Number(priceInput.value);

    const selectedSort = sortSelect.value;

    let filteredProducts = products.filter(function(product) {

        const matchesSearch =
            product.name.toLowerCase().includes(searchText);

        const matchesCategory =
            selectedCategory === "all" ||
            product.category === selectedCategory;

        const matchesPrice =
            priceInput.value === "" ||
            product.price <= maximumPrice;

        return matchesSearch &&
               matchesCategory &&
               matchesPrice;
    });


    if (selectedSort === "low-high") {

        filteredProducts.sort(function(a, b) {
            return a.price - b.price;
        });

    } else if (selectedSort === "high-low") {

        filteredProducts.sort(function(a, b) {
            return b.price - a.price;
        });

    } else if (selectedSort === "name") {

        filteredProducts.sort(function(a, b) {
            return a.name.localeCompare(b.name);
        });
    }


    displayProducts(filteredProducts);
}


function addToCart(productId) {

    const product = products.find(function(item) {
        return item.id === productId;
    });

    if (!product) {
        return;
    }

    const existingItem = cart.find(function(item) {
        return item.id === productId;
    });


    if (existingItem) {

        existingItem.quantity++;

    } else {

        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            quantity: 1
        });
    }


    saveCart();

    displayCart();
}


function removeFromCart(productId) {

    cart = cart.filter(function(item) {
        return item.id !== productId;
    });

    saveCart();

    displayCart();
}


function increaseQuantity(productId) {

    const item = cart.find(function(item) {
        return item.id === productId;
    });

    if (item) {
        item.quantity++;
    }

    saveCart();

    displayCart();
}


function decreaseQuantity(productId) {

    const item = cart.find(function(item) {
        return item.id === productId;
    });

    if (!item) {
        return;
    }


    if (item.quantity > 1) {

        item.quantity--;

    } else {

        removeFromCart(productId);
        return;
    }


    saveCart();

    displayCart();
}


function displayCart() {

    cartContainer.innerHTML = "";

    if (cart.length === 0) {

        cartContainer.innerHTML = `
            <p>Your cart is empty.</p>
        `;

        cartTotal.textContent = "0.00";

        return;
    }


    let total = 0;


    cart.forEach(function(item) {

        const itemTotal = item.price * item.quantity;

        total += itemTotal;


        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";


        cartItem.innerHTML = `

            <div class="cart-item-info">

                <h3>${item.name}</h3>

                <p class="cart-item-price">
                    ₹${item.price.toFixed(2)}
                </p>

            </div>


            <div class="quantity-controls">

                <button
                    type="button"
                    class="decrease-btn"
                    data-id="${item.id}"
                >
                    -
                </button>

                <span class="quantity">
                    ${item.quantity}
                </span>

                <button
                    type="button"
                    class="increase-btn"
                    data-id="${item.id}"
                >
                    +
                </button>

            </div>


            <strong>
                ₹${itemTotal.toFixed(2)}
            </strong>


            <button
                type="button"
                class="remove-btn"
                data-id="${item.id}"
            >
                Remove
            </button>

        `;


        cartContainer.appendChild(cartItem);
    });


    cartTotal.textContent = total.toFixed(2);
}


function saveCart() {

    localStorage.setItem(
        "cart",
        JSON.stringify(cart)
    );
}


productContainer.addEventListener("click", function(event) {

    if (event.target.classList.contains("add-cart-btn")) {

        const productId = Number(
            event.target.dataset.id
        );

        addToCart(productId);
    }
});


cartContainer.addEventListener("click", function(event) {

    const productId = Number(
        event.target.dataset.id
    );


    if (event.target.classList.contains("increase-btn")) {

        increaseQuantity(productId);

    } else if (event.target.classList.contains("decrease-btn")) {

        decreaseQuantity(productId);

    } else if (event.target.classList.contains("remove-btn")) {

        removeFromCart(productId);
    }
});


searchInput.addEventListener(
    "input",
    filterAndSortProducts
);

categorySelect.addEventListener(
    "change",
    filterAndSortProducts
);

priceInput.addEventListener(
    "input",
    filterAndSortProducts
);

sortSelect.addEventListener(
    "change",
    filterAndSortProducts
);


emptyCartButton.addEventListener(
    "click",
    function() {

        if (cart.length === 0) {
            return;
        }

        const confirmation = confirm(
            "Are you sure you want to empty the cart?"
        );

        if (confirmation) {

            cart = [];

            saveCart();

            displayCart();
        }
    }
);


displayProducts(products);

displayCart();