// admin/src/pages/Admin/Verification.jsx

import { AdminContext } from "@/context/AdminContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";

const Verification = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [pendingTeachers, setPendingTeachers] = useState([]);
  const [loading, setLoading] = useState(true);

  // Function to fetch teachers awaiting verification
  const fetchPendingTeachers = async () => {
    if (!aToken) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/teachers/pending`, { headers: { aToken } });
      if (data.success) {
        setPendingTeachers(data.teachers);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch pending teachers.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle the verification of a teacher
  const handleVerifyTeacher = async (teacherId) => {
    if (!aToken) return;
    try {
      const { data } = await axios.put(`${backendUrl}/api/admin/teachers/verify/${teacherId}`, {}, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        // Refresh the list after verification
        fetchPendingTeachers();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred during verification.");
    }
  };

  useEffect(() => {
    fetchPendingTeachers();
  }, [aToken]);

  return (
    <div className="m-5 w-full">
      <h1 className="text-lg font-medium">Teacher Verification Requests</h1>
      <div className="mt-4">
        {loading ? (
          <p>Loading...</p>
        ) : pendingTeachers.length === 0 ? (
          <p className="text-gray-500 mt-10">No new verification requests.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white border">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Registered On</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {pendingTeachers.map((teacher) => (
                  <tr key={teacher._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{teacher.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{teacher.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{new Date(teacher.createdAt).toLocaleDateString()}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button onClick={() => handleVerifyTeacher(teacher._id)} className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded transition-colors">
                        Verify
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Verification;
