const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');

// Register a user     => /api/v1/registers
exports.registerUser = catchAsyncErrors(async (req, res, next) => {
  const {name, email, password} = req.body;

  const user = await User.create({
    name,
    email,
    password,
    avatar: {
      public_id: 'rDEOVtE7vOs',
      url: 'https://unsplash.com/photos/rDEOVtE7vOs',
    },
  });

  sendToken(user, 200, res);

});

// Login User   =>    /api/v1/Login
exports.loginUser = catchAsyncErrors(async (req, res, next) => {
  const {email, password} = req.body;

  // Checks if email and password is entered by user
  if (!email || !password) {
    return next(new ErrorHandler('Please enter email and password', 400));
  }

  // Finding user in database
  // Use the select method cuz in user model ('./models/user.js), i have specified the select to false, so i cannot select the password here for that.
  const user = await User.findOne({email}).select('+password');

  if (!user) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }

  // Checks if password is correct or not
  const isPasswordMatched = await user.comparePassword(password);

  if (!isPasswordMatched) {
    return next(new ErrorHandler('Invalid email or password', 401));
  }


  sendToken(user, 200, res);
});
