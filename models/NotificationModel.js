const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  image: { type: String, required: true },
  text: { type: String, required: true },
  link: { type: String, required: true } // Không cần giá trị mặc định
});

const Notification = mongoose.model('Notification', notificationSchema);

module.exports = Notification;
