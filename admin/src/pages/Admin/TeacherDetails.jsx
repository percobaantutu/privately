import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "@/context/AdminContext";
import { Button } from "@/components/ui/button";
import { AlertTriangle, ArrowLeft } from "lucide-react";

// Reusable component for displaying details
const DetailRow = ({ label, value, isSensitive = false }) => (
  <div className={`px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6 ${isSensitive ? "bg-yellow-50" : "even:bg-white odd:bg-gray-50"}`}>
    <dt className="text-sm font-medium text-gray-500">{label}</dt>
    <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{value || <span className="text-gray-400">Not Provided</span>}</dd>
  </div>
);

const TeacherDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { backendUrl, aToken } = useContext(AdminContext);
  const [teacher, setTeacher] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount || 0);
  };

  useEffect(() => {
    const fetchTeacherDetails = async () => {
      setLoading(true);
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/teacher/${id}`, { headers: { aToken } });
        if (data.success) {
          setTeacher(data.teacher);
        } else {
          toast.error(data.message);
        }
      } catch (error) {
        toast.error("Failed to fetch teacher details.");
      } finally {
        setLoading(false);
      }
    };

    if (aToken) {
      fetchTeacherDetails();
    }
  }, [id, aToken, backendUrl]);

  if (loading) {
    return <div className="p-8 text-center">Loading teacher details...</div>;
  }

  if (!teacher) {
    return <div className="p-8 text-center">Could not find teacher data.</div>;
  }

  const { teacherProfile } = teacher;

  return (
    <div className="m-5 w-full">
      <Button variant="outline" onClick={() => navigate(-1)} className="mb-4">
        <ArrowLeft className="mr-2 h-4 w-4" /> Back to Teacher List
      </Button>

      <div className="bg-white shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6 flex items-center gap-4">
          <img src={teacher.profilePicture} alt={teacher.fullName} className="h-20 w-20 rounded-full object-cover" />
          <div>
            <h3 className="text-lg leading-6 font-medium text-gray-900">{teacher.fullName}</h3>
            <p className="mt-1 max-w-2xl text-sm text-gray-500">{teacher.email}</p>
            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${teacher.isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>{teacher.isActive ? "Active" : "Inactive"}</span>
          </div>
        </div>

        <div className="border-t border-gray-200">
          <dl>
            <DetailRow label="Full Name" value={teacher.fullName} />
            <DetailRow label="Email Address" value={teacher.email} />
            <DetailRow label="Speciality" value={teacherProfile.speciality} />
            <DetailRow label="Degree" value={teacherProfile.degree} />
            <DetailRow label="Experience" value={teacherProfile.experience} />
            <DetailRow label="Session Fee" value={formatCurrency(teacherProfile.hourlyRate)} />
            <DetailRow label="Address" value={`${teacherProfile.address?.line1}, ${teacherProfile.address?.line2}`} />

            {/* Sensitive Information Section */}
            <div className="bg-yellow-100 px-4 py-5 sm:px-6 mt-4 border-t border-yellow-200">
              <div className="flex items-center gap-3">
                <AlertTriangle className="text-yellow-600 h-5 w-5" />
                <h4 className="text-md font-semibold text-yellow-800">Confidential Information</h4>
              </div>
            </div>
            <DetailRow label="Bank Name" value={teacherProfile.bankDetails?.bankName} isSensitive />
            <DetailRow label="Account Holder Name" value={teacherProfile.bankDetails?.accountHolderName} isSensitive />
            <DetailRow label="Account Number" value={teacherProfile.bankDetails?.accountNumber} isSensitive />
            <DetailRow label="ID Type" value={teacherProfile.verificationDetails?.idType} isSensitive />
            <DetailRow label="ID Number" value={teacherProfile.verificationDetails?.idNumber} isSensitive />
          </dl>
        </div>
      </div>
    </div>
  );
};

export default TeacherDetails;
