// frontend/src/components/ui/ReviewModal.jsx

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star } from "lucide-react";
import { Button } from "./button";

const ReviewModal = ({ isOpen, onClose, onSubmit, isLoading }) => {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleStarClick = (index) => {
    setRating(index);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert("Please select a star rating.");
      return;
    }
    onSubmit({ rating, comment });
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4" onClick={onClose}>
        <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }} className="bg-white rounded-lg p-6 w-full max-w-md mx-auto" onClick={(e) => e.stopPropagation()}>
          {/* Header */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold text-gray-800">Leave a Review</h2>
            <button onClick={onClose} className="text-gray-500 hover:text-gray-700 p-1 rounded-full hover:bg-gray-100" aria-label="Close">
              <X size={20} />
            </button>
          </div>

          {/* Content */}
          <div className="space-y-4">
            {/* Star Rating */}
            <div>
              <p className="text-sm font-medium text-gray-700 mb-2">Your Rating</p>
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((index) => (
                  <Star
                    key={index}
                    size={28}
                    className="cursor-pointer transition-colors"
                    color={hoverRating >= index || rating >= index ? "#ffc107" : "#e0e0e0"}
                    fill={hoverRating >= index || rating >= index ? "#ffc107" : "#e0e0e0"}
                    onMouseEnter={() => setHoverRating(index)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => handleStarClick(index)}
                  />
                ))}
              </div>
            </div>

            {/* Comment Box */}
            <div>
              <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-1">
                Your Comment (Optional)
              </label>
              <textarea
                id="comment"
                rows="4"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="Share your experience with this teacher..."
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <Button variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
              Cancel
            </Button>
            <Button className="flex-1 bg-primary" onClick={handleSubmit} disabled={isLoading || rating === 0}>
              {isLoading ? "Submitting..." : "Submit Review"}
            </Button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ReviewModal;
