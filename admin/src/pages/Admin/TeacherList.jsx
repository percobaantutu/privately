import { AdminContext } from "@/context/AdminContext";
import React, { useContext, useEffect } from "react";

const TeacherList = () => {
  // The changeAvailability function is now updated in the context
  const { getAllTeachers, teachers, aToken, changeAvailability } = useContext(AdminContext);

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
          <div key={teacher._id} className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group">
            {/* UPDATED: The image property is now `profilePicture` */}
            <img className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-32 object-cover" src={teacher.profilePicture} alt={teacher.fullName} />
            <div className="p-4">
              {/* UPDATED: The name property is now `fullName` */}
              <p className="text-[#262626] text-lg font-medium">{teacher.fullName}</p>
              <p className="text-[#5C5C5C] text-sm">{teacher.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                {/* UPDATED: The availability property is now `isActive` */}
                <input type="checkbox" checked={teacher.isActive} onChange={() => changeAvailability(teacher._id)} id={`teacher-active-${teacher._id}`} />
                <label htmlFor={`teacher-active-${teacher._id}`} className="cursor-pointer">
                  {teacher.isActive ? "Active" : "Inactive"}
                </label>
              </div>
            </div>
          </div>
        ))}

        {teachers.length === 0 && <p className="text-gray-500 mt-10">No teachers found...</p>}
      </div>
    </div>
  );
};

export default TeacherList;
