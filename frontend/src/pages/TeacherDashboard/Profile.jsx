import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Upload, AlertTriangle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

// A reusable component for profile fields
const ProfileField = ({ label, value, isEditing, name, onChange, type = "text", as = "input", placeholder }) => (
  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center first:bg-gray-50 even:bg-white odd:bg-gray-50">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {isEditing ? (
        as === "textarea" ? (
          <textarea name={name} value={value || ""} onChange={onChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder={placeholder} />
        ) : as === "select" ? (
          value // The select element is passed directly as the value
        ) : (
          <input type={type} name={name} value={value || ""} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" placeholder={placeholder} />
        )
      ) : (
        value || <span className="text-gray-400">Not provided</span>
      )}
    </dd>
  </div>
);

const Profile = () => {
  const { user, refreshUserProfile, backendUrl, formatCurrency } = useContext(AppContext);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    hourlyRate: "",
    address: { line1: "", line2: "" },
    bankDetails: { accountHolderName: "", accountNumber: "", bankName: "" },
    verificationDetails: { idType: "KTP", idNumber: "" },
  });

  useEffect(() => {
    if (user) {
      setFormData({
        fullName: user.fullName || "",
        email: user.email || "",
        speciality: user.teacherProfile?.speciality || "",
        degree: user.teacherProfile?.degree || "",
        experience: user.teacherProfile?.experience || "",
        about: user.teacherProfile?.about || "",
        hourlyRate: user.teacherProfile?.hourlyRate || "",
        address: user.teacherProfile?.address || { line1: "", line2: "" },
        bankDetails: user.teacherProfile?.bankDetails || { accountHolderName: "", accountNumber: "", bankName: "" },
        verificationDetails: user.teacherProfile?.verificationDetails || { idType: "KTP", idNumber: "" },
      });
      setPreviewImage(user.profilePicture);
    }
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setFormData((prev) => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value },
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSaveChanges = async () => {
    setIsLoading(true);
    try {
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);
        await axios.post(`${backendUrl}/api/auth/upload-profile-picture`, imageFormData);
      }
      await axios.put(`${backendUrl}/api/teachers/me/profile`, formData);
      await refreshUserProfile();
      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
      setImageFile(null);
    }
  };

  if (!user) {
    return <div>Loading profile...</div>;
  }

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
        <div>
          <h3 className="text-lg leading-6 font-medium text-gray-900">Teacher Profile</h3>
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details, professional information, and payout settings.</p>
        </div>
        {isEditing ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setIsEditing(false)} disabled={isLoading}>
              Cancel
            </Button>
            <Button onClick={handleSaveChanges} disabled={isLoading} className="bg-primary">
              {isLoading ? "Saving..." : "Save Changes"}
            </Button>
          </div>
        ) : (
          <Button onClick={() => setIsEditing(true)} className="bg-primary">
            Edit Profile
          </Button>
        )}
      </div>

      <div className="border-t border-gray-200">
        <dl>
          {/* PERSONAL DETAILS */}
          <div className="bg-gray-50 px-4 py-5 sm:px-6">
            <h4 className="text-md font-semibold text-gray-700">Personal Details</h4>
          </div>
          <ProfileField
            label="Profile Picture"
            value={
              <div className="flex items-center gap-4">
                <img src={previewImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                {isEditing && (
                  <label htmlFor="image-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                    <Upload size={16} /> Change
                    <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            }
          />
          <ProfileField label="Full Name" value={formData.fullName} isEditing={isEditing} name="fullName" onChange={handleChange} />
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2">{formData.email}</dd>
          </div>
          <ProfileField
            label="Address"
            isEditing={isEditing}
            value={
              isEditing ? (
                <div className="space-y-2">
                  <input type="text" name="address.line1" value={formData.address?.line1 || ""} onChange={handleChange} placeholder="Address Line 1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  <input type="text" name="address.line2" value={formData.address?.line2 || ""} onChange={handleChange} placeholder="Address Line 2 (City, State)" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              ) : (
                `${formData.address?.line1 || "Not provided"}, ${formData.address?.line2 || ""}`
              )
            }
          />

          {/* PROFESSIONAL DETAILS */}
          <div className="bg-gray-50 px-4 py-5 sm:px-6 mt-4">
            <h4 className="text-md font-semibold text-gray-700">Professional Details</h4>
          </div>
          <ProfileField label="Speciality" value={formData.speciality} isEditing={isEditing} name="speciality" onChange={handleChange} />
          <ProfileField label="Degree" value={formData.degree} isEditing={isEditing} name="degree" onChange={handleChange} />
          <ProfileField label="Experience" value={formData.experience} isEditing={isEditing} name="experience" onChange={handleChange} />
          <ProfileField label="About" value={formData.about} isEditing={isEditing} name="about" onChange={handleChange} as="textarea" />
          <ProfileField label="Session Fee (per hour)" value={isEditing ? formData.hourlyRate : formatCurrency(formData.hourlyRate)} isEditing={isEditing} name="hourlyRate" type="number" onChange={handleChange} />

          {/* SENSITIVE DETAILS - only show in edit mode */}
          <AnimatePresence>
            {isEditing && (
              <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }}>
                <div className="bg-yellow-50 px-4 py-5 sm:px-6 mt-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="text-yellow-500 h-5 w-5 mt-0.5" />
                    <div>
                      <h4 className="text-md font-semibold text-yellow-800">Verification & Payout Details</h4>
                      <p className="text-sm text-yellow-700">This information is confidential and used only for identity verification and to process your earnings. It will not be displayed publicly.</p>
                    </div>
                  </div>
                </div>
                <ProfileField label="Bank Name" value={formData.bankDetails?.bankName} isEditing={isEditing} name="bankDetails.bankName" onChange={handleChange} placeholder="e.g., Bank Central Asia (BCA)" />
                <ProfileField
                  label="Account Holder Name"
                  value={formData.bankDetails?.accountHolderName}
                  isEditing={isEditing}
                  name="bankDetails.accountHolderName"
                  onChange={handleChange}
                  placeholder="Full name as it appears on your bank account"
                />
                <ProfileField label="Account Number" value={formData.bankDetails?.accountNumber} isEditing={isEditing} name="bankDetails.accountNumber" onChange={handleChange} placeholder="Your bank account number" />
                <ProfileField
                  label="ID Type"
                  isEditing={isEditing}
                  as="select"
                  value={
                    <select name="verificationDetails.idType" value={formData.verificationDetails?.idType} onChange={handleChange} className="w-full p-2 border rounded-lg bg-white">
                      <option value="KTP">KTP (Indonesian ID)</option>
                      <option value="Passport">Passport</option>
                    </select>
                  }
                />
                <ProfileField label="ID Number" value={formData.verificationDetails?.idNumber} isEditing={isEditing} name="verificationDetails.idNumber" onChange={handleChange} placeholder="Your KTP or Passport number" />
              </motion.div>
            )}
          </AnimatePresence>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
