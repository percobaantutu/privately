// admin/src/pages/Admin/Dashboard.jsx

import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AdminContext } from "@/context/AdminContext";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Users, UserCheck, ShieldAlert, Banknote } from "lucide-react";
import { Button } from "@/components/ui/button";

// Stat Card Component
const StatCard = ({ icon, title, value, color, onClick }) => (
  <div onClick={onClick} className={`p-5 rounded-lg shadow-sm flex items-center gap-4 cursor-pointer transition-transform hover:scale-105 ${color}`}>
    <div className="p-3 bg-white/30 rounded-full">{icon}</div>
    <div>
      <p className="text-sm text-white/90">{title}</p>
      <p className="text-2xl font-bold text-white">{value}</p>
    </div>
  </div>
);

// List Item Component for quick actions
const ActionListItem = ({ primaryText, secondaryText, buttonText, onButtonClick }) => (
  <div className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-md">
    <div>
      <p className="text-sm font-semibold text-gray-800">{primaryText}</p>
      <p className="text-xs text-gray-500">{secondaryText}</p>
    </div>
    <Button onClick={onButtonClick} size="sm" variant="outline">
      {buttonText}
    </Button>
  </div>
);

const Dashboard = () => {
  const { backendUrl, aToken } = useContext(AdminContext);
  const navigate = useNavigate();
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(true);

  const formatCurrency = (amount) => new Intl.NumberFormat("id-ID", { style: "currency", currency: "IDR", minimumFractionDigits: 0 }).format(amount);

  useEffect(() => {
    const fetchSummary = async () => {
      try {
        const { data } = await axios.get(`${backendUrl}/api/admin/dashboard-summary`, { headers: { aToken } });
        if (data.success) {
          setSummary(data.summary);
        }
      } catch (error) {
        toast.error("Failed to load dashboard data.");
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [aToken, backendUrl]);

  if (loading) {
    return (
      <div className="flex items-center justify-center w-full h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!summary) {
    return <div className="p-8 text-center text-red-500">Could not load dashboard data.</div>;
  }

  return (
    <div className="p-8 w-full space-y-8">
      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard icon={<Users size={24} className="text-white" />} title="Active Teachers" value={summary.activeTeachersCount} color="bg-blue-500" onClick={() => navigate("/teacher-list")} />
        <StatCard icon={<UserCheck size={24} className="text-white" />} title="Pending Verification" value={summary.pendingTeachersCount} color="bg-orange-500" onClick={() => navigate("/verification")} />
        <StatCard icon={<ShieldAlert size={24} className="text-white" />} title="Open Disputes" value={summary.openDisputesCount} color="bg-red-500" onClick={() => navigate("/disputes")} />
        <StatCard icon={<Banknote size={24} className="text-white" />} title="Pending Payouts" value={formatCurrency(summary.pendingPayoutsAmount)} color="bg-green-500" onClick={() => navigate("/payouts")} />
      </div>

      {/* Actionable Widgets */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Verification Requests */}
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Recent Verification Requests</h3>
            <Button variant="link" size="sm" onClick={() => navigate("/verification")}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {summary.recentPendingTeachers.length > 0 ? (
              summary.recentPendingTeachers.map((teacher) => (
                <ActionListItem
                  key={teacher._id}
                  primaryText={teacher.fullName}
                  secondaryText={teacher.email}
                  buttonText="Verify"
                  onButtonClick={() => navigate("/verification")} // Or navigate(`/teacher-details/${teacher._id}`)
                />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center p-4">No new verification requests.</p>
            )}
          </div>
        </div>

        {/* Latest Open Disputes */}
        <div className="bg-white p-5 rounded-lg shadow-sm border">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold text-gray-700">Latest Open Disputes</h3>
            <Button variant="link" size="sm" onClick={() => navigate("/disputes")}>
              View All
            </Button>
          </div>
          <div className="space-y-2">
            {summary.recentOpenDisputes.length > 0 ? (
              summary.recentOpenDisputes.map((dispute) => (
                <ActionListItem key={dispute._id} primaryText={`Filed by: ${dispute.filedBy.fullName}`} secondaryText={`Reason: ${dispute.reason}`} buttonText="Review" onButtonClick={() => navigate("/disputes")} />
              ))
            ) : (
              <p className="text-sm text-gray-500 text-center p-4">No open disputes.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
