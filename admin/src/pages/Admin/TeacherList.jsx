import { AdminContext } from "@/context/AdminContext";
import React, { useContext, useEffect } from "react";

const TeacherList = () => {
  const { getAllTeachers, teachers, aToken, changeAvailability } = useContext(AdminContext);

  useEffect(() => {
    if (aToken) getAllTeachers();
  }, [aToken]);

  return (
    <div className="m-5 max-h-[90vh] overflow-y-scroll">
      <h1 className="text-lg font-medium">All Teachers</h1>

      <div className="w-full flex flex-wrap gap-4 pt-5 gap-y-6">
        {teachers.map((teacher) => (
          <div key={teacher._id} className="border border-[#C9D8FF] rounded-xl max-w-56 overflow-hidden cursor-pointer group">
            <img className="bg-[#EAEFFF] group-hover:bg-primary transition-all duration-500 w-full h-32 object-cover" src={teacher.image} alt={teacher.name} />
            <div className="p-4">
              <p className="text-[#262626] text-lg font-medium">{teacher.name}</p>
              <p className="text-[#5C5C5C] text-sm">{teacher.speciality}</p>
              <div className="mt-2 flex items-center gap-1 text-sm">
                <input type="checkbox" checked={teacher.available} onChange={() => changeAvailability(teacher._id)} />
                <p>{teacher.available ? "Available" : "Unavailable"}</p>
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
