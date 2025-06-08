import { Outlet, Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../css/Layout.css';

const Layout = () => {

  const { cartItems } = useCart();
  const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
  
  return (
    <>
      <header className="header">
        <Link className="nav-link" to="/"><div className="logo">Webbshop</div></Link>
        <nav className="nav">
          <Link className="nav-link" to="/">Home</Link>|<Link to="/cart" className="cart-link">
            Cart ({totalItems})
          </Link>
        </nav>
      </header>
      <Outlet />
    </>
  );
};

export default Layout;