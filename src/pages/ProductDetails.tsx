import { useParams, useNavigate } from "react-router-dom";
import { useState, useEffect, useMemo, useRef } from "react";
//api
import { trpc } from "../api/trpc";
//store
import useCartStore from "../store/cartStore";
//utils
import { cleanProductName, formatPrice } from "../utils/textFormatter";
import LoadingSpinner from "../components/LoadingSpinner";
//error imports
import ErrorMessage from "../components/ErrorMessage";
import { normalizeError, getSafeImageUrl } from "../utils/errorHandler";
//styles
import "../styles/components/productDetails.scss";

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

export default function ProductDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addToCart = useCartStore((state) => state.addToCart);
  const pageTopRef = useRef<HTMLDivElement | null>(null);
  const [imageError, setImageError] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isAddedToCart, setIsAddedToCart] = useState(false);

  const productId = Number(id);

  const {
    data: product,
    isLoading: loading,
    error,
    refetch,
  } = trpc.products.getById.useQuery(
    { id: productId },
    { enabled: Number.isFinite(productId) && productId > 0 },
  );

  const appError = error ? normalizeError(error) : null;

  const imageUrl = useMemo(() => {
    if (!product?.images?.length) return "";

    for (const image of product.images) {
      const normalized = normalizeImageUrl(image);
      const safeImage = getSafeImageUrl(normalized, "");
      if (safeImage) return safeImage;
    }

    return "";
  }, [product?.images]);

  useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [imageUrl]);

  useEffect(() => {
    if (!isAddedToCart) {
      return;
    }

    const timeoutId = window.setTimeout(() => {
      setIsAddedToCart(false);
    }, 1500);

    return () => window.clearTimeout(timeoutId);
  }, [isAddedToCart]);

  useEffect(() => {
    pageTopRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  const handleAddToCart = () => {
    if (!product) return;

    addToCart({
      id: product.id,
      title: product.title ?? "Untitled product",
      price: product.price ?? 0,
      image: imageUrl,
      images: product.images,
    });

    setIsAddedToCart(true);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (appError) {
    return (
      <ErrorMessage
        title={appError.title}
        message={appError.message}
        onRetry={refetch}
      />
    );
  }

  if (!product) {
    return (
      <ErrorMessage
        title="Product not found"
        message="We couldn't find the product you were looking for."
        action={
          <button className="btn btn-primary" onClick={() => navigate("/categories")}>
            Browse products
          </button>
        }
      />
    );
  }

  const productName = cleanProductName(product.title ?? "Untitled product");
  const price = formatPrice(product.price ?? 0);

  return (
    <div className="product-details" ref={pageTopRef}>
      <button className="btn-back" onClick={() => navigate(-1)}>
        ← Back
      </button>

      <div className="product-container">
        <div className="product-image">
          {!imageLoaded && !imageError && imageUrl && <div className="image-skeleton" />}

          {imageUrl && !imageError ? (
            <img
              src={imageUrl}
              alt={productName}
              className={imageLoaded ? "loaded" : ""}
              style={{
                opacity: imageLoaded ? 1 : 0,
              }}
              onLoad={() => setImageLoaded(true)}
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="image-placeholder">
              <span>🫥</span>
            </div>
          )}
        </div>

        <div className="product-content">
          <h1>{productName}</h1>
          <p className="category">{product.category?.name ?? "Uncategorized"}</p>
          <p className="description">{product.description}</p>

          <div className="pricing">
            <span className="price">{price}</span>
          </div>

          <button
            type="button"
            className={`btn btn-primary btn-large ${isAddedToCart ? "is-added" : ""}`}
            onClick={handleAddToCart}
          >
            {isAddedToCart ? "Added to Cart" : "Add to Cart"}
          </button>

          {isAddedToCart && <p className="cart-feedback">Item added to your cart.</p>}
        </div>
      </div>
    </div>
  );
}