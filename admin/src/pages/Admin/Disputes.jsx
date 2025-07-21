import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { AdminContext } from "@/context/AdminContext";
import ResolveDisputeModal from "@/components/ui/ResolveDisputeModal";
import { Button } from "@/components/ui/button";

const Disputes = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [disputes, setDisputes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDispute, setSelectedDispute] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const fetchDisputes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/disputes/admin/all`, { headers: { aToken } });
      if (data.success) {
        setDisputes(data.disputes);
      } else {
        toast.error("Failed to fetch disputes.");
      }
    } catch (error) {
      toast.error("An error occurred while fetching disputes.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (aToken) {
      fetchDisputes();
    }
  }, [aToken]);

  const handleOpenModal = (dispute) => {
    setSelectedDispute(dispute);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedDispute(null);
    setIsModalOpen(false);
  };

  const handleResolveDispute = async ({ status, resolution }) => {
    if (!selectedDispute) return;
    setIsSubmitting(true);
    try {
      const { data } = await axios.put(`${backendUrl}/api/disputes/admin/${selectedDispute._id}/resolve`, { status, resolution }, { headers: { aToken } });
      if (data.success) {
        toast.success("Dispute updated successfully!");
        fetchDisputes(); // Refresh the list
        handleCloseModal();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to resolve dispute.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const getStatusClass = (status) => {
    switch (status) {
      case "open":
        return "bg-red-100 text-red-800";
      case "under_review":
        return "bg-yellow-100 text-yellow-800";
      case "resolved":
        return "bg-green-100 text-green-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <>
      <ResolveDisputeModal isOpen={isModalOpen} onClose={handleCloseModal} onSubmit={handleResolveDispute} isLoading={isSubmitting} dispute={selectedDispute} />
      <div className="m-5 w-full">
        <h1 className="text-xl font-semibold text-gray-800">Dispute Management</h1>
        <p className="text-sm text-gray-500 mt-1">Review and resolve issues reported by users.</p>

        <div className="mt-6 bg-white border rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <p className="p-6 text-center text-gray-500">Loading disputes...</p>
          ) : disputes.length === 0 ? (
            <p className="p-6 text-center text-gray-500">There are no open disputes.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date Filed</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Filed By</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Reason</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {disputes.map((dispute) => (
                    <tr key={dispute._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(dispute.createdAt).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {dispute.filedBy.fullName} ({dispute.filedBy.role})
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700">{dispute.reason}</td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(dispute.status)}`}>{dispute.status.replace("_", " ")}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <Button variant="outline" size="sm" onClick={() => handleOpenModal(dispute)}>
                          Review / Resolve
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Disputes;
