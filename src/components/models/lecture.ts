import { Schema, model, models } from "mongoose";

const LectureSchema = new Schema({
  course_id: String,
  type: String,
  day_of_week: String,
  start_time: String,
  end_time: String,
  lecturer_id: String,
  students_ids: [String],
  // Add any other fields you might have
});

const lecture = models.lecture || model("lecture", LectureSchema);

export default lecture;