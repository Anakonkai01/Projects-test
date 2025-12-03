import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "sonner";
import { motion } from "framer-motion";
import { FiLoader } from "react-icons/fi";
import { login, reset } from "../features/auth/authSlice";

const formVariants = {
  hidden: {
    opacity: 0,
    y: 20,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  const redirect = new URLSearchParams(location.search).get("redirect") || "/";

  useEffect(() => {
    if (isError) {
      toast.error(message || "Email hoặc mật khẩu không đúng.");
      dispatch(reset()); // Đảm bảo reset lỗi
      return; // Dừng sớm
    }

    // KHI VỪA ĐĂNG NHẬP THÀNH CÔNG (isSuccess = true)
    if (isSuccess && user) {
      // Kiểm tra vai trò của user
      if (user.role === 'ADMIN') {
        toast.success("Đăng nhập với tư cách là Admin!"); // Goal 2
        navigate('/admin'); // Goal 1: Điều hướng đến trang admin
      } else {
        toast.success("Đăng nhập thành công!");
        navigate(redirect); // Điều hướng như cũ cho user thường
      }
      dispatch(reset()); // Reset trạng thái
      return;
    }

    // KHI USER ĐÃ ĐĂNG NHẬP SẴN (user đã tồn tại) VÀ LỠ VÀO LẠI TRANG LOGIN
    if (user) {
      // Chỉ cần điều hướng đi, không cần thông báo
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirect);
      }
    }
    
  }, [user, isError, isSuccess, message, navigate, redirect, dispatch]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLoading) return;
    const userData = {
      email,
      password,
    };
    dispatch(login(userData));
  };

  const GoogleIcon = () => (
    <svg className="w-5 h-5 mr-3" viewBox="0 0 48 48">
      <path
        fill="#FFC107"
        d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
      />
      <path
        fill="#FF3D00"
        d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
      />
      <path
        fill="#4CAF50"
        d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
      />
      <path
        fill="#1976D2"
        d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571l6.19,5.238C39.712,34.464,44,28.091,44,20C44,22.659,43.862,21.35,43.611,20.083z"
      />
    </svg>
  );

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-sky-200 via-blue-300 to-indigo-500 p-4">
      <motion.div
        variants={formVariants}
        initial="hidden"
        animate="visible"
        className="w-full max-w-md"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full bg-white p-8 rounded-lg border border-gray-200 shadow-xl"
        >
          <div className="flex justify-center mb-6">
            <h2 className="text-3xl font-extrabold text-gray-800">
              Đăng Nhập
            </h2>
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="email"
            >
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="your-email@example.com"
              required
            />
          </div>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-medium mb-2"
              htmlFor="password"
            >
              Mật khẩu <span className="text-red-500">*</span>
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="shadow-sm appearance-none border border-gray-300 rounded-lg w-full py-3 px-4 text-gray-700 leading-tight transition duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Nhập mật khẩu của bạn"
              minLength="8"
              required
            />
          </div>
          <div className="flex items-center justify-end mb-4">
            <Link
              to="/forgotpassword"
              className="text-sm text-blue-500 hover:underline"
            >
              Quên mật khẩu?
            </Link>
          </div>
          <div className="mb-4">
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-300 ease-in-out flex items-center justify-center disabled:opacity-60 disabled:cursor-not-allowed active:scale-[.98]"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <FiLoader className="animate-spin w-5 h-5 mr-2" />
                  Đang đăng nhập...
                </>
              ) : (
                "Đăng nhập"
              )}
            </button>
          </div>

          <div className="relative my-6">
            <div
              className="absolute inset-0 flex items-center"
              aria-hidden="true"
            >
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">
                Hoặc đăng nhập với
              </span>
            </div>
          </div>

          <div>
            <a
              href="http://localhost:8000/api/auth/google"
              className="w-full inline-flex items-center justify-center bg-white hover:bg-gray-50 text-gray-700 font-semibold py-3 px-4 border border-gray-300 rounded-lg shadow-sm transition-colors duration-200"
            >
              <GoogleIcon />
              Đăng nhập với Google
            </a>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm mt-2 text-gray-600">
              Chưa có tài khoản?{" "}
              <Link
                to={`/register?redirect=${encodeURIComponent(redirect)}`}
                className="font-medium text-blue-500 hover:underline"
              >
                Đăng ký ngay
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default Login;