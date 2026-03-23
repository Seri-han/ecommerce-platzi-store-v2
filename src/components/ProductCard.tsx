import { Link } from "react-router-dom";
import { useEffect, useMemo, useState, type MouseEvent } from "react";
import useCartStore from "../store/cartStore";
import { cleanProductName, formatPrice } from "../utils/textFormatter";
import { getSafeImageUrl } from "../utils/errorHandler";

type Product = {
  id: number;
  title: string;
  price: number;
  images?: string[];
  category?: {
    name: string;
  };
};

type ProductCardProps = {
  product: Product;
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
    // keep original trimmed value
  }

  return trimmed;
}

export default function ProductCard({ product }: ProductCardProps) {
  const addToCart = useCartStore((state) => state.addToCart);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const imageUrl = useMemo(() => {
    const normalized = normalizeImageUrl(product.images?.[0]);
    return getSafeImageUrl(normalized, "");
  }, [product.images]);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  const handleAddToCart = (event: MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
    event.stopPropagation();

    setIsAdding(true);

    addToCart({
      id: product.id,
      title: product.title,
      price: product.price,
      image: imageUrl,
      images: product.images,
    });

    window.setTimeout(() => {
      setIsAdding(false);
    }, 600);
  };

  return (
    <Link to={`/products/${product.id}`} className="product-card">
      <div className="product-image">
        {!imageLoaded && !imageError && imageUrl && <div className="image-skeleton" />}

        {imageUrl && !imageError ? (
          <img
            src={imageUrl}
            alt={product.title}
            className={imageLoaded ? "loaded" : ""}
            style={{
              opacity: imageLoaded ? 1 : 0,
            }}
            onLoad={() => setImageLoaded(true)}
            onError={() => setImageError(true)}
          />
        ) : (
          <div className="image-placeholder">🫥</div>
        )}
      </div>

      <div className="product-info">
        <h3>{cleanProductName(product.title)}</h3>

          <p className="product-category">
          {product.category?.name || "Uncategorized"}
        </p>


        <div className="product-footer">
          <span className="price">{formatPrice(product.price)}</span>

          <button
            type="button"
            className={`btn-add-cart ${isAdding ? "adding" : ""}`}
            onClick={handleAddToCart}
            title="Add to cart"
            aria-label="Add to cart"
            disabled={isAdding}
          >
            {isAdding ? "✓" : "+"}
          </button>
        </div>
      </div>
    </Link>
  );
}