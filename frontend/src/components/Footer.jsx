import React from 'react';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="main-footer">
            <div className="footer-content">
                <div className="footer-brand">
                    <span className="logo">SmartTracker</span>
                    <p>Elevating digital experiences with premium, curated intelligence.</p>
                </div>
                <div className="footer-links">
                    <div className="footer-column">
                        <h4>Explore</h4>
                        <a href="/products">Products</a>
                        <a href="/cart">Shopping Cart</a>
                    </div>
                    <div className="footer-column">
                        <h4>Company</h4>
                        <a href="#">About Us</a>
                        <a href="#">Privacy Policy</a>
                        <a href="#">Terms of Service</a>
                    </div>
                </div>
            </div>
            <div className="footer-bottom">
                <p>&copy; {currentYear} SmartTracker. All rights reserved.</p>
            </div>
        </footer>
    );
};

export default Footer;
