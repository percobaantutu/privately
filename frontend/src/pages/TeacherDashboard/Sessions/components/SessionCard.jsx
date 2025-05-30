import React from "react";
import { Link } from "react-router-dom";

const SessionCard = ({ session }) => {
  const { studentId, date, startTime, endTime, topic, status, duration, price, _id } = session;

  const getStatusPillClasses = (status) => {
    switch (status) {
      case "confirmed": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "cancelled_by_student":
      case "cancelled_by_teacher":
      case "cancelled_by_admin":
        return "bg-red-100 text-red-800";
      case "pending_confirmation": return "bg-yellow-100 text-yellow-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const formattedDate = new Date(date).toLocaleDateString(undefined, {
    year: 'numeric', month: 'long', day: 'numeric'
  });

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 hover:shadow-xl transition-shadow duration-300 ease-in-out">
      <div className="flex flex-col sm:flex-row justify-between items-start mb-4">
        <h3 className="text-xl font-semibold text-indigo-700 mb-2 sm:mb-0 break-words">
          {topic || "Untitled Session"}
        </h3>
        <span className={`text-xs font-semibold px-3 py-1 rounded-full ${getStatusPillClasses(status)}`}>
          {status.replace(/_/g, " ").toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-3 text-sm text-gray-600">
        <div className="flex items-center space-x-2">
          <img
            src={studentId?.image || '/default-profile.png'} // Provide a default image path
            alt={studentId?.name || "Student"}
            className="w-10 h-10 rounded-full object-cover"
          />
          <div>
            <p className="font-medium text-gray-800">{studentId?.name || "N/A"}</p>
            <p className="text-xs text-gray-500">{studentId?.email || "N/A"}</p>
          </div>
        </div>
         <p><strong>Date:</strong> {formattedDate}</p>
        <p><strong>Time:</strong> {startTime} - {endTime}</p>
        <p><strong>Duration:</strong> {duration} minutes</p>
        <p><strong>Fee:</strong> ${price}</p>
      </div>

      <div className="mt-6 text-right">
        <Link
          to={`/teacher/dashboard/sessions/${_id}`}
          className="inline-block px-5 py-2 text-sm font-medium text-white bg-indigo-600 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors"
        >
          View Details
        </Link>
      </div>
    </div>
  );
};
export default SessionCard;