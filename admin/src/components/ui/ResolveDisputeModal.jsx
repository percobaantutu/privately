import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button";

const ResolveDisputeModal = ({ isOpen, onClose, onSubmit, isLoading, dispute }) => {
  const [status, setStatus] = useState("");
  const [resolution, setResolution] = useState("");

  useEffect(() => {
    if (dispute) {
      setStatus(dispute.status);
      setResolution(dispute.resolution || "");
    }
  }, [dispute]);

  const handleSubmit = () => {
    onSubmit({ status, resolution });
  };

  if (!isOpen || !dispute) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg p-6 w-full max-w-2xl mx-auto" onClick={(e) => e.stopPropagation()}>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Resolve Dispute</h2>
            <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-100">
              <X size={20} />
            </button>
          </div>

          <div className="space-y-4 text-sm">
            <div className="p-4 bg-gray-50 rounded-lg border">
              <p>
                <span className="font-semibold">Filed By:</span> {dispute.filedBy.fullName} ({dispute.filedBy.role})
              </p>
              <p>
                <span className="font-semibold">Reason:</span> {dispute.reason}
              </p>
              <p className="mt-2">
                <span className="font-semibold">Details Provided:</span>
              </p>
              <blockquote className="border-l-4 pl-4 italic text-gray-600">{dispute.details}</blockquote>
            </div>

            <div>
              <label htmlFor="status" className="block text-sm font-medium text-gray-700 mb-1">
                Update Status
              </label>
              <select id="status" value={status} onChange={(e) => setStatus(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-lg bg-white">
                <option value="open">Open</option>
                <option value="under_review">Under Review</option>
                <option value="resolved">Resolved</option>
              </select>
            </div>

            <div>
              <label htmlFor="resolution" className="block text-sm font-medium text-gray-700 mb-1">
                Admin Resolution / Notes
              </label>
              <textarea
                id="resolution"
                rows="4"
                value={resolution}
                onChange={(e) => setResolution(e.target.value)}
                placeholder="Enter your final decision and any notes for this case..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary" onClick={handleSubmit} disabled={isLoading}>
              {isLoading ? "Saving..." : "Save Resolution"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ResolveDisputeModal;
