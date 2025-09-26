import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { AppContext } from "@/context/AppContext";
import axios from "../utils/axios"; // Use the configured axios instance
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setUser } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(true); // Default to login view
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  const validate = () => {
    const newErrors = {};
    if (!isLogin) {
      if (formData.fullName.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters";
      }
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }
    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setIsLoading(true);

    const endpoint = isLogin ? "/api/auth/login" : "/api/auth/register";
    const payload = isLogin ? { email: formData.email, password: formData.password } : { fullName: formData.fullName, email: formData.email, password: formData.password, role: "student" };

    try {
      const { data } = await axios.post(endpoint, payload);

      if (data.success) {
        if (isLogin) {
          setUser(data.user);
          toast.success("Login successful!");
          navigate("/");
        } else {
          toast.success("Registration successful! Please log in.");
          setIsLogin(true); // Switch to login view
          setFormData({ fullName: "", email: formData.email, password: "" }); // Keep email for convenience
        }
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={handleSubmit}>
      <motion.div
        className="flex flex-col gap-4 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-2xl font-semibold w-full text-center">{isLogin ? "Welcome Back" : "Create Your Account"}</p>
        <p className="text-gray-600 w-full text-center">{isLogin ? "Please login to continue." : "Sign up to book your first session."}</p>

        <AnimatePresence>
          {!isLogin && (
            <motion.div
              className="w-full"
              key="fullName"
              initial={{ opacity: 0, height: 0, marginTop: 0 }}
              animate={{ opacity: 1, height: "auto", marginTop: "1rem" }}
              exit={{ opacity: 0, height: 0, marginTop: 0 }}
              transition={{ duration: 0.3 }}
            >
              <label>Full Name</label>
              <input
                className={`border ${errors.fullName ? "border-red-500" : "border-[#DADADA]"} rounded w-full p-2 mt-1`}
                type="text"
                name="fullName"
                required={!isLogin}
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full">
          <label>Email</label>
          <input className={`border ${errors.email ? "border-red-500" : "border-[#DADADA]"} rounded w-full p-2 mt-1`} type="email" name="email" required value={formData.email} onChange={handleChange} placeholder="Enter your email" />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="w-full relative">
          <label>Password</label>
          <input
            className={`border ${errors.password ? "border-red-500" : "border-[#DADADA]"} rounded w-full p-2 mt-1 pr-10`}
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <button type="button" className="absolute right-3 top-1/2 -translate-y-0.5 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </button>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button type="submit" className={`w-full py-2 my-2 rounded-md text-base transition-all duration-300 ${isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-opacity-90"}`} disabled={isLoading}>
          {isLoading ? "Processing..." : isLogin ? "Login" : "Create account"}
        </button>

        <a href="http://api.privately.my.id/api/auth/google" className="w-full">
          <Button type="button" variant="outline" className="w-full">
            <svg className="w-4 h-4 mr-2" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
              <path
                fill="currentColor"
                d="M488 261.8C488 403.3 381.5 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 126 21.2 174 57.9l-67 67C314.6 98.4 282.7 80 248 80c-84.3 0-152 68.6-152 176s67.7 176 152 176c94.2 0 135.3-63.5 140.8-95.3H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"
              ></path>
            </svg>
            Google
          </Button>
        </a>

        <div className="w-full text-left">
          <Link to="/forgot-password" className="text-xs text-primary hover:underline">
            Forgot Password?
          </Link>
        </div>

        <p className="w-full text-center">
          {isLogin ? "Don't have an account? " : "Already have an account? "}

          <span
            className="text-primary underline cursor-pointer font-medium"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
          >
            {isLogin ? "Sign up" : "Login"}
          </span>
        </p>

        <p className="w-full text-center">
          Are you a teacher?{" "}
          <span className="text-primary underline cursor-pointer font-medium">
            <Link to="/teacher/login">Login</Link>
          </span>
        </p>
      </motion.div>
    </form>
  );
};

export default Login;
