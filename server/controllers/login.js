const { User } = require("../models/user");
const bcrypt = require("bcrypt");
const Joi = require("joi");
const Token = require("../models/token");
const sendEmail = require("../utils/sendEmail");
const crypto = require("crypto");
const speakeasy = require("speakeasy");

const validate = (data) => {
  const schema = Joi.object({
    email: Joi.string().email().required().label("Email"),
    password: Joi.string().required().label("Password"),
    authenticatorToken: Joi.string().label("authenticatorToken"),
  });
  return schema.validate(data);
};

const postLogin = async (req, res) => {
  const { email, password, authenticatorToken } = req.body;
  try {
    const { error } = validate(req.body);
    if (error) {
      return res.status(400).send({ message: error.details[0].message });
    }

    const user = await User.findOne({ email: email });
    if (!user) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }

    if (!user.verified) {
      let token = await Token.findOne({ userId: user._id });
      if (!token) {
        token = await new Token({
          userId: user._id,
          token: crypto.randomBytes(32).toString("hex"),
        }).save();
        const url = `${"https://two-factor-frontend.vercel.app/"}users/${
          user.id
        }/verify/${token.token}`;
        await sendEmail(
          user.email,
          "Email Verification",
          `Click here to verify your email ${url}`
        );
      }
      return res.status(400).send({
        data: token,
        message:
          "An email has been sent to your account, check your email to get the qr code to login",
      });
    }

    var verified = speakeasy.totp.verify({
      secret: user.authenticatorSecret,
      encoding: "ascii",
      token: authenticatorToken,
    });

    if (!verified) {
      return res.status(401).send({ message: "Invalid Credentials" });
    }

    const token = user.generateAuthToken();
    return res.status(200).send({ data: token, message: "Logged in" });
  } catch (error) {
    console.log(error);
    res
      .status(500)
      .send({ message: "Something didn't work, try again later :(" });
  }
};

module.exports = {
  postLogin,
};
