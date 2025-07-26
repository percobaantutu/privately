import React, { useState, useEffect, useContext } from "react";
import { AppContext } from "@/context/AppContext";
import axios from "../utils/axios";
import { toast } from "react-toastify";
import { FileText, Clock, CheckCircle } from "lucide-react";

const MyDisputes = () => {
  const { backendUrl, user } = useContext(AppContext);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchDisputes = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/disputes/my-disputes`);
        if (data.success) {
          setDisputes(data.disputes);
        } else {
          toast.error("Failed to fetch your disputes.");
        }
      } catch (error) {
        toast.error("An error occurred while fetching your disputes.");
      } finally {
        setLoading(false);
      }
    };

    fetchDisputes();
  }, [user, backendUrl]);

  const getStatusInfo = (status) => {
    switch (status) {
      case "open":
        return { text: "Open", color: "bg-red-100 text-red-800", Icon: FileText };
      case "under_review":
        return { text: "Under Review", color: "bg-yellow-100 text-yellow-800", Icon: Clock };
      case "resolved":
        return { text: "Resolved", color: "bg-green-100 text-green-800", Icon: CheckCircle };
      default:
        return { text: "Unknown", color: "bg-gray-100 text-gray-800", Icon: FileText };
    }
  };

  if (loading) {
    return (
      <div className="text-center py-10">
        <p>Loading your disputes...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-12">
      <h1 className="text-3xl font-bold text-gray-800 mb-6 border-b pb-4">My Disputes</h1>
      {disputes.length === 0 ? (
        <p className="text-gray-500 text-center py-10">You have not filed any disputes.</p>
      ) : (
        <div className="space-y-6">
          {disputes.map((dispute) => {
            const { Icon, text, color } = getStatusInfo(dispute.status);
            const otherParty = dispute.filedBy.role === "student" ? dispute.sessionId.teacherId : dispute.sessionId.studentId;

            return (
              <div key={dispute._id} className="bg-white border border-gray-200 rounded-lg p-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="font-semibold text-lg text-gray-800">Dispute regarding session with {otherParty.fullName}</h2>
                    <p className="text-sm text-gray-500">Session Date: {new Date(dispute.sessionId.date).toLocaleDateString()}</p>
                    <p className="text-sm text-gray-500">Filed on: {new Date(dispute.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium ${color}`}>
                    <Icon size={16} />
                    {text}
                  </span>
                </div>

                <div className="mt-4 pt-4 border-t">
                  <h3 className="font-semibold text-gray-700">Reason: {dispute.reason}</h3>
                  <p className="text-gray-600 mt-2 text-sm bg-gray-50 p-3 rounded-md">{dispute.details}</p>
                </div>

                {dispute.status === "resolved" && dispute.resolution && (
                  <div className="mt-4 pt-4 border-t border-green-200">
                    <h3 className="font-semibold text-green-800">Admin's Resolution</h3>
                    <p className="text-gray-700 mt-2 text-sm bg-green-50 p-3 rounded-md">{dispute.resolution}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};

export default MyDisputes;
