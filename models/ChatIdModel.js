// models/ChatIdModel.js
const mongoose = require('mongoose');

const chatIdSchema = new mongoose.Schema({
  chatId: { type: String, required: true, unique: true },
  time: { type: Date, default: Date.now } // Thêm trường time với giá trị mặc định là ngày hiện tại
});

// Tạo index cho trường time
chatIdSchema.index({ time: 1 });

const ChatId = mongoose.model('ChatId', chatIdSchema);

module.exports = ChatId;
