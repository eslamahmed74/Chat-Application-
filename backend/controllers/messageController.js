const Chat = require("../models/chatModel");
const Message = require("../models/messageModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createMessage = catchAsync(async (req, res, next) => {
  const { content, chatId } = req.body;

  if (!content || !chatId) {
    return next(new AppError("Please provide the required fields", 400));
  }

  const message = await Message.create({
    sender: req.user._id,
    content,
    chat: chatId,
  });

  await Chat.findByIdAndUpdate(chatId, { lastMessage: message._id });

  const fullMessage = await Message.findById(message._id)
    .populate("sender")
    .populate("chat");

  res.status(201).json({
    status: "success",
    data: {
      fullMessage,
    },
  });
});

exports.getMessages = catchAsync(async (req, res, next) => {
  const chatId = req.params.chatId;

  const message = await Message.find({ chat: chatId })
    .populate("sender")
    .populate("chat");

  res.status(200).json({
    status: "success",
    data: {
      message,
    },
  });
});
