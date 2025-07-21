import { AdminContext } from "@/context/AdminContext";
import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { Button } from "@/components/ui/button";

const Payouts = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const [pendingPayouts, setPendingPayouts] = useState([]);
  const [selectedPayouts, setSelectedPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);

  // Helper to format currency
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const fetchPendingPayouts = async () => {
    if (!aToken) return;
    setLoading(true);
    try {
      const { data } = await axios.get(`${backendUrl}/api/admin/payouts/pending`, { headers: { aToken } });
      if (data.success) {
        setPendingPayouts(data.payouts);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("Failed to fetch pending payouts.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPendingPayouts();
  }, [aToken]);

  const handleSelectPayout = (id) => {
    setSelectedPayouts((prev) => (prev.includes(id) ? prev.filter((pId) => pId !== id) : [...prev, id]));
  };

  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedPayouts(pendingPayouts.map((p) => p._id));
    } else {
      setSelectedPayouts([]);
    }
  };

  const handleProcessPayouts = async () => {
    if (selectedPayouts.length === 0) {
      toast.info("Please select at least one payout to process.");
      return;
    }
    setProcessing(true);
    try {
      const { data } = await axios.post(`${backendUrl}/api/admin/payouts/process`, { teacherProfileIds: selectedPayouts }, { headers: { aToken } });
      if (data.success) {
        toast.success(data.message);
        setSelectedPayouts([]);
        fetchPendingPayouts(); // Refresh the list
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error("An error occurred while processing payouts.");
    } finally {
      setProcessing(false);
    }
  };

  return (
    <div className="m-5 w-full">
      <h1 className="text-xl font-semibold text-gray-800">Pending Payouts</h1>
      <p className="text-sm text-gray-500 mt-1">Review and process weekly payouts for teachers who have met the minimum threshold.</p>

      <div className="mt-6 bg-white border rounded-lg shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-6 text-center text-gray-500">Loading...</p>
        ) : pendingPayouts.length === 0 ? (
          <p className="p-6 text-center text-gray-500">No pending payouts at the moment.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left">
                    <input type="checkbox" onChange={handleSelectAll} checked={selectedPayouts.length === pendingPayouts.length && pendingPayouts.length > 0} className="rounded" />
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tutor Name</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Pending Amount</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {pendingPayouts.map((payout) => (
                  <tr key={payout._id} className={`${selectedPayouts.includes(payout._id) ? "bg-blue-50" : ""}`}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <input type="checkbox" checked={selectedPayouts.includes(payout._id)} onChange={() => handleSelectPayout(payout._id)} className="rounded" />
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{payout.userId.fullName}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{payout.userId.email}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-700">{formatCurrency(payout.earnings)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      {pendingPayouts.length > 0 && (
        <div className="mt-6 flex justify-end">
          <Button onClick={handleProcessPayouts} disabled={processing || selectedPayouts.length === 0} className="bg-primary px-6 py-3">
            {processing ? "Processing..." : `Mark ${selectedPayouts.length} Selected as Paid`}
          </Button>
        </div>
      )}
    </div>
  );
};

export default Payouts;
