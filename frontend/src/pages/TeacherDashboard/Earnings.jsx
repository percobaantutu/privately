// frontend/src/pages/TeacherDashboard/Earnings.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "../../utils/axios";
import { toast } from "react-toastify";
import { AppContext } from "@/context/AppContext";
import { DollarSign, Wallet, CalendarClock } from "lucide-react";

const Earnings = () => {
  const { backendUrl, currencySymbol } = useContext(AppContext);
  const [earningsData, setEarningsData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/teachers/me/earnings`);
        if (data.success) {
          setEarningsData(data.earningsData);
        }
      } catch (error) {
        toast.error("Failed to fetch earnings data.");
        console.error("Earnings fetch error:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchEarnings();
  }, [backendUrl]);

  if (loading) {
    return <div className="p-8 text-center">Loading earnings data...</div>;
  }

  if (!earningsData) {
    return <div className="p-8 text-center text-red-500">Could not load earnings data.</div>;
  }

  const StatCard = ({ icon, title, value, color }) => (
    <div className={`p-6 rounded-lg shadow-md flex items-start gap-4 ${color}`}>
      <div className="p-3 bg-white/30 rounded-full">{icon}</div>
      <div>
        <p className="text-sm text-white/90">{title}</p>
        <p className="text-2xl font-bold text-white">{value}</p>
      </div>
    </div>
  );

  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-bold text-gray-800">My Earnings</h1>

      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard icon={<Wallet size={24} className="text-white" />} title="Total Earnings" value={`${currencySymbol}${earningsData.totalEarnings.toFixed(2)}`} color="bg-green-500" />
        <StatCard icon={<DollarSign size={24} className="text-white" />} title="Pending Payout" value={`${currencySymbol}${earningsData.pendingPayout.toFixed(2)}`} color="bg-blue-500" />
        <StatCard
          icon={<CalendarClock size={24} className="text-white" />}
          title="Next Payout Date"
          value={new Date(earningsData.nextPayoutDate).toLocaleDateString("en-GB", {
            day: "numeric",
            month: "short",
            year: "numeric",
          })}
          color="bg-orange-500"
        />
      </div>

      {/* Transactions Table */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Transaction History</h2>
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Student</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Session Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Commission (5%)</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">You Earned</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {earningsData.transactions.length > 0 ? (
                  earningsData.transactions.map((session) => (
                    <tr key={session._id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{new Date(session.date).toLocaleDateString()}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{session.studentId.fullName}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {currencySymbol}
                        {session.price.toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-red-500">
                        - {currencySymbol}
                        {(session.price * 0.05).toFixed(2)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-green-600">
                        {currencySymbol}
                        {(session.price * 0.95).toFixed(2)}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-6 py-4 text-center text-sm text-gray-500">
                      No completed sessions yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Earnings;
