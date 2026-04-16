import { createContext, useState, useContext, useEffect } from 'react';
import { useAuth } from './AuthContext';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const { user } = useAuth();
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        if (user) {
            const savedCart = localStorage.getItem(`cartItems_${user._id}`);
            if (savedCart) {
                setCartItems(JSON.parse(savedCart));
            } else {
                setCartItems([]);
            }
        } else {
            setCartItems([]);
        }
    }, [user]);

    const saveCart = (items) => {
        if (user) {
            localStorage.setItem(`cartItems_${user._id}`, JSON.stringify(items));
        }
    };

    const addToCart = (product) => {
        setCartItems((prevItems) => {
            const existItem = prevItems.find((x) => x.id === product.id);
            let nextItems;
            if (existItem) {
                nextItems = prevItems.map((x) =>
                    x.id === product.id ? { ...x, qty: x.qty + 1 } : x
                );
            } else {
                nextItems = [...prevItems, { ...product, qty: 1 }];
            }
            saveCart(nextItems);
            return nextItems;
        });
    };

    const removeFromCart = (id) => {
        setCartItems((prevItems) => {
            const nextItems = prevItems.filter((x) => x.id !== id);
            saveCart(nextItems);
            return nextItems;
        });
    };

    const updateQty = (id, qty) => {
        if (qty < 1) return;
        setCartItems((prevItems) => {
            const nextItems = prevItems.map((x) => (x.id === id ? { ...x, qty } : x));
            saveCart(nextItems);
            return nextItems;
        });
    };

    const clearCart = () => {
        setCartItems([]);
        if (user) localStorage.removeItem(`cartItems_${user._id}`);
    };

    const cartTotal = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
    const cartCount = cartItems.reduce((acc, item) => acc + item.qty, 0);

    return (
        <CartContext.Provider
            value={{
                cartItems,
                addToCart,
                removeFromCart,
                updateQty,
                clearCart,
                cartTotal,
                cartCount,
            }}
        >
            {children}
        </CartContext.Provider>
    );
};

export const useCart = () => useContext(CartContext);
