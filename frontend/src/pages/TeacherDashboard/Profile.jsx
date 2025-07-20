import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";
import { Upload } from "lucide-react";

// A reusable component for profile fields
const ProfileField = ({ label, value, isEditing, name, onChange, type = "text", as = "input" }) => (
  <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center first:bg-gray-50 even:bg-white odd:bg-gray-50">
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
      {isEditing ? (
        as === "textarea" ? (
          <textarea name={name} value={value || ""} onChange={onChange} rows={4} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
        ) : (
          <input type={type} name={name} value={value || ""} onChange={onChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
        )
      ) : (
        value
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

  // --- THIS IS THE CRITICAL FIX ---
  // Initialize formData with the complete structure to prevent rendering errors.
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    speciality: "",
    degree: "",
    experience: "",
    about: "",
    hourlyRate: "",
    address: {
      line1: "",
      line2: "",
    },
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
        address: {
          line1: user.teacherProfile?.address?.line1 || "",
          line2: user.teacherProfile?.address?.line2 || "",
        },
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
      // Step 1: Upload new profile picture if one was selected
      if (imageFile) {
        const imageFormData = new FormData();
        imageFormData.append("image", imageFile);
        const res = await axios.post(`${backendUrl}/api/auth/upload-profile-picture`, imageFormData);
        if (!res.data.success) {
          throw new Error("Image upload failed");
        }
      }

      // Step 2: Update the rest of the profile data
      await axios.put(`${backendUrl}/api/teachers/me/profile`, formData);

      // Step 3: Refresh the global user state to get all updated data
      await refreshUserProfile();

      toast.success("Profile updated successfully!");
      setIsEditing(false);
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update profile.");
    } finally {
      setIsLoading(false);
      setImageFile(null); // Reset file input
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
          <p className="mt-1 max-w-2xl text-sm text-gray-500">Personal details and information.</p>
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
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-sm font-medium text-gray-500">Profile Picture</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              <div className="flex items-center gap-4">
                <img src={previewImage} alt="Profile" className="w-20 h-20 rounded-full object-cover" />
                {isEditing && (
                  <label htmlFor="image-upload" className="cursor-pointer bg-gray-100 hover:bg-gray-200 text-gray-700 font-semibold py-2 px-4 rounded-lg flex items-center gap-2">
                    <Upload size={16} /> Change
                    <input id="image-upload" type="file" className="hidden" accept="image/*" onChange={handleImageChange} />
                  </label>
                )}
              </div>
            </dd>
          </div>
          <ProfileField label="Name" value={formData.fullName} isEditing={isEditing} name="fullName" onChange={handleChange} />
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email</dt>
            <dd className="mt-1 text-sm text-gray-700 sm:mt-0 sm:col-span-2">{formData.email}</dd>
          </div>
          <ProfileField label="Speciality" value={formData.speciality} isEditing={isEditing} name="speciality" onChange={handleChange} />
          <ProfileField label="Degree" value={formData.degree} isEditing={isEditing} name="degree" onChange={handleChange} as="input" />
          <ProfileField label="Experience" value={formData.experience} isEditing={isEditing} name="experience" onChange={handleChange} />
          <ProfileField label="About" value={formData.about} isEditing={isEditing} name="about" onChange={handleChange} as="textarea" />
          <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 items-center">
            <dt className="text-sm font-medium text-gray-500">Fees (per hour)</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <input type="number" name="hourlyRate" value={formData.hourlyRate} onChange={handleChange} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary sm:text-sm" />
              ) : (
                formatCurrency(formData.hourlyRate)
              )}
            </dd>
          </div>
          <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
              {isEditing ? (
                <div className="space-y-2">
                  <input type="text" name="address.line1" value={formData.address?.line1 || ""} onChange={handleChange} placeholder="Address Line 1" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                  <input type="text" name="address.line2" value={formData.address?.line2 || ""} onChange={handleChange} placeholder="Address Line 2" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm" />
                </div>
              ) : (
                `${formData.address?.line1 || ""}, ${formData.address?.line2 || ""}`
              )}
            </dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default Profile;
