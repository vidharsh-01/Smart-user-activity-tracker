import { useCart } from '../context/CartContext';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useTracking } from '../context/TrackingContext';

const CartPage = () => {
    const { cartItems, removeFromCart, updateQty, cartTotal } = useCart();
    const { trackClick } = useTracking();

    if (cartItems.length === 0) {
        return (
            <div className="empty-cart">
                <ShoppingBag size={64} />
                <h2>Your cart is empty</h2>
                <p>Looks like you haven't added anything to your cart yet.</p>
                <Link
                    to="/products"
                    className="btn-primary"
                    onClick={() => trackClick('Empty Cart Browse Link', '')}
                >
                    Browse Products
                </Link>
            </div>
        );
    }

    return (
        <div className="cart-container">
            <h2 className="page-title">Your Shopping Cart</h2>
            <div className="cart-layout">
                <div className="cart-items">
                    {cartItems.map((item) => (
                        <div key={item.id} className="cart-item">
                            <img src={item.image} alt={item.name} className="cart-item-img" />
                            <div className="cart-item-info">
                                <h3>{item.name}</h3>
                                <p className="cart-item-price">₹{item.price}</p>
                            </div>
                            <div className="cart-item-controls">
                                <button
                                    onClick={() => {
                                        updateQty(item.id, item.qty - 1);
                                        trackClick('Decrease Qty', item.name);
                                    }}
                                    className="qty-btn"
                                >
                                    <Minus size={16} />
                                </button>
                                <span className="qty-value">{item.qty}</span>
                                <button
                                    onClick={() => {
                                        updateQty(item.id, item.qty + 1);
                                        trackClick('Increase Qty', item.name);
                                    }}
                                    className="qty-btn"
                                >
                                    <Plus size={16} />
                                </button>
                            </div>
                            <p className="cart-item-total">₹{(item.price * item.qty).toFixed(2)}</p>
                            <button
                                onClick={() => {
                                    removeFromCart(item.id);
                                    trackClick('Remove from Cart', item.name);
                                }}
                                className="remove-btn"
                            >
                                <Trash2 size={18} />
                            </button>
                        </div>
                    ))}
                </div>
                <div className="cart-summary">
                    <h3>Order Summary</h3>
                    <div className="summary-row">
                        <span>Subtotal</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <div className="summary-row">
                        <span>Shipping</span>
                        <span>FREE</span>
                    </div>
                    <div className="summary-total">
                        <span>Total</span>
                        <span>₹{cartTotal.toFixed(2)}</span>
                    </div>
                    <button
                        className="btn-primary checkout-btn"
                        onClick={() => trackClick('Checkout Button', `Total: ₹${cartTotal}`)}
                    >
                        Proceed to Checkout
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CartPage;

