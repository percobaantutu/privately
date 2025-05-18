import React, { useContext, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react"; // 👁 Using lucide icons (or swap with heroicons)
import { AppContext } from "@/context/AppContext";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const navigate = useNavigate();
  const { backendUrl, setUser } = useContext(AppContext);
  const [isLogin, setIsLogin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginAttempts, setLoginAttempts] = useState(0);

  // Form states
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  // Error states
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);

  // Password strength indicator
  const [passwordStrength, setPasswordStrength] = useState(0);

  // Validate email format
  const validateEmail = (email) => {
    const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    return emailRegex.test(email);
  };

  // Check password strength
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength += 1;
    if (/[A-Z]/.test(password)) strength += 1;
    if (/[0-9]/.test(password)) strength += 1;
    if (/[^A-Za-z0-9]/.test(password)) strength += 1;
    return strength;
  };

  // Validate form
  const validate = () => {
    const newErrors = {};
    
    if (!isLogin) {
      if (formData.fullName.trim().length < 2) {
        newErrors.fullName = "Full name must be at least 2 characters";
      }
      if (!/^[a-zA-Z\s]*$/.test(formData.fullName)) {
        newErrors.fullName = "Name should only contain letters and spaces";
      }
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.password.length < 8) {
      newErrors.password = "Password must be at least 8 characters";
    }

    if (!isLogin && passwordStrength < 3) {
      newErrors.password = "Password is too weak. Include uppercase, numbers, and special characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));

    // Check password strength in real-time
    if (name === 'password') {
      setPasswordStrength(checkPasswordStrength(value));
    }

    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    // Check for too many login attempts
    if (isLogin && loginAttempts >= 5) {
      toast.error("Too many login attempts. Please try again later.");
      return;
    }

    setIsLoading(true);

    try {
      if (!isLogin) {
        // Sign Up logic
        const { data } = await axios.post(`${backendUrl}/api/user/register`, {
          name: formData.fullName,
          email: formData.email,
          password: formData.password,
        }, {
          withCredentials: true // Important for cookies
        });
        
        if (data.success) {
          toast.success("Registration successful! Please log in.");
          setIsLogin(true);
          setFormData({ fullName: "", email: "", password: "" });
        }
      } else {
        // Login logic
        const { data } = await axios.post(`${backendUrl}/api/auth/login`, {
          email: formData.email,
          password: formData.password,
        }, {
          withCredentials: true // Important for cookies
        });
        
        if (data.success) {
          setUser(data.user); // Store user data in context
          toast.success("Login successful!");
          setLoginAttempts(0);
          navigate('/'); // Redirect to home page
        }
      }
    } catch (error) {
      const errorMessage = error.response?.data?.message || "An error occurred. Please try again.";
      toast.error(errorMessage);
      
      if (isLogin) {
        setLoginAttempts(prev => prev + 1);
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Password strength indicator component
  const PasswordStrengthIndicator = () => {
    const strengthColors = ['#ff4444', '#ffbb33', '#00C851', '#007E33'];
    const strengthText = ['Very Weak', 'Weak', 'Strong', 'Very Strong'];
    
    return (
      <div className="mt-1">
        <div className="flex gap-1">
          {[...Array(4)].map((_, index) => (
            <div
              key={index}
              className="h-1 w-full rounded-full"
              style={{
                backgroundColor: index < passwordStrength ? strengthColors[passwordStrength - 1] : '#e0e0e0'
              }}
            />
          ))}
        </div>
        {formData.password && (
          <p className="text-xs mt-1" style={{ color: strengthColors[passwordStrength - 1] }}>
            {strengthText[passwordStrength - 1]}
          </p>
        )}
      </div>
    );
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
            <motion.div 
              className="w-full" 
              key="fullName" 
              initial={{ opacity: 0, x: -20 }} 
              animate={{ opacity: 1, x: 0 }} 
              exit={{ opacity: 0, x: 20 }} 
              transition={{ duration: 0.3 }}
            >
              <p>Full Name</p>
              <input 
                className={`border ${errors.fullName ? 'border-red-500' : 'border-[#DADADA]'} rounded w-full p-2 mt-1`}
                type="text"
                name="fullName"
                required
                value={formData.fullName}
                onChange={handleChange}
                placeholder="Enter your full name"
              />
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </motion.div>
          )}
        </AnimatePresence>

        <div className="w-full">
          <p>Email</p>
          <input 
            className={`border ${errors.email ? 'border-red-500' : 'border-[#DADADA]'} rounded w-full p-2 mt-1`}
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
          />
          {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
        </div>

        <div className="w-full relative">
          <p>Password</p>
          <input 
            className={`border ${errors.password ? 'border-red-500' : 'border-[#DADADA]'} rounded w-full p-2 mt-1 pr-10`}
            type={showPassword ? "text" : "password"}
            name="password"
            required
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
          />
          <div 
            className="absolute right-3 top-9 cursor-pointer text-gray-500"
            onClick={() => setShowPassword(!showPassword)}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </div>
          {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
          {!isLogin && <PasswordStrengthIndicator />}
        </div>

        <button 
          type="submit" 
          className={`w-full py-2 my-2 rounded-md text-base transition-all duration-300 ${
            isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-primary text-white hover:bg-opacity-90"
          }`}
          disabled={isLoading}
        >
          {isLoading ? (
            <motion.div 
              className="flex justify-center items-center gap-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
            >
              <motion.div 
                className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              />
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
              setFormData({ fullName: "", email: "", password: "" });
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
