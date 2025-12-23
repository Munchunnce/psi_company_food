import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate } from "react-router-dom";
import { registerUser } from "../store/authSlice";
import Toast from "../components/Toast/Toast";

const Register = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, accessToken } = useSelector((state) => state.auth);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });
const [toast, setToast] = useState({
  show: false,
  message: "",
  type: "success",
});
// Email validation (basic) add karein
const isValidEmail = (email) => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

  // const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
  e.preventDefault();

  // Empty validation
  if (!formData.name || !formData.email || !formData.password) {
    setToast({
      show: true,
      message: "All fields are required",
      type: "error",
    });
    return;
  }

  // Email validation
  if (!isValidEmail(formData.email)) {
    setToast({
      show: true,
      message: "Please enter a valid email address",
      type: "error",
    });
    return;
  }

  dispatch(registerUser(formData)).then((res) => {
    if (res.meta.requestStatus === "fulfilled") {
      setToast({
        show: true,
        message: "Registration successful",
        type: "success",
      });

      setTimeout(() => {
        navigate("/");
      }, 1000);
    } else {
      setToast({
        show: true,
        message: res.payload || "Registration failed",
        type: "error",
      });
    }
  });
};


  return (
    <div>
      {/* toast notify */}
      {toast.show && (
      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ ...toast, show: false })}
      />
    )}
      <section className="login flex justify-center pt-15 container rounded bg-[#F8F8F8] mx-auto mt-4">
        <div className="w-full max-w-xs">
          <form
            onSubmit={handleSubmit}
            className="bg-white shadow-md rounded px-8 pt-6 pb-8 mb-4"
          >
            {error && (
              <span className="text-red-500 text-sm">{error}</span>
            )}

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="name"
              >
                Name
              </label>
              <input
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#FE5F1E]"
                id="name"
                type="text"
                placeholder="Enter your name"
              />
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="email"
              >
                Email
              </label>
              <input
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#FE5F1E]"
                id="email"
                type="email"
                placeholder="Enter your email"
              />
            </div>

            <div className="mb-6">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="password"
              >
                Password
              </label>
              <input
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="shadow appearance-none border border-gray-300 rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:border-[#FE5F1E]"
                id="password"
                type="password"
                placeholder="******************"
              />
            </div>

            <div className="flex items-center justify-between">
              <button
                disabled={loading}
                className="bg-[#FE5F1E] hover:bg-[#e64e10] rounded-full text-white font-bold py-2 px-4 focus:outline-none focus:shadow-outline cursor-pointer"
                type="submit"
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <Link
                className="text-[#FE5F1E] hover:text-[#e64e10] inline-block align-baseline font-bold text-sm"
                to="/login"
              >
                Already have account?
              </Link>
            </div>
          </form>
          <p className="text-center text-gray-500 text-xs">
            &copy;2025 Vimal's Gyan. All rights reserved.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Register;