import Booking from "../models/Booking.js";
import teacherModel from "../models/teacherModel.js";

// Create a new booking
export const createBooking = async (req, res) => {
  try {
    const { teacherId, date, startTime, duration, type, notes } = req.body;
    const studentId = req.user._id; // From auth middleware

    // Calculate end time
    const [hours, minutes] = startTime.split(":");
    const endTime = new Date(date);
    endTime.setHours(parseInt(hours));
    endTime.setMinutes(parseInt(minutes) + duration);
    const endTimeString = endTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    // Get teacher's fee
    const teacher = await teacherModel.findById(teacherId);
    if (!teacher) {
      return res.status(404).json({ message: "Teacher not found" });
    }

    // Check for booking conflicts
    const existingBooking = await Booking.findOne({
      teacherId,
      date,
      startTime,
      status: { $in: ["pending", "confirmed"] },
    });

    if (existingBooking) {
      return res.status(400).json({ message: "This time slot is already booked" });
    }

    // Create new booking
    const booking = new Booking({
      teacherId,
      studentId,
      date,
      startTime,
      endTime: endTimeString,
      duration,
      price: teacher.fees,
      type,
      notes,
    });

    await booking.save();

    res.status(201).json({
      success: true,
      message: "Booking created successfully",
      booking,
    });
  } catch (error) {
    console.error("Booking creation error:", error);
    res.status(500).json({ message: "Error creating booking", error: error.message });
  }
};

// Get user's bookings
export const getUserBookings = async (req, res) => {
  try {
    const userId = req.user._id;
    const bookings = await Booking.find({ studentId: userId })
      .populate("teacherId", "name image speciality", "teacher")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get bookings error:", error);
    res.status(500).json({ message: "Error fetching bookings", error: error.message });
  }
};

// Get teacher's bookings
export const getTeacherBookings = async (req, res) => {
  try {
    const teacherId = req.user._id;
    const bookings = await Booking.find({ teacherId })
      .populate("studentId", "name email")
      .sort({ date: 1, startTime: 1 });

    res.status(200).json({
      success: true,
      bookings,
    });
  } catch (error) {
    console.error("Get teacher bookings error:", error);
    res.status(500).json({ message: "Error fetching teacher bookings", error: error.message });
  }
};

// Update booking status
export const updateBookingStatus = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const { status } = req.body;

    const booking = await Booking.findById(bookingId);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user has permission to update
    if (booking.studentId.toString() !== req.user._id.toString() && 
        booking.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to update this booking" });
    }

    booking.status = status;
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking status updated successfully",
      booking,
    });
  } catch (error) {
    console.error("Update booking status error:", error);
    res.status(500).json({ message: "Error updating booking status", error: error.message });
  }
};

// Cancel booking
export const cancelBooking = async (req, res) => {
  try {
    const { bookingId } = req.params;
    const booking = await Booking.findById(bookingId);

    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    // Check if user has permission to cancel
    if (booking.studentId.toString() !== req.user._id.toString() && 
        booking.teacherId.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Not authorized to cancel this booking" });
    }

    // Check if booking can be cancelled (e.g., not too close to start time)
    const bookingDate = new Date(booking.date);
    const now = new Date();
    const hoursUntilBooking = (bookingDate - now) / (1000 * 60 * 60);

    if (hoursUntilBooking < 24) {
      return res.status(400).json({ 
        message: "Bookings can only be cancelled at least 24 hours before the session" 
      });
    }

    booking.status = "cancelled";
    await booking.save();

    res.status(200).json({
      success: true,
      message: "Booking cancelled successfully",
      booking,
    });
  } catch (error) {
    console.error("Cancel booking error:", error);
    res.status(500).json({ message: "Error cancelling booking", error: error.message });
  }
}; 