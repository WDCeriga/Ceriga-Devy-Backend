import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import { nanoid } from "nanoid"

import User from "../models/user.js"
import ForgotPassword from "../models/forgotPassword.js"

import SocialAuth from "../models/socialAuth.js"

import config from "../config.js"

const signIn = async (req, res) => {
  const JWT_SECRET = config.jwtSecret
  const { email, password } = req.body
  try {
    const matchUser = await User.findOne({ email })
    if (!matchUser) {
      res.status(404).json({ message: "Incorrect login" })
    } else {
      const matchPassword = await bcrypt.compare(password, matchUser.password)
      if (matchPassword) {
        const newToken = jwt.sign({ id: matchUser._id }, JWT_SECRET, {
          expiresIn: "1h"
        })
        const newRefreshToken = jwt.sign({ id: matchUser._id }, JWT_SECRET, {
          expiresIn: "14d"
        })
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

const authGoogle = async (accessToken, refreshToken, profile, done) => {
  const JWT_SECRET = config.jwtSecret
  try {
    const candidate = await User.findOne({ email: profile.emails[0].value })
    if (candidate) {
      const token = jwt.sign({ id: candidate._id }, JWT_SECRET, {
        expiresIn: "1h"
      })
      const newRefreshToken = jwt.sign({ id: candidate._id }, JWT_SECRET, {
        expiresIn: "14d"
      })
      const newSocialAuth = new SocialAuth({
        id: profile.id,
        token,
        refreshToken: newRefreshToken
      })
      await newSocialAuth.save()
      return done(null, { id: profile.id, token: token, refresh: newRefreshToken })
    } else {
      const newUser = new User({
        name: profile.name.givenName,
        last_name: profile.name.familyName,
        email: profile.emails[0].value,
        photo: profile.photos[0].value,
        googleAuth: profile.id
      });
      await newUser.save()
      const token = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "1h"
      })
      const newRefreshToken = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "14d"
      })
      const newSocialAuth = new SocialAuth({
        id: profile.id,
        token,
        refreshToken: newRefreshToken
      })
      await newSocialAuth.save()
      return done(null, { id: profile.id, token: token, refresh: newRefreshToken })
    }
  } catch (e) {
    console.error(e)
  }
  console.log("User profile:", profile);
}

const signUp = async (req, res) => {
  console.log(req.body)
  const JWT_SECRET = config.jwtSecret
  const { name, email, phone, password } = req.body
  try {
    const matchUser = await User.findOne({ email }).lean()
    if (matchUser) {
      res.status(400).json({ message: 'User already exists' })
    } else {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
      const newUser = new User({
        name,
        email,
        phone,
        password: hashedPassword
      })
      await newUser.save()
      const newToken = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "1h"
      })
      const refreshToken = jwt.sign({ id: newUser._id }, JWT_SECRET, {
        expiresIn: "14d"
      })
      res.status(201).json({ token: newToken, refresh: refreshToken })
    }
  } catch (e) {
    console.error(e);
    res.status(500).send('Server error');
  }
}

const getInfo = async (req, res) => {
  try {
    const candidate = await User.findById(req.id, { name: 1, last_name: 1, email: 1, photo: 1, phone: 1 }).lean()
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
      const newToken = jwt.sign({ id: candidate._id }, config.jwtSecret, {
        expiresIn: "1h"
      })
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
      const protectedCode = nanoid(8)
      const newReqChangePass = new ForgotPassword({
        email,
        first_name: matchUser.first_name,
        code: protectedCode,
        userId: matchUser._id,
      });
      try {
        await newReqChangePass.save();
        res.status(201).json({ message: "Password reset request created" });
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
  const { code } = req.body
  console.log(code)
  try {
    const candidate = await ForgotPassword.findOne({ code })
    if (candidate) {
      const token = jwt.sign({ userId: candidate.userId }, config.jwtSecret, {
        expiresIn: "30m"
      })
      await ForgotPassword.findOneAndDelete({ code })
      res.status(200).json({
        info: {
          email: candidate.email,
          first_name: candidate.first_name,
          token
        }
      })
    } else {
      res.status(404).json({
        message: "Forgot password form is not found"
      })
    }
  } catch (e) {
    res.status(500).json({
      message: "Server error"
    })
  }
}

const changePassword = async (req, res) => {
  const { token, password } = req.body
  try {
    const { userId } = jwt.verify(token, config.jwtSecret)
    if (userId) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(password, salt)
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
  if (!id) {
    return res.status(400).json({ message: "Bad request, id is empty" });
  }
  try {
    const authCandidate = await SocialAuth.findOne({ id }, { token: 1, refreshToken: 1 }).lean();

    if (authCandidate) {
      try {
        await SocialAuth.deleteOne({ id: authCandidate.id });
      } catch (deleteError) {
        console.error("Error deleting user:", deleteError);
        return res.status(500).json({ message: "Error deleting user", error: deleteError.message });
      }

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
/*

const forgotPassword = async (req, res) => {
  const { email } = req.body
  try {
    const candidate = await User.findOne({ email }, { _id: 1 })
    if (candidate) {
      const specialCode = nanoid(6)
      console.log(`Special code ${specialCode} for user ${email}`)
      const restoreToken = jwt.sign({
        id: candidate._id,
        code: specialCode
      }, config.jwtSecret, {
        expiresIn: "30m"
      })
      res.status(200).json({
        restoreToken
      })
    } else {
      res.status(404).json({
        message: "User not found"
      })
    }
  } catch (e) {
    res.status(500).json(e)
  }
}

const checkForgotCode = () => {

}

const setNewPassword = async (req, res) => {
  const { token, specialCode, newPassword } = req.body
  try {
    const { id, code } = jwt.verify(token, config.jwtSecret)
    if (code === specialCode) {
      const salt = await bcrypt.genSalt(10)
      const hashedPassword = await bcrypt.hash(newPassword, salt)
      await User.findByIdAndUpdate(id, {
        password: hashedPassword
      })
      res.status(200).json({
        message: "Password has been changed"
      })
    } else {
      res.status(400).json({
        message: "Invalid security code"
      })
    }
  } catch (e) {
    console.log(e)
    res.status(500).json(e)
  }

}
*/

export {
  signIn,
  signUp,
  authGoogle,
  getInfo,
  refreshToken,
  forgotPassword,
  checkForgotLink,
  changePassword,
  getTokens
  // setNewPassword,
  //checkForgotCode
}