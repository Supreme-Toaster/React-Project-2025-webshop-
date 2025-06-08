import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { useCart } from '../contexts/CartContext';
import '../css/ProductPage.css';



function ProductImages({ images, product }) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  // Show only the current image
  const currentImage = images[currentIndex];

  // Render arrows only if there's more than one image
  return (
    <div className="slideshow-container">
      {images.length > 1 && (
        <button onClick={handlePrev} className="prev-button"></button>
      )}

      <img
        src={currentImage}
        alt={`${product.title} ${currentIndex + 1}`}
        className="product-detail-image"
      />

      {images.length > 1 && (
        <button onClick={handleNext} className="next-button"></button>
      )}
    </div>
  );
}


function ProductPage() {
  const { addToCart, incrementQuantity, decrementQuantity, cartItems } = useCart();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const getProductQuantity = (productId) => {
    const item = cartItems.find((item) => item.id === productId);
    return item ? item.quantity : 0;
  };

  useEffect(() => {
    // Fetch product details by ID
    fetch(`https://dummyjson.com/products/${id}`)
      .then(res => res.json())
      .then(data => {
        setProduct(data);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching product details:', err);
        setError('Failed to load product details.');
        setLoading(false);
      });
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>Product not found.</p>;

  // Determine images for display
  const images = product.images && product.images.length > 0
    ? product.images
    : [product.thumbnail || 'https://dummyjson.com/image/200x100'];

  const quantityInCart = getProductQuantity(product.id);

  // Assume product.rating and product.reviews exist
  const { rating, reviews } = product;

  return (
    <div className="product-page">
      <h1>{product.title}</h1>
      {/* Display images */}
      <div className="images-container">
        <ProductImages images={images} product={product} />
      </div>

      {/* Quantity Controls */}
      {quantityInCart > 0 ? (
        <div className="quantity-controls">
          <button onClick={() => decrementQuantity(product.id)}>-</button>
          <span className="quantity">{quantityInCart}</span>
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

      {/* Product details */}
      <p><strong>Price:</strong> ${product.price}<span style={{ fontSize: 'smaller' }}>({(product.price / (1 - (product.discountPercentage / 100))).toFixed(2)}$)</span>  <span className="discount-percentage">{product.discountPercentage}% <strong>SALE</strong></span></p>
      <p><strong>Description:</strong> {product.description}</p>
      <p><strong>Warranty:</strong> {product.warrantyInformation}</p>
      {product.stock !== 0 ? (
        <p><strong>Stock:</strong> {product.stock} <strong>({product.availabilityStatus})</strong></p>

      ) : (<p>Out of stock</p>)}
      <p><strong>Shipping:</strong> {product.shippingInformation}</p>

      {/* Display rating */}
      {rating && (
        <div className="product-rating">
          <strong>Rating:</strong> {rating} / 5
        </div>
      )}

      {/* Display reviews if available */}
      {reviews && reviews.length > 0 && (
        <div className="reviews-section">
          <h2>Reviews</h2>
          {reviews.map((review, index) => (
            <div key={index} className="review">
              <p><strong>{review.reviewerName || 'Anonymous'}</strong> rated {review.rating} / 5</p>
              <p>{review.comment}</p>
              <p><strong>Date:</strong> {new Date(review.date).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default ProductPage;