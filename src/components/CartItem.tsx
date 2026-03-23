import { useMemo, useState } from "react";
import useCartStore from "../store/cartStore";
import { formatPrice } from "../utils/textFormatter";
import "../styles/components/cartItem.scss";

type CartItemData = {
  id: number;
  title: string;
  price: number;
  quantity: number;
  image?: string;
  images?: string[];
};

type CartItemProps = {
  item: CartItemData;
};

function normalizeImageUrl(value?: string | null) {
  if (!value) return null;

  const trimmed = value.trim();

  if (!trimmed) return null;

  try {
    if (trimmed.startsWith("[") || trimmed.startsWith('"')) {
      const parsed = JSON.parse(trimmed);

      if (Array.isArray(parsed)) {
        const first = parsed.find(
          (item) => typeof item === "string" && item.trim().length > 0,
        );
        return first ?? null;
      }

      if (typeof parsed === "string" && parsed.trim()) {
        return parsed.trim();
      }
    }
  } catch {
    // ignore and return original trimmed value
  }

  return trimmed;
}

export default function CartItem({ item }: CartItemProps) {
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeFromCart = useCartStore((state) => state.removeFromCart);

  const [imageError, setImageError] = useState(false);

  const imageUrl = useMemo(() => {
    return normalizeImageUrl(item.image) ?? normalizeImageUrl(item.images?.[0]);
  }, [item.image, item.images]);

  const itemPrice = parseFloat(String(item.price)) || 0;
  const itemQuantity = parseInt(String(item.quantity)) || 1;
  const itemTotal = itemPrice * itemQuantity;

  const handleQuantityChange = (newQuantity: string | number) => {
    const qty = parseInt(String(newQuantity), 10);

    if (Number.isNaN(qty)) return;

    if (qty < 1) {
      removeFromCart(item.id);
      return;
    }

    updateQuantity(item.id, qty);
  };

  const handleRemove = () => {
    removeFromCart(item.id);
  };

  return (
    <article className="cart-item">
      {!imageUrl || imageError ? (
        <div
          className="cart-item-image"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#2d2d2d",
            color: "#9ca3af",
          }}
        >
          🫥
        </div>
      ) : (
        <img
          src={imageUrl}
          alt={item.title}
          className="cart-item-image"
          onError={() => setImageError(true)}
        />
      )}

      <div className="cart-item-details">
        <h3>{item.title}</h3>
        <p className="price">{formatPrice(itemPrice)}</p>
      </div>

      <div className="cart-item-controls">
        <button
          type="button"
          className="qty-btn"
          onClick={() => handleQuantityChange(itemQuantity - 1)}
          title="Decrease quantity"
          aria-label="Decrease quantity"
        >
          −
        </button>

        <input
          type="number"
          value={itemQuantity}
          onChange={(e) => handleQuantityChange(e.target.value)}
          min="1"
          className="qty-input"
          title="Quantity"
          aria-label="Quantity"
        />

        <button
          type="button"
          className="qty-btn"
          onClick={() => handleQuantityChange(itemQuantity + 1)}
          title="Increase quantity"
          aria-label="Increase quantity"
        >
          +
        </button>
      </div>

      <div className="cart-item-total">
        <span>{formatPrice(itemTotal)}</span>
      </div>

      <button
        type="button"
        className="btn-remove"
        onClick={handleRemove}
        title="Remove item"
        aria-label="Remove item"
      >
        ✕
      </button>
    </article>
  );
}