import React, { useState, useEffect } from 'react';
import './App.css';

const USER_EMAIL = 'rm2778643@gmail.com';
const USER_PHONE = '+91 9876543210';

function App() {
  const [page, setPage] = useState('home');
  const [user, setUser] = useState(null);
  const [cart, setCart] = useState([]);
  const [orders, setOrders] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const products = [
    { id: 1, name: 'iPhone 15 Pro Max', category: 'electronics', price: 159900, rating: 4.8, image: '📱', desc: '256GB, Titanium Blue' },
    { id: 2, name: 'Samsung Galaxy S24 Ultra', category: 'electronics', price: 124999, rating: 4.7, image: '📱', desc: '12GB RAM, 256GB' },
    { id: 3, name: 'OnePlus 12', category: 'electronics', price: 64999, rating: 4.6, image: '📱', desc: '16GB RAM, 256GB' },
    { id: 4, name: 'Sony WH-1000XM5', category: 'electronics', price: 29990, rating: 4.9, image: '🎧', desc: 'Noise Cancelling Headphones' },
    { id: 5, name: 'Apple MacBook Air M2', category: 'electronics', price: 114900, rating: 4.8, image: '💻', desc: '13-inch, 8GB RAM, 256GB SSD' },
    { id: 6, name: 'Dell XPS 15', category: 'electronics', price: 189990, rating: 4.7, image: '💻', desc: 'Intel i7, 16GB RAM, 512GB SSD' },
    { id: 7, name: 'Nike Air Max 270', category: 'fashion', price: 12995, rating: 4.5, image: '👟', desc: 'Men Running Shoes' },
    { id: 8, name: 'Adidas Ultraboost', category: 'fashion', price: 16999, rating: 4.6, image: '👟', desc: 'Premium Running Shoes' },
    { id: 9, name: 'Levi\'s 511 Slim Fit Jeans', category: 'fashion', price: 2999, rating: 4.4, image: '👖', desc: 'Dark Blue Denim' },
    { id: 10, name: 'Tommy Hilfiger Shirt', category: 'fashion', price: 2499, rating: 4.3, image: '👔', desc: 'Casual Slim Fit' },
    { id: 11, name: 'Boat Airdopes 141', category: 'electronics', price: 1299, rating: 4.2, image: '🎧', desc: 'True Wireless Earbuds' },
    { id: 12, name: 'Samsung 55" 4K Smart TV', category: 'electronics', price: 54990, rating: 4.6, image: '📺', desc: 'Crystal UHD, HDR' },
    { id: 13, name: 'LG Refrigerator', category: 'appliances', price: 32990, rating: 4.5, image: '🧊', desc: '260L, Frost Free' },
    { id: 14, name: 'Whirlpool Washing Machine', category: 'appliances', price: 18990, rating: 4.4, image: '🌀', desc: '7kg, Fully Automatic' },
    { id: 15, name: 'Philips Air Fryer', category: 'appliances', price: 8999, rating: 4.7, image: '🍳', desc: '4.1L, Digital Display' },
    { id: 16, name: 'Canon EOS 1500D DSLR', category: 'electronics', price: 31999, rating: 4.6, image: '📷', desc: '24.1MP, WiFi' },
  ];

  useEffect(() => {
    const saved = localStorage.getItem('flipkartData');
    if (saved) {
      const data = JSON.parse(saved);
      setUser(data.user);
      setCart(data.cart || []);
      setOrders(data.orders || []);
    }
  }, []);

  useEffect(() => {
    if (user) {
      localStorage.setItem('flipkartData', JSON.stringify({ user, cart, orders }));
    }
  }, [user, cart, orders]);

  const handleLogin = (email, phone) => {
    setUser({ email, phone, name: email.split('@')[0] });
    setPage('home');
  };

  const handleSignup = (name, email, phone) => {
    setUser({ name, email, phone });
    setPage('home');
  };

  const addToCart = (product) => {
    if (!user) {
      alert('Please login to add items to cart');
      setPage('login');
      return;
    }
    const existing = cart.find(i => i.id === product.id);
    if (existing) {
      setCart(cart.map(i => i.id === product.id ? {...i, qty: i.qty + 1} : i));
    } else {
      setCart([...cart, {...product, qty: 1}]);
    }
  };

  const placeOrder = (deliveryInfo) => {
    const order = {
      id: Date.now(),
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
      deliveryInfo,
      date: new Date().toLocaleDateString(),
      status: 'Order Confirmed',
      estimatedDelivery: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toLocaleDateString()
    };
    setOrders([...orders, order]);
    setCart([]);
    setPage('orders');
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || p.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="app">
      <Header 
        user={user} 
        cartCount={cart.length}
        setPage={setPage}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onLogout={() => { setUser(null); setCart([]); setOrders([]); setPage('home'); }}
      />
      
      <main className="main-content">
        {page === 'home' && (
          <HomePage 
            products={filteredProducts}
            selectedCategory={selectedCategory}
            setSelectedCategory={setSelectedCategory}
            addToCart={addToCart}
            setPage={setPage}
          />
        )}
        {page === 'cart' && <CartPage cart={cart} setCart={setCart} placeOrder={placeOrder} user={user} setPage={setPage} />}
        {page === 'orders' && <OrdersPage orders={orders} />}
        {page === 'login' && <LoginPage handleLogin={handleLogin} setPage={setPage} />}
        {page === 'signup' && <SignupPage handleSignup={handleSignup} setPage={setPage} />}
      </main>

      <Footer />
    </div>
  );
}

