require('dotenv').config(); 

const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const Notification = require('./models/NotificationModel');
const ChatId = require('./models/ChatIdModel');

const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 5000;

mongoose.connect('mongodb+srv://quangdeptraino1:NmhcLf3bffPzWLuu@cluster0.q951owo.mongodb.net/admin-bot', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Middleware để cho phép Express hiểu JSON từ yêu cầu và xử lý urlencoded data
app.use(bodyParser.json({ limit: '10mb' }));
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }));
app.use(cors());

app.get('/api/notifications', async (req, res) => {
  try {
    const notifications = await Notification.find(); // Lấy tất cả thông báo từ cơ sở dữ liệu
    res.json(notifications);
  } catch (error) {
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi lấy thông báo.', error: error.message });
  }
});

// Route POST để tạo thông báo mới
app.post('/api/notifications', async (req, res) => {
  try {
    // Lấy thông tin từ yêu cầu
    const { image, text, link } = req.body;

    // Tạo mới document Notification và lưu vào cơ sở dữ liệu
    const notification = new Notification({
      image,
      text,
      link
    });

    // Lưu thông báo vào cơ sở dữ liệu
    const savedNotification = await notification.save();

    res.json(savedNotification);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

app.get('/api/chatid', async (req, res) => {
  try {
    const chatIds = await ChatId.find(); // Lấy tất cả các chat ID từ cơ sở dữ liệu
    res.json(chatIds);
  } catch (error) {
    res.status(500).json({ message: 'Đã có lỗi xảy ra khi lấy chat ID.', error: error.message });
  }
});

// Khởi động máy chủ
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
