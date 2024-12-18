const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const AppError = require("../utils/appError");
const catchAsync = require("../utils/catchAsync");

exports.createChat = catchAsync(async (req, res, next) => {
  const { chatName, isGroupChat, users, groupAdmin } = req.body;

  if (!chatName || !users || (isGroupChat && !groupAdmin)) {
    return next(new AppError("Missing required fields", 400));
  }

  const usersArray = Array.isArray(users) ? users : [users];
  const vaildUsers = await User.find({ _id: { $in: usersArray } });

  if (vaildUsers.length !== usersArray.length) {
    return next(new AppError("Invalid users id", 400));
  }

  const chatData = {
    chatName,
    isGroupChat: Boolean(isGroupChat),
    users: usersArray,
  };

  if (isGroupChat) {
    chatData.groupAdmin = groupAdmin;
  }
  const chat = await Chat.create(chatData);
  res.status(201).json({
    status: "success",
    data: {
      chat,
    },
  });
});

exports.getChats = catchAsync(async (req, res, next) => {
  let chats = await Chat.find({ users: { $in: [req.user._id] } })
    .populate("users")
    .populate("groupAdmin")
    .populate("lastMessage")
    .sort({ updateAt: -1 });

  res.status(200).json({
    status: "success",
    data: {
      chats,
    },
  });
});
