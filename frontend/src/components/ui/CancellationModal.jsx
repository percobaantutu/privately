// frontend/src/components/ui/CancellationModal.jsx

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, AlertTriangle } from "lucide-react";
import { Button } from "./button";

const CancellationModal = ({ isOpen, onClose, onConfirm, isLoading, cancellationInfo }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg p-6 w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex items-center gap-3 mb-4">
            <div className="bg-red-100 p-2 rounded-full">
              <AlertTriangle className="text-red-600" size={24} />
            </div>
            <h2 className="text-xl font-semibold text-gray-800">Confirm Cancellation</h2>
          </div>

          {/* Content */}
          <div className="space-y-4">
            <p className="text-sm text-gray-600">You are about to cancel your session. Please review the cancellation policy consequences below before confirming.</p>
            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded-r-lg">
              <p className="font-semibold text-yellow-800">Policy Details:</p>
              <p className="text-sm text-yellow-700 mt-1">{cancellationInfo.message}</p>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Go Back
            </Button>
            <Button variant="destructive" className="flex-1" onClick={onConfirm} disabled={isLoading}>
              {isLoading ? "Cancelling..." : "I Understand, Cancel"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default CancellationModal;