function Header({ user, cartCount, setPage, searchQuery, setSearchQuery, onLogout }) {
  return (
    <header className="header">
      <div className="header-container">
        <div className="logo" onClick={() => setPage('home')}>
          <span className="logo-text">Flipkart</span>
          <span className="logo-subtitle">Explore <span className="plus">Plus</span></span>
        </div>

        <div className="search-bar">
          <input 
            type="text" 
            placeholder="Search for products, brands and more"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
          <button className="search-btn">🔍</button>
        </div>

        <nav className="header-nav">
          {user ? (
            <div className="user-menu">
              <span className="user-name">Hello, {user.name}</span>
              <div className="dropdown">
                <button onClick={() => setPage('orders')}>My Orders</button>
                <button onClick={onLogout}>Logout</button>
              </div>
            </div>
          ) : (
            <button className="login-btn" onClick={() => setPage('login')}>Login</button>
          )}
          
          <button className="cart-btn" onClick={() => setPage('cart')}>
            🛒 Cart
            {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
          </button>
        </nav>
      </div>
    </header>
  );
}

function HomePage({ products, selectedCategory, setSelectedCategory, addToCart, setPage }) {
  const categories = [
    { id: 'all', name: 'All', icon: '🏪' },
    { id: 'electronics', name: 'Electronics', icon: '📱' },
    { id: 'fashion', name: 'Fashion', icon: '👕' },
    { id: 'appliances', name: 'Appliances', icon: '🏠' },
  ];

  return (
    <div className="home-page">
      <div className="categories-sidebar">
        {categories.map(cat => (
          <div 
            key={cat.id}
            className={`category-item ${selectedCategory === cat.id ? 'active' : ''}`}
            onClick={() => setSelectedCategory(cat.id)}
          >
            <span className="cat-icon">{cat.icon}</span>
            <span>{cat.name}</span>
          </div>
        ))}
      </div>

      <div className="products-section">
        <div className="banner">
          <h1>Best Deals on Top Brands</h1>
          <p>Shop from millions of products at the best prices</p>
        </div>

        <div className="products-grid">
          {products.map(product => (
            <div key={product.id} className="product-card">
              <div className="product-image">{product.image}</div>
              <div className="product-info">
                <h3 className="product-name">{product.name}</h3>
                <p className="product-desc">{product.desc}</p>
                <div className="product-rating">
                  <span className="rating">{product.rating} ⭐</span>
                </div>
                <div className="product-price">₹{product.price.toLocaleString('en-IN')}</div>
                <button className="add-to-cart-btn" onClick={() => addToCart(product)}>
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

function CartPage({ cart, setCart, placeOrder, user, setPage }) {
  const [checkout, setCheckout] = useState(false);
  const [deliveryInfo, setDeliveryInfo] = useState({
    name: user?.name || '',
    email: user?.email || USER_EMAIL,
    phone: user?.phone || USER_PHONE,
    address: '',
    city: '',
    state: '',
    pincode: ''
  });

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const discount = Math.floor(total * 0.1);
  const deliveryCharge = total > 500 ? 0 : 40;
  const finalTotal = total - discount + deliveryCharge;

  if (!user) {
    return (
      <div className="empty-state">
        <h2>Please login to view cart</h2>
        <button className="primary-btn" onClick={() => setPage('login')}>Login</button>
      </div>
    );
  }

  if (cart.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">🛒</div>
        <h2>Your cart is empty!</h2>
        <p>Add items to get started</p>
        <button className="primary-btn" onClick={() => setPage('home')}>Shop Now</button>
      </div>
    );
  }

  if (checkout) {
    return (
      <div className="checkout-page">
        <div className="checkout-container">
          <h1>Checkout</h1>
          <form onSubmit={(e) => { e.preventDefault(); placeOrder(deliveryInfo); }}>
            <div className="form-section">
              <h2>Delivery Information</h2>
              <input placeholder="Full Name" value={deliveryInfo.name} onChange={e => setDeliveryInfo({...deliveryInfo, name: e.target.value})} required />
              <input type="email" placeholder="Email" value={deliveryInfo.email} onChange={e => setDeliveryInfo({...deliveryInfo, email: e.target.value})} required />
              <input type="tel" placeholder="Phone Number" value={deliveryInfo.phone} onChange={e => setDeliveryInfo({...deliveryInfo, phone: e.target.value})} required />
              <textarea placeholder="Complete Address" value={deliveryInfo.address} onChange={e => setDeliveryInfo({...deliveryInfo, address: e.target.value})} required />
              <div className="form-row">
                <input placeholder="City" value={deliveryInfo.city} onChange={e => setDeliveryInfo({...deliveryInfo, city: e.target.value})} required />
                <input placeholder="State" value={deliveryInfo.state} onChange={e => setDeliveryInfo({...deliveryInfo, state: e.target.value})} required />
                <input placeholder="Pincode" value={deliveryInfo.pincode} onChange={e => setDeliveryInfo({...deliveryInfo, pincode: e.target.value})} required />
              </div>
            </div>

            <div className="order-summary">
              <h2>Order Summary</h2>
              {cart.map(item => (
                <div key={item.id} className="summary-item">
                  <span>{item.name} x {item.qty}</span>
                  <span>₹{(item.price * item.qty).toLocaleString('en-IN')}</span>
                </div>
              ))}
              <div className="summary-row">
                <span>Subtotal</span>
                <span>₹{total.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row discount">
                <span>Discount (10%)</span>
                <span>-₹{discount.toLocaleString('en-IN')}</span>
              </div>
              <div className="summary-row">
                <span>Delivery Charges</span>
                <span>{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
              </div>
              <div className="summary-total">
                <span>Total Amount</span>
                <span>₹{finalTotal.toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="checkout-actions">
              <button type="button" className="secondary-btn" onClick={() => setCheckout(false)}>Back to Cart</button>
              <button type="submit" className="primary-btn">Place Order</button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="cart-page">
      <div className="cart-container">
        <div className="cart-items">
          <h2>My Cart ({cart.length} items)</h2>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <div className="item-image">{item.image}</div>
              <div className="item-details">
                <h3>{item.name}</h3>
                <p>{item.desc}</p>
                <div className="item-price">₹{item.price.toLocaleString('en-IN')}</div>
              </div>
              <div className="item-actions">
                <div className="quantity-controls">
                  <button onClick={() => setCart(cart.map(i => i.id === item.id ? {...i, qty: Math.max(1, i.qty - 1)} : i))}>-</button>
                  <span>{item.qty}</span>
                  <button onClick={() => setCart(cart.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i))}>+</button>
                </div>
                <button className="remove-btn" onClick={() => setCart(cart.filter(i => i.id !== item.id))}>Remove</button>
              </div>
            </div>
          ))}
        </div>

        <div className="price-details">
          <h2>Price Details</h2>
          <div className="price-row">
            <span>Price ({cart.length} items)</span>
            <span>₹{total.toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row">
            <span>Discount</span>
            <span className="discount">-₹{discount.toLocaleString('en-IN')}</span>
          </div>
          <div className="price-row">
            <span>Delivery Charges</span>
            <span className="free">{deliveryCharge === 0 ? 'FREE' : `₹${deliveryCharge}`}</span>
          </div>
          <div className="price-total">
            <span>Total Amount</span>
            <span>₹{finalTotal.toLocaleString('en-IN')}</span>
          </div>
          <div className="savings">You will save ₹{discount.toLocaleString('en-IN')} on this order</div>
          <button className="place-order-btn" onClick={() => setCheckout(true)}>Place Order</button>
        </div>
      </div>
    </div>
  );
}

function OrdersPage({ orders }) {
  if (orders.length === 0) {
    return (
      <div className="empty-state">
        <div className="empty-icon">📦</div>
        <h2>No orders yet</h2>
        <p>Your order history will appear here</p>
      </div>
    );
  }

  return (
    <div className="orders-page">
      <h1>My Orders</h1>
      <div className="orders-list">
        {orders.map(order => (
          <div key={order.id} className="order-card">
            <div className="order-header">
              <div>
                <h3>Order #{order.id}</h3>
                <p className="order-date">Placed on {order.date}</p>
              </div>
              <span className="order-status">{order.status}</span>
            </div>

            <div className="order-items">
              {order.items.map(item => (
                <div key={item.id} className="order-item">
                  <span className="item-emoji">{item.image}</span>
                  <div className="item-info">
                    <h4>{item.name}</h4>
                    <p>Qty: {item.qty}</p>
                  </div>
                  <div className="item-price">₹{(item.price * item.qty).toLocaleString('en-IN')}</div>
                </div>
              ))}
            </div>

            <div className="order-delivery">
              <div className="delivery-address">
                <h4>📍 Delivery Address</h4>
                <p>{order.deliveryInfo.name}</p>
                <p>{order.deliveryInfo.address}</p>
                <p>{order.deliveryInfo.city}, {order.deliveryInfo.state} - {order.deliveryInfo.pincode}</p>
                <p>📞 {order.deliveryInfo.phone}</p>
                <p>📧 {order.deliveryInfo.email}</p>
              </div>
              <div className="delivery-status">
                <h4>🚚 Estimated Delivery</h4>
                <p className="delivery-date">{order.estimatedDelivery}</p>
              </div>
            </div>

            <div className="order-footer">
              <div className="order-total">
                <span>Total Amount:</span>
                <span className="total-amount">₹{order.total.toLocaleString('en-IN')}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function LoginPage({ handleLogin, setPage }) {
  const [email, setEmail] = useState(USER_EMAIL);
  const [phone, setPhone] = useState(USER_PHONE);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Login</h1>
          <p>Get access to your Orders, Wishlist and Recommendations</p>
        </div>
        <div className="auth-right">
          <form onSubmit={(e) => { e.preventDefault(); handleLogin(email, phone); }}>
            <input 
              type="email" 
              placeholder="Enter Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
            <input 
              type="tel" 
              placeholder="Enter Phone Number" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required 
            />
            <input type="password" placeholder="Enter Password" required />
            <button type="submit" className="primary-btn">Login</button>
          </form>
          <p className="auth-switch">
            New to Flipkart? <button onClick={() => setPage('signup')}>Create an account</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function SignupPage({ handleSignup, setPage }) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState(USER_EMAIL);
  const [phone, setPhone] = useState(USER_PHONE);

  return (
    <div className="auth-page">
      <div className="auth-container">
        <div className="auth-left">
          <h1>Looks like you're new here!</h1>
          <p>Sign up with your email and phone to get started</p>
        </div>
        <div className="auth-right">
          <form onSubmit={(e) => { e.preventDefault(); handleSignup(name, email, phone); }}>
            <input 
              placeholder="Enter Name" 
              value={name}
              onChange={e => setName(e.target.value)}
              required 
            />
            <input 
              type="email" 
              placeholder="Enter Email" 
              value={email}
              onChange={e => setEmail(e.target.value)}
              required 
            />
            <input 
              type="tel" 
              placeholder="Enter Phone Number" 
              value={phone}
              onChange={e => setPhone(e.target.value)}
              required 
            />
            <input type="password" placeholder="Create Password" required />
            <button type="submit" className="primary-btn">Continue</button>
          </form>
          <p className="auth-switch">
            Existing User? <button onClick={() => setPage('login')}>Log in</button>
          </p>
        </div>
      </div>
    </div>
  );
}

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>ABOUT</h3>
          <ul>
            <li>Contact Us</li>
            <li>About Us</li>
            <li>Careers</li>
            <li>Flipkart Stories</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>HELP</h3>
          <ul>
            <li>Payments</li>
            <li>Shipping</li>
            <li>Cancellation & Returns</li>
            <li>FAQ</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>POLICY</h3>
          <ul>
            <li>Return Policy</li>
            <li>Terms Of Use</li>
            <li>Security</li>
            <li>Privacy</li>
          </ul>
        </div>
        <div className="footer-section">
          <h3>SOCIAL</h3>
          <ul>
            <li>Facebook</li>
            <li>Twitter</li>
            <li>YouTube</li>
          </ul>
        </div>
      </div>
      <div className="footer-bottom">
        <p>© 2025 Flipkart Clone. All rights reserved.</p>
        <p>Contact: {USER_EMAIL} | {USER_PHONE}</p>
      </div>
    </footer>
  );
}

export default App;