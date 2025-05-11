import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { specialityData } from "@/assets/assets_frontend/assets";

const Teachers = () => {
  const { speciality } = useParams();
  const { teachers } = useContext(AppContext);
  const [filterTeacher, setFilterTeacher] = useState([]);
  const [showFilter, setShowFilter] = useState(false);
  const navigate = useNavigate();

  const applyFilter = () => {
    if (speciality) {
      setFilterTeacher(teachers.filter((teacher) => teacher.speciality === speciality));
    } else {
      setFilterTeacher(teachers);
    }
  };

  useEffect(() => {
    applyFilter();
  }, [speciality, teachers]);

  return (
    <div>
      <p className="text-gray-600">Browse through the specific teachers.</p>
      <div className="flex flex-col sm:flex-row items-start gap-5 mt-5">
        <button className={`py-1 px-3 border rounded text-sm transition-all sm:hidden ${showFilter ? "bg-primary text-white" : ""} `} onClick={() => setShowFilter((prev) => !prev)}>
          Filter
        </button>
        {/* Filter list */}
        <div className={`flex-col gap-4 text-sm text-gray-600 ${showFilter ? "flex" : "hidden sm:flex"}`}>
          {specialityData.map((item, index) => (
            <p
              onClick={() => {
                if (speciality === item.speciality) {
                  navigate("/teachers");
                } else {
                  navigate(`/teachers/${item.speciality}`);
                }
              }}
              className={`w-[94vw] sm:w-auto pl-3 py-1.5 pr-16 border border-gray-300 rounded transition-all cursor-pointer ${speciality === item.speciality ? "bg-indigo-100 text-black" : ""}`}
              key={index}
            >
              {item.speciality}
            </p>
          ))}
        </div>

        {/* Teachers list */}
        <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 gap-y-6">
          {filterTeacher.map((item, index) => (
            <div key={index} onClick={() => navigate(`/session/${item._id}`)} className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500">
              <img src={item.image} alt={item.name} className="bg-[#EAEFFF]" />
              <div className="p-4">
                <div className="flex items-center gap-2 text-sm text-center text-green-500">
                  <p className="w-2 h-2 rounded-full bg-green-500"></p>
                  <p>Available</p>
                </div>
                <p className="text-[#262626] text-lg font-medium">{item.name}</p>
                <p className="text-[#5C5C5C] text-sm">{item.speciality}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Teachers;
