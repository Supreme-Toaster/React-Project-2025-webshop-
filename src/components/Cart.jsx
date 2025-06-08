import { useState } from 'react';
import { useCart } from '../contexts/CartContext';
import { Link } from 'react-router-dom';
import '../css/Cart.css';

function Cart() {

  const { cartItems, removeFromCart, clearCart, incrementQuantity, decrementQuantity } = useCart();
  // State for user info form
  const [showForm, setShowForm] = useState(false);
  // New state to toggle cart visibility
  const [showCart, setShowCart] = useState(true);
  const [userInfo, setUserInfo] = useState({
    name: '',
    mail: '',
    address: '',
    city: '',
    zip: '',
    phone: '',
  });

  // Handle input change
  const handleChange = (e) => {
    setUserInfo({ ...userInfo, [e.target.name]: e.target.value });
  };

  // Calculate total cost
  const totalCost = cartItems.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );

  if (cartItems.length === 0) return <p>Your cart is empty.</p>;

  // Handle purchase confirmation: hide cart, show form
  const handleConfirmPurchase= () => {
    setShowCart(false);
    setShowForm(true);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    alert(`Purchase confirmed for ${userInfo.name}!`);
    // Clear cart after purchase
    clearCart();
    setShowForm(false);
    setShowCart(true);
    // Reset form
    setUserInfo({
      name: '',
      address: '',
      city: '',
      zip: '',
      phone: '',
    });
  };

  return (
    <div className="cart-container">
      {showCart ? (
        // Show cart view
        <>
          <h2>Shopping Cart</h2>
          <br />
          <ul>
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                {/* Product title clickable, linking to its product page */}
                <div>
                  <Link to={`/product/${item.id}`} className="product-link">
                    {item.title}
                  </Link>{' '}
                  <br />
                  {item.price}$ x {item.quantity} = {(item.price * item.quantity).toFixed(2)}$
                </div>
                {/* Quantity Controls */}
                <div className="item-actions">
                  <div className="quantity-controls" style={{ marginTop: '0px' }}>
                    <button
                      onClick={() => decrementQuantity(item.id)}
                    >
                      -
                    </button>
                    <span style={{ margin: '0 10px' }}>{item.quantity}</span>
                    <button
                      onClick={() => incrementQuantity(item.id)}
                      disabled={item.stock && item.quantity >= item.stock}
                    >
                      +
                    </button>
                  </div>
                  {/* Remove Button */}
                  <button
                    style={{ marginTop: '10px' }}
                    className="remove-cart-item"
                    onClick={() => removeFromCart(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </li>
            ))}
          </ul>
          {/* Display total cost */}
          <div className="cart-total">
            <strong>Total: ${totalCost.toFixed(2)}</strong>
          </div>

          {/* Buttons for purchase and clearing */}
          <div className="buttons-container">
            {!showForm && (
              <button className="confirm-purchase" onClick={handleConfirmPurchase}>
                Confirm Purchase
              </button>
            )}
            <button className="clear-cart" onClick={clearCart}>
              Clear Cart
            </button>
          </div>
        </>
      ) : (
        // Show form view
        showForm && (
          <div className="user-info-form">
            <h3>Enter Your Delivery Details</h3>
            <form onSubmit={handleSubmit}>
              <div>
                <label>Name:</label>
                <input
                  type="text"
                  name="name"
                  value={userInfo.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>E-Mail:</label>
                <input
                  type="text"
                  name="mail"
                  value={userInfo.mail}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Address:</label>
                <input
                  type="text"
                  name="address"
                  value={userInfo.address}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>City:</label>
                <input
                  type="text"
                  name="city"
                  value={userInfo.city}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>ZIP Code:</label>
                <input
                  type="text"
                  name="zip"
                  value={userInfo.zip}
                  onChange={handleChange}
                  required
                />
              </div>
              <div>
                <label>Phone:</label>
                <input
                  type="tel"
                  name="phone"
                  value={userInfo.phone}
                  onChange={handleChange}
                  required
                />
              </div>
              <button type="submit">Confirm Purchase</button>
              {/* Cancel button to go back to cart */}
              <button
                type="button"
                onClick={() => {
                  setShowForm(false);
                  setShowCart(true);
                }}
                style={{ marginLeft: '10px' }}
              >
                Cancel
              </button>
            </form>
          </div>
        )
      )}
    </div>
  );
}

export default Cart;