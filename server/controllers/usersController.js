const User=require("../model/userModel");
const bcrypt= require("bcrypt");

module.exports.login = async (req, res, next) => {
    try {
      const { username, password } = req.body;
      console.log(req.body);
      const user = await User.findOne({ username });
      if (!user)
        return res.json({ msg: "نام کاربری یا گذرواژه اشتباه است", status: false });
      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid)
        return res.json({ msg: "نام کاربری یا گذرواژه اشتباه است", status: false });
      delete user.password;
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
  };
  
 
  module.exports.register = async (req, res, next) => {
    try {
      const { username, email, password } = req.body;
      const usernameCheck = await User.findOne({ username });
      if (usernameCheck)
        return res.json({ msg: "نام کاربری قبلاً استفاده شده است", status: false });
      const emailCheck = await User.findOne({ email });
      if (emailCheck)
        return res.json({ msg: "ایمیل قبلا استفاده شده است", status: false });
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({
        email,
        username,
        password: hashedPassword,
      });
      delete user.password;
      return res.json({ status: true, user });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.setAvatar = async (req, res, next) => {
    try {
      const userId = req.params.id;
      const avatarImage = req.body.image;
      const userData = await User.findByIdAndUpdate(
        userId,
        {
          isAvatarImageSet: true,
          avatarImage,
        },
        { new: true }
      );
      return res.json({
        isSet: userData.isAvatarImageSet,
        image: userData.avatarImage,
      });
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.logOut = (req, res, next) => {
    try {
      if (!req.params.id) return res.json({ msg: "شناسه کاربری مورد نیاز است" });
      onlineUsers.delete(req.params.id);
      return res.status(200).send();
    } catch (ex) {
      next(ex);
    }
  };

  module.exports.getAllUsers = async (req, res, next) => {
    try {
      const users = await User.find({ _id: { $ne: req.params.id } }).select([
        "email",
        "username",
        "avatarImage",
        "_id",
      ]);
      return res.json(users);
    } catch (ex) {
      next(ex);
    }
  };