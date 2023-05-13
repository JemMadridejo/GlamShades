
      function addToCart(productIndex) {
        var products = [
          { name: "Mallow", price: 149.00, image: "box.jpg" },
          { name: "Classic", price: 149.00, image: "box.jpg" },
          { name: "Enchant", price: 149.00, image: "box.jpg" },
          { name: "Sweet", price: 149.00, image: "box.jpg" },
          { name: "Charm", price: 149.00, image: "box.jpg" }
        ];

        var selectedProduct = products[productIndex];

        var cartItem = {
          item: selectedProduct.name,
          price: selectedProduct.price,
          quantity: 1,
          image: selectedProduct.image,
          checked: false
        };

        var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        var existingItem = cartItems.find(function(item) {
          return item.item === cartItem.item && item.price === cartItem.price;
        });

        if (existingItem) {
          existingItem.quantity++;
        } else {
          cartItems.push(cartItem);
        }

        localStorage.setItem("cartItems", JSON.stringify(cartItems));

        // Dispatch a custom event to notify other pages about the cart update
        var cartUpdateEvent = new CustomEvent("cartUpdate");
        window.dispatchEvent(cartUpdateEvent);
      }
      function renderCart() {
        var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        var cartTable = document.getElementById("cartTable");
        var totalElement = document.getElementById("total");

        while (cartTable.rows.length > 1) {
          cartTable.deleteRow(1);
        }

        var totalPrice = 0;
        cartItems.forEach(function (cartItem, index) {
          var row = cartTable.insertRow();
          var cell1 = row.insertCell(0);
          var cell2 = row.insertCell(1);
          var cell3 = row.insertCell(2);
          var cell4 = row.insertCell(3);

          var productInfoContainer = document.createElement("div");
          productInfoContainer.className = "product-info";

          var productName = document.createElement("span");
          productName.textContent = cartItem.item;

          var productImage = document.createElement("img");
          productImage.src = cartItem.image;
          productImage.className = "product-image";

          productInfoContainer.appendChild(productName);
          productInfoContainer.appendChild(productImage);

          cell1.appendChild(productInfoContainer);
          cell2.textContent = "₱ " + cartItem.price.toFixed(2);
          cell3.style.textAlign = "center";
          cell2.style.fontSize="1.5em";
          cell2.style.letterSpacing=".2em";

          var quantityContainer = document.createElement("div");
          quantityContainer.className = "quantity-container";

          var minusButton = document.createElement("button");
          minusButton.textContent = "-";
          minusButton.className = "quantity-button";
          minusButton.addEventListener("click", function () {
            if (cartItem.quantity > 1) {
              cartItem.quantity--;
              quantityValue.textContent = cartItem.quantity; // Update the displayed quantity
              saveCartItems(cartItems);
              updateTotal();
            } else {
              cartItems.splice(index, 1);
              saveCartItems(cartItems);
              renderCart();
              updateTotal();
            }
          });

          var quantityValue = document.createElement("span");
          quantityValue.textContent = cartItem.quantity;

          var plusButton = document.createElement("button");
          plusButton.textContent = "+";
          plusButton.className = "quantity-button";
          plusButton.addEventListener("click", function () {
            cartItem.quantity++;
            quantityValue.textContent = cartItem.quantity; // Update the displayed quantity
            saveCartItems(cartItems);
            updateTotal();
          });

          quantityContainer.appendChild(minusButton);
          quantityContainer.appendChild(quantityValue);
          quantityContainer.appendChild(plusButton);

          cell3.appendChild(quantityContainer);

          var removeButton = document.createElement("button");
          removeButton.textContent = "Remove";
          removeButton.className = "remove-button";
          removeButton.addEventListener("click", function () {
            cartItems.splice(index, 1);
            saveCartItems(cartItems);
            renderCart(); // Render the cart after removing the item
            updateTotal(); // Call the function to update the total after removing the item
          });

          cell4.appendChild(removeButton);

          totalPrice += cartItem.price * cartItem.quantity; // Update the total price
        });

        totalElement.textContent = totalPrice.toFixed(2); // Set the total price in the totalElement
      }

      function updateTotal() {
        var cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];
        var totalElement = document.getElementById("total");

        var totalPrice = 0;

        // Loop through the cart items and calculate the total price
        cartItems.forEach(function (cartItem) {
          totalPrice += cartItem.price * cartItem.quantity;
        });

        totalElement.textContent = totalPrice.toFixed(2);
      }

      function saveCartItems(cartItems) {
        localStorage.setItem("cartItems", JSON.stringify(cartItems));
      }

      function clearCart() {
        localStorage.removeItem("cartItems");
        renderCart();
        updateTotal();
      }

      renderCart();
