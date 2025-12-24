import { useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import Toast from "./Toast/Toast";
import { addToCart } from "../store/CartSlice";

const Product = ({ product }) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null);

  // ⭐ Convert rating number into stars
  const renderStars = (rating = 0) => {
    return [...Array(5)].map((_, i) => (
      <span
        key={i}
        className={`text-lg ${
          i < Math.round(rating) ? "text-yellow-500" : "text-gray-300"
        }`}
      >
        ★
      </span>
    ));
  };

  // Add to cart button
  const addCart = (e, product) => {
    e.preventDefault();
    dispatch(addToCart(product));

    setToast({ message: "🛒 added to cart!", type: "success" });
    setIsAdding(true);

    setTimeout(() => {
      setIsAdding(false);
    }, 1000);
  };

  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <Link to={`/products/${product.id}`}>
        <div className="bg-white shadow-md rounded-xl p-4 hover:shadow-lg transition-all duration-300 flex flex-col">

          {/* Product Image */}
          <div className="overflow-hidden rounded-xl flex justify-center">
            <img
              src={product.image}
              alt={product.name}
              className="
                object-cover rounded-xl
                transition-transform duration-500 ease-in-out transform hover:scale-105
                w-40 h-40 sm:w-44 sm:h-44 md:w-48 md:h-48 lg:w-52 lg:h-52
              "
            />
          </div>

          {/* Product Info */}
          <div className="text-center mt-3">
            <h2 className="text-lg font-bold leading-tight">{product.name}</h2>

            {/* Difficulty Badge */}
            <span className="bg-gray-200 text-gray-700 py-1 px-4 rounded-full text-xs inline-block mt-2">
              {product.difficulty}
            </span>

            {/* Rating */}
            <div className="flex justify-center mt-2">
              {renderStars(product.rating)}
            </div>
          </div>

          {/* Price & Add Button */}
          <div className="flex justify-between items-center mt-4">
            <span className="font-bold text-lg text-gray-800">
              ₹ {product.caloriesPerServing}
            </span>

            <button
              disabled={isAdding}
              onClick={(e) => addCart(e, product)}
              className={`
                flex items-center py-1 px-5 rounded-full font-bold transition-colors duration-200 cursor-pointer
                ${
                  isAdding
                    ? "bg-green-500 text-white"
                    : "bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white"
                }
              `}
            >
              + ADD{isAdding ? "ED" : ""}
            </button>
          </div>

        </div>
      </Link>
    </>
  );
};

export default Product;
