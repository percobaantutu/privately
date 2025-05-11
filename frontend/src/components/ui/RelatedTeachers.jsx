import { AppContext } from "@/context/AppContext";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "./button";

const RelatedTeachers = ({ speciality, teacherId }) => {
  const { teachers } = useContext(AppContext);

  const navigate = useNavigate();

  const [relatedTeachers, setRelatedTeachers] = useState([]);

  useEffect(() => {
    if (teachers.length > 0 && speciality) {
      const teachersData = teachers.filter((teacher) => teacher.speciality === speciality && teacher._id !== teacherId);
      setRelatedTeachers(teachersData);
    }
  }, [teachers, speciality, teacherId]);

  return (
    <div className="flex flex-col items-center gap-4 my-16 text-[#262626] md:mx-10">
      <h2 className="text-3xl font-medium">Related Teachers</h2>
      <div className="w-full grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-5 gap-y-6 px-3 sm:px-0">
        {relatedTeachers.slice(0, 5).map((item, index) => (
          <div
            key={index}
            onClick={() => {
              navigate(`/session/${item._id}`);
              scrollTo(0, 0);
            }}
            className="border border-[#C9D8FF] rounded-xl overflow-hidden cursor-pointer hover:translate-y-[-10px] transition-all duration-500"
          >
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
      <Button
        onClick={() => {
          navigate("/teachers");
          scrollTo(0, 0);
        }}
        className="bg-[#EAEFFF] text-gray-600 px-12 py-3 rounded-full mt-10"
      >
        more
      </Button>
    </div>
  );
};

export default RelatedTeachers;
