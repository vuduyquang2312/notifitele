require('dotenv').config();
const { Telegraf, Markup } = require('telegraf');
const mongoose = require('mongoose');
const axios = require('axios');
const ChatId = require('./models/ChatIdModel'); // Import ChatId model

const bot = new Telegraf(process.env.BOT_TOKEN);

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB', err));

// Biến toàn cục để lưu ID của thông báo cuối cùng đã gửi
let lastNotificationId = null;

// Function to fetch the latest notification and send to user
const sendLatestNotification = async (ctx) => {
  try {
    const response = await axios.get('http://localhost:5000/api/notifications'); // URL của server
    const notifications = response.data;

    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1]; // Lấy thông báo mới nhất
      const { _id, image, text, link } = latestNotification;
      const message = `${text}\n\n`;

      if (_id !== lastNotificationId) {
        ctx.replyWithPhoto({ source: Buffer.from(image, 'base64') }, {
          caption: message,
          reply_markup: {
            inline_keyboard: [
              [{ text: 'Đăng kí ngay', url: link }]
            ]
          }
        });

        // Cập nhật ID của thông báo cuối cùng đã gửi
        lastNotificationId = _id;
      }
    } else {
      ctx.reply('Hiện tại không có thông báo nào.');
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
    ctx.reply('Đã có lỗi xảy ra khi lấy thông báo.');
  }
};

// Function to send the latest notification to all chat IDs in the database
const sendLatestNotificationToAll = async () => {
  try {
    const response = await axios.get('http://localhost:5000/api/notifications');
    const notifications = response.data;

    if (notifications.length > 0) {
      const latestNotification = notifications[notifications.length - 1]; // Lấy thông báo mới nhất
      const { _id, image, text, link } = latestNotification;
      const message = `${text}\n\n`;

      if (_id !== lastNotificationId) {
        const chatIds = await ChatId.find();

        chatIds.forEach(chatIdObj => {
          const chatId = chatIdObj.chatId;

          bot.telegram.sendPhoto(chatId, { source: Buffer.from(image, 'base64') }, {
            caption: message,
            reply_markup: {
              inline_keyboard: [
                [{ text: 'Đăng kí ngay', url: link }]
              ]
            }
          }).catch(error => console.error(`Failed to send notification to chat ID ${chatId}:`, error));
        });

        // Cập nhật ID của thông báo cuối cùng đã gửi
        lastNotificationId = _id;
      }
    }
  } catch (error) {
    console.error('Failed to fetch notifications:', error);
  }
};

// Xử lý lệnh /start
bot.start(async (ctx) => {
  const chatId = ctx.chat.id.toString();

  try {
    const existingChatId = await ChatId.findOne({ chatId });

    if (!existingChatId) {
      const newChatId = new ChatId({ chatId });
      await newChatId.save();
    } else {
      // Nếu chatId đã tồn tại, cập nhật thời gian
      existingChatId.time = Date.now();
      await existingChatId.save();
    }

    // Lấy dữ liệu thông báo mới nhất và gửi cho người dùng
    await sendLatestNotification(ctx);

  } catch (error) {
    console.error('Failed to save chat ID:', error);
    ctx.reply('Đã có lỗi xảy ra khi lưu Chat ID của bạn.');
  }
});

// Kiểm tra dữ liệu mới mỗi phút
setInterval(async () => {
  await sendLatestNotificationToAll();
}, 1000); // 60,000 milliseconds = 1 minute

// Khởi động bot
bot.launch()
  .then(() => console.log('Bot đã được khởi động'))
  .catch(err => console.error('Lỗi khi khởi động bot', err));
