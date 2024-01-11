const bcrypt = require("bcrypt");
const { User, validateUser } = require("../models/user");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const spekeasy = require("speakeasy");
const qrcode = require("qrcode");

const postRegister = async (req, res) => {
  const { email, password } = req.body;
  try {
    const { error } = validateUser(req.body);
    if (error) {
      console.log(error);
      return res.status(400).send({ message: error.details[0].message });
    }
    let user = await User.findOne({ email: email });

    if (user) {
      return res.status(409).send({
        message: "There is already a user with those credentials registered",
      });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    let secret = spekeasy.generateSecret({
      name: process.env.QR_SECRET,
    });

    user = await new User({
      ...req.body,
      password: hashedPassword,
      authenticatorSecret: secret.ascii,
    }).save();

    const token = await new Token({
      userId: user._id,
      token: crypto.randomBytes(32).toString("hex"),
    }).save();

    const url = `${process.env.BASE_URL}users/${user.id}/verify/${token.token}`;

    qrcode.toString(secret.otpauth_url, async function (err, data) {
      if (err) {
        console.log(err);
        return res
          .status(500)
          .send({ message: "Something didn't work, try again later :(" });
      }
      await sendEmail(
        user.email,
        "Email Verification",
        `Click here to verify your email ${url} and then scan the qr code with Google Authenticator to use two factor authentication and use your account!`,
        data
      );
      return res.status(201).send({
        message:
          "An email has been sent to your account, check your email to complete the registration process",
      });
    });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something didn't work, try again later :(" });
  }
};

const getVerify = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.params.id });
    if (!user) {
      return res
        .status(400)
        .send({ message: "Invalid link, you shouldn't be here :/" });
    }

    const token = await Token.findOne({
      userId: user._id,
      token: req.params.token,
    });
    if (!token) {
      return res
        .status(400)
        .send({ message: "Invalid link, you shouldn't be here :/" });
    }
    await User.updateOne({ _id: user._id }, { verified: true });
    await Token.findOneAndRemove({ _id: token._id });

    return res.status(200).send({ message: "Email verified" });
  } catch (error) {
    console.log(error);
    return res
      .status(500)
      .send({ message: "Something didn't work, try again later :(" });
  }
};

module.exports = {
  postRegister,
  getVerify,
};
