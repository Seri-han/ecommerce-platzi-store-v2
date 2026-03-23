import { useEffect, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import useCartStore from '../store/cartStore';
import '../styles/components/header.scss';

export default function Header() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const cartItems = useCartStore((state: any) => state.cart);
  const itemCount = cartItems.reduce((sum: number, item: any) => sum + item.quantity, 0);
  const cartLabel = itemCount > 0 ? `Cart, ${itemCount} item${itemCount === 1 ? '' : 's'}` : 'Cart';

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location.pathname]);

  return (
    <header className="header">
      <div className="container">
        <Link to="/" className="logo">
          Platzi Store
        </Link>

        <div className="header-actions">
          <button
            type="button"
            className={`menu-toggle ${isMobileMenuOpen ? 'is-open' : ''}`}
            aria-expanded={isMobileMenuOpen}
            aria-controls="mobile-navigation"
            aria-label={isMobileMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            onClick={() => setIsMobileMenuOpen((current) => !current)}
          >
            <span />
            <span />
            <span />
          </button>

          <nav className="nav">
            {/* <Link to="/">Home</Link> */}
            <NavLink to="/categories">Categories</NavLink>
          </nav>

          <Link to="/cart" className="cart-link btn btn-secondary" aria-label={cartLabel}>
            <span className="cart-icon" aria-hidden="true">
              <svg viewBox="0 0 24 24" fill="none" focusable="false">
                <path
                  d="M3 4h2.2c.5 0 .93.34 1.05.82L6.7 7h11.65c.76 0 1.3.74 1.08 1.47l-1.4 4.8a1.12 1.12 0 0 1-1.08.8H9.1a1.12 1.12 0 0 1-1.08-.83L5.2 3.95"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="10" cy="19" r="1.5" fill="currentColor" />
                <circle cx="17" cy="19" r="1.5" fill="currentColor" />
              </svg>
            </span>
            <span className="cart-text">Cart</span>
            {itemCount > 0 && <span className="cart-badge">{itemCount}</span>}
          </Link>
        </div>

        <nav
          id="mobile-navigation"
          className={`mobile-menu ${isMobileMenuOpen ? 'is-open' : ''}`}
          aria-label="Mobile navigation"
        >
          <NavLink to="/categories" className="mobile-nav-link">
            Categories
          </NavLink>
          <NavLink to="/cart" className="mobile-nav-link" aria-label={cartLabel}>
            Cart
            {itemCount > 0 && <span className="mobile-nav-badge">{itemCount}</span>}
          </NavLink>
        </nav>
      </div>
    </header>
  );
}