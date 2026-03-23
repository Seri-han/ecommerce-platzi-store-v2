import { useEffect, useRef } from "react";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
//error imports
import ErrorMessage from "../components/ErrorMessage";
import { normalizeError } from "../utils/errorHandler";
//api
import { trpc } from "../api/trpc";
//styles
import "../styles/components/home.scss";

export default function Home() {
  const pageTopRef = useRef<HTMLDivElement | null>(null);

  const {
    data: products = [],
    isLoading: loading,
    error,
    refetch,
  } = trpc.products.getAll.useQuery({ limit: 20, offset: 0 });

  const featured = products.slice(0, 10);
  const appError = error ? normalizeError(error) : null;

  useEffect(() => {
    pageTopRef.current?.scrollIntoView({ behavior: "auto", block: "start" });
  }, []);

  return (
    <div className="home" ref={pageTopRef}>
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to Platzi Store</h1>
          <p>Discover amazing products at great prices</p>
          <a href="/categories" className="btn btn-primary">
            Shop Now
          </a>
        </div>
      </section>

      <section className="featured">
        <div className="container">
          <h2>Popular Products</h2>

          {loading && <LoadingSpinner />}

          {appError && (
            <ErrorMessage
              title={appError.title}
              message={appError.message}
              onRetry={refetch}
            />
          )}

          {!loading && !appError && featured.length > 0 && (
            <div className="product-grid">
              {featured.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          )}

          {!loading && !appError && featured.length === 0 && (
            <div className="empty-state">
              <p>No products available</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}