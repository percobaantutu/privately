import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./button";

const DisputeModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [reason, setReason] = useState("");
  const [details, setDetails] = useState("");
  const [error, setError] = useState("");

  const disputeReasons = ["Tutor did not show up", "Student did not show up", "Significant technical issues", "Session content was not as described", "Other"];

  const handleSubmit = () => {
    if (!reason || !details) {
      setError("Please select a reason and provide details about the issue.");
      return;
    }
    setError("");
    onSubmit({ reason, details });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg p-6 w-full max-w-lg mx-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-start gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-full mt-1">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <div>
              <h2 className="text-xl font-semibold text-gray-800">Report an Issue</h2>
              <p className="text-sm text-gray-500">Please provide details about the problem. Our team will review your case within 48 hours.</p>
            </div>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Reason Dropdown */}
            <div>
              <label htmlFor="reason" className="block text-sm font-medium text-gray-700 mb-1">
                Reason for Dispute
              </label>
              <select id="reason" value={reason} onChange={(e) => setReason(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-primary">
                <option value="" disabled>
                  -- Select a reason --
                </option>
                {disputeReasons.map((r) => (
                  <option key={r} value={r}>
                    {r}
                  </option>
                ))}
              </select>
            </div>

            {/* Details Text Area */}
            <div>
              <label htmlFor="details" className="block text-sm font-medium text-gray-700 mb-1">
                Details
              </label>
              <textarea
                id="details"
                rows="5"
                value={details}
                onChange={(e) => setDetails(e.target.value)}
                placeholder="Please describe the issue in as much detail as possible. Include specific times, what happened, and any other relevant information."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
            {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button variant="destructive" className="flex-1" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Submitting..." : "Submit Dispute"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default DisputeModal;
