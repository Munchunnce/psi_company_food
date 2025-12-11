import { useEffect, useState } from "react";
import Product from "./Product";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);

  const [filterType, setFilterType] = useState("all"); 
  const [sortPrice, setSortPrice] = useState("default");
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    fetch("https://dummyjson.com/recipes")
      .then((response) => response.json())
      .then((data) => {
        setProducts(data.recipes);
        setFilteredProducts(data.recipes);
      });
  }, []);

  useEffect(() => {
    let updated = [...products];

    // filter by mealType array
    if (filterType !== "all") {
      updated = updated.filter(product =>
        product.mealType &&
        product.mealType.includes(filterType)
      );
    }

    // sort by caloriesPerServing
    if (sortPrice === "low") {
      updated.sort((a, b) => a.caloriesPerServing - b.caloriesPerServing);
    } else if (sortPrice === "high") {
      updated.sort((a, b) => b.caloriesPerServing - a.caloriesPerServing);
    } else if (sortPrice === "medium") {
      updated = updated.filter(
        p =>
          p.caloriesPerServing >= 200 &&
          p.caloriesPerServing <= 500
      );
    }

    setFilteredProducts(updated);
  }, [filterType, sortPrice, products]);

  return (
    <div className="container mx-auto pb-24 px-4 text-left">
      <h1 className="text-lg md:text-xl font-bold my-8 ms-5">Products</h1>

      <div className="flex justify-end mb-4 me-5">
        <button
          onClick={() => setShowFilters(!showFilters)}
          className="bg-yellow-500 text-white px-4 py-2 rounded-full font-semibold cursor-pointer"
        >
          {showFilters ? "Hide Filters" : "Show Filters"}
        </button>
      </div>

      {showFilters && (
        <div className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-6 px-5">

          <div className="flex gap-2 flex-wrap">
            {["all", "Breakfast", "Lunch", "Dinner", "Snack"].map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-full border font-semibold cursor-pointer ${
                  filterType === type
                    ? "bg-yellow-500 text-white border-yellow-500"
                    : "bg-white text-yellow-600 border-yellow-500"
                }`}
              >
                {type}
              </button>
            ))}
          </div>

          <div className="flex gap-2 flex-wrap">
            {["default", "low", "medium", "high"].map(sort => (
              <button
                key={sort}
                onClick={() => setSortPrice(sort)}
                className={`px-4 py-2 rounded-full border font-semibold cursor-pointer ${
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

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-8 my-8 px-5">
        {filteredProducts.map(product => (
          <Product key={product.id} product={product} />
        ))}
      </div>

    </div>
  );
};

export default Products;
