import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { ShoppingCart, LogOut, LayoutDashboard, Home, Package } from 'lucide-react';

const Navbar = () => {
    const { user, logout } = useAuth();
    const { cartCount } = useCart();

    if (!user) return null;

    return (
        <header className="main-header">
            <Link to="/" className="logo">Smart Tracker</Link>
            <nav className="nav-links">
                <Link to="/" className="nav-item">
                    <Home size={20} />
                    <span>Home</span>
                </Link>
                <Link to="/products" className="nav-item">
                    <Package size={20} />
                    <span>Products</span>
                </Link>
                <Link to="/cart" className="nav-item cart-link">
                    <ShoppingCart size={20} />
                    <span>Cart</span>
                    {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
                </Link>
                {user.isAdmin && (
                    <Link to="/admin" className="nav-item">
                        <LayoutDashboard size={20} />
                        <span>Admin</span>
                    </Link>
                )}
                <div className="user-section">
                    <span className="user-name">{user.name}</span>
                    <button onClick={logout} className="logout-btn">
                        <LogOut size={18} />
                    </button>
                </div>
            </nav>
        </header>
    );
};

export default Navbar;
