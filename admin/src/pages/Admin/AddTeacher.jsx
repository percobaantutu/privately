import { assets } from "@/assets/assets";
import { AdminContext } from "@/context/AdminContext";
import axios from "axios";
import React, { useContext, useState } from "react";
import { toast } from "react-toastify";

const AddTeacher = () => {
  const [image, setImage] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [experience, setExperience] = useState("1 Year");
  const [fees, setFees] = useState("");
  const [speciality, setSpeciality] = useState("Math");
  const [degree, setDegree] = useState("");
  const [address1, setAddress1] = useState("");
  const [address2, setAddress2] = useState("");
  const [about, setAbout] = useState("");
  const [loading, setLoading] = useState(false);

  const { backendUrl, aToken } = useContext(AdminContext);

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (!image) {
        return toast.error("Please upload an image");
      }
      setLoading(true);
      const formData = new FormData();
      formData.append("image", image);
      formData.append("name", name);
      formData.append("email", email);
      formData.append("password", password);
      formData.append("experience", experience);
      formData.append("fees", Number(fees));
      formData.append("speciality", speciality);
      formData.append("degree", degree);
      formData.append("address", JSON.stringify({ line1: address1, line2: address2 }));
      formData.append("about", about);

      formData.forEach((value, key) => {
        console.log(`${key}, ${value}`);
      });

      const { data } = await axios.post(`${backendUrl}/api/admin/add-teacher`, formData, { headers: { aToken } });

      if (data.success) {
        toast.success(data.message);
        window.scrollTo({ top: 0, behavior: "smooth" });
        setImage(false);
        setName("");
        setEmail("");
        setPassword("");
        setExperience("1 Year");
        setFees("");
        setSpeciality("Math");
        setDegree("");
        setAddress1("");
        setAddress2("");
        setAbout("");
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="m-5 w-full">
      <p className="mb-3 text-lg font-medium">Add Teacher</p>

      <div className="bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll">
        {/* Upload */}
        <div className="flex items-center gap-4 mb-8 text-gray-500">
          <label htmlFor="teacher-img">
            <img className="w-16 bg-gray-100 rounded-full cursor-pointer" src={image ? URL.createObjectURL(image) : assets.upload_area} alt="" />
          </label>
          <input type="file" id="teacher-img" hidden onChange={(e) => setImage(e.target.files[0])} />
          <p>
            Upload Teacher <br /> picture
          </p>
        </div>

        {/* Inputs */}
        <div className="flex flex-col lg:flex-row items-start gap-10 text-gray-600">
          {/* Left */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Your name</p>
              <input className="border rounded px-3 py-2" type="text" placeholder="Name" required value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Teacher Email</p>
              <input className="border rounded px-3 py-2" type="email" placeholder="Email" required value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Set Password</p>
              <input className="border rounded px-3 py-2" type="password" placeholder="Password" required value={password} onChange={(e) => setPassword(e.target.value)} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Experience</p>
              <select className="border rounded px-2 py-2" value={experience} onChange={(e) => setExperience(e.target.value)}>
                <option value="1 Year">1 Year</option>
                <option value="2 Years">2 Years</option>
                <option value="3 Years">3 Years</option>
                <option value="4 Years">4 Years</option>
                <option value="5 Years">5 Years</option>
                <option value="6 Years">6 Years</option>
                <option value="7 Years">7 Years</option>
                <option value="8 Years">8 Years</option>
                <option value="9 Years">9 Years</option>
                <option value="10 Years">10 Years</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Fees</p>
              <input className="border rounded px-3 py-2" type="number" placeholder="Teacher fees" required value={fees} onChange={(e) => setFees(e.target.value)} />
            </div>
          </div>

          {/* Right */}
          <div className="w-full lg:flex-1 flex flex-col gap-4">
            <div className="flex-1 flex flex-col gap-1">
              <p>Subject</p>
              <select className="border rounded px-2 py-2" value={speciality} onChange={(e) => setSpeciality(e.target.value)}>
                <option value="Math">Math</option>
                <option value="Science">Science</option>
                <option value="Language & Literature">Language & Literature</option>
                <option value="History">History</option>
                <option value="Digital Literacy">Digital Literacy</option>
                <option value="Life Skill">Life Skill</option>
              </select>
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Degree</p>
              <input className="border rounded px-3 py-2" type="text" placeholder="Degree" required value={degree} onChange={(e) => setDegree(e.target.value)} />
            </div>
            <div className="flex-1 flex flex-col gap-1">
              <p>Address</p>
              <input className="border rounded px-3 py-2" type="text" placeholder="Address 1" required value={address1} onChange={(e) => setAddress1(e.target.value)} />
              <input className="border rounded px-3 py-2" type="text" placeholder="Address 2" required value={address2} onChange={(e) => setAddress2(e.target.value)} />
            </div>
          </div>
        </div>

        {/* About */}
        <div>
          <p className="mt-4 mb-2">About Teacher</p>
          <textarea className="w-full px-4 pt-2 border rounded" rows="5" placeholder="Write about Teacher" value={about} onChange={(e) => setAbout(e.target.value)}></textarea>
        </div>

        <button type="submit" className="bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer flex items-center justify-center gap-2 disabled:opacity-50" disabled={loading}>
          {loading ? (
            <>
              <svg className="w-5 h-5 animate-spin" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="white" strokeWidth="4"></circle>
                <path className="opacity-75" fill="white" d="M4 12a8 8 0 018-8v4l3-3-3-3v4a8 8 0 00-8 8h4z"></path>
              </svg>
              Loading...
            </>
          ) : (
            "Add Teacher"
          )}
        </button>
      </div>
    </form>
  );
};

export default AddTeacher;
