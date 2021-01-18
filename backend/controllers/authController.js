const User = require('../models/user');

const ErrorHandler = require('../utils/errorHandler');
const catchAsyncErrors = require('../middlewares/catchAsyncErrors');
const sendToken = require('../utils/jwtToken');
const sendEmail = require('../utils/sendEmail');

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

// Forgot Password  => /api/v1/password/forgot
exports.forgotPassword = catchAsyncErrors(async (req, res, next) => {
  const user = await User.findOne({email: req.body.email});

  if (!user) {
    return next(new ErrorHandler('User not found with this email'), 404);
  }

  // Get reset token
  const resetToken = user.getResetPasswordToken();

  await user.save({validateBeforeSave: false});

  // Create reset password url
  const resetUrl = `${req.protocol}://${req.get('host')}/api/v1/password/reset/${resetToken}`;

  const message = `Your password reset token is as follow:\n\n${resetUrl}\n\nIf you have not requested this email, then ignore it.`

  try {

    await sendEmail({
      email: user.email,
      subject: 'Your password reset',
      message
    })

    res.status(200).json({
      success: true,
      message: `Email sent to: ${user.email}`
    })

  } catch (error){
    user.resetPasswordToken = undefined;
    user.resetPasswordExpire = undefined;

    await user.save({validateBeforeSave: false});

    return next(new ErrorHandler(error.message, 500))

  }
});

// Logout user    =>    /api/v1/logout
exports.logout = catchAsyncErrors(async (req, res, next) => {
  res.cookie('token', null, {
    expires: new Date(Date.now()),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    message: 'Logged out',
  });
});
