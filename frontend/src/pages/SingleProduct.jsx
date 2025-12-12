import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/CartSlice";
import Toast from "../components/Toast/Toast";

const SingleProduct = () => {
  const [product, setProduct] = useState({});
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [toast, setToast] = useState(null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    dispatch(addToCart(product));
    setToast({ message: `🛒 added to cart!`, type: "success" });
  };

  useEffect(() => {
    fetch(`https://dummyjson.com/recipes/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
      });
  }, [id]);

  // ⭐ PREMIUM GOLD STAR COMPONENT
  const StarRating = ({ rating = 0 }) => {
    const stars = [];
    const full = Math.floor(rating);
    const half = rating % 1 >= 0.5;

    for (let i = 0; i < 5; i++) {
      if (i < full) stars.push("full");
      else if (i === full && half) stars.push("half");
      else stars.push("empty");
    }

    return (
      <div className="flex items-center gap-1">
        {stars.map((type, index) => (
          <span key={index} className="star-wrapper">
            {type === "full" && (
              <svg viewBox="0 0 20 20" className="star full">
                <path d="M10 1.5L12.9 7.4L19.4 8.3L14.7 12.8L15.9 19.2L10 16L4.1 19.2L5.3 12.8L0.6 8.3L7.1 7.4L10 1.5Z" />
              </svg>
            )}

            {type === "half" && (
              <svg viewBox="0 0 20 20" className="star half">
                <defs>
                  <linearGradient id="half-grad">
                    <stop offset="50%" stopColor="#FFD700" />
                    <stop offset="50%" stopColor="#E2E8F0" />
                  </linearGradient>
                </defs>
                <path
                  fill="url(#half-grad)"
                  d="M10 1.5L12.9 7.4L19.4 8.3L14.7 12.8L15.9 19.2L10 16L4.1 19.2L5.3 12.8L0.6 8.3L7.1 7.4L10 1.5Z"
                />
              </svg>
            )}

            {type === "empty" && (
              <svg viewBox="0 0 20 20" className="star empty">
                <path d="M10 1.5L12.9 7.4L19.4 8.3L14.7 12.8L15.9 19.2L10 16L4.1 19.2L5.3 12.8L0.6 8.3L7.1 7.4L10 1.5Z" />
              </svg>
            )}
          </span>
        ))}

        {/* GOLD STAR STYLES */}
        <style>
          {`
          .star {
            width: 26px;
            height: 26px;
            transition: transform .3s ease, filter .3s ease;
          }

          .star.full path {
            fill: #FFD700;
            filter: drop-shadow(0 0 8px rgba(255, 215, 0, 0.9));
            animation: shine 2.5s infinite ease-in-out;
          }

          .star.half path {
            filter: drop-shadow(0 0 5px rgba(255, 215, 0, 0.6));
          }

          .star.empty path {
            fill: #E2E8F0;
          }

          .star-wrapper:hover .star {
            transform: scale(1.25);
          }

          @keyframes shine {
            0% { filter: drop-shadow(0 0 6px rgba(255,215,0,0.4)); }
            50% { filter: drop-shadow(0 0 16px rgba(255,215,0,1)); }
            100% { filter: drop-shadow(0 0 6px rgba(255,215,0,0.4)); }
          }
        `}
        </style>
      </div>
    );
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

      <div className="container mx-auto mt-9 p-4 sm:p-6">

        {/* Back Button */}
        <div className="mb-6 flex justify-start">
          <button
            onClick={() => navigate(-1)}
            className="bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-2 px-6 rounded-full font-bold cursor-pointer transition-colors duration-200"
          >
            Back
          </button>
        </div>

        <div className="bg-[#F8F8F8] rounded-xl shadow-md hover:shadow-lg transition-all duration-300 flex flex-col lg:flex-row items-center lg:items-start p-4 sm:p-6 w-full max-w-5xl mx-auto">

          {/* Product Image */}
          <div className="overflow-hidden rounded-xl mb-6 lg:mb-0">
            <img
              src={product.image}
              alt={product.name}
              className="
                object-cover rounded-xl
                transition-transform duration-500 ease-in-out transform hover:scale-105
                w-[200px] h-[200px]
                sm:w-[260px] sm:h-[260px]
                md:w-[300px] md:h-[300px]
                lg:w-[400px] lg:h-[400px]
              "
            />
          </div>

          {/* Product Info */}
          <div className="lg:ml-10 flex flex-col justify-between text-center lg:text-left w-full">

            {/* Name */}
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>

            {/* Difficulty + Cooking time */}
            <p className="text-gray-600 mb-2">
              Difficulty: <b>{product.difficulty}</b>
            </p>

            <p className="text-gray-600 mb-2">
              Cooking Time: <b>{product.cookTimeMinutes} mins</b>
            </p>

            {/* Rating */}
            <div className="flex items-center gap-2 justify-center lg:justify-start mb-4">
              <StarRating rating={product.rating} />
              <span className="text-gray-700 font-semibold">
                {product.rating} / 5
              </span>
            </div>

            {/* Price */}
            <p className="font-bold text-2xl mb-4">
              ₹ {product.caloriesPerServing}
            </p>

            {/* Meal Type (Badges) */}
            <div className="flex flex-wrap gap-2 justify-center lg:justify-start mb-5">
              {(product.mealType || []).map((type, index) => (
                <span
                  key={index}
                  className="bg-orange-200 text-orange-700 px-3 py-1 rounded-full text-sm font-semibold"
                >
                  {type}
                </span>
              ))}
            </div>

            {/* Ingredients */}
            <div className="mt-4 text-left">
              <h3 className="text-lg font-bold mb-2">Ingredients:</h3>
              <ul className="list-disc ml-6 text-gray-700">
                {(product.ingredients || []).map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>

            <button
              onClick={handleAddToCart}
              className="mt-6 mx-auto lg:mx-0 bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-2 px-6 rounded-full font-bold cursor-pointer transition-colors duration-200"
            >
              Add to Cart
            </button>

          </div>
        </div>
      </div>
    </>
  );
};

export default SingleProduct;
