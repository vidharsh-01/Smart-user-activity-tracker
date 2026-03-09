import { useParams, useNavigate } from 'react-router-dom';
import { products } from '../data';
import { useCart } from '../context/CartContext';
import { ChevronLeft, ShoppingCart, ShieldCheck, Truck } from 'lucide-react';
import { useTracking } from '../context/TrackingContext';

const ProductDetailPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { addToCart } = useCart();
    const { trackClick } = useTracking();
    const product = products.find((p) => p.id === id);

    if (!product) {
        return <div className="error-container">Product not found</div>;
    }

    const handleAddToCart = () => {
        addToCart(product);
        trackClick('Detail Add to Cart', product.name);
    };

    return (
        <div className="product-detail-container">
            <button
                onClick={() => {
                    trackClick('Back to Products', '');
                    navigate(-1);
                }}
                className="back-btn"
            >
                <ChevronLeft size={20} /> Back to Products
            </button>
            <div className="product-detail-layout">
                <div className="product-detail-image">
                    <img src={product.image} alt={product.name} />
                </div>
                <div className="product-detail-info">
                    <span className="product-category">{product.category}</span>
                    <h1>{product.name}</h1>
                    <p className="product-price">₹{product.price}</p>
                    <p className="product-description">{product.description}</p>

                    <div className="product-features">
                        <div className="feature">
                            <Truck size={20} />
                            <span>Free Express Delivery</span>
                        </div>
                        <div className="feature">
                            <ShieldCheck size={20} />
                            <span>2 Year Warranty Included</span>
                        </div>
                    </div>

                    <button onClick={handleAddToCart} className="btn-primary buy-btn">
                        <ShoppingCart size={20} /> Add to Shopping Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailPage;
