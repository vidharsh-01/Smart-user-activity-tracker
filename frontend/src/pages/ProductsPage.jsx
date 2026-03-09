import { products } from '../data';
import { useCart } from '../context/CartContext';
import { Link } from 'react-router-dom';
import { Eye, ShoppingCart } from 'lucide-react';
import { useTracking } from '../context/TrackingContext';

const ProductsPage = () => {
    const { addToCart } = useCart();
    const { trackClick } = useTracking();

    const handleAddToCart = (product) => {
        addToCart(product);
        trackClick('Add to Cart Button', product.name);
    };

    return (
        <div className="products-container">
            <h2 className="page-title">Featured Products</h2>
            <div className="product-grid">
                {products.map((product) => (
                    <div key={product.id} className="product-card">
                        <div className="product-image">
                            <img src={product.image} alt={product.name} />
                        </div>
                        <div className="product-info">
                            <span className="product-category">{product.category}</span>
                            <h3>{product.name}</h3>
                            <p className="product-price">₹{product.price}</p>
                            <div className="product-actions">
                                <Link
                                    to={`/products/${product.id}`}
                                    className="btn-secondary"
                                    onClick={() => trackClick('View Details Link', product.name)}
                                >
                                    <Eye size={18} /> Details
                                </Link>
                                <button
                                    onClick={() => handleAddToCart(product)}
                                    className="btn-primary"
                                >
                                    <ShoppingCart size={18} /> Add to Cart
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default ProductsPage;

