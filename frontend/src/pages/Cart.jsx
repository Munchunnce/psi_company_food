import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  addToCart,
  decreaseQuantity,
  removeFromCart,
  clearCart,
} from "../store/CartSlice";
import { Link, useNavigate } from "react-router-dom";
import Toast from "../components/Toast/Toast";

const Cart = () => {
  const dispatch = useDispatch();
  const cart = useSelector((state) => state.cart);
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [priceFetched, setPriceFetched] = useState(false);
  const [toast, setToast] = useState(null);

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [pincode, setPincode] = useState("");

  // ---------------------- Fetch Products ----------------------
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

  // ---------------------- Handlers ----------------------
  const increment = (product) => dispatch(addToCart(product));
  const decrement = (id) => dispatch(decreaseQuantity(id));
  const handleDelete = (id) => {
    dispatch(removeFromCart(id));
    setProducts(products.filter((p) => p.id !== id));
  };

  const handleOrderNow = () => {
    if (!name || !phone || !address || !pincode) {
      return alert("Please fill in all delivery details!");
    }

    setToast({ message: "Order placed successfully", type: "success" });
    dispatch(clearCart());
    setProducts([]);
    setName("");
    setPhone("");
    setAddress("");
    setPincode("");
    navigate("/customer/orders");
  };

  // ---------------------- Empty Cart ----------------------
  if (!products.length) {
    return (
      <div className="empty-cart py-16">
        <div className="container mx-auto text-center">
          <h1 className="text-3xl font-bold mb-2">Cart Empty 😕</h1>
          <p className="text-gray-500 text-lg mb-12">
            You probably haven't added any items yet. <br />
            To order, go to the main page.
          </p>
          <img
            className="w-2/5 mx-auto"
            src="/images/empty-cart.png"
            alt="empty-cart"
          />
          <Link to="/" className="inline-block mt-12">
            <button className="bg-white border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white py-1 px-3 sm:px-5 rounded-full font-bold cursor-pointer transition-colors duration-200 flex items-center">
              Go back
            </button>
          </Link>
        </div>
      </div>
    );
  }

  // ---------------------- UI ----------------------
  return (
    <>
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}

      <section className="cart py-16">
        <div className="order container mx-auto xl:w-1/2">
          <div className="flex items-center border-b border-gray-300 pb-4 mb-6">
            <h1 className="font-bold text-2xl">Order summary</h1>
          </div>

          {/* CART ITEMS */}
          {products.map((product) => (
            <div
              key={product.id}
              className="flex flex-col sm:flex-row sm:items-center sm:justify-between my-6 p-4 border rounded-lg shadow-sm"
            >
              <div className="flex flex-col sm:flex-row sm:items-center w-full sm:w-auto">
                <img
                  className="w-24 h-24 object-cover rounded mx-auto sm:mx-0"
                  src={product.image}
                  alt={product.name}
                />
                <div className="flex-1 sm:ml-4 text-center sm:text-left mt-3 sm:mt-0">
                  <h1 className="font-semibold text-lg">{product.name}</h1>
                  <span className="text-gray-600 text-sm">
                    Cooking Time: {product.cookTimeMinutes} mins
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-center mt-3 sm:mt-0 space-x-2">
                <button
                  onClick={() => decrement(product.id)}
                  disabled={cart.items[product.id]?.quantity === 1}
                  className={`px-3 py-1 rounded-full cursor-pointer ${
                    cart.items[product.id]?.quantity === 1
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gray-200 hover:bg-gray-300"
                  }`}
                >
                  -
                </button>
                <span className="font-medium">
                  {cart.items[product.id]?.quantity} Pcs
                </span>
                <button
                  onClick={() => increment(product)}
                  className="px-3 py-1 bg-gray-200 hover:bg-gray-300 rounded-full cursor-pointer"
                >
                  +
                </button>
              </div>

              <div className="flex flex-col sm:flex-row items-center sm:space-x-4 mt-3 sm:mt-0 text-center sm:text-left">
                <span className="font-bold text-lg text-[#FE5F1E]">
                  ₹ {product.caloriesPerServing * cart.items[product.id]?.quantity}
                </span>
                <button
                  onClick={() => handleDelete(product.id)}
                  className="mt-2 sm:mt-0 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded-full cursor-pointer transition"
                >
                  Remove
                </button>
              </div>
            </div>
          ))}

          {/* TOTAL */}
          <div className="flex justify-end py-6">
            <div className="text-right">
              <span className="text-lg font-bold">Grand Total: </span>
              <span className="text-2xl font-bold text-[#FE5F1E]">
                ₹
                {products.reduce(
                  (acc, product) =>
                    acc +
                    product.caloriesPerServing *
                      (cart.items[product.id]?.quantity || 0),
                  0
                )}
              </span>
            </div>
          </div>

          <hr className="my-6" />

          {/* DELIVERY DETAILS */}
          <h2 className="text-2xl font-bold mb-4">Delivery Details</h2>

          <div className="grid grid-cols-1 gap-4 mb-8">
            <input
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border p-3 rounded"
              placeholder="Your Name"
            />
            <input
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="border p-3 rounded"
              placeholder="Phone Number"
            />
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="border p-3 rounded"
              placeholder="Full Address"
            />
            <input
              value={pincode}
              onChange={(e) => setPincode(e.target.value)}
              className="border p-3 rounded"
              placeholder="Pincode"
            />
          </div>

          {/* ACTION BUTTONS */}
          <div className="mt-6 flex flex-col sm:flex-row justify-end space-y-3 sm:space-y-0 sm:space-x-4">
            <button
              onClick={() => {
                dispatch(clearCart());
                setProducts([]);
              }}
              className="border border-[#FE5F1E] text-[#FE5F1E] hover:bg-[#FE5F1E] hover:text-white px-6 py-2 rounded-full font-bold cursor-pointer"
            >
              Clear Cart
            </button>

            <button
              onClick={handleOrderNow}
              className="px-6 py-2 rounded-full bg-[#FE5F1E] hover:bg-[#e64e10] text-white font-bold cursor-pointer"
            >
              Order Now
            </button>
          </div>
        </div>
      </section>
    </>
  );
};

export default Cart;
