// frontend/pages/TeacherRegister.jsx

import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { Eye, EyeOff } from "lucide-react";
import { specialityData } from "@/assets/assets_frontend/assets";

const TeacherRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    role: "teacher",
    speciality: specialityData[0].speciality, // Default to the first item
    degree: "",
    experience: "",
    about: "",
    fees: "",
    address: {
      line1: "",
      line2: "",
    },
  });
  const [customSpeciality, setCustomSpeciality] = useState(""); // State for the "Other" input
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value,
        },
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      // Create a payload to send, handling the "Other" speciality case
      const payloadToSend = { ...formData };
      if (formData.speciality === "Other") {
        payloadToSend.speciality = customSpeciality;
      }

      const response = await axios.post("/api/auth/register", payloadToSend);

      if (response.data.success) {
        toast.success(response.data.message);
        navigate("/teacher/login");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="min-h-[80vh] flex items-center justify-center p-4" onSubmit={handleSubmit}>
      <motion.div className="flex flex-col gap-3 w-full max-w-md p-8 border rounded-xl text-[#5E5E5E] text-sm shadow-lg bg-white" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        <p className="text-2xl font-semibold text-gray-900">Create Teacher Account</p>
        <p className="text-gray-600 mb-4">Join our platform and start teaching!</p>

        <div className="w-full space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
            <input type="text" name="fullName" value={formData.fullName} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter your full name" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter your email" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
            <div className="relative">
              <input type={showPassword ? "text" : "password"} name="password" value={formData.password} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Enter your password" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500">
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>
          {/* Speciality Dropdown */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Speciality</label>
            <select name="speciality" value={formData.speciality} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
              {specialityData.map((item, index) => (
                <option key={index} value={item.speciality}>
                  {item.speciality}
                </option>
              ))}
            </select>
          </div>
          {/* Conditional Input for "Other" Speciality */}
          <AnimatePresence>
            {formData.speciality === "Other" && (
              <motion.div initial={{ opacity: 0, height: 0, marginTop: 0 }} animate={{ opacity: 1, height: "auto", marginTop: "1rem" }} exit={{ opacity: 0, height: 0, marginTop: 0 }}>
                <label className="block text-sm font-medium text-gray-700 mb-1">Please specify your speciality</label>
                <input
                  type="text"
                  name="customSpeciality"
                  value={customSpeciality}
                  onChange={(e) => setCustomSpeciality(e.target.value)}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg"
                  placeholder="e.g., Cooking, Music Theory"
                />
              </motion.div>
            )}
          </AnimatePresence>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Degree</label>
            <input type="text" name="degree" value={formData.degree} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., M.Ed" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Experience</label>
            <input type="text" name="experience" value={formData.experience} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 5 Years" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Session Fee (in Rupiah)</label>
            <input type="number" name="fees" value={formData.fees} onChange={handleChange} required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="e.g., 50000" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">About You</label>
            <textarea name="about" value={formData.about} onChange={handleChange} rows="3" required className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Tell students about yourself" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
            <input type="text" name="address.line1" value={formData.address.line1} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2" placeholder="Address Line 1" />
            <input type="text" name="address.line2" value={formData.address.line2} onChange={handleChange} className="w-full px-3 py-2 border border-gray-300 rounded-lg" placeholder="Address Line 2 (City, State)" />
          </div>
        </div>

        <button type="submit" disabled={isLoading} className="w-full mt-4 bg-primary text-white py-2 rounded-lg hover:bg-opacity-90 transition-colors disabled:opacity-50">
          {isLoading ? "Registering..." : "Create Account"}
        </button>

        <p className="text-center w-full mt-2">
          Already a teacher?{" "}
          <Link to="/teacher/login" className="text-primary hover:underline">
            Login here
          </Link>
        </p>
      </motion.div>
    </form>
  );
};

export default TeacherRegister;
