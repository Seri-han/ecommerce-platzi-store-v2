import { useEffect, useMemo, useRef, useState } from "react";
import { trpc } from "../api/trpc";
import ProductCard from "../components/ProductCard";
import LoadingSpinner from "../components/LoadingSpinner";
import ErrorMessage from "../components/ErrorMessage";
import { normalizeError } from "../utils/errorHandler";
import "../styles/components/categories.scss";

type SortBy = "name" | "price-asc" | "price-desc";

type Product = {
  id: number;
  title: string;
  price: number;
  images: string[];
};

type Category = {
  id: number;
  name: string;
};

export default function Categories() {
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortBy, setSortBy] = useState<SortBy>("name");
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCategories, setShowAllCategories] = useState(false);
  const pageTopRef = useRef<HTMLDivElement | null>(null);
  const hasScrolledOnInteraction = useRef(false);

  const itemsPerPage = 12;
  const collapsedCategoryCount = 8;

  const {
    data: categories = [],
    isLoading: categoriesLoading,
    error: categoriesError,
    refetch: refetchCategories,
  } = trpc.products.getCategories.useQuery();

  const {
    data: rawProducts = [],
    isLoading: productsLoading,
    error: productsError,
    refetch: refetchProducts,
  } = selectedCategory
    ? trpc.products.getByCategory.useQuery({
        categoryId: selectedCategory,
        limit: 100,
        offset: 0,
      })
    : trpc.products.getAll.useQuery({
        limit: 100,
        offset: 0,
      });

  const loading = categoriesLoading || productsLoading;
  const appError = categoriesError
    ? normalizeError(categoriesError)
    : productsError
      ? normalizeError(productsError)
      : null;

  const products = useMemo(() => {
    let filtered: Product[] = [...rawProducts];

    if (searchTerm.trim()) {
      const normalized = searchTerm.toLowerCase();
      filtered = filtered.filter((p) =>
        p.title.toLowerCase().includes(normalized),
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "price-asc") return a.price - b.price;
      if (sortBy === "price-desc") return b.price - a.price;
      return a.title.localeCompare(b.title);
    });

    return filtered;
  }, [rawProducts, searchTerm, sortBy]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, searchTerm, sortBy]);

  useEffect(() => {
    if (!hasScrolledOnInteraction.current) {
      hasScrolledOnInteraction.current = true;
      return;
    }

    pageTopRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [currentPage, selectedCategory, searchTerm, sortBy]);

  const totalPages = Math.ceil(products.length / itemsPerPage);

  const paginatedProducts = products.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage,
  );

  const visibleCategories = showAllCategories
    ? categories
    : categories.slice(0, collapsedCategoryCount);

  const hiddenCategoryCount = Math.max(categories.length - collapsedCategoryCount, 0);

  return (
    <div className="categories-page" ref={pageTopRef}>
      <section className="categories-hero" aria-labelledby="categories-page-title">
        <p className="categories-eyebrow">Browse the catalog</p>
        <h1 id="categories-page-title">Categories</h1>
      </section>

      <div className="categories">
      <aside className="filters" aria-label="Product filters">
        <div className="filter-group">
          <label htmlFor="search">Search</label>
          <input
            id="search"
            type="text"
            placeholder="Search products..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="filter-group">
          <label htmlFor="sort">Sort By</label>
          <select
            id="sort"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as SortBy)}
          >
            <option value="name">Name (A-Z)</option>
            <option value="price-asc">Price (Low to High)</option>
            <option value="price-desc">Price (High to Low)</option>
          </select>
        </div>

        <div className="filter-group categories-group">
          <div className="filter-group-header">
            <h2 id="categories-heading">Categories</h2>
          </div>

          <div
            id="categories-list"
            className={`categories-list ${showAllCategories ? "expanded" : "collapsed"}`}
            role="group"
            aria-labelledby="categories-heading"
          >
            <button
              type="button"
              className={`category-btn ${selectedCategory === null ? "active" : ""}`}
              onClick={() => setSelectedCategory(null)}
              aria-pressed={selectedCategory === null}
            >
              All Products
            </button>

            {visibleCategories.map((cat: Category) => (
              <button
                type="button"
                key={cat.id}
                className={`category-btn ${selectedCategory === cat.id ? "active" : ""}`}
                onClick={() => setSelectedCategory(cat.id)}
                title={cat.name}
                aria-pressed={selectedCategory === cat.id}
              >
                {cat.name}
              </button>
            ))}
          </div>

          {hiddenCategoryCount > 0 && (
            <button
              type="button"
              className="categories-toggle"
              onClick={() => setShowAllCategories((current) => !current)}
              aria-expanded={showAllCategories}
              aria-controls="categories-list"
            >
              {showAllCategories
                ? "Show fewer categories"
                : `Show ${hiddenCategoryCount} more categories`}
            </button>
          )}
        </div>
      </aside>

      <section className="products-section" aria-labelledby="categories-page-title">
        {loading && <LoadingSpinner />}

        {appError && (
          <ErrorMessage
            title={appError.title}
            message={appError.message}
            onRetry={() => {
              refetchCategories();
              refetchProducts();
            }}
          />
        )}

        {!loading && !appError && paginatedProducts.length === 0 && (
          <div className="empty-state">
            <p>No products found</p>
          </div>
        )}

        {!loading && !appError && paginatedProducts.length > 0 && (
          <>
            <div className="product-grid">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>

            {totalPages > 1 && (
              <div className="pagination">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage((p) => p - 1)}
                  className="pagination-btn"
                >
                  Previous
                </button>

                <span className="pagination-info">
                  Page {currentPage} of {totalPages}
                </span>

                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage((p) => p + 1)}
                  className="pagination-btn"
                >
                  Next
                </button>
              </div>
            )}
          </>
        )}
      </section>
      </div>
    </div>
  );
}