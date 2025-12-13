import { useEffect, useState } from "react";
import Product from "./Product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [filterType, setFilterType] = useState("all");
  const [sortPrice, setSortPrice] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  // Pagination state
  const pageSize = 10; // show 10 products per page
  const [page, setPage] = useState(1);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.recipes || []);
        setFilteredProducts(data.recipes || []);
      })
      .catch((err) => {
        console.error("Failed to fetch products", err);
        setProducts([]);
        setFilteredProducts([]);
      });
  }, []);

  // Apply filters & sorting (runs before pagination)
  useEffect(() => {
    let updated = [...products];

    // filter by mealType array
    if (filterType !== "all") {
      updated = updated.filter(
        (product) => product.mealType && product.mealType.includes(filterType)
      );
    }

    // sort by caloriesPerServing (acting as price)
    if (sortPrice === "low") {
      updated.sort((a, b) => (a.caloriesPerServing || 0) - (b.caloriesPerServing || 0));
    } else if (sortPrice === "high") {
      updated.sort((a, b) => (b.caloriesPerServing || 0) - (a.caloriesPerServing || 0));
    } else if (sortPrice === "medium") {
      updated = updated.filter(
        (p) => (p.caloriesPerServing || 0) >= 200 && (p.caloriesPerServing || 0) <= 500
      );
    }

    setFilteredProducts(updated);
    setPage(1); // reset to first page whenever filters/sort/products change
  }, [filterType, sortPrice, products]);

  // Pagination helpers
  const totalItems = filteredProducts.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));

  // compute products to show on current page
  const startIdx = (page - 1) * pageSize;
  const visibleProducts = filteredProducts.slice(startIdx, startIdx + pageSize);

  // Helper to produce a compact page list (with ellipses)
  const getPageNumbers = () => {
    const maxButtons = 7; // change to show more/less page buttons
    if (totalPages <= maxButtons) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const pages = [];
    const left = Math.max(2, page - 1);
    const right = Math.min(totalPages - 1, page + 1);

    pages.push(1);
    if (left > 2) pages.push("left-ellipsis");
    for (let p = left; p <= right; p++) pages.push(p);
    if (right < totalPages - 1) pages.push("right-ellipsis");
    pages.push(totalPages);
    return pages;
  };

  const pageNumbers = getPageNumbers();

  // navigation actions
  const goToFirst = () => setPage(1);
  const goToLast = () => setPage(totalPages);
  const goPrev = () => setPage((s) => Math.max(1, s - 1));
  const goNext = () => setPage((s) => Math.min(totalPages, s + 1));
  const goPage = (p) => {
    if (typeof p === "number") setPage(p);
  };

  return (
    <div className="container mx-auto pb-24 px-4 text-left">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-lg md:text-xl font-bold">Products</h1>

        <div className="flex gap-2">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold cursor-pointer"
          >
            {showFilters ? "Hide Filters" : "Show Filters"}
          </button>
        </div>
      </div>

      {/* Filters Panel */}
      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6 px-1">
          {/* Meal Type */}
          <div className="flex gap-2 flex-wrap">
            {["all", "Breakfast", "Lunch", "Dinner", "Snack"].map((type) => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full border font-semibold transition duration-200 cursor-pointer ${
                  filterType === type
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-white text-yellow-600 border-yellow-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          {/* Calories (price) */}
          <div className="flex gap-2 flex-wrap">
            {["default", "low", "medium", "high"].map((sort) => (
              <button
                key={sort}
                onClick={() => setSortPrice(sort)}
                className={`px-4 py-2 rounded-full border font-semibold transition duration-200 cursor-pointer ${
                  sortPrice === sort
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-white text-yellow-600 border-yellow-500"
                }`}
              >
                {sort === "default"
                  ? "Calories"
                  : sort === "low"
                  ? "Low → High"
                  : sort === "high"
                  ? "High → Low"
                  : "Medium Range"}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Products Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 my-8">
        {visibleProducts.length === 0 ? (
          <div className="col-span-full text-center text-gray-600 py-12">
            No products found.
          </div>
        ) : (
          visibleProducts.map((product) => (
            <Product key={product.id} product={product} />
          ))
        )}
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-4 mt-8">
        <div className="text-sm text-gray-600">
          Showing <span className="font-semibold">{Math.min(startIdx + 1, totalItems || 0)}</span> -
          <span className="font-semibold"> {Math.min(startIdx + pageSize, totalItems)}</span> of{" "}
          <span className="font-semibold">{totalItems}</span>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={goToFirst}
            disabled={page === 1}
            className={`px-3 py-1 rounded-md cursor-pointer ${page === 1 ? "bg-gray-200 text-gray-500" : "bg-white border"}`}
          >
            First
          </button>

          <button
            onClick={goPrev}
            disabled={page === 1}
            className={`px-3 py-1 rounded-md cursor-pointer ${page === 1 ? "bg-gray-200 text-gray-500" : "bg-white border"}`}
          >
            Prev
          </button>

          {pageNumbers.map((p, idx) =>
            p === "left-ellipsis" || p === "right-ellipsis" ? (
              <span key={p + idx} className="px-3 py-1 text-gray-500">…</span>
            ) : (
              <button
                key={p}
                onClick={() => goPage(p)}
                className={`px-3 py-1 rounded-md cursor-pointer ${p === page ? "bg-yellow-500 text-white" : "bg-white border"}`}
              >
                {p}
              </button>
            )
          )}

          <button
            onClick={goNext}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-md cursor-pointer ${page === totalPages ? "bg-gray-200 text-gray-500" : "bg-white border"}`}
          >
            Next
          </button>

          <button
            onClick={goToLast}
            disabled={page === totalPages}
            className={`px-3 py-1 rounded-md cursor-pointer ${page === totalPages ? "bg-gray-200 text-gray-500" : "bg-white border"}`}
          >
            Last
          </button>
        </div>
      </div>
    </div>
  );
};

export default Products;
