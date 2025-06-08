import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useCart } from '../contexts/CartContext';
import '../css/home.css';

function Home() {
  const { addToCart, incrementQuantity, decrementQuantity, cartItems } = useCart();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const fetchProducts = (pageNumber) => {
    fetch(`https://dummyjson.com/products?limit=25&skip=${(pageNumber - 1) * 25}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.products.length === 0) {
          setHasMore(false);
        } else {
          setProducts(prev => [...prev, ...data.products]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error('Error fetching products:', err);
        setError('Failed to load products.');
        setLoading(false);
      });
  };

  // Load first page on mount
  useEffect(() => {
    setLoading(true);
    fetchProducts(1);
  }, []);

  // Infinite scroll effect
  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop >=
        document.documentElement.offsetHeight - 100 && // threshold
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore]);

  // Fetch more products when page changes
  useEffect(() => {
    if (page === 1) return; // Already fetched page 1 initially
    setLoading(true);
    fetchProducts(page);
  }, [page]);

  const getProductQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  if (loading && page === 1) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="app-container">
      <h1>Product Listing</h1>
      <div className="grid-container">
        {products.map((product, index) => (
          <div key={`${product.id}-${index}`} className="card">
            <Link to={`/product/${product.id}`} className="product-link">
              <img
              // Load product image and pick a random one if there are multiple
                src={
                  product.thumbnail ||
                  (product.images && product.images.length > 0
                    ? product.images[Math.floor(Math.random() * product.images.length)]
                    : 'https://dummyjson.com/image/200x100')
                }
                alt={product.title}
                className="product-image"
              />
              <h3 className="product-title">{product.title}</h3>
            </Link>
            <p className="product-price">
              ${product.price} <span style={{ fontSize: 'smaller' }}>({(product.price / (1 - (product.discountPercentage / 100))).toFixed(2)}$)</span>
              <span className="discount-percentage">{product.discountPercentage}% <strong>SALE</strong></span>
            </p>
            {getProductQuantity(product.id) > 0 ? (
              <div className="quantity-controls">
                <button onClick={() => decrementQuantity(product.id)}>-</button>
                <span className="quantity">{getProductQuantity(product.id)}</span>
                <button onClick={() => incrementQuantity(product.id)}>+</button>
              </div>
            ) : (
              <button
                className="add-to-cart-btn"
                onClick={() => addToCart(product)}
              >
                Add to cart
              </button>
            )}
          </div>
        ))}
        {loading && <p>Loading more products...</p>}
        {!hasMore && <p>No more products to load.</p>}
      </div>
    </div>
  );
}

export default Home;