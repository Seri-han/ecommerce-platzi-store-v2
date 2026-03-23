import { useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/textFormatter";
import CartItem from "../components/CartItem";
import "../styles/components/cart.scss";

export default function Cart() {
  const pageTopRef = useRef<HTMLDivElement | null>(null);
  const { cart, clearCart } = useCartStore();

  useEffect(() => {
    pageTopRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  let total = 0;

  cart.forEach((item) => {
    const price = parseFloat(String(item.price)) || 0;
    const quantity = parseInt(String(item.quantity)) || 1;
    total += price * quantity;
  });

  const totalFormatted = formatPrice(total);

  return (
    <div className="cart-page" ref={pageTopRef}>
      <h1>Shopping Cart</h1>

      {cart.length === 0 ? (
        <div className="empty-cart">
          <p>Your cart is empty</p>
          <Link to="/categories" className="btn btn-primary">
            Continue Shopping
          </Link>
        </div>
      ) : (
        <div className="cart-container">
          <div className="cart-items">
            {cart.map((item) => (
              <CartItem
                key={item.id}
                item={{
                  id: item.id,
                  title: item.title || "Untitled Product",
                  price: item.price,
                  quantity: item.quantity,
                  image: item.image,
                  images: item.images,
                }}
              />
            ))}

            {cart.some((item) => item.price === 0) && (
              <div
                style={{
                  padding: "1rem",
                  backgroundColor: "rgba(239, 68, 68, 0.1)",
                  border: "1px solid rgba(239, 68, 68, 0.3)",
                  borderRadius: "0.5rem",
                  color: "#fca5a5",
                  textAlign: "center",
                  marginTop: "1rem",
                }}
              >
                ⚠️ Some items have invalid prices
              </div>
            )}
          </div>

          <aside className="cart-summary">
            <h2>Order Summary</h2>

            <div className="summary-rows">
              <div className="summary-row">
                <span>Items:</span>
                <span>{cart.length}</span>
              </div>
              <div className="summary-row">
                <span>Subtotal:</span>
                <span>{totalFormatted}</span>
              </div>
              <div className="summary-row">
                <span>Shipping:</span>
                <span>Free</span>
              </div>
              <div className="summary-row total">
                <span>Total:</span>
                <span>{totalFormatted}</span>
              </div>
            </div>

            <button className="btn btn-primary btn-checkout">
              Proceed to Checkout
            </button>

            <Link to="/categories" className="btn-secondary">
              Continue Shopping
            </Link>

            <button className="btn-danger" onClick={clearCart}>
              Clear Cart
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}