import React, { useContext, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 👁 Using lucide icons (or swap with heroicons)
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const { backendUrl, token, setToken } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(false);

  // Form states
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  // Error states
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Validate form
  const validate = () => {
    const newErrors = {};

    if (!email.match(/^\S+@\S+\.\S+$/)) {
      newErrors.email = "Invalid email format";
    }

    if (password.length < 6) {
      newErrors.password = "Password must be at least 6 characters";
    }

    if (!isLogin && fullName.trim().length < 2) {
      newErrors.fullName = "Full name must be at least 2 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "Sign Up") {
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name: fullName,
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("User registered successfully");
        } else {
          toast.error(data.message);
        }
      } else {
        const { data } = await axios.post(`${backendUrl}/api/user/login`, {
          email,
          password,
        });
        if (data.success) {
          localStorage.setItem("token", data.token);
          setToken(data.token);
          toast.success("User login successfully");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      toast.error(error.message);
    }

    if (!validate()) return;

    setLoading(true);
    await new Promise((res) => setTimeout(res, 2000)); // fake loading 2s

    if (isLogin) {
      alert(`Logged in with:\nEmail: ${email}\nPassword: ${password}`);
    } else {
      alert(`Signed up with:\nName: ${fullName}\nEmail: ${email}\nPassword: ${password}`);
    }

    // Reset form
    setFullName("");
    setEmail("");
    setPassword("");
    setErrors({});
    setLoading(false);
  };

  return (
    <form className="min-h-[80vh] flex items-center" onSubmit={handleSubmit}>
      <motion.div
        className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <p className="text-2xl font-semibold">{isLogin ? "Welcome Back" : "Create Account"}</p>
        <p>{isLogin ? "Please login to your account" : "Please sign up to book appointment"}</p>

        <AnimatePresence mode="wait">
          {!isLogin && (
            <motion.div className="w-full" key="fullName" initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} transition={{ duration: 0.3 }}>
              <p>Full Name</p>
              <input className="border border-[#DADADA] rounded w-full p-2 mt-1" type="text" required value={fullName} onChange={(e) => setFullName(e.target.value)} />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full">
          <p>Email</p>
          <input className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="w-full relative">
          <p>Password</p>
          <input className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10" type={showPassword ? "text" : "password"} required value={password} onChange={(e) => setPassword(e.target.value)} />
          {/* 👁 Toggle icon */}
          <div className="absolute right-3 top-9 cursor-pointer text-gray-500" onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
        </div>

        <button type="submit" className={`w-full py-2 my-2 rounded-md text-base transition-all duration-300 ${loading ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white"}`} disabled={loading}>
          {loading ? (
            <motion.div className="flex justify-center items-center gap-2" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              <motion.div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Processing...
            </motion.div>
          ) : isLogin ? (
            "Login"
          ) : (
            "Create account"
          )}
        </button>

        <p>
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <span
            className="text-primary underline cursor-pointer"
            onClick={() => {
              setIsLogin(!isLogin);
              setErrors({});
            }}
          >
            {isLogin ? "Sign up here" : "Login here"}
          </span>
        </p>
      </motion.div>
    </form>
  );
};

export default Login;
