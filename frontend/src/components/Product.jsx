import { useState } from "react";
import { Link } from "react-router-dom";

import Toast from "./Toast/Toast";
import { useDispatch } from "react-redux";
import { addToCart } from "../store/CartSlice";

const Product = (props) => {
  const dispatch = useDispatch();
  const [isAdding, setIsAdding] = useState(false);
  const [toast, setToast] = useState(null); //  Toast info
  const { product } = props;

  // addToCart click functionality
  const addCart = (e, product)  => {
    e.preventDefault();
    dispatch(addToCart(product));

    // Show toast with product name
    setToast({ message: `🛒 added to cart!`, type: 'success' });

    // click button color change
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
        <div className="bg-white rounded-lg shadow-md p-4">
          <img src={product.image} alt="peproni" className="w-full"/>
          <div className="text-center">
            <h2 className="text-large font-bold py-2">{product.name}</h2>
            <span className="bg-gray-200 py-1 rounded-full text-sm px-4">
              {product.difficulty}
            </span>
          </div>
          <div className="flex justify-between items-centers mt-4">
            <span>₹ {product.caloriesPerServing}</span>
            <button disabled={isAdding} onClick={(e) => addCart(e, product)} className={`${ isAdding ? 'bg-green-500' : 'bg-yellow-500' } py-1 px-4 rounded-full font-bold cursor-pointer`}>
              ADD{isAdding ? 'ED' : ''}
            </button>
          </div>
        </div>
      </Link>
    </>
  );
};

export default Product;
