// File: frontend/src/pages/ForgotPassword.jsx

import React, { useState } from "react";
import { motion } from "framer-motion";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const ForgotPassword = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage("");
    try {
      const response = await axios.post("/api/auth/forgot-password", { email });
      if (response.data.success) {
        toast.success(response.data.message);
        setMessage(response.data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "An error occurred.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-[70vh] flex items-center justify-center">
      <motion.div className="w-full max-w-md p-8 space-y-6 bg-white border rounded-xl shadow-lg" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-800">Forgot Your Password?</h1>
          <p className="mt-2 text-sm text-gray-600">No problem. Enter your email address below and we'll send you a link to reset it.</p>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="sr-only">
              Email address
            </label>
            <input id="email" name="email" type="email" autoComplete="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md" placeholder="Email address" />
          </div>
          <Button type="submit" className="w-full bg-primary" disabled={isLoading}>
            {isLoading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
        {message && <p className="text-center text-sm text-green-600 bg-green-50 p-3 rounded-md">{message}</p>}
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
