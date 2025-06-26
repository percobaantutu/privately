// frontend/src/components/ui/ConfirmationModal.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { Button } from "./button"; // Assuming you have a reusable Button component

const ConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  const [sessionLink, setSessionLink] = useState("");
  const [error, setError] = useState("");

  const handleConfirm = () => {
    // Basic URL validation
    if (!sessionLink || !sessionLink.startsWith("http")) {
      setError("Please enter a valid URL (e.g., https://zoom.us/j/...)");
      return;
    }
    setError("");
    onConfirm(sessionLink);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg p-6 w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Confirm Session</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 transition-colors p-1 rounded-full hover:bg-gray-100" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">Please provide the video session link (Zoom, Google Meet, etc.) for this booking. The student will receive this link once you confirm.</p>
            <div>
              <label htmlFor="sessionLink" className="block text-sm font-medium text-gray-700 mb-1">
                Session Link
              </label>
              <input
                type="url"
                id="sessionLink"
                value={sessionLink}
                onChange={(e) => setSessionLink(e.target.value)}
                placeholder="https://..."
                className={`w-full px-3 py-2 border rounded-lg focus:outline-none focus:ring-2 ${error ? "border-red-500 ring-red-500" : "border-gray-300 focus:ring-primary"}`}
              />
              {error && <p className="text-red-600 text-xs mt-1">{error}</p>}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary" onClick={handleConfirm} disabled={isLoading}>
              {isLoading ? "Confirming..." : "Confirm & Send Link"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ConfirmationModal;
