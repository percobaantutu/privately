import teacherModel from "../models/teacherModel.js";

const changeAvailability = async (req, res) => {
  try {
    const { teacherId } = req.body;

    const teacherData = await teacherModel.findById(teacherId);
    await teacherModel.findByIdAndUpdate(teacherId, {
      available: !teacherData.available,
    });
    res.status(200).json({ success: true, message: "Teacher availability changed successfully" });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

const teacherList = async (req, res) => {
  try {
    const teachers = await teacherModel.find({}).select("-password -email");
    res.status(200).json({ success: true, teachers });
  } catch (error) {
    console.log(error);
    res.status(500).json({ success: false, message: error.message });
  }
};

export { changeAvailability, teacherList };
