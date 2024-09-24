import { Router } from "express";
import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";

import {
  authGoogle,
  changePassword,
  checkForgotLink,
  forgotPassword,
  getInfo,
  getTokens,
  refreshToken,
  signIn,
  signUp
} from "../controllers/auth.js";

import checkToken from '../middleware/checkToken.js';
import config from "../config.js";

passport.use(new GoogleStrategy({
  clientID: config.GOOGLE_CLIENT_ID,
  clientSecret: config.GOOGLE_CLIENT_SECRET,
  callbackURL: "http://localhost:4000/auth/google/callback"
},authGoogle
));

const router = Router()

router.post("/sign-in", signIn);
router.post("/sign-up", signUp);
router.post("/refresh", refreshToken);

router.post("/forgot-pass", forgotPassword);
router.post("/check-link", checkForgotLink);
router.post("/change-password", changePassword);

router.get("/google", passport.authenticate('google', { scope: ['profile', 'email'] }));

router.get("/google/callback",
  passport.authenticate('google', { failureRedirect: '/' }),
  (req, res) => {
    res.redirect(`https://ceriga-devy.vercel.app/social/${req.user.id}`)
  }
);

router.get("/get-tokens", getTokens)

router.get("/info", checkToken, getInfo);

export default router;