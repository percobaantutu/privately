import React, { useContext, useState } from "react";
import { motion } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { AdminContext } from "../context/AdminContext";
import axios from "axios";
import { toast } from "react-toastify";

const Login = () => {
  const [state, setState] = useState("Admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { setAToken, backendUrl } = useContext(AdminContext);

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (state === "Admin") {
        const { data } = await axios.post(`${backendUrl}/api/admin/login`, { email, password });
        if (data.success) {
          setAToken(data.token);
          localStorage.setItem("adminToken", data.token);
          toast.success(`${state} login successful!`);
          setTimeout(() => window.location.reload(), 1200);
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.error("Error during login:", error);
      const errMsg = error.response?.data?.message || "Login failed. Please try again.";
      toast.error(errMsg);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="min-h-[80vh] flex items-center">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="flex flex-col gap-3 m-auto items-start p-8 min-w-[340px] sm:min-w-96 border rounded-xl text-[#5E5E5E] text-sm shadow-lg"
      >
        {/* Animated Switch */}
        <motion.p
          key={state} // triggers animation when state changes
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-semibold m-auto"
        >
          <span className="text-primary">{state}</span> Login
        </motion.p>

        {/* Email */}
        <div className="w-full">
          <label>Email</label>
          <input className="border border-[#DADADA] rounded w-full p-2 mt-1" type="email" name="email" required autoComplete="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Password + Eye toggle */}
        <div className="w-full">
          <label>Password</label>
          <div className="relative">
            <input
              className="border border-[#DADADA] rounded w-full p-2 mt-1 pr-10"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <div onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 cursor-pointer text-gray-500">
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </div>
          </div>
        </div>

        {/* Login button */}
        <button type="submit" className="bg-primary text-white w-full py-2 rounded-md text-base hover:bg-opacity-90 transition">
          Login
        </button>

        {/* Switch login type */}
        {state === "Admin" ? (
          <p>
            Teacher Login?{" "}
            <span onClick={() => setState("Teacher")} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        ) : (
          <p>
            Admin Login?{" "}
            <span onClick={() => setState("Admin")} className="text-primary underline cursor-pointer">
              Click here
            </span>
          </p>
        )}
      </motion.div>
    </form>
  );
};

export default Login;
