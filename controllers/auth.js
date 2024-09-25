import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { customAlphabet, nanoid } from "nanoid"

import { sendForgotPassword } from "../services/emails/sendEmails.js"
import ForgotPassword from "../models/forgotPassword.js"
import SocialAuth from "../models/socialAuth.js"
import User from "../models/user.js"
import generateToken from "../services/generateToken.js"
import { getMatchPassword, hashPassword } from "../services/password.js"
import config from "../config.js"

const signIn = async (req, res) => {
  const { email, password } = req.body
  try {
    const matchUser = await User.findOne({ email })
    if (!matchUser) {
      res.status(404).json({ message: "Incorrect login" })
    } else {
      const matchPassword = await getMatchPassword(password, matchUser.password)
      if (matchPassword) {
        const newToken = generateToken(matchUser._id, "1h");
        const newRefreshToken = generateToken(matchUser._id, "14d");
        await User.findByIdAndUpdate(matchUser._id, { lastActive: new Date() })
        res.status(200).json({ token: newToken, refresh: newRefreshToken })
      } else {
        res.status(401).json({ message: "Incorrect password" })
      }
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
}
const googleVerifyCallback = async (accessToken, refreshToken, profile, done) => {
  try {
    const candidate = await User.findOne({ email: profile.emails[0].value }, { _id: 1, photo: 1 });
    if (candidate) {
      await User.findByIdAndUpdate(candidate._id, { lastActive: new Date() })
      if (!candidate.photo) {
        await User.findOneAndUpdate(
          { _id: candidate._id },
          { photo: profile.photos[0].value }
        );
      }
      const token = generateToken(candidate._id, "1h");
      const newRefreshToken = generateToken(candidate._id, "14d");
      const newSocialAuth = new SocialAuth({
        id: profile.id,
        token,
        refreshToken: newRefreshToken
      });
      await newSocialAuth.save();
      return done(null, { id: profile.id, token, refresh: newRefreshToken });
    } else {
      const newUser = new User({
        name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        googleAuth: profile.id
      });
      await newUser.save();
      const token = generateToken(newUser._id, "1h");
      const newRefreshToken = generateToken(newUser._id, "14d");
      const newSocialAuth = new SocialAuth({
        id: profile.id,
        token,
        refreshToken: newRefreshToken
      });
      await newSocialAuth.save();
      return done(null, { id: profile.id, token: token, refresh: newRefreshToken });
    }
  } catch (e) {
    console.error(e);
    return done(e);
  }
};

const facebookVerifyCallback = async (accessToken, refreshToken, profile, done) => {
  const { id, emails, name, photos } = profile;
  try {
    const candidate = await User.findOne({ email: emails[0].value }, { _id: 1, photo }).lean()
    if (candidate) {
      await User.findByIdAndUpdate(candidate._id, { lastActive: new Date() })
      if (!candidate.photo) {
        candidate.photo = photos[0].value
        await candidate.save()
      }
      const token = generateToken(candidate._id, "1h")
      const refreshToken = generateToken(candidate._id, "14d")
      const newSocialAuth = new SocialAuth({
        id, token, refreshToken
      })
      await newSocialAuth.save()
    } else {
      const newUser = new User({
        name: name.givenName,
        last_name: name.familyName,
        email: emails[0].value,
        photo: photos[0].value,
        facebookAuth: profile.id
      })
      await newUser.save()
      const token = generateToken(newUser._id, "1h")
      const refreshToken = generateToken(newUser._id, "14d")
      const newSocialAuth = new SocialAuth({
        id, token, refreshToken
      })
      await newSocialAuth.save()
    }
  } catch (e) {
    console.error(e)
  }
}

const appleVerifyCallback = async (req, accessToken, refreshToken, idToken, profile, done) => {
  try {
    const candidate = await User.findOne({ email: profile.email }, { _id: 1, photo: 1 }).lean()
    if (candidate) {
      await User.findByIdAndUpdate(candidate._id, { lastActive: new Date() })
      if (!candidate.photo) {
        await User.findOneAndUpdate(
          { _id: candidate._id },
          { photo: profile.photos[0].value }
        )
      }
      const token = generateToken(candidate._id, "1h")
      const refreshToken = generateToken(candidate._id, "14d")
      const socialAuth = new SocialAuth({
        id: profile.id,
        token, refreshToken
      })
      await socialAuth.save()
      return done(null, { id: profile.id, token, refreshToken })
    } else {
      const newUser = new User({
        name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.email,
        photo: profile.photos[0].value,
        appleAuth: profile.id
      })
      await newUser.save()
      const token = generateToken(newUser._id, "1h")
      const refreshToken = generateToken(newUser._id, "14d")
      const newSocialAuth = new SocialAuth({
        id: profile.id,
        token, refreshToken
      })
      await newSocialAuth.save()
      return done(null, { id: profile.id, token, refreshToken })
    }
  } catch (e) {

  }
}

const signUp = async (req, res) => {
  const { name, email, phone, password } = req.body
  try {
    const matchUser = await User.findOne({ email }).lean()
    if (matchUser) {
      res.status(400).json({ message: 'User already exists' })
    } else {
      const hashedPassword = await hashPassword(password)
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword
      })
      await newUser.save()
      const newToken = generateToken(newUser._id, "1d")
      const refreshToken = generateToken(newUser._id, "14d")
      res.status(201).json({ token: newToken, refresh: refreshToken })
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
}

const getInfo = async (req, res) => {
  try {
    const candidate = await User.findById(req.id,
      {
        name: 1,
        last_name: 1,
        email: 1,
        photo: 1,
        phone: 1,
        address: 1,
        company: 1,
        role: 1,
        manufacturer: 1
      }).lean()
    if (candidate) {
      res.status(200).json(candidate)
    } else {
      res.status(404).json({
        message: "User not found"
      })
    }
  } catch (e) {
    console.error(e)
    res.status(500).send('Server error')
  }
}

const refreshToken = async (req, res) => {
  const { refresh } = req.body
  if (!refresh) {
    res.status(400).json({
      message: "No refresh token"
    })
  }
  try {
    const { id } = jwt.verify(refresh, config.jwtSecret)
    const candidate = await User.findById(id)
    if (candidate) {
      const newToken = generateToken(candidate._id, "1d")
      res.status(200).json({
        token: newToken
      })
    } else {
      res.status(404).json({
        message: "User not found"
      })
    }
  } catch (e) {
    console.error(e)
    res.status(500).json(e)
  }
}

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const matchUser = await User.findOne({ email }, { _id: 1, first_name: 1 });
    if (matchUser) {
      const protectedCode = customAlphabet('123456789', 6)();
      const newReqChangePass = new ForgotPassword({
        email,
        first_name: matchUser.first_name,
        code: protectedCode,
        userId: matchUser._id,
      });

      try {
        await newReqChangePass.save();
        await sendForgotPassword(newReqChangePass)
        res.status(201).json({ message: "Password reset request created", userId: matchUser._id });
      } catch (e) {
        res.status(500).json({ error: "Failed to create password reset request" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
};

const checkForgotLink = async (req, res) => {
  const { code, userId, password } = req.body
  try {
    const candidate = await User.findById(userId, { _id: 1 }).lean()
    if (candidate) {
      const forgotPassword = await ForgotPassword.findOne({ userId, code }).lean()
      if (forgotPassword) {
        const hashedPassword = await hashPassword(password)
        await ForgotPassword.deleteOne({ userId })
        await User.findByIdAndUpdate(candidate._id, { password: hashedPassword })
        res.status(200).json({ message: "Password has been updated" });
      } else {
        res.status(404).json({ error: "Invalid or expired link" });
      }
    } else {
      res.status(404).json({ error: "User not found" });
    }
  } catch (e) {
    res.status(500).json({ error: "Server error" });
  }
}

const changePassword = async (req, res) => {
  const { token, password } = req.body
  try {
    const { userId } = jwt.verify(token, config.jwtSecret)
    if (userId) {
      const hashedPassword = await hashPassword(password)
      await User.findByIdAndUpdate(userId, { password: hashedPassword })
      res.status(200).json({
        message: "Password has been updated"
      })
    } else {
      res.status(500).json({
        message: "Invalid token"
      })
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error"
    })
  }
}

const getTokens = async (req, res) => {
  const { id } = req.query;
  try {
    const authCandidate = await SocialAuth.findOne({ id }, { id: 1, token: 1, refreshToken: 1 }).lean();
    if (authCandidate) {
      setTimeout(async () => {
        try {
          await SocialAuth.deleteOne({ id: authCandidate.id });
        } catch (deleteError) {
          console.error("Error deleting user:", deleteError);
        }
      }, 60000);

      return res.status(200).json({
        token: authCandidate.token,
        refreshToken: authCandidate.refreshToken
      });
    } else {
      return res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    console.error("Internal server error:", error);
    return res.status(500).json({
      message: "Internal server error",
      error: error.message
    });
  }
};


export {
  signIn,
  signUp,
  googleVerifyCallback,
  facebookVerifyCallback,
  appleVerifyCallback,
  getInfo,
  refreshToken,
  forgotPassword,
  checkForgotLink,
  changePassword,
  getTokens
}