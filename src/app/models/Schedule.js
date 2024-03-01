const mongoose = require('mongoose');

const scheduleSchema = new mongoose.Schema({
  date: String,
  startTime: String,
  endTime: String,
  roomNumber: String,
  buildingName: String,
  className: String,
}, { timestamps: true });

const Schedule = mongoose.models.Schedule || mongoose.model('Schedule', scheduleSchema);

module.exports = Schedule;
