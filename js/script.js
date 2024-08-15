document.addEventListener('DOMContentLoaded', () => {
  // Toggle UI elements
  const searchForm = document.querySelector('.search-form');
  const shoppingCart = document.querySelector('.shopping-cart');
  const loginForm = document.querySelector('.login-form');
  const navbar = document.querySelector('.navbar');
  let cart = []; // Array to hold cart items

  // Toggle functions
  document.querySelector('#search-btn').onclick = () => {
    searchForm.classList.toggle('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
  };

  document.querySelector('#cart-btn').onclick = () => {
    shoppingCart.classList.toggle('active');
    searchForm.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
  };

  document.querySelector('#login-btn').onclick = () => {
    loginForm.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    navbar.classList.remove('active');
  };

  document.querySelector('#menu-btn').onclick = () => {
    navbar.classList.toggle('active');
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
  };

  // Hide all UI elements on scroll
  window.onscroll = () => {
    searchForm.classList.remove('active');
    shoppingCart.classList.remove('active');
    loginForm.classList.remove('active');
    navbar.classList.remove('active');
  };

  // Initialize Swiper sliders
  const initializeSwiper = () => {
    new Swiper(".product-slider", {
      loop: true,
      spaceBetween: 20,
      autoplay: {
        delay: 7500,
        disableOnInteraction: false,
      },
      centeredSlides: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1020: { slidesPerView: 3 }
      },
    });

    new Swiper(".review-slider", {
      loop: true,
      spaceBetween: 20,
      autoplay: {
        delay: 7500,
        disableOnInteraction: false,
      },
      centeredSlides: true,
      breakpoints: {
        0: { slidesPerView: 1 },
        768: { slidesPerView: 2 },
        1020: { slidesPerView: 3 }
      },
    });
  };

  // Function to update the cart total and display
  const updateCart = () => {
    const cartContainer = document.getElementById('shopping-cart');
    if (!cartContainer) return;
  
    // Calculate the total price
    const total = cart.reduce((acc, item) => {
      // Ensure price and quantity are numbers
      const price = parseFloat(item.price); // Convert price to number
      const quantity = parseInt(item.quantity, 10); // Convert quantity to number
      return acc + (price * quantity);
    }, 0);
  
    // Create HTML for cart items
    const cartItemsHTML = cart.map(item => `
      <div class="box">
        <img src="${item.image}" alt="${item.title}">
        <div class="content">
          <h3>${item.title}</h3>
          <span class="price">Ksh:${item.price} x ${item.quantity}</span>
          <span class="quantity">Quantity: ${item.quantity}</span>
          <i class="fa fa-trash remove-btn" data-id="${item.id}"></i>
        </div>
      </div>
    `).join('');
  
    // Update the cart container with cart items and total price
    cartContainer.innerHTML = `
      ${cartItemsHTML}
      <div class="total">total : Ksh:${total}/-</div>
      <a href="#" class="btn" id="checkout-btn">checkout</a>
    `;
  
    // Add event listeners for "Remove" buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', (event) => {
        const productId = event.target.getAttribute('data-id');
        removeFromCart(productId);
      });
    });
  };
  

  // Handle "Add to Cart" button click
  const addToCart = (product) => {
    const existingProductIndex = cart.findIndex(item => item.id === product.id);
  
    if (existingProductIndex > -1) {
      // Update quantity if product is already in the cart
      cart[existingProductIndex].quantity += 1;
    } else {
      // Add new product to the cart
      cart.push({
        id: product.id,
        image: product.image,
        title: product.title,
        price: parseFloat(product.price), // Ensure price is a number
        quantity: 1
      });
    }
  
    updateCart();
  };
  
  // Handle "Remove from Cart" button click
  const removeFromCart = (productId) => {
    cart = cart.filter(item => item.id !== productId); // Remove item with the given ID
    updateCart(); // Update cart display
  };

  // Fetch and populate data
  const fetchData = () => {
    const apiEndpoints = {
      features: 'http://localhost:3000/features',
      products: 'http://localhost:3000/products',
      categories: 'http://localhost:3000/categories',
      reviews: 'http://localhost:3000/reviews',
      blogs: 'http://localhost:3000/blogs'
    };

    // Fetch features
    fetch(apiEndpoints.features)
      .then(response => response.json())
      .then(data => {
        const featuresContainer = document.getElementById('features-container');
        if (featuresContainer) {
          featuresContainer.innerHTML = data.map(feature => `
            <div class="box">
              <img src="${feature.image}" alt="${feature.title}">
              <h3>${feature.title}</h3>
              <p>${feature.description}</p>
              <a href="${feature.link}" class="btn">read more</a>
            </div>
          `).join('');
        }
      })
      .catch(error => console.error('Error fetching features:', error));

    // Fetch products
    fetch(apiEndpoints.products)
      .then(response => response.json())
      .then(data => {
        const slider1Container = document.getElementById('product-slider-1').querySelector('.swiper-wrapper');
        const slider2Container = document.getElementById('product-slider-2').querySelector('.swiper-wrapper');

        if (slider1Container && slider2Container) {
          const midIndex = Math.ceil(data.length / 2);
          const slider1Data = data.slice(0, midIndex);
          const slider2Data = data.slice(midIndex);

          const createProductSlides = (products) => products.map(product => `
            <div class="swiper-slide box">
              <img src="${product.image}" alt="${product.title}">
              <h3>${product.title}</h3>
              <div class="price">Ksh:${product.price}</div>
              <div class="stars">
                ${'<i class="fas fa-star"></i>'.repeat(product.rating)}
                ${'<i class="fas fa-star-half-alt"></i>'.repeat(5 - product.rating)}
              </div>
              <a href="#" class="btn add-to-cart-btn" data-id="${product.id}" data-title="${product.title}" data-price="${product.price}" data-image="${product.image}">add to cart</a>
            </div>
          `).join('');

          slider1Container.innerHTML = createProductSlides(slider1Data);
          slider2Container.innerHTML = createProductSlides(slider2Data);

          initializeSwiper(); // Initialize Swiper sliders once after data is loaded
        }

        // Add event listeners for "Add to Cart" buttons
        document.querySelectorAll('.add-to-cart-btn').forEach(button => {
          button.addEventListener('click', event => {
            event.preventDefault();
            const product = {
              id: event.target.getAttribute('data-id'),
              title: event.target.getAttribute('data-title'),
              price: parseFloat(event.target.getAttribute('data-price')),
              image: event.target.getAttribute('data-image')
            };
            addToCart(product);
          });
        });
      })
      .catch(error => console.error('Error fetching products:', error));

    // Fetch categories
    fetch(apiEndpoints.categories)
      .then(response => response.json())
      .then(data => {
        const categoriesContainer = document.querySelector('.categories .box-container');
        if (categoriesContainer) {
          categoriesContainer.innerHTML = data.map(category => `
            <div class="box">
              <img src="${category.image}" alt="${category.title}">
              <h3>${category.title}</h3>
              <p>${category.discount}</p>
              <a href="${category.link}" class="btn">shop now</a>
            </div>
          `).join('');
        }
      })
      .catch(error => console.error('Error fetching categories data:', error));

    // Fetch reviews
    fetch(apiEndpoints.reviews)
      .then(response => response.json())
      .then(data => {
        const reviewsContainer = document.querySelector('.review-slider .swiper-wrapper');
        if (reviewsContainer) {
          reviewsContainer.innerHTML = data.map(review => `
            <div class="swiper-slide box">
              <img src="${review.image}" alt="${review.name}">
              <p>${review.text}</p>
              <h3>${review.name}</h3>
              <div class="stars">
                ${'<i class="fas fa-star"></i>'.repeat(Math.floor(review.rating))}
                ${review.rating % 1 === 0.5 ? '<i class="fas fa-star-half-alt"></i>' : ''}
                ${'<i class="fas fa-star"></i>'.repeat(5 - Math.ceil(review.rating))}
              </div>
            </div>
          `).join('');

          // Initialize Swiper slider
          new Swiper(".review-slider", {
            loop: true,
            spaceBetween: 20,
            autoplay: {
              delay: 7500,
              disableOnInteraction: false,
            },
            centeredSlides: true,
            breakpoints: {
              0: { slidesPerView: 1 },
              768: { slidesPerView: 2 },
              1020: { slidesPerView: 3 }
            },
          });
        }
      })
      .catch(error => console.error('Error fetching reviews data:', error));

    // Fetch blogs
    fetch(apiEndpoints.blogs)
      .then(response => response.json())
      .then(data => {
        const blogsContainer = document.querySelector('.blogs .box-container');
        if (blogsContainer) {
          blogsContainer.innerHTML = data.map(blog => `
            <div class="box">
              <img src="${blog.image}" alt="${blog.title}">
              <div class="content">
                <div class="icons">
                  <a href="#"><i class="fas fa-user"></i>by ${blog.author}</a>
                  <a href="#"><i class="fas fa-calendar"></i>${blog.date}</a>
                </div>
                <h3>${blog.title}</h3>
                <p>${blog.summary}</p>
                <a href="#" class="btn" data-id="${blog.id}">read more</a>
              </div>
            </div>
          `).join('');

          // Add event listeners to "Read More" buttons
          document.querySelectorAll('.blogs .btn[data-id]').forEach(button => {
            button.addEventListener('click', event => {
              event.preventDefault();
              const blogId = event.target.getAttribute('data-id');
              showModal(blogId);
            });
          });
        }
      })
      .catch(error => console.error('Error fetching blogs data:', error));
  };

  // Function to show modal with full blog information
  function showModal(blogId) {
    const modal = document.getElementById('blog-modal');
    const modalContent = document.getElementById('modal-blog-content');

    // Fetch the full blog data
    fetch(`http://localhost:3000/blogs/${blogId}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(blog => {
        modalContent.innerHTML = `
          <img src="${blog.image}" alt="${blog.title}" style="width:100%; height:auto;">
          <h2>${blog.title}</h2>
          <p><strong>by ${blog.author}</strong></p>
          <p><em>${blog.date}</em></p>
          <p>${blog.content}</p>
        `;

        // Show the modal
        modal.style.display = 'block';

        // Close the modal when the user clicks on <span> (x)
        document.querySelector('.close-btn').addEventListener('click', () => {
          modal.style.display = 'none';
        });

        // Close the modal when the user clicks outside of the modal
        window.addEventListener('click', (event) => {
          if (event.target === modal) {
            modal.style.display = 'none';
          }
        });
      })
      .catch(error => console.error('Error fetching blog data:', error));
  }

  // Fetch and display data
  fetchData();
});

document.getElementById('login-btn').addEventListener('click', function() {
  const loginForm = document.getElementById('login-form');
  loginForm.classList.toggle('active');
});

document.getElementById('login-form').addEventListener('submit', function(event) {
  event.preventDefault();

  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  if (!email || !password) {
    alert('Please enter both email and password.');
    return;
  }

  fetch('http://localhost:3000/users')
    .then(response => response.json())
    .then(users => {
      const user = users.find(user => user.email === email && user.password === password);
      
      if (user) {
        alert('Login successful!');
        window.location.href = 'home.html'; // Redirect to home or dashboard page
      } else {
        alert('Login failed: Invalid email or password.');
      }
    })
    .catch(error => {
      console.error('Error:', error);
      alert('An error occurred. Please try again.');
    });
});

document.getElementById('create-account-link').addEventListener('click', function(e) {
  e.preventDefault();
  // Redirect to registration page
  window.location.href = 'register.html';
});

document.getElementById('forgot-password-link').addEventListener('click', function(e) {
  e.preventDefault();
  // Redirect to forgot password page or show a modal
  alert('Redirecting to forgot password page...');
});
