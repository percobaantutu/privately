import { AdminContext } from "@/context/AdminContext";
import React, { useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const TeacherList = () => {
  const { getAllTeachers, teachers, aToken, changeAvailability } = useContext(AdminContext);
  const navigate = useNavigate();

  useEffect(() => {
    if (aToken) {
      getAllTeachers();
    }
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Teachers</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden group">
            <div onClick={() => navigate(`/teacher-details/${teacher._id}`)} className="cursor-pointer">
              <img className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-32 object-cover" src={teacher.profilePicture} alt={teacher.fullName} />
              <div className="p-4">
                <p className="text-[#262626] text-lg font-medium">{teacher.fullName}</p>
                <p className="text-[#5C5C5C] text-sm">{teacher.speciality}</p>
              </div>
            </div>
            <div className="mt-2 p-4 pt-0 flex items-center gap-2 text-sm border-t bg-gray-50">
              <input
                type="checkbox"
                checked={teacher.isActive}
                onChange={(e) => {
                  e.stopPropagation();
                  changeAvailability(teacher._id);
                }}
                id={`teacher-active-${teacher._id}`}
                className="form-checkbox h-4 w-4 text-primary rounded"
              />
              <label htmlFor={`teacher-active-${teacher._id}`} className="cursor-pointer select-none">
                {teacher.isActive ? "Active" : "Inactive"}
              </label>
            </div>
          </div>
        ))}

        {teachers.length === 0 && <p className="text-gray-500 mt-10">No teachers found...</p>}
      </div>
    </div>
  );
};

export default TeacherList;
