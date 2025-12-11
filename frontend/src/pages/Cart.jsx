import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/CartSlice";
import Toast from "../components/Toast/Toast";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);

  const [products, setProducts] = useState([]);
  const [priceFetched, setPriceFetched] = useState(false);
  const [toast, setToast] = useState(null);

  // ----------------------
  // Fetch Products By IDs
  // ----------------------
  useEffect(() => {
    if (!cart.items || Object.keys(cart.items).length === 0) {
      setProducts([]);
      return;
    }

    if (priceFetched) return;

    const fetchProducts = async () => {
      const ids = Object.keys(cart.items);

      try {
        const requests = ids.map((id) =>
          fetch(`https://dummyjson.com/recipes/${id}`).then((res) => res.json())
        );

        const productData = await Promise.all(requests);
        setProducts(productData);
        setPriceFetched(true);
      } catch (error) {
        console.error("Failed to fetch products:", error);
      }
    };

    fetchProducts();
  }, [cart, priceFetched]);

  // ----------------------
  // Handlers
  // ----------------------

  const increment = (product) => {
    dispatch(addToCart(product));
  };

  const decrement = (productId) => {
    dispatch(decreaseQuantity(productId));
  };

  const handleDelete = (productId) => {
    dispatch(removeFromCart(productId));
    setProducts(products.filter((p) => p.id !== productId));
  };

  const handleOrderNow = () => {
    setToast({ message: "Order placed successfully", type: "success" });
    window.alert("Order placed successfully");
    dispatch(clearCart());
    setProducts([]);
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

      {!products.length ? (
        <img
          className="mx-auto w-1/2 mt-12"
          src="/images/empty-cart.png"
          alt="empty-cart"
        />
      ) : (
        <div className="container mx-auto lg:w-1/2 w-full pb-24">
          <h1 className="my-12 font-bold">Cart Items</h1>

          <ul>
            {products.map((product) => (
              <li key={product.id} className="mb-12">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <img className="h-16" src={product.image || product.thumbnail} alt={product.name} />
                    <span className="font-bold ml-4 w-48">{product.name}</span>
                  </div>

                  <div>
                    {/* Decrement */}
                    <button
                      onClick={() => decrement(product.id)}
                      className="bg-yellow-500 px-4 py-2 rounded-full leading-none cursor-pointer"
                    >
                      -
                    </button>

                    <b className="px-4">{cart.items[product.id]?.quantity}</b>

                    {/* Increment */}
                    <button
                      onClick={() => increment(product)}
                      className="bg-yellow-500 px-4 py-2 rounded-full leading-none cursor-pointer"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <span>
                    ₹ {(product.caloriesPerServing || 0) * (cart.items[product.id]?.quantity || 0)}
                  </span>

                  {/* Delete */}
                  <button
                    onClick={() => handleDelete(product.id)}
                    className="bg-red-500 px-4 py-2 rounded-full leading-none text-white cursor-pointer"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
          </ul>

          <hr className="my-6" />

          {/* Grand Total */}
          <div className="text-right">
            <b>
              Grand total: ₹
              {products.reduce(
                (acc, product) =>
                  acc +
                  product.caloriesPerServing *
                    (cart.items[product.id]?.quantity || 0),
                0
              )}
            </b>
          </div>

          {/* Order Now */}
          <div className="text-right mt-6">
            <button
              onClick={handleOrderNow}
              className="bg-yellow-500 px-4 py-2 rounded-full leading-none cursor-pointer"
            >
              Order Now
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default Cart;
